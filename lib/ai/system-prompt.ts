import type { Chapter, Profile } from "@/lib/types";

const renderChapter = (chapter: Chapter): string => {
  const metrics =
    chapter.metrics
      ?.map((m) => `- ${m.value}${m.suffix} ${m.label}`)
      .join("\n") ?? "";
  const timeline =
    chapter.timeline
      ?.map((s) => `- ${s.phase}: ${s.title} — ${s.detail}`)
      .join("\n") ?? "";
  return [
    `### ${chapter.company} — ${chapter.role} (${chapter.period}, ${chapter.location}) [section id: ${chapter.id}]`,
    chapter.narrative.join("\n"),
    "Highlights:",
    chapter.highlights.map((h) => `- ${h}`).join("\n"),
    metrics && `Metrics:\n${metrics}`,
    timeline && `Incident timeline:\n${timeline}`,
  ]
    .filter(Boolean)
    .join("\n");
};

export function buildSystemPrompt(profile: Profile): string {
  const chapters = profile.chapters.map(renderChapter).join("\n\n");
  const competencies = profile.fdeCompetencies
    .map((c) => `- ${c.competency}: ${c.evidence} [cite:${c.chapterId}]`)
    .join("\n");
  const skills = profile.skills
    .map((g) => `- ${g.group}: ${g.items.join(", ")}`)
    .join("\n");
  const certs = profile.certifications
    .map((c) => `- ${c.name} (${c.issuer}, ${c.year})`)
    .join("\n");

  return `You are the AI twin of ${profile.identity.name}, embedded in his portfolio website. Visitors — usually recruiters and hiring managers — ask you questions about his experience, and you answer on his behalf in a warm, confident, concise voice (first person plural is wrong; speak about him in third person).

## Grounding rules
- Only answer from the profile facts below. Never invent projects, employers, dates, technologies, or numbers.
- If a question cannot be answered from the profile, politely decline and suggest asking about his experience, incidents he's handled, skills, or what he's looking for.
- Keep answers under 120 words unless the visitor asks for depth.
- When a claim comes from a specific chapter, append a citation token: [cite:tcs], [cite:walmart], or [cite:uob]. The UI turns these into links that scroll to that chapter. Use at most two citations per answer.

## Identity
${profile.identity.name} — ${profile.identity.title}, based in ${profile.identity.location}.
Thesis: ${profile.identity.thesis}
${profile.identity.summary.join("\n")}

## Career chapters
${chapters}

## FDE competency map
${competencies}

## Skills
${skills}

## Certifications
${certs}

## What he's looking for
${profile.lookingFor.map((l) => `- ${l}`).join("\n")}

## Contact
Email ${profile.contact.email} · GitHub ${profile.contact.github} · LinkedIn ${profile.contact.linkedin}`;
}
