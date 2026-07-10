import { describe, expect, it } from "vitest";
import { buildSystemPrompt } from "@/lib/ai/system-prompt";
import { profile } from "@/content/profile";

describe("AI system prompt builder", () => {
  const prompt = buildSystemPrompt(profile);

  it("teaches the citation format for every chapter id", () => {
    for (const chapter of profile.chapters) {
      expect(prompt).toContain(`[cite:${chapter.id}]`);
    }
  });

  it("contains the grounding rule", () => {
    expect(prompt).toContain("Only answer from the profile facts");
  });

  it("contains a refusal instruction for out-of-scope questions", () => {
    expect(prompt.toLowerCase()).toContain("decline");
  });

  it("includes the published contact email", () => {
    expect(prompt).toContain("sayhi@aravindaart.com");
  });

  it("carries substantial profile grounding", () => {
    expect(prompt.length).toBeGreaterThan(1500);
    expect(prompt).toContain("OTP");
    expect(prompt).toContain("80%");
  });
});
