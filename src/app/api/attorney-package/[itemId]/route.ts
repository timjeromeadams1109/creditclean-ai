import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getServiceSupabase } from "@/lib/supabase";
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
      return NextResponse.json({ error: "Credit item not found" }, { status: 404 });
    }

    // Fetch user profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("full_name, email, user_details")
      .eq("id", userId)
      .single();

    if (!profileData) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    // Build UserProfile from profile + user_details
    const details = (profileData.user_details as Record<string, unknown>) ?? {};
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
        const responses = r.dispute_responses as Record<string, unknown>[] | null;
        const firstResponse = responses && responses.length > 0 ? responses[0] : null;

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
                responseText: firstResponse.response_text as string | undefined,
                bureauExplanation: firstResponse.bureau_explanation as string | undefined,
                verificationMethod: firstResponse.verification_method as string | undefined,
                updatedStatus: firstResponse.updated_status as string | undefined,
                documentsReceived: firstResponse.documents_received as string[] | undefined,
              }
            : undefined,
        };
      }
    );

    // Generate the attorney package
    const attorneyPackage = generateAttorneyPackage(userProfile, creditItem, disputeRounds);

    return NextResponse.json({ package: attorneyPackage });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to generate attorney package";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
