import type { Harness } from "@/lib/types";

/**
 * The agent harness Aravindhan built inside a locked-down bank environment.
 * Facts here describe a real internal system (kept on an office machine);
 * no repository link is published for it.
 */
export const harness: Harness = {
  name: "copilot-harness",
  tagline:
    "An agentic coding loop built where no LLM API access exists — by driving Copilot's web chat with Playwright and forcing it to speak a tool protocol.",
  problem: [
    "Inside a regulated bank there are no model API keys, no Claude Code, no Cursor — but there was a licensed GitHub Copilot web chat sitting in the browser.",
    "So instead of waiting for procurement, the chat becomes the model endpoint: Playwright drives the Copilot web UI, and a Python FastAPI orchestrator wraps it in a real agent loop.",
  ],
  pipeline: [
    {
      label: "instruction",
      detail:
        "A natural-language task enters the FastAPI orchestrator — refactor this module, trace this bug, wire this API.",
    },
    {
      label: "prompt contract",
      detail:
        "The orchestrator instructs the LLM to reply only in a predefined structured format: one tool invocation per turn, from a fixed vocabulary.",
    },
    {
      label: "playwright bridge",
      detail:
        "Playwright types the prompt into Copilot web chat, waits for the streamed answer, and scrapes the structured response back out of the DOM.",
    },
    {
      label: "executor",
      detail:
        "The harness parses the tool call, runs it against the workspace, and feeds the result back as the next turn — looping until the model emits finish.",
    },
    {
      label: "guardrails",
      detail:
        "Every step passes through restricted-file checks and content sanitization before anything touches disk or leaves the machine.",
    },
  ],
  tools: [
    { name: "read_files", description: "Return file contents into the loop's context" },
    { name: "write_files", description: "Create or overwrite a file with provided content" },
    { name: "replace_lines", description: "Surgical line-range replacement inside a file" },
    { name: "add_lines_before", description: "Insert lines above an anchor line" },
    { name: "add_lines_after", description: "Insert lines below an anchor line" },
    { name: "command_execute", description: "Run a shell command and capture its output" },
    { name: "finish", description: "Declare the task complete and end the loop" },
  ],
  guardrails: [
    "Restricted-file list — protected paths the executor refuses to read or write",
    "Content sanitization on everything entering and leaving the model",
    "Predefined response structure — a reply that doesn't parse as a known tool is rejected, never executed",
  ],
  extension: {
    headline: "Companion browser extension",
    detail: [
      "A hand-built extension reads the active browser tab and takes actions on it from natural-language instructions.",
      "It talks to the same harness, extending the loop beyond the editor: the agent can see what the browser sees and act on it.",
    ],
  },
};
