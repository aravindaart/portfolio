import { describe, expect, it } from "vitest";
import { resolveInitialMode } from "@/lib/mode-resolver";

describe("resolveInitialMode", () => {
  it("URL param wins over stored value", () => {
    expect(resolveInitialMode("recruiter", "story")).toBe("recruiter");
    expect(resolveInitialMode("story", "recruiter")).toBe("story");
  });

  it("falls back to stored value when no param", () => {
    expect(resolveInitialMode(null, "recruiter")).toBe("recruiter");
  });

  it("defaults to story", () => {
    expect(resolveInitialMode(null, null)).toBe("story");
  });

  it("ignores invalid values", () => {
    expect(resolveInitialMode("banana", "42")).toBe("story");
    expect(resolveInitialMode("banana", "recruiter")).toBe("recruiter");
  });
});
