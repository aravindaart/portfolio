import { describe, expect, it } from "vitest";
import { buildAgentTools } from "@/lib/ai/tools";
import { profile } from "@/content/profile";
import { harness } from "@/content/harness";

const tools = buildAgentTools(profile);

type ExecutableTool = { execute: (input: never, options: never) => unknown };

const run = async <T>(tool: unknown, input: unknown): Promise<T> =>
  (await (tool as ExecutableTool).execute(
    input as never,
    {} as never,
  )) as T;

describe("agent tools", () => {
  it("search_experience finds UOB by incident-related terms", async () => {
    const result = await run<{ matchCount: number; matches: { id: string }[] }>(
      tools.search_experience,
      { query: "production incident OTP" },
    );
    expect(result.matchCount).toBeGreaterThan(0);
    expect(result.matches.map((m) => m.id)).toContain("uob");
  });

  it("search_experience returns zero matches for unrelated terms", async () => {
    const result = await run<{ matchCount: number }>(tools.search_experience, {
      query: "zzzzqq",
    });
    expect(result.matchCount).toBe(0);
  });

  it("read_chapter returns full walmart chapter with metrics", async () => {
    const result = await run<{ company: string; metrics: unknown[] }>(
      tools.read_chapter,
      { id: "walmart" },
    );
    expect(result.company).toBe("Walmart Global Tech");
    expect(result.metrics.length).toBeGreaterThan(0);
  });

  it("get_incident_timeline returns the five UOB phases", async () => {
    const result = await run<{ timeline: unknown[] }>(
      tools.get_incident_timeline,
      {},
    );
    expect(result.timeline).toHaveLength(5);
  });

  it("get_harness_spec returns the harness with its tool vocabulary", async () => {
    const result = await run<typeof harness>(tools.get_harness_spec, {});
    expect(result.tools.map((t) => t.name)).toContain("replace_lines");
    expect(result.guardrails.length).toBeGreaterThan(0);
  });

  it("get_availability includes contact email and expectations", async () => {
    const result = await run<{
      contact: { email: string };
      lookingFor: string[];
    }>(tools.get_availability, {});
    expect(result.contact.email).toBe(profile.contact.email);
    expect(result.lookingFor.length).toBeGreaterThan(0);
  });
});

describe("harness content", () => {
  it("documents the full tool protocol", () => {
    const names = harness.tools.map((t) => t.name);
    for (const expected of [
      "read_files",
      "write_files",
      "command_execute",
      "replace_lines",
      "add_lines_before",
      "add_lines_after",
      "finish",
    ]) {
      expect(names).toContain(expected);
    }
  });

  it("has a pipeline ending in guardrails", () => {
    expect(harness.pipeline.at(-1)?.label).toBe("guardrails");
  });
});
