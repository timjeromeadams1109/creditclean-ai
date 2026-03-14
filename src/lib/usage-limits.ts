import { getServiceSupabase } from "./supabase";

/**
 * Subscription tier usage limits.
 * Enforced server-side on all generation endpoints.
 */
export const TIER_LIMITS = {
  free: {
    lettersPerMonth: 1,
    forensicReportsPerMonth: 1,
    pdfDownloadsPerMonth: 3,
    creditItems: 5,
    maxDisputeRound: 1,
  },
  pro: {
    lettersPerMonth: 30,
    forensicReportsPerMonth: 10,
    pdfDownloadsPerMonth: 100,
    creditItems: 50,
    maxDisputeRound: 5,
  },
  premium: {
    lettersPerMonth: 100,
    forensicReportsPerMonth: 30,
    pdfDownloadsPerMonth: 500,
    creditItems: 200,
    maxDisputeRound: 5,
  },
} as const;

export type SubscriptionTier = keyof typeof TIER_LIMITS;

interface UsageCounts {
  lettersThisMonth: number;
  forensicReportsThisMonth: number;
  pdfDownloadsThisMonth: number;
  totalCreditItems: number;
}

/**
 * Get the user's subscription tier from their profile.
 */
export async function getUserTier(userId: string): Promise<SubscriptionTier> {
  const supabase = getServiceSupabase();
  const { data } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", userId)
    .single();

  const tier = (data?.subscription_tier as string) ?? "free";
  if (tier in TIER_LIMITS) return tier as SubscriptionTier;
  return "free";
}

/**
 * Get the user's usage counts for the current calendar month.
 */
export async function getUsageCounts(userId: string): Promise<UsageCounts> {
  const supabase = getServiceSupabase();
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  // Run counts in parallel
  const [lettersResult, forensicResult, itemsResult] = await Promise.all([
    supabase
      .from("dispute_letters")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", monthStart),
    supabase
      .from("forensic_reports")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("analyzed_at", monthStart),
    supabase
      .from("credit_items")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
  ]);

  return {
    lettersThisMonth: lettersResult.count ?? 0,
    forensicReportsThisMonth: forensicResult.count ?? 0,
    pdfDownloadsThisMonth: 0, // Track via separate counter or estimate from letters
    totalCreditItems: itemsResult.count ?? 0,
  };
}

/**
 * Check if a user can perform a specific action based on their tier limits.
 * Returns { allowed: true } or { allowed: false, reason: string, limit: number, used: number }.
 */
export async function checkUsageLimit(
  userId: string,
  action: "generate_letter" | "forensic_report" | "pdf_download" | "add_item"
): Promise<
  | { allowed: true }
  | { allowed: false; reason: string; limit: number; used: number; tier: SubscriptionTier }
> {
  const [tier, usage] = await Promise.all([
    getUserTier(userId),
    getUsageCounts(userId),
  ]);

  const limits = TIER_LIMITS[tier];

  switch (action) {
    case "generate_letter":
      if (usage.lettersThisMonth >= limits.lettersPerMonth) {
        return {
          allowed: false,
          reason: `You've used ${usage.lettersThisMonth}/${limits.lettersPerMonth} dispute letters this month. Upgrade to Pro for more.`,
          limit: limits.lettersPerMonth,
          used: usage.lettersThisMonth,
          tier,
        };
      }
      break;

    case "forensic_report":
      if (usage.forensicReportsThisMonth >= limits.forensicReportsPerMonth) {
        return {
          allowed: false,
          reason: `You've used ${usage.forensicReportsThisMonth}/${limits.forensicReportsPerMonth} forensic reports this month. Upgrade to Pro for more.`,
          limit: limits.forensicReportsPerMonth,
          used: usage.forensicReportsThisMonth,
          tier,
        };
      }
      break;

    case "pdf_download":
      if (usage.pdfDownloadsThisMonth >= limits.pdfDownloadsPerMonth) {
        return {
          allowed: false,
          reason: `You've reached the ${limits.pdfDownloadsPerMonth} PDF download limit for this month.`,
          limit: limits.pdfDownloadsPerMonth,
          used: usage.pdfDownloadsThisMonth,
          tier,
        };
      }
      break;

    case "add_item":
      if (usage.totalCreditItems >= limits.creditItems) {
        return {
          allowed: false,
          reason: `You've reached the ${limits.creditItems} credit item limit. Upgrade to Pro for more.`,
          limit: limits.creditItems,
          used: usage.totalCreditItems,
          tier,
        };
      }
      break;
  }

  return { allowed: true };
}
