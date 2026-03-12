import { getServiceSupabase } from "@/lib/supabase";

interface ResponseFilters {
  disputeRoundId?: string;
}

interface CreateResponseData {
  dispute_round_id: string;
  response_type: string;
  file_url: string;
  file_type: string;
}

interface ResponseAnalysis {
  summary: string;
  key_findings: string[];
  recommended_action: string;
}

/**
 * List dispute responses for a user with optional filter by dispute round.
 */
export async function getResponses(
  userId: string,
  filters?: ResponseFilters
) {
  const supabase = getServiceSupabase();

  let query = supabase
    .from("dispute_responses")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (filters?.disputeRoundId) {
    query = query.eq("dispute_round_id", filters.disputeRoundId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch responses: ${error.message}`);
  }

  return data;
}

/**
 * Create a new dispute response record (e.g. uploaded bureau response letter).
 */
export async function createResponse(
  userId: string,
  data: CreateResponseData
) {
  const supabase = getServiceSupabase();

  const { data: response, error } = await supabase
    .from("dispute_responses")
    .insert({
      user_id: userId,
      dispute_round_id: data.dispute_round_id,
      response_type: data.response_type,
      file_url: data.file_url,
      file_type: data.file_type,
      date_received: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create response: ${error.message}`);
  }

  return response;
}

/**
 * Update a response with AI-generated analysis (summary, key findings, recommended action).
 */
export async function updateResponseAnalysis(
  userId: string,
  responseId: string,
  analysis: ResponseAnalysis
) {
  const supabase = getServiceSupabase();

  const { data: response, error } = await supabase
    .from("dispute_responses")
    .update({
      ai_summary: analysis.summary,
      key_findings: analysis.key_findings,
      recommended_action: analysis.recommended_action,
      analyzed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .eq("id", responseId)
    .select()
    .single();

  if (error) {
    throw new Error(
      `Failed to update response analysis for ${responseId}: ${error.message}`
    );
  }

  return response;
}
