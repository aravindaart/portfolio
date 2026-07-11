import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const MAX_SUBMISSIONS = 5;
const WINDOW = "10 m";

export type RateLimitVerdict =
  | { ok: true }
  | { ok: false; status: 429; error: "rate_limited" };

let cached: Ratelimit | null | undefined;

/** Lazily builds the limiter from env vars; null (not undefined) means "checked, not configured". */
function getLimiter(): Ratelimit | null {
  if (cached !== undefined) return cached;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  cached =
    url && token
      ? new Ratelimit({
          redis: new Redis({ url, token }),
          limiter: Ratelimit.slidingWindow(MAX_SUBMISSIONS, WINDOW),
          prefix: "portfolio-contact",
        })
      : null;
  return cached;
}

/**
 * Rate-limits contact form submissions by IP. Fails open (allows the
 * request) when Upstash isn't configured — this is a protective layer on
 * top of an otherwise-working feature, not the feature itself, so missing
 * infra shouldn't take the contact form down with it.
 */
export async function checkContactRateLimit(ip: string): Promise<RateLimitVerdict> {
  const limiter = getLimiter();
  if (!limiter) return { ok: true };
  const { success } = await limiter.limit(ip);
  return success ? { ok: true } : { ok: false, status: 429, error: "rate_limited" };
}

/** First hop in X-Forwarded-For is the original client IP; falls back for local/unproxied requests. */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || "unknown";
}
