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

  // Gemini free tier: hard rate-limited by Google, never billed —
  // safe to expose to unauthenticated public traffic.
  const result = streamText({
    model: google("gemini-3.5-flash"),
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
