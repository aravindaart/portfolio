import { describe, expect, it } from "vitest";
import { executeCommand, COMMAND_NAMES } from "@/lib/terminal/commands";
import { profile } from "@/content/profile";

const run = (input: string) => executeCommand(input, profile);

describe("terminal command engine", () => {
  it("help lists every registered command", () => {
    const { output } = run("help");
    const text = output.join("\n");
    for (const name of COMMAND_NAMES) {
      if (name === "exit") continue; // alias, intentionally undocumented
      expect(text).toContain(name);
    }
  });

  it("experience walmart surfaces the 80% metric", () => {
    const { output } = run("experience walmart");
    expect(output.join("\n")).toContain("80%");
  });

  it("harness lists the full tool protocol", () => {
    const { output } = run("harness");
    const text = output.join("\n");
    for (const tool of ["read_files", "replace_lines", "command_execute", "finish"]) {
      expect(text).toContain(tool);
    }
  });

  it("ai command returns the ai action", () => {
    expect(run("ai").action).toEqual({ type: "ai" });
  });

  it("overview and resume switch modes", () => {
    expect(run("overview").action).toEqual({ type: "mode", mode: "overview" });
    expect(run("resume").action).toEqual({ type: "mode", mode: "recruiter" });
    expect(run("exit").action).toEqual({ type: "mode", mode: "overview" });
  });

  it("clear returns the clear action", () => {
    expect(run("clear").action).toEqual({ type: "clear" });
  });

  it("suggests the nearest command for typos", () => {
    const { output } = run("hepl");
    expect(output.join("\n")).toContain("did you mean 'help'?");
  });

  it("redirects natural-language questions to the agent", () => {
    const { output } = run("what did he do at walmart?");
    expect(output.join("\n")).toContain("'ai'");
  });

  it("empty input produces no output", () => {
    expect(run("   ").output).toEqual([]);
  });
});
