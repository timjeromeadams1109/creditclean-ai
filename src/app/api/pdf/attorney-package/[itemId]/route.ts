import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getServiceSupabase } from "@/lib/supabase";
import { generateAttorneyPackagePDF } from "@/lib/pdf/generate";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import type { AttorneyPackagePDFData } from "@/lib/pdf/attorney-package-pdf";
import {
  generateAttorneyPackage,
  type CreditItem,
  type DisputeRound,
  type UserProfile,
  DisputeStrategy,
  DisputeOutcome,
  Bureau,
  ItemType,
} from "@/lib/disputes";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as Record<string, unknown>).id as string;

  // Rate limit
  const rl = checkRateLimit(userId, "pdf");
  if (!rl.allowed) return rateLimitResponse(rl);

  const { itemId } = await params;
  const supabase = getServiceSupabase();

  try {
    // Fetch credit item
    const { data: itemData, error: itemError } = await supabase
      .from("credit_items")
      .select("*")
      .eq("id", itemId)
      .eq("user_id", userId)
      .single();

    if (itemError || !itemData) {
      return NextResponse.json(
        { error: "Credit item not found" },
        { status: 404 }
      );
    }

    // Fetch user profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("full_name, email, user_details")
      .eq("id", userId)
      .single();

    if (!profileData) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    // Build UserProfile
    const details =
      (profileData.user_details as Record<string, unknown>) ?? {};
    const nameParts = (profileData.full_name ?? "").split(" ");
    const userProfile: UserProfile = {
      firstName: nameParts[0] ?? "",
      lastName: nameParts.slice(1).join(" ") ?? "",
      address: {
        street: (details.street as string) ?? "",
        city: (details.city as string) ?? "",
        state: (details.state as string) ?? "",
        zip: (details.zip as string) ?? "",
      },
      ssnLast4: (details.ssn_last4 as string) ?? "",
      dob: (details.dob as string) ?? "",
      email: profileData.email,
      phone: (details.phone as string) ?? undefined,
    };

    // Map credit item
    const creditItem: CreditItem = {
      id: itemData.id,
      bureau: itemData.bureau as Bureau,
      itemType: itemData.item_type as ItemType,
      creditorName: itemData.creditor_name,
      accountNumber: itemData.account_number,
      balance: itemData.balance,
      originalBalance: itemData.original_balance,
      dateOpened: itemData.date_opened,
      dateReported: itemData.date_reported,
      status: itemData.status,
      collectorName: itemData.collector_name,
      collectorAddress: itemData.collector_address,
      remarks: itemData.remarks,
      isMedical: itemData.is_medical,
      latePaymentDates: itemData.late_payment_dates,
      inquiryDate: itemData.inquiry_date,
      inquiryCreditor: itemData.inquiry_creditor,
      userNotes: itemData.user_notes,
    };

    // Fetch all dispute rounds with responses
    const { data: roundsData } = await supabase
      .from("dispute_rounds")
      .select("*, dispute_responses(*)")
      .eq("credit_item_id", itemId)
      .order("round_number", { ascending: true });

    const disputeRounds: DisputeRound[] = (roundsData ?? []).map(
      (r: Record<string, unknown>) => {
        const responses = r.dispute_responses as
          | Record<string, unknown>[]
          | null;
        const firstResponse =
          responses && responses.length > 0 ? responses[0] : null;

        return {
          roundNumber: r.round_number as number,
          strategy: r.strategy as DisputeStrategy,
          dateSent: r.date_sent as string,
          deadlineDate: r.deadline_date as string,
          letterContent: r.letter_content as string,
          recipientName: r.recipient_name as string,
          recipientAddress: r.recipient_address as string,
          trackingNumber: r.tracking_number as string | undefined,
          response: firstResponse
            ? {
                dateReceived: firstResponse.date_received as string,
                outcome: firstResponse.outcome as DisputeOutcome,
                responseText:
                  firstResponse.response_text as string | undefined,
                bureauExplanation:
                  firstResponse.bureau_explanation as string | undefined,
                verificationMethod:
                  firstResponse.verification_method as string | undefined,
                updatedStatus:
                  firstResponse.updated_status as string | undefined,
                documentsReceived:
                  firstResponse.documents_received as string[] | undefined,
              }
            : undefined,
        };
      }
    );

    // Generate the attorney package data via existing logic
    const basePackage = generateAttorneyPackage(
      userProfile,
      creditItem,
      disputeRounds
    );

    // Build evidence exhibits from dispute rounds
    const evidenceExhibits: AttorneyPackagePDFData["evidenceExhibits"] = [];
    let exhibitIndex = 0;
    const exhibitLabels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    disputeRounds.forEach((round) => {
      const label =
        exhibitIndex < 26
          ? `Exhibit ${exhibitLabels[exhibitIndex]}`
          : `Exhibit ${exhibitIndex + 1}`;
      evidenceExhibits.push({
        exhibitLabel: label,
        description: `Dispute Letter — Round ${round.roundNumber} (${round.strategy.replace(/_/g, " ")})`,
        date: round.dateSent
          ? new Date(round.dateSent).toLocaleDateString("en-US")
          : "N/A",
        type: "letter_sent",
      });
      exhibitIndex++;

      if (round.response) {
        const respLabel =
          exhibitIndex < 26
            ? `Exhibit ${exhibitLabels[exhibitIndex]}`
            : `Exhibit ${exhibitIndex + 1}`;
        evidenceExhibits.push({
          exhibitLabel: respLabel,
          description: `Bureau/Creditor Response — Round ${round.roundNumber} (Outcome: ${round.response.outcome.replace(/_/g, " ")})`,
          date: round.response.dateReceived
            ? new Date(round.response.dateReceived).toLocaleDateString("en-US")
            : "N/A",
          type: "response_received",
        });
        exhibitIndex++;
      }
    });

    // Calculate damages
    const violationCount = basePackage.identifiedViolations.length;
    const fcraMin = 100;
    const fcraMax = 1000;
    const statutoryMin = violationCount * fcraMin;
    const statutoryMax = violationCount * fcraMax;

    // Build recommended claims from violations
    const recommendedClaims: AttorneyPackagePDFData["recommendedClaims"] = [];
    const seenStatutes = new Set<string>();

    basePackage.identifiedViolations.forEach((v) => {
      if (!seenStatutes.has(v.statute)) {
        seenStatutes.add(v.statute);
        recommendedClaims.push({
          cause: `${v.statute} — ${v.description}`,
          basis: v.evidenceDescription,
          strength: v.severity === "severe" ? "strong" : v.severity === "moderate" ? "moderate" : "weak",
        });
      }
    });

    // Build legal memorandum
    const legalMemorandum = [
      `This memorandum summarizes the legal basis for claims arising from the credit reporting dispute between ${userProfile.firstName} ${userProfile.lastName} and ${creditItem.collectorName ?? creditItem.creditorName}.`,
      "",
      `The consumer initiated ${disputeRounds.length} dispute round(s) regarding account ...${creditItem.accountNumber} reported on their ${creditItem.bureau} credit report. Through this process, ${violationCount} potential violation(s) of federal and/or state consumer protection laws were identified.`,
      "",
      `The Fair Credit Reporting Act (FCRA), 15 U.S.C. \u00A7 1681 et seq., requires credit reporting agencies to follow reasonable procedures to assure maximum possible accuracy of consumer reports. The Fair Debt Collection Practices Act (FDCPA), 15 U.S.C. \u00A7 1692 et seq., prohibits abusive debt collection practices. Both statutes provide for statutory damages, actual damages, punitive damages, and attorney fees.`,
      "",
      `Based on the documented violations and the respondent's failure to adequately investigate and correct the disputed information, the consumer has viable claims for relief under the cited statutes.`,
    ].join("\n\n");

    // Assemble full PDF data
    const pdfData: AttorneyPackagePDFData = {
      ...basePackage,
      damagesCalculation: {
        statutoryMin,
        statutoryMax,
        punitivePotential: "Up to the greater of $500,000 or 1% of net worth (FCRA class action) or court discretion (individual)",
        attorneyFees: "Recoverable under FCRA \u00A7 616(a)(3) and FDCPA \u00A7 813(a)(3)",
        stateLawDamages: creditItem.bureau
          ? determineStateDamages(
              (details.state as string) ?? ""
            )
          : undefined,
        stateLawDescription: (details.state as string)
          ? `${details.state} consumer protection statute`
          : undefined,
        totalEstimatedMin: statutoryMin,
        totalEstimatedMax: statutoryMax * 2, // rough estimate including potential punitive
      },
      evidenceExhibits,
      legalMemorandum,
      recommendedClaims,
    };

    // Generate PDF
    const pdfBuffer = await generateAttorneyPackagePDF(pdfData);

    // Build filename
    const respondent = (
      creditItem.collectorName ?? creditItem.creditorName
    )
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-");
    const dateStr = new Date().toISOString().split("T")[0];
    const filename = `attorney-package-${respondent}-${dateStr}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Failed to generate attorney package PDF";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** Determine state-specific additional damages based on state code */
function determineStateDamages(state: string): string | undefined {
  const stateMap: Record<string, string> = {
    CA: "$100 — $5,000 per violation (CCRAA \u00A7 1785.31)",
    TX: "Treble actual damages (TX Bus. & Com. Code \u00A7 20.12)",
    NY: "$1,000 per violation (NY Gen. Bus. Law \u00A7 380-l)",
    FL: "Actual damages or $1,000 per violation (FL \u00A7 501.005)",
    IL: "Actual damages or $1,000, plus punitive up to $5,000 (815 ILCS 530/20)",
    WA: "Actual damages or $500 per violation (WA Rev. Code \u00A7 19.182.110)",
    MA: "Treble actual damages, min $25 per violation (MGL c93A)",
    NJ: "Treble actual damages (NJ Truth-in-Consumer Contract Act)",
  };
  return stateMap[state.toUpperCase()] ?? undefined;
}
