import { describe, expect, it } from "vitest";
import { profile } from "@/content/profile";

describe("profile data layer", () => {
  it("has the three career chapters in chronological order", () => {
    expect(profile.chapters.map((c) => c.id)).toEqual([
      "tcs",
      "walmart",
      "uob",
    ]);
  });

  it("every chapter has narrative and at least two highlights", () => {
    for (const chapter of profile.chapters) {
      expect(chapter.narrative.length).toBeGreaterThan(0);
      expect(chapter.highlights.length).toBeGreaterThanOrEqual(2);
      expect(chapter.headline).not.toHaveLength(0);
    }
  });

  it("walmart chapter carries the 80/30/50 impact metrics", () => {
    const walmart = profile.chapters.find((c) => c.id === "walmart");
    const values = walmart?.metrics?.map((m) => m.value) ?? [];
    expect(values).toEqual(expect.arrayContaining([80, 30, 50]));
    expect(walmart?.metrics).toHaveLength(3);
  });

  it("uob chapter has an incident timeline with at least four steps", () => {
    const uob = profile.chapters.find((c) => c.id === "uob");
    expect(uob?.timeline?.length).toBeGreaterThanOrEqual(4);
  });

  it("publishes the confirmed contact channels", () => {
    expect(profile.contact.email).toBe("sayhi@aravindaart.com");
    expect(profile.contact.github).toBe("https://github.com/aravindaart");
    expect(profile.contact.linkedin).toBe(
      "https://www.linkedin.com/in/aravindaart/",
    );
  });

  it("thesis line matches the approved copy", () => {
    expect(profile.identity.thesis).toBe(
      "Forward-deployed before it had a name.",
    );
  });

  it("every FDE competency cites an existing chapter", () => {
    const ids = new Set(profile.chapters.map((c) => c.id));
    for (const comp of profile.fdeCompetencies) {
      expect(ids.has(comp.chapterId)).toBe(true);
    }
  });
});
