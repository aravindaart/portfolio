import type { CommandResult, Profile } from "@/lib/types";
import { harness } from "@/content/harness";

type CommandHandler = (args: string[], profile: Profile) => CommandResult;

const levenshtein = (a: string, b: string): number => {
  const rows = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) =>
      i === 0 ? j : j === 0 ? i : 0,
    ),
  );
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      rows[i][j] = Math.min(
        rows[i - 1][j] + 1,
        rows[i][j - 1] + 1,
        rows[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
  }
  return rows[a.length][b.length];
};

const chapterSummary = (profile: Profile, id: string): string[] => {
  const chapter = profile.chapters.find((c) => c.id === id);
  if (!chapter) return [`unknown company '${id}' — try: tcs, walmart, uob`];
  const metrics =
    chapter.metrics?.map((m) => `  > ${m.value}${m.suffix} ${m.label}`) ?? [];
  return [
    `${chapter.company} — ${chapter.role} (${chapter.period})`,
    ...chapter.highlights.map((h) => `  * ${h}`),
    ...metrics,
  ];
};

const handlers: Record<string, CommandHandler> = {
  help: () => ({
    output: [
      "available commands:",
      "  help          this list",
      "  whoami        who is this person",
      "  experience    career history (try: experience walmart)",
      "  harness       the agent harness he built inside a bank",
      "  skills        technical skill groups",
      "  incidents     the UOB OTP-abuse incident timeline",
      "  certs         certifications",
      "  contact       how to reach aravindhan",
      "  looking-for   what role he wants next",
      "  ai            open a live agent session (full screen)",
      "  overview      switch to the clean site",
      "  resume        switch to the printable resume",
      "  clear         clear the terminal",
    ],
  }),

  whoami: (_args, profile) => ({
    output: [
      `${profile.identity.name} — ${profile.identity.title}`,
      profile.identity.tagline,
      `${profile.identity.location} · ${profile.identity.thesis}`,
    ],
  }),

  experience: (args, profile) => {
    if (args.length > 0) {
      const query = args[0];
      const match =
        profile.chapters.find((c) => c.id === query) ??
        profile.chapters.find((c) =>
          c.company.toLowerCase().includes(query),
        );
      return { output: chapterSummary(profile, match?.id ?? query) };
    }
    return {
      output: profile.chapters.flatMap((c) => [
        `[${c.id}] ${c.company} — ${c.role} (${c.period})`,
        `      ${c.headline}`,
      ]),
    };
  },

  harness: () => ({
    output: [
      `${harness.name} — built where no model API existed`,
      harness.tagline,
      "",
      "tool protocol:",
      ...harness.tools.map((t) => `  ${t.name.padEnd(18)}${t.description}`),
      "",
      "guardrails:",
      ...harness.guardrails.map((rail) => `  * ${rail}`),
      "",
      "ask the live agent for the full story: type 'ai'",
    ],
  }),

  skills: (_args, profile) => ({
    output: profile.skills.map(
      (group) => `${group.group}: ${group.items.join(", ")}`,
    ),
  }),

  incidents: (_args, profile) => {
    const uob = profile.chapters.find((c) => c.id === "uob");
    return {
      output: [
        "production OTP-abuse incident — UOB:",
        ...(uob?.timeline?.map(
          (step) => `  ${step.phase} — ${step.title}`,
        ) ?? []),
        "type 'experience uob' for the full chapter",
      ],
    };
  },

  certs: (_args, profile) => ({
    output: profile.certifications.map(
      (c) => `${c.year} · ${c.name} — ${c.issuer}`,
    ),
  }),

  contact: (_args, profile) => ({
    output: [
      `email:    ${profile.contact.email}`,
      `github:   ${profile.contact.github}`,
      `linkedin: ${profile.contact.linkedin}`,
    ],
  }),

  "looking-for": (_args, profile) => ({
    output: profile.lookingFor.map((line) => `* ${line}`),
  }),

  ai: () => ({
    output: ["opening live agent session…"],
    action: { type: "ai" },
  }),

  overview: () => ({
    output: ["switching to overview…"],
    action: { type: "mode", mode: "overview" },
  }),

  resume: () => ({
    output: ["switching to the printable resume…"],
    action: { type: "mode", mode: "recruiter" },
  }),

  exit: () => ({
    output: ["logout", "switching to overview…"],
    action: { type: "mode", mode: "overview" },
  }),

  clear: () => ({ output: [], action: { type: "clear" } }),
};

export const COMMAND_NAMES = Object.keys(handlers);

const suggest = (input: string): string | null => {
  const scored = COMMAND_NAMES.map((name) => ({
    name,
    distance: levenshtein(input, name),
  })).sort((a, b) => a.distance - b.distance);
  return scored[0] && scored[0].distance <= 2 ? scored[0].name : null;
};

// This is a command shell, not a chat box — but the terminal invites
// questions, so a bare "command not found: what" reads as broken rather
// than as "wrong interface, try 'ai'".
const QUESTION_WORDS = new Set([
  "what",
  "who",
  "why",
  "how",
  "when",
  "where",
  "is",
  "are",
  "can",
  "does",
  "do",
  "did",
  "has",
  "have",
  "will",
  "could",
  "would",
  "should",
]);

const looksLikeQuestion = (rawInput: string, tokens: string[]): boolean =>
  tokens.length > 1 &&
  (rawInput.trim().endsWith("?") || QUESTION_WORDS.has(tokens[0]));

export function executeCommand(input: string, profile: Profile): CommandResult {
  const tokens = input.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return { output: [] };
  const [name, ...args] = tokens;
  const handler = handlers[name];
  if (handler) return handler(args, profile);

  if (looksLikeQuestion(input, tokens)) {
    return {
      output: [
        "this terminal runs commands, not questions.",
        "type 'ai' to ask the live agent directly.",
      ],
    };
  }

  const suggestion = suggest(name);
  return {
    output: [
      `command not found: ${name}`,
      suggestion ? `did you mean '${suggestion}'?` : "type 'help' to see commands",
    ],
  };
}
