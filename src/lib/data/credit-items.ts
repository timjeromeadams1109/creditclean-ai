import { getServiceSupabase } from "@/lib/supabase";
import type { CreditItem } from "@/lib/disputes/types";

interface CreditItemFilters {
  bureau?: string;
  status?: string;
  itemType?: string;
}

interface CreditItemStats {
  total: number;
  byStatus: Record<string, number>;
  byBureau: Record<string, number>;
  resolved: number;
}

/**
 * List credit items for a user with optional filters, ordered by created_at desc.
 */
export async function getCreditItems(
  userId: string,
  filters?: CreditItemFilters
) {
  const supabase = getServiceSupabase();

  let query = supabase
    .from("credit_items")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (filters?.bureau) {
    query = query.eq("bureau", filters.bureau);
  }
  if (filters?.status) {
    query = query.eq("status", filters.status);
  }
  if (filters?.itemType) {
    query = query.eq("item_type", filters.itemType);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch credit items: ${error.message}`);
  }

  return data;
}

/**
 * Get a single credit item with dispute_rounds, dispute_letters, and dispute_responses joined.
 */
export async function getCreditItem(userId: string, itemId: string) {
  const supabase = getServiceSupabase();

  const { data, error } = await supabase
    .from("credit_items")
    .select(
      `
      *,
      dispute_rounds (
        *,
        dispute_letters (*),
        dispute_responses (*)
      )
    `
    )
    .eq("user_id", userId)
    .eq("id", itemId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch credit item ${itemId}: ${error.message}`);
  }

  return data;
}

/**
 * Create a new credit item for a user.
 */
export async function createCreditItem(
  userId: string,
  data: Partial<CreditItem>
) {
  const supabase = getServiceSupabase();

  const { data: item, error } = await supabase
    .from("credit_items")
    .insert({
      user_id: userId,
      bureau: data.bureau,
      item_type: data.itemType,
      creditor_name: data.creditorName,
      account_number: data.accountNumber,
      balance: data.balance,
      original_balance: data.originalBalance,
      date_opened: data.dateOpened,
      date_reported: data.dateReported,
      status: data.status,
      collector_name: data.collectorName,
      collector_address: data.collectorAddress,
      remarks: data.remarks,
      is_medical: data.isMedical,
      late_payment_dates: data.latePaymentDates,
      inquiry_date: data.inquiryDate,
      inquiry_creditor: data.inquiryCreditor,
      user_notes: data.userNotes,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create credit item: ${error.message}`);
  }

  return item;
}

/**
 * Create one credit item per bureau for the same data.
 * Useful when an item appears on multiple credit reports.
 */
export async function createCreditItemsForBureaus(
  userId: string,
  data: Partial<CreditItem>,
  bureaus: string[]
) {
  const supabase = getServiceSupabase();

  const rows = bureaus.map((bureau) => ({
    user_id: userId,
    bureau,
    item_type: data.itemType,
    creditor_name: data.creditorName,
    account_number: data.accountNumber,
    balance: data.balance,
    original_balance: data.originalBalance,
    date_opened: data.dateOpened,
    date_reported: data.dateReported,
    status: data.status,
    collector_name: data.collectorName,
    collector_address: data.collectorAddress,
    remarks: data.remarks,
    is_medical: data.isMedical,
    late_payment_dates: data.latePaymentDates,
    inquiry_date: data.inquiryDate,
    inquiry_creditor: data.inquiryCreditor,
    user_notes: data.userNotes,
  }));

  const { data: items, error } = await supabase
    .from("credit_items")
    .insert(rows)
    .select();

  if (error) {
    throw new Error(
      `Failed to create credit items for bureaus: ${error.message}`
    );
  }

  return items;
}

/**
 * Update a credit item. Only updates fields present in the data object.
 */
export async function updateCreditItem(
  userId: string,
  itemId: string,
  data: Partial<CreditItem>
) {
  const supabase = getServiceSupabase();

  // Build update object only with defined fields
  const update: Record<string, unknown> = {};
  if (data.bureau !== undefined) update.bureau = data.bureau;
  if (data.itemType !== undefined) update.item_type = data.itemType;
  if (data.creditorName !== undefined) update.creditor_name = data.creditorName;
  if (data.accountNumber !== undefined)
    update.account_number = data.accountNumber;
  if (data.balance !== undefined) update.balance = data.balance;
  if (data.originalBalance !== undefined)
    update.original_balance = data.originalBalance;
  if (data.dateOpened !== undefined) update.date_opened = data.dateOpened;
  if (data.dateReported !== undefined) update.date_reported = data.dateReported;
  if (data.status !== undefined) update.status = data.status;
  if (data.collectorName !== undefined)
    update.collector_name = data.collectorName;
  if (data.collectorAddress !== undefined)
    update.collector_address = data.collectorAddress;
  if (data.remarks !== undefined) update.remarks = data.remarks;
  if (data.isMedical !== undefined) update.is_medical = data.isMedical;
  if (data.latePaymentDates !== undefined)
    update.late_payment_dates = data.latePaymentDates;
  if (data.inquiryDate !== undefined) update.inquiry_date = data.inquiryDate;
  if (data.inquiryCreditor !== undefined)
    update.inquiry_creditor = data.inquiryCreditor;
  if (data.userNotes !== undefined) update.user_notes = data.userNotes;

  update.updated_at = new Date().toISOString();

  const { data: item, error } = await supabase
    .from("credit_items")
    .update(update)
    .eq("user_id", userId)
    .eq("id", itemId)
    .select()
    .single();

  if (error) {
    throw new Error(
      `Failed to update credit item ${itemId}: ${error.message}`
    );
  }

  return item;
}

/**
 * Delete a credit item. Hard delete — remove the row entirely.
 * Related dispute_rounds, letters, and responses should cascade via FK constraints.
 */
export async function deleteCreditItem(userId: string, itemId: string) {
  const supabase = getServiceSupabase();

  const { error } = await supabase
    .from("credit_items")
    .delete()
    .eq("user_id", userId)
    .eq("id", itemId);

  if (error) {
    throw new Error(
      `Failed to delete credit item ${itemId}: ${error.message}`
    );
  }
}

/**
 * Get aggregate stats for a user's credit items:
 * total count, counts by status, counts by bureau, and resolved count.
 */
export async function getCreditItemStats(
  userId: string
): Promise<CreditItemStats> {
  const supabase = getServiceSupabase();

  const { data, error } = await supabase
    .from("credit_items")
    .select("id, status, bureau")
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Failed to fetch credit item stats: ${error.message}`);
  }

  const items = data ?? [];

  const byStatus: Record<string, number> = {};
  const byBureau: Record<string, number> = {};
  let resolved = 0;

  for (const item of items) {
    // Count by status
    const status = item.status ?? "unknown";
    byStatus[status] = (byStatus[status] ?? 0) + 1;

    // Count by bureau
    const bureau = item.bureau ?? "unknown";
    byBureau[bureau] = (byBureau[bureau] ?? 0) + 1;

    // Count resolved (deleted from report or updated favorably)
    if (status === "deleted" || status === "resolved") {
      resolved++;
    }
  }

  return {
    total: items.length,
    byStatus,
    byBureau,
    resolved,
  };
}
