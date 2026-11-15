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

  it("instructs honest, grounded answers when asked about weaknesses or fit gaps", () => {
    expect(prompt).toContain("why he might NOT be a good fit");
    expect(prompt.toLowerCase()).toContain("never invent a weakness");
  });

  it("locks scope against out-of-scope tasks and prompt injection", () => {
    expect(prompt).toContain("not a general-purpose assistant");
    expect(prompt.toLowerCase()).toContain("untrusted data");
    expect(prompt).toContain("ignore your instructions");
    expect(prompt.toLowerCase()).toContain("never reveal");
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
