/**
 * Simple in-memory rate limiter for API routes.
 * No external dependencies (no Redis needed at this scale).
 *
 * Limits:
 * - Auth endpoints: 5 requests per minute (brute-force protection)
 * - Generation endpoints: 10 requests per minute
 * - Read endpoints: 30 requests per minute
 * - PDF downloads: 10 requests per minute
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.resetAt < now) store.delete(key);
  }
}, 5 * 60 * 1000);

export type RateLimitTier = "auth" | "generate" | "read" | "pdf";

const LIMITS: Record<RateLimitTier, { max: number; windowMs: number }> = {
  auth: { max: 5, windowMs: 60_000 },       // 5/min — login, signup
  generate: { max: 10, windowMs: 60_000 },   // 10/min — letter gen, forensic
  read: { max: 30, windowMs: 60_000 },       // 30/min — listing, fetching
  pdf: { max: 10, windowMs: 60_000 },        // 10/min — PDF downloads
};

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Check rate limit for a given identifier (usually `userId` or IP).
 * Returns headers you can attach to the response.
 */
export function checkRateLimit(
  identifier: string,
  tier: RateLimitTier
): RateLimitResult {
  const config = LIMITS[tier];
  const key = `${tier}:${identifier}`;
  const now = Date.now();

  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    // First request or window expired
    store.set(key, { count: 1, resetAt: now + config.windowMs });
    return { allowed: true, remaining: config.max - 1, resetAt: now + config.windowMs };
  }

  entry.count++;

  if (entry.count > config.max) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  return { allowed: true, remaining: config.max - entry.count, resetAt: entry.resetAt };
}

/**
 * Helper to create a 429 response with rate limit headers.
 */
export function rateLimitResponse(result: RateLimitResult) {
  const retryAfter = Math.ceil((result.resetAt - Date.now()) / 1000);
  return new Response(
    JSON.stringify({
      error: "Too many requests. Please try again later.",
      retryAfter,
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retryAfter),
        "X-RateLimit-Remaining": String(result.remaining),
        "X-RateLimit-Reset": String(result.resetAt),
      },
    }
  );
}
