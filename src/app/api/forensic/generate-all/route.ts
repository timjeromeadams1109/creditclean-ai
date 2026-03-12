import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getServiceSupabase } from "@/lib/supabase";
import { generateLetter } from "@/lib/disputes";
import type { ForensicReport, Recommendation } from "@/lib/forensic/types";
import {
  Bureau,
  ItemType,
  DisputeStrategy,
  type CreditItem,
  type UserProfile,
} from "@/lib/disputes/types";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as Record<string, unknown>).id as string;
  const supabase = getServiceSupabase();

  try {
    const body = await req.json();
    const { reportId } = body;

    if (!reportId) {
      return NextResponse.json(
        { error: "Report ID is required." },
        { status: 400 }
      );
    }

    // Fetch the forensic report
    const { data: reportRow, error: fetchError } = await supabase
      .from("forensic_reports")
      .select("*")
      .eq("id", reportId)
      .eq("user_id", userId)
      .single();

    if (fetchError || !reportRow) {
      return NextResponse.json(
        { error: "Forensic report not found." },
        { status: 404 }
      );
    }

    const report = reportRow.report_data as ForensicReport;

    // Fetch user profile for letter generation
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, email, address_street, address_city, address_state, address_zip, ssn_last4, dob, phone")
      .eq("id", userId)
      .single();

    const userProfile: UserProfile = {
      firstName: profile?.full_name?.split(" ")[0] || "Client",
      lastName: profile?.full_name?.split(" ").slice(1).join(" ") || "",
      address: {
        street: profile?.address_street || "",
        city: profile?.address_city || "",
        state: profile?.address_state || "",
        zip: profile?.address_zip || "",
      },
      ssnLast4: profile?.ssn_last4 || "",
      dob: profile?.dob || "",
      email: profile?.email || session.user.email || "",
      phone: profile?.phone || "",
    };

    const generatedLetters: Array<{
      action: Recommendation;
      letterContent: string;
      creditItemId: string;
      disputeRoundId: string;
    }> = [];

    // Process each prioritized action
    for (const action of report.prioritizedActions) {
      // Find the corresponding finding
      const finding = report.findings.find((f) =>
        f.recommendations.some((r) => r.action === action.action)
      );

      if (!finding) continue;

      // Map method to DisputeStrategy
      const strategy = mapMethodToStrategy(action.method);

      // Map item type
      const itemType = mapItemType(finding.itemType);

      // Create credit_item in the database
      const { data: creditItem, error: itemError } = await supabase
        .from("credit_items")
        .insert({
          user_id: userId,
          bureau: finding.bureau as string,
          item_type: itemType,
          creditor_name: finding.accountName,
          account_number: finding.accountNumber.replace(/\*/g, ""),
          balance: finding.reportedBalance || 0,
          date_opened: finding.dateOpened || null,
          date_reported: finding.dateReported || null,
          status: finding.currentStatus,
          remarks: finding.itemDescription,
          is_medical: finding.itemType.toLowerCase().includes("medical"),
          user_notes: `Auto-created from forensic report ${reportId}`,
        })
        .select("id")
        .single();

      if (itemError || !creditItem) {
        console.error("Failed to create credit item:", itemError);
        continue;
      }

      // Build CreditItem for letter generation
      const creditItemData: CreditItem = {
        id: creditItem.id,
        bureau: finding.bureau as Bureau,
        itemType: itemType as ItemType,
        creditorName: finding.accountName,
        accountNumber: finding.accountNumber.replace(/\*/g, ""),
        balance: finding.reportedBalance,
        dateOpened: finding.dateOpened,
        dateReported: finding.dateReported,
        status: finding.currentStatus,
        remarks: finding.itemDescription,
        isMedical: finding.itemType.toLowerCase().includes("medical"),
      };

      // Generate the letter
      const letter = generateLetter(strategy, userProfile, creditItemData);

      // Create dispute_round in database
      const { data: round, error: roundError } = await supabase
        .from("dispute_rounds")
        .insert({
          credit_item_id: creditItem.id,
          user_id: userId,
          round_number: 1,
          strategy: strategy,
          letter_content: letter.content,
          recipient_name: letter.recipientName,
          recipient_address: letter.recipientAddress,
          legal_basis: letter.legalBasis,
          deadline_days: letter.deadlineDays,
          status: "draft",
        })
        .select("id")
        .single();

      if (roundError) {
        console.error("Failed to create dispute round:", roundError);
      }

      generatedLetters.push({
        action,
        letterContent: letter.content,
        creditItemId: creditItem.id,
        disputeRoundId: round?.id || "",
      });
    }

    return NextResponse.json(
      {
        lettersGenerated: generatedLetters.length,
        letters: generatedLetters,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Generate all letters error:", err);
    return NextResponse.json(
      { error: "Failed to generate letters. Please try again." },
      { status: 500 }
    );
  }
}

function mapMethodToStrategy(method: string): DisputeStrategy {
  const map: Record<string, DisputeStrategy> = {
    dispute_letter: DisputeStrategy.FCRA_611_BUREAU_DISPUTE,
    debt_validation: DisputeStrategy.FDCPA_809_VALIDATION,
    verification_request: DisputeStrategy.FCRA_609_VERIFICATION,
    goodwill: DisputeStrategy.GOODWILL_LETTER,
    cfpb_complaint: DisputeStrategy.CFPB_COMPLAINT,
    state_ag: DisputeStrategy.STATE_AG_COMPLAINT,
    cease_desist: DisputeStrategy.INTENT_TO_LITIGATE,
    intent_to_litigate: DisputeStrategy.INTENT_TO_LITIGATE,
  };
  return map[method] || DisputeStrategy.FCRA_611_BUREAU_DISPUTE;
}

function mapItemType(itemType: string): string {
  const normalized = itemType.toLowerCase().replace(/[^a-z]/g, "_");
  const map: Record<string, string> = {
    collection: ItemType.COLLECTION,
    late_payment: ItemType.LATE_PAYMENT,
    charge_off: ItemType.CHARGE_OFF,
    medical_debt: ItemType.MEDICAL_DEBT,
    medical: ItemType.MEDICAL_DEBT,
    student_loan: ItemType.STUDENT_LOAN,
    mortgage: ItemType.OTHER,
    revolving: ItemType.OTHER,
    installment: ItemType.OTHER,
    inquiry: ItemType.INQUIRY,
  };
  return map[normalized] || ItemType.OTHER;
}
