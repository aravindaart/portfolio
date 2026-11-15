import { tool } from "ai";
import { z } from "zod";
import type { Chapter, Profile } from "@/lib/types";
import { harness } from "@/content/harness";

const chapterSummary = (chapter: Chapter) => ({
  id: chapter.id,
  company: chapter.company,
  role: chapter.role,
  period: chapter.period,
  location: chapter.location,
  headline: chapter.headline,
});

const chapterFull = (chapter: Chapter) => ({
  ...chapterSummary(chapter),
  narrative: chapter.narrative,
  highlights: chapter.highlights,
  metrics: chapter.metrics ?? [],
});

const matchesQuery = (chapter: Chapter, query: string): boolean => {
  const haystack = [
    chapter.company,
    chapter.role,
    chapter.headline,
    ...chapter.narrative,
    ...chapter.highlights,
  ]
    .join(" ")
    .toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .some((term) => term.length > 2 && haystack.includes(term));
};

/**
 * Server-side tools for the portfolio agent. Every tool reads from the same
 * static profile/harness content the page renders — the agent can only cite
 * what the site already shows.
 */
export function buildAgentTools(profile: Profile) {
  return {
    search_experience: tool({
      description:
        "Search Aravindhan's career history for a topic, technology, or company. Returns matching chapter summaries with their ids.",
      inputSchema: z.object({
        query: z
          .string()
          .min(2)
          .max(200)
          .describe("Topic, skill, or company to search for"),
      }),
      execute: async ({ query }) => {
        const matches = profile.chapters.filter((chapter) =>
          matchesQuery(chapter, query),
        );
        return {
          query,
          matchCount: matches.length,
          matches: matches.map(chapterSummary),
        };
      },
    }),

    read_chapter: tool({
      description:
        "Read one career chapter in full detail: narrative, highlights, and metrics. Ids: tcs (TCS, 2015-2020), walmart (Walmart Global Tech, 2020-2022), uob (UOB Bank, 2022-present).",
      inputSchema: z.object({
        id: z.enum(["tcs", "walmart", "uob"]),
      }),
      execute: async ({ id }) => {
        const chapter = profile.chapters.find((c) => c.id === id);
        return chapter ? chapterFull(chapter) : { error: "chapter_not_found" };
      },
    }),

    get_incident_timeline: tool({
      description:
        "Get the full timeline of the production OTP-abuse incident Aravindhan led end-to-end at UOB Bank: detection, assessment, mitigation, hardening, monitoring.",
      inputSchema: z.object({}),
      execute: async () => {
        const uob = profile.chapters.find((c) => c.id === "uob");
        return { company: uob?.company, timeline: uob?.timeline ?? [] };
      },
    }),

    get_harness_spec: tool({
      description:
        "Get the spec of the agent harness Aravindhan built inside a locked-down bank environment: a Playwright-driven Copilot web chat wrapped in a FastAPI tool-calling loop with guardrails, plus a browser extension.",
      inputSchema: z.object({}),
      execute: async () => harness,
    }),

    get_skills_and_certs: tool({
      description:
        "Get Aravindhan's grouped skills and certifications (AI/MCP, frontend, full-stack, leadership).",
      inputSchema: z.object({}),
      execute: async () => ({
        skills: profile.skills,
        certifications: profile.certifications,
      }),
    }),

    get_availability: tool({
      description:
        "Get what Aravindhan is looking for (roles, location, compensation) and how to contact him.",
      inputSchema: z.object({}),
      execute: async () => ({
        lookingFor: profile.lookingFor,
        contact: profile.contact,
      }),
    }),
  };
}

export type AgentTools = ReturnType<typeof buildAgentTools>;
