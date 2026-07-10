import { describe, expect, it } from "vitest";
import { executeCommand, COMMAND_NAMES } from "@/lib/terminal/commands";
import { profile } from "@/content/profile";

const run = (input: string) => executeCommand(input, profile);

describe("terminal command engine", () => {
  it("help lists every registered command", () => {
    const { output } = run("help");
    const text = output.join("\n");
    for (const name of COMMAND_NAMES) {
      expect(text).toContain(name);
    }
  });

  it("experience walmart surfaces the 80% metric", () => {
    const { output } = run("experience walmart");
    expect(output.join("\n")).toContain("80%");
  });

  it("experience without argument lists all chapters", () => {
    const { output } = run("experience");
    const text = output.join("\n");
    expect(text).toContain("Tata Consultancy Services");
    expect(text).toContain("Walmart");
    expect(text).toContain("UOB");
  });

  it("open uob returns a scroll action", () => {
    expect(run("open uob").action).toEqual({ type: "scroll", target: "uob" });
  });

  it("clear returns the clear action", () => {
    expect(run("clear").action).toEqual({ type: "clear" });
  });

  it("recruiter and ai return their actions", () => {
    expect(run("recruiter").action).toEqual({ type: "recruiter" });
    expect(run("ai").action).toEqual({ type: "ai" });
  });

  it("suggests the closest command for a typo", () => {
    const { output } = run("experiense");
    expect(output.join("\n")).toContain("experience");
  });

  it("is case and whitespace insensitive", () => {
    expect(run("  HELP  ").output.join("\n")).toContain("experience");
  });

  it("contact prints the published email", () => {
    expect(run("contact").output.join("\n")).toContain("sayhi@aravindaart.com");
  });

  it("incidents prints the OTP timeline phases", () => {
    const text = run("incidents").output.join("\n");
    expect(text).toContain("Detect");
    expect(text).toContain("Harden");
  });
});
