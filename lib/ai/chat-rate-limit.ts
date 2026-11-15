import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Two layers per IP: a burst window against rapid-fire scripting, and a
// daily budget so no single visitor can drain the shared free-tier quota
// (1,000 Gemini requests/day across everyone).
const BURST_LIMIT = 6;
const BURST_WINDOW = "1 m";
const DAILY_LIMIT = 40;
const DAILY_WINDOW = "24 h";

export type ChatRateLimitVerdict =
  | { ok: true }
  | { ok: false; status: 429; error: "rate_limited" };

let cached: { burst: Ratelimit; daily: Ratelimit } | null | undefined;

/** Lazily builds the limiters; null (not undefined) means "checked, not configured". */
function getLimiters(): { burst: Ratelimit; daily: Ratelimit } | null {
  if (cached !== undefined) return cached;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    cached = null;
    return cached;
  }
  const redis = new Redis({ url, token });
  cached = {
    burst: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(BURST_LIMIT, BURST_WINDOW),
      prefix: "portfolio-chat-burst",
    }),
    daily: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(DAILY_LIMIT, DAILY_WINDOW),
      prefix: "portfolio-chat-daily",
    }),
  };
  return cached;
}

/**
 * Rate-limits chat requests by IP. Fails open when Upstash isn't configured
 * (local dev) — Gemini's own free-tier cap still bounds the worst case, and
 * the key is never billable.
 */
export async function checkChatRateLimit(
  ip: string,
): Promise<ChatRateLimitVerdict> {
  const limiters = getLimiters();
  if (!limiters) return { ok: true };
  const [burst, daily] = await Promise.all([
    limiters.burst.limit(ip),
    limiters.daily.limit(ip),
  ]);
  return burst.success && daily.success
    ? { ok: true }
    : { ok: false, status: 429, error: "rate_limited" };
}
