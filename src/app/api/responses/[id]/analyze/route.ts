import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getServiceSupabase } from "@/lib/supabase";
import {
  analyzeResponse,
  checkForViolations,
  type CreditItem,
  type DisputeRound,
  type DisputeResponse,
  DisputeStrategy,
  DisputeOutcome,
  Bureau,
  ItemType,
} from "@/lib/disputes";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as Record<string, unknown>).id as string;
  const { id } = await params;
  const supabase = getServiceSupabase();

  try {
    // Fetch the response record first (need IDs for subsequent queries)
    const { data: responseRecord, error: respError } = await supabase
      .from("dispute_responses")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (respError || !responseRecord) {
      return NextResponse.json({ error: "Response not found" }, { status: 404 });
    }

    // Fetch dispute round and credit item in parallel
    const [roundResult, itemResult] = await Promise.all([
      supabase
        .from("dispute_rounds")
        .select("*")
        .eq("id", responseRecord.dispute_round_id)
        .single(),
      supabase
        .from("credit_items")
        .select("*")
        .eq("id", responseRecord.credit_item_id)
        .single(),
    ]);

    const roundData = roundResult.data;
    const itemData = itemResult.data;

    if (!roundData) {
      return NextResponse.json({ error: "Associated dispute round not found" }, { status: 404 });
    }

    if (!itemData) {
      return NextResponse.json({ error: "Associated credit item not found" }, { status: 404 });
    }

    // Map to typed objects
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

    const disputeRound: DisputeRound = {
      roundNumber: roundData.round_number,
      strategy: roundData.strategy as DisputeStrategy,
      dateSent: roundData.date_sent,
      deadlineDate: roundData.deadline_date,
      letterContent: roundData.letter_content,
      recipientName: roundData.recipient_name,
      recipientAddress: roundData.recipient_address,
      trackingNumber: roundData.tracking_number,
    };

    const disputeResponse: DisputeResponse = {
      dateReceived: responseRecord.date_received,
      outcome: responseRecord.outcome as DisputeOutcome,
      responseText: responseRecord.response_text,
      bureauExplanation: responseRecord.bureau_explanation,
      verificationMethod: responseRecord.verification_method,
      updatedStatus: responseRecord.updated_status,
      documentsReceived: responseRecord.documents_received,
    };

    // Run analysis
    const analysis = analyzeResponse(disputeResponse, disputeRound);
    const violations = checkForViolations(disputeRound, disputeResponse);

    // Update the response record with analysis results
    const allViolations = [...analysis.violations, ...violations];
    const summary = `Outcome: ${analysis.outcome}. ${analysis.isFavorable ? "Favorable" : "Unfavorable"} result. Urgency: ${analysis.urgencyLevel}.`;
    const { data: updatedResponse, error: updateError } = await supabase
      .from("dispute_responses")
      .update({
        summary,
        key_findings: { isFavorable: analysis.isFavorable, outcome: analysis.outcome, urgencyLevel: analysis.urgencyLevel, violations: allViolations },
        recommended_action: analysis.nextAction,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      response: updatedResponse,
      analysis: {
        isFavorable: analysis.isFavorable,
        outcome: analysis.outcome,
        urgencyLevel: analysis.urgencyLevel,
        nextAction: analysis.nextAction,
        nextStrategy: analysis.nextStrategy,
        violations: allViolations,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
