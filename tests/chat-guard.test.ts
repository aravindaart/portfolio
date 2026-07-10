import { describe, expect, it } from "vitest";
import { chatGuard } from "@/lib/ai/chat-guard";

const validBody = {
  messages: [{ role: "user", content: "Has he handled incidents?" }],
};

describe("chatGuard", () => {
  it("returns 503 ai_unavailable when no key is configured", () => {
    const verdict = chatGuard(undefined, validBody);
    expect(verdict).toEqual({
      ok: false,
      status: 503,
      error: "ai_unavailable",
    });
  });

  it("rejects oversized message content with 400", () => {
    const verdict = chatGuard("key", {
      messages: [{ role: "user", content: "x".repeat(1001) }],
    });
    expect(verdict).toEqual({ ok: false, status: 400, error: "invalid_input" });
  });

  it("rejects more than 20 messages with 400", () => {
    const messages = Array.from({ length: 21 }, () => ({
      role: "user",
      content: "hi",
    }));
    const verdict = chatGuard("key", { messages });
    expect(verdict).toEqual({ ok: false, status: 400, error: "invalid_input" });
  });

  it("rejects malformed bodies with 400", () => {
    expect(chatGuard("key", { nope: true })).toEqual({
      ok: false,
      status: 400,
      error: "invalid_input",
    });
  });

  it("accepts a valid body when a key exists", () => {
    const verdict = chatGuard("key", validBody);
    expect(verdict.ok).toBe(true);
    if (verdict.ok) {
      expect(verdict.messages).toHaveLength(1);
    }
  });
});
