import { describe, expect, it } from "vitest";
import { contactGuard } from "@/lib/contact/contact-guard";

const valid = {
  name: "Jane Recruiter",
  email: "jane@example.com",
  message: "We have an FDE role you would be great for.",
};

describe("contactGuard", () => {
  it("returns 503 email_unavailable when no key is configured", () => {
    const verdict = contactGuard(undefined, valid);
    expect(verdict).toEqual({
      ok: false,
      status: 503,
      error: "email_unavailable",
    });
  });

  it("accepts a valid submission when a key exists", () => {
    const verdict = contactGuard("key", valid);
    expect(verdict.ok).toBe(true);
    if (verdict.ok) {
      expect(verdict.data.email).toBe("jane@example.com");
    }
  });

  it("trims whitespace from fields", () => {
    const verdict = contactGuard("key", {
      ...valid,
      name: "  Jane Recruiter  ",
    });
    expect(verdict.ok).toBe(true);
    if (verdict.ok) {
      expect(verdict.data.name).toBe("Jane Recruiter");
    }
  });

  it("rejects an invalid email", () => {
    const verdict = contactGuard("key", { ...valid, email: "not-an-email" });
    expect(verdict).toEqual({
      ok: false,
      status: 400,
      error: "invalid_input",
    });
  });

  it("rejects an empty message", () => {
    const verdict = contactGuard("key", { ...valid, message: "" });
    expect(verdict.ok).toBe(false);
  });

  it("rejects an oversized message", () => {
    const verdict = contactGuard("key", { ...valid, message: "x".repeat(2001) });
    expect(verdict.ok).toBe(false);
  });

  it("rejects a missing name", () => {
    const { name: _name, ...rest } = valid;
    const verdict = contactGuard("key", rest);
    expect(verdict.ok).toBe(false);
  });

  it("rejects non-object bodies", () => {
    expect(contactGuard("key", null).ok).toBe(false);
    expect(contactGuard("key", "hi").ok).toBe(false);
  });
});
