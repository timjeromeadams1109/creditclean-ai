import { getServiceSupabase } from "@/lib/supabase";
import type { DisputeRound } from "@/lib/disputes/types";

interface CreateDisputeRoundData {
  credit_item_id: string;
  round_number: number;
  strategy: string;
  recipient: string;
  deadline_date: string;
}

/**
 * Get all dispute rounds for a specific credit item, ordered by round_number.
 */
export async function getDisputeRounds(
  userId: string,
  creditItemId: string
) {
  const supabase = getServiceSupabase();

  const { data, error } = await supabase
    .from("dispute_rounds")
    .select("*")
    .eq("user_id", userId)
    .eq("credit_item_id", creditItemId)
    .order("round_number", { ascending: true });

  if (error) {
    throw new Error(
      `Failed to fetch dispute rounds for item ${creditItemId}: ${error.message}`
    );
  }

  return data;
}

/**
 * Get a single dispute round with its associated letter and responses.
 */
export async function getDisputeRound(userId: string, roundId: string) {
  const supabase = getServiceSupabase();

  const { data, error } = await supabase
    .from("dispute_rounds")
    .select(
      `
      *,
      dispute_letters (*),
      dispute_responses (*)
    `
    )
    .eq("user_id", userId)
    .eq("id", roundId)
    .single();

  if (error) {
    throw new Error(
      `Failed to fetch dispute round ${roundId}: ${error.message}`
    );
  }

  return data;
}

/**
 * Create a new dispute round.
 */
export async function createDisputeRound(
  userId: string,
  data: CreateDisputeRoundData
) {
  const supabase = getServiceSupabase();

  const { data: round, error } = await supabase
    .from("dispute_rounds")
    .insert({
      user_id: userId,
      credit_item_id: data.credit_item_id,
      round_number: data.round_number,
      strategy: data.strategy,
      recipient_name: data.recipient,
      deadline_date: data.deadline_date,
      status: "draft",
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create dispute round: ${error.message}`);
  }

  return round;
}

/**
 * Update a dispute round — status, outcome, response dates, tracking number, etc.
 */
export async function updateDisputeRound(
  userId: string,
  roundId: string,
  data: Partial<DisputeRound> & Record<string, unknown>
) {
  const supabase = getServiceSupabase();

  const update: Record<string, unknown> = {};
  if (data.strategy !== undefined) update.strategy = data.strategy;
  if (data.dateSent !== undefined) update.date_sent = data.dateSent;
  if (data.deadlineDate !== undefined)
    update.deadline_date = data.deadlineDate;
  if (data.letterContent !== undefined)
    update.letter_content = data.letterContent;
  if (data.recipientName !== undefined)
    update.recipient_name = data.recipientName;
  if (data.recipientAddress !== undefined)
    update.recipient_address = data.recipientAddress;
  if (data.trackingNumber !== undefined)
    update.tracking_number = data.trackingNumber;

  // Allow raw snake_case fields to pass through (e.g. status, outcome)
  if (data.status !== undefined) update.status = data.status;
  if (data.outcome !== undefined) update.outcome = data.outcome;
  if (data.response_date !== undefined)
    update.response_date = data.response_date;

  update.updated_at = new Date().toISOString();

  const { data: round, error } = await supabase
    .from("dispute_rounds")
    .update(update)
    .eq("user_id", userId)
    .eq("id", roundId)
    .select()
    .single();

  if (error) {
    throw new Error(
      `Failed to update dispute round ${roundId}: ${error.message}`
    );
  }

  return round;
}

/**
 * Get all active disputes — rounds with status 'sent' or 'awaiting_response'.
 */
export async function getActiveDisputes(userId: string) {
  const supabase = getServiceSupabase();

  const { data, error } = await supabase
    .from("dispute_rounds")
    .select(
      `
      *,
      credit_items (*)
    `
    )
    .eq("user_id", userId)
    .in("status", ["sent", "awaiting_response"])
    .order("deadline_date", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch active disputes: ${error.message}`);
  }

  return data;
}

/**
 * Get overdue disputes — rounds where deadline_date < now and status is still
 * 'sent' or 'awaiting_response' (no response received yet).
 */
export async function getOverdueDisputes(userId: string) {
  const supabase = getServiceSupabase();

  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("dispute_rounds")
    .select(
      `
      *,
      credit_items (*)
    `
    )
    .eq("user_id", userId)
    .in("status", ["sent", "awaiting_response"])
    .lt("deadline_date", now)
    .order("deadline_date", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch overdue disputes: ${error.message}`);
  }

  return data;
}
