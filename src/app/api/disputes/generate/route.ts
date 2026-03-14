import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getServiceSupabase } from "@/lib/supabase";
import { checkUsageLimit } from "@/lib/usage-limits";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import {
  determineNextStrategy,
  generateLetter,
  calculateDeadline,
  type CreditItem,
  type DisputeRound,
  type UserProfile,
  DisputeStrategy,
  DisputeOutcome,
  Bureau,
  ItemType,
} from "@/lib/disputes";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as Record<string, unknown>).id as string;

  // Rate limit
  const rl = checkRateLimit(userId, "generate");
  if (!rl.allowed) return rateLimitResponse(rl);

  // Usage limit
  const usage = await checkUsageLimit(userId, "generate_letter");
  if (!usage.allowed) {
    return NextResponse.json(
      { error: usage.reason, limit: usage.limit, used: usage.used, tier: usage.tier },
      { status: 403 }
    );
  }

  const supabase = getServiceSupabase();

  try {
    const body = await req.json();
    const { creditItemId, strategy, userProfile: providedProfile } = body as {
      creditItemId: string;
      strategy?: DisputeStrategy;
      userProfile?: UserProfile | null;
    };

    if (!creditItemId) {
      return NextResponse.json({ error: "creditItemId is required" }, { status: 400 });
    }

    // Use provided profile or fetch from DB
    let userProfile: UserProfile;
    if (providedProfile) {
      userProfile = providedProfile;
    } else {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, email, address_street, address_city, address_state, address_zip, ssn_last4, dob, phone")
        .eq("id", userId)
        .single();

      userProfile = {
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
        email: profile?.email || "",
        phone: profile?.phone || "",
      };
    }

    // Fetch the credit item
    const { data: itemData, error: itemError } = await supabase
      .from("credit_items")
      .select("*")
      .eq("id", creditItemId)
      .eq("user_id", userId)
      .single();

    if (itemError || !itemData) {
      return NextResponse.json({ error: "Credit item not found" }, { status: 404 });
    }

    // Map DB record to CreditItem type
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

    // Fetch previous dispute rounds
    const { data: roundsData } = await supabase
      .from("dispute_rounds")
      .select("*, dispute_responses(*)")
      .eq("credit_item_id", creditItemId)
      .order("round_number", { ascending: true });

    const previousRounds: DisputeRound[] = (roundsData ?? []).map(
      (r: Record<string, unknown>) => ({
        roundNumber: r.round_number as number,
        strategy: r.strategy as DisputeStrategy,
        dateSent: r.date_sent as string,
        deadlineDate: r.deadline_date as string,
        letterContent: r.letter_content as string,
        recipientName: r.recipient_name as string,
        recipientAddress: r.recipient_address as string,
        trackingNumber: r.tracking_number as string | undefined,
        response: Array.isArray(r.dispute_responses) && (r.dispute_responses as Record<string, unknown>[]).length > 0
          ? {
              dateReceived: (r.dispute_responses as Record<string, unknown>[])[0].date_received as string,
              outcome: (r.dispute_responses as Record<string, unknown>[])[0].outcome as DisputeOutcome,
              responseText: (r.dispute_responses as Record<string, unknown>[])[0].response_text as string | undefined,
              bureauExplanation: (r.dispute_responses as Record<string, unknown>[])[0].bureau_explanation as string | undefined,
              verificationMethod: (r.dispute_responses as Record<string, unknown>[])[0].verification_method as string | undefined,
              updatedStatus: (r.dispute_responses as Record<string, unknown>[])[0].updated_status as string | undefined,
              documentsReceived: (r.dispute_responses as Record<string, unknown>[])[0].documents_received as string[] | undefined,
            }
          : undefined,
      })
    );

    // Determine strategy if not provided
    const recommendation = strategy ? null : determineNextStrategy(creditItem, previousRounds);
    const selectedStrategy: DisputeStrategy = strategy ?? recommendation!.strategy;
    const nextRoundNumber = previousRounds.length + 1;

    // Generate the letter
    const letter = generateLetter(selectedStrategy, userProfile, creditItem);
    const now = new Date().toISOString();
    const deadline = calculateDeadline(now, selectedStrategy);

    // Create dispute round record
    const { data: roundRecord, error: roundError } = await supabase
      .from("dispute_rounds")
      .insert({
        credit_item_id: creditItemId,
        user_id: userId,
        round_number: nextRoundNumber,
        strategy: selectedStrategy,
        deadline_date: deadline.deadlineDate.toISOString(),
        letter_content: letter.content,
        recipient_name: letter.recipientName,
        recipient_address: letter.recipientAddress,
        status: "draft",
      })
      .select()
      .single();

    if (roundError) {
      return NextResponse.json({ error: roundError.message }, { status: 500 });
    }

    // Create dispute letter record
    const { data: letterRecord, error: letterError } = await supabase
      .from("dispute_letters")
      .insert({
        credit_item_id: creditItemId,
        dispute_round_id: roundRecord.id,
        user_id: userId,
        content: letter.content,
        strategy: selectedStrategy,
        item_type: creditItem.itemType,
        legal_basis: letter.legalBasis,
        recipient_name: letter.recipientName,
        recipient_address: letter.recipientAddress,
        deadline_days: letter.deadlineDays,
      })
      .select()
      .single();

    if (letterError) {
      return NextResponse.json({ error: letterError.message }, { status: 500 });
    }

    return NextResponse.json(
      {
        round: roundRecord,
        letter: letterRecord,
        strategy: selectedStrategy,
        roundNumber: nextRoundNumber,
        deadline,
      },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to generate dispute letter";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
