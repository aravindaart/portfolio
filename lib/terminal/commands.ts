import type { CommandResult, Profile } from "@/lib/types";

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
    chapter.metrics?.map((m) => `  ▸ ${m.value}${m.suffix} ${m.label}`) ?? [];
  return [
    `${chapter.company} — ${chapter.role} (${chapter.period})`,
    ...chapter.highlights.map((h) => `  • ${h}`),
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
      "  skills        technical skill groups",
      "  incidents     the UOB OTP-abuse incident timeline",
      "  certs         certifications",
      "  contact       how to reach Aravindhan",
      "  looking-for   what role he wants next",
      "  open <id>     jump to a section (tcs | walmart | uob | contact)",
      "  recruiter     toggle Recruiter Mode",
      "  ai            talk to the AI twin",
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
        "type 'open uob' to read the full story",
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
    output: profile.lookingFor.map((line) => `• ${line}`),
  }),

  open: (args) => {
    const target = args[0];
    const valid = ["tcs", "walmart", "uob", "contact", "thesis"];
    if (!target || !valid.includes(target)) {
      return { output: [`usage: open <${valid.join(" | ")}>`] };
    }
    return { output: [`navigating to #${target}…`], action: { type: "scroll", target } };
  },

  recruiter: () => ({
    output: ["toggling Recruiter Mode…"],
    action: { type: "recruiter" },
  }),

  ai: () => ({
    output: ["handing off to the AI twin…"],
    action: { type: "ai" },
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

export function executeCommand(input: string, profile: Profile): CommandResult {
  const tokens = input.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return { output: [] };
  const [name, ...args] = tokens;
  const handler = handlers[name];
  if (handler) return handler(args, profile);
  const suggestion = suggest(name);
  return {
    output: [
      `command not found: ${name}`,
      suggestion ? `did you mean '${suggestion}'?` : "type 'help' to see commands",
    ],
  };
}
