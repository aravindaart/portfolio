import { describe, expect, it } from "vitest";
import { contactGuard } from "@/lib/contact/contact-guard";

const valid = {
  name: "Jane Recruiter",
  email: "jane@example.com",
  message: "We have an FDE role you would be great for.",
};

describe("contactGuard", () => {
  it("accepts a valid submission", () => {
    const verdict = contactGuard(valid);
    expect(verdict.ok).toBe(true);
    if (verdict.ok) {
      expect(verdict.data.email).toBe("jane@example.com");
    }
  });

  it("trims whitespace from fields", () => {
    const verdict = contactGuard({
      ...valid,
      name: "  Jane Recruiter  ",
    });
    expect(verdict.ok).toBe(true);
    if (verdict.ok) {
      expect(verdict.data.name).toBe("Jane Recruiter");
    }
  });

  it("rejects an invalid email", () => {
    const verdict = contactGuard({ ...valid, email: "not-an-email" });
    expect(verdict).toEqual({
      ok: false,
      status: 400,
      error: "invalid_input",
    });
  });

  it("rejects an empty message", () => {
    const verdict = contactGuard({ ...valid, message: "" });
    expect(verdict.ok).toBe(false);
  });

  it("rejects an oversized message", () => {
    const verdict = contactGuard({ ...valid, message: "x".repeat(2001) });
    expect(verdict.ok).toBe(false);
  });

  it("rejects a missing name", () => {
    const { name: _name, ...rest } = valid;
    const verdict = contactGuard(rest);
    expect(verdict.ok).toBe(false);
  });

  it("rejects non-object bodies", () => {
    expect(contactGuard(null).ok).toBe(false);
    expect(contactGuard("hi").ok).toBe(false);
  });
});
