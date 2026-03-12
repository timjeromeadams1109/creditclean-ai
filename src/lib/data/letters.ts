import { getServiceSupabase } from "@/lib/supabase";

interface LetterFilters {
  status?: string;
  letterType?: string;
}

interface CreateLetterData {
  dispute_round_id: string;
  letter_type: string;
  content: string;
  legal_basis: string[];
  recipient_name: string;
  recipient_address: string;
}

/**
 * List dispute letters for a user with optional filters.
 */
export async function getLetters(userId: string, filters?: LetterFilters) {
  const supabase = getServiceSupabase();

  let query = supabase
    .from("dispute_letters")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }
  if (filters?.letterType) {
    query = query.eq("letter_type", filters.letterType);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch letters: ${error.message}`);
  }

  return data;
}

/**
 * Get a single dispute letter by ID.
 */
export async function getLetter(userId: string, letterId: string) {
  const supabase = getServiceSupabase();

  const { data, error } = await supabase
    .from("dispute_letters")
    .select("*")
    .eq("user_id", userId)
    .eq("id", letterId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch letter ${letterId}: ${error.message}`);
  }

  return data;
}

/**
 * Create a new dispute letter.
 */
export async function createLetter(userId: string, data: CreateLetterData) {
  const supabase = getServiceSupabase();

  const { data: letter, error } = await supabase
    .from("dispute_letters")
    .insert({
      user_id: userId,
      dispute_round_id: data.dispute_round_id,
      letter_type: data.letter_type,
      content: data.content,
      legal_basis: data.legal_basis,
      recipient_name: data.recipient_name,
      recipient_address: data.recipient_address,
      status: "draft",
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create letter: ${error.message}`);
  }

  return letter;
}

/**
 * Update the status of a letter (e.g. draft -> final -> sent).
 */
export async function updateLetterStatus(
  userId: string,
  letterId: string,
  status: string
) {
  const supabase = getServiceSupabase();

  const { data: letter, error } = await supabase
    .from("dispute_letters")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .eq("id", letterId)
    .select()
    .single();

  if (error) {
    throw new Error(
      `Failed to update letter status for ${letterId}: ${error.message}`
    );
  }

  return letter;
}
