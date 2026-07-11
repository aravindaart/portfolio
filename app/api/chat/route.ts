import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { chatGuard } from "@/lib/ai/chat-guard";
import { buildSystemPrompt } from "@/lib/ai/system-prompt";
import { profile } from "@/content/profile";

export const maxDuration = 30;

export async function POST(request: Request) {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_input" }, { status: 400 });
  }

  const verdict = chatGuard(apiKey, body);
  if (!verdict.ok) {
    return Response.json({ error: verdict.error }, { status: verdict.status });
  }

  // Gemini free tier: hard rate-limited by Google, never billed — safe to
  // expose to unauthenticated public traffic. flash-lite specifically
  // (not the full flash model) because this project's free-tier quota for
  // gemini-3.5-flash is only 20 requests/day — exhausted mid-session just
  // from our own testing. gemini-3.1-flash-lite gets 1,000/day on the
  // same key (Google's docs), confirmed live, and holds up fine in
  // quality for grounded single-turn Q&A about a static profile — this
  // isn't a task that needs the heavier model's reasoning depth.
  const result = streamText({
    model: google("gemini-3.1-flash-lite"),
    system: buildSystemPrompt(profile),
    messages: verdict.messages.map((message) => ({
      role: message.role,
      content: message.content,
    })),
    // toTextStreamResponse() below has already committed to a 200 by the
    // time an upstream error (e.g. quota exhaustion) surfaces — errors
    // land here instead of throwing, so this is the only place a failed
    // generation gets logged server-side.
    onError({ error }) {
      console.error("[chat] streamText error", error);
    },
  });

  return result.toTextStreamResponse();
}
