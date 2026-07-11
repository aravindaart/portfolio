import { describe, expect, it } from "vitest";
import { checkContactRateLimit, getClientIp } from "@/lib/contact/rate-limit";

describe("checkContactRateLimit", () => {
  it("fails open when Upstash isn't configured", async () => {
    // No UPSTASH_REDIS_REST_URL/TOKEN set in the test environment — this
    // covers the actual current deploy state until Upstash credentials
    // are added. The Redis-backed path is an integration concern (a real
    // network call to Upstash), not something to mock here.
    const verdict = await checkContactRateLimit("203.0.113.1");
    expect(verdict).toEqual({ ok: true });
  });
});

describe("getClientIp", () => {
  const request = (headers: Record<string, string>) =>
    new Request("https://example.com/api/contact", { headers });

  it("takes the first address from a comma-separated X-Forwarded-For", () => {
    const ip = getClientIp(
      request({ "x-forwarded-for": "203.0.113.1, 10.0.0.1, 10.0.0.2" }),
    );
    expect(ip).toBe("203.0.113.1");
  });

  it("trims whitespace around the first address", () => {
    const ip = getClientIp(request({ "x-forwarded-for": "  203.0.113.1  ,10.0.0.1" }));
    expect(ip).toBe("203.0.113.1");
  });

  it("falls back to 'unknown' when the header is missing", () => {
    expect(getClientIp(request({}))).toBe("unknown");
  });
});
