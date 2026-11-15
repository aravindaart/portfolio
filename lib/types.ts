export interface Metric {
  value: number;
  suffix: string;
  label: string;
}

export interface TimelineStep {
  phase: string;
  title: string;
  detail: string;
}

export interface Chapter {
  /** Section anchor + AI citation id: 'tcs' | 'walmart' | 'uob' */
  id: string;
  index: number;
  company: string;
  role: string;
  period: string;
  location: string;
  headline: string;
  kicker: string;
  narrative: string[];
  highlights: string[];
  metrics?: Metric[];
  timeline?: TimelineStep[];
}

export interface FdeCompetency {
  competency: string;
  evidence: string;
  chapterId: string;
}

export interface Profile {
  identity: {
    name: string;
    title: string;
    tagline: string;
    location: string;
    thesis: string;
    summary: string[];
  };
  contact: {
    email: string;
    github: string;
    linkedin: string;
  };
  chapters: Chapter[];
  fdeCompetencies: FdeCompetency[];
  skills: { group: string; items: string[] }[];
  certifications: { name: string; issuer: string; year: string }[];
  lookingFor: string[];
}

export interface HarnessTool {
  /** Tool identifier as the harness protocol names it, e.g. "read_files" */
  name: string;
  /** Short human description of what the executor does for this tool */
  description: string;
}

export interface HarnessPipelineStep {
  label: string;
  detail: string;
}

export interface Harness {
  name: string;
  tagline: string;
  /** The constraint that forced the design */
  problem: string[];
  /** How it works, in order */
  pipeline: HarnessPipelineStep[];
  /** The structured tool vocabulary the LLM must answer with */
  tools: HarnessTool[];
  guardrails: string[];
  extension: {
    headline: string;
    detail: string[];
  };
}

export type CommandAction =
  | { type: "clear" }
  | { type: "ai" }
  | { type: "mode"; mode: "overview" | "recruiter" };

export interface CommandResult {
  output: string[];
  action?: CommandAction;
}
