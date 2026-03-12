import { getServiceSupabase } from "@/lib/supabase";

interface AddScoreData {
  bureau: string;
  score: number;
  score_date: string;
  source: string;
}

/**
 * Get credit scores for a user, optionally filtered by bureau, ordered by score_date desc.
 */
export async function getScores(userId: string, bureau?: string) {
  const supabase = getServiceSupabase();

  let query = supabase
    .from("credit_scores")
    .select("*")
    .eq("user_id", userId)
    .order("score_date", { ascending: false });

  if (bureau) {
    query = query.eq("bureau", bureau);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch credit scores: ${error.message}`);
  }

  return data;
}

/**
 * Add a new credit score entry.
 */
export async function addScore(userId: string, data: AddScoreData) {
  const supabase = getServiceSupabase();

  const { data: score, error } = await supabase
    .from("credit_scores")
    .insert({
      user_id: userId,
      bureau: data.bureau,
      score: data.score,
      score_date: data.score_date,
      source: data.source,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to add credit score: ${error.message}`);
  }

  return score;
}

/**
 * Get the most recent score for each bureau.
 * Returns up to 3 records (one per bureau: equifax, experian, transunion).
 */
export async function getLatestScores(userId: string) {
  const supabase = getServiceSupabase();

  // Fetch recent scores and deduplicate by bureau in JS
  // (Supabase JS client doesn't support DISTINCT ON directly)
  const { data, error } = await supabase
    .from("credit_scores")
    .select("*")
    .eq("user_id", userId)
    .order("score_date", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch latest credit scores: ${error.message}`);
  }

  // Keep only the first (most recent) entry per bureau
  const seen = new Set<string>();
  const latest: typeof data = [];

  for (const row of data ?? []) {
    if (!seen.has(row.bureau)) {
      seen.add(row.bureau);
      latest.push(row);
    }
  }

  return latest;
}
