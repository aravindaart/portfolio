import { describe, expect, it } from "vitest";
import { resolveInitialMode } from "@/lib/mode-resolver";

describe("resolveInitialMode", () => {
  it("URL param wins over stored value", () => {
    expect(resolveInitialMode("recruiter", "terminal")).toBe("recruiter");
    expect(resolveInitialMode("terminal", "recruiter")).toBe("terminal");
  });

  it("falls back to stored value when no param", () => {
    expect(resolveInitialMode(null, "recruiter")).toBe("recruiter");
    expect(resolveInitialMode(null, "terminal")).toBe("terminal");
  });

  it("defaults to overview", () => {
    expect(resolveInitialMode(null, null)).toBe("overview");
  });

  it("maps the legacy 'story' value to overview", () => {
    expect(resolveInitialMode("story", null)).toBe("overview");
    expect(resolveInitialMode(null, "story")).toBe("overview");
  });

  it("ignores invalid values", () => {
    expect(resolveInitialMode("banana", "42")).toBe("overview");
    expect(resolveInitialMode("banana", "recruiter")).toBe("recruiter");
  });
});
