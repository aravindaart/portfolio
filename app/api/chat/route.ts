import { google } from "@ai-sdk/google";
import { convertToModelMessages, stepCountIs, streamText } from "ai";
import { chatGuard } from "@/lib/ai/chat-guard";
import { checkChatRateLimit } from "@/lib/ai/chat-rate-limit";
import { buildAgentTools } from "@/lib/ai/tools";
import { buildSystemPrompt } from "@/lib/ai/system-prompt";
import { getClientIp } from "@/lib/contact/rate-limit";
import { profile } from "@/content/profile";

export const maxDuration = 30;

export async function POST(request: Request) {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  // Per-IP limits run before anything touches the model: this endpoint is
  // unauthenticated, so it's the only thing standing between a scripted
  // visitor and the shared daily Gemini quota.
  const rate = await checkChatRateLimit(getClientIp(request));
  if (!rate.ok) {
    return Response.json({ error: rate.error }, { status: rate.status });
  }

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
  // quality for grounded tool-calling Q&A about a static profile.
  const result = streamText({
    model: google("gemini-3.1-flash-lite"),
    system: buildSystemPrompt(profile),
    messages: await convertToModelMessages(verdict.messages),
    tools: buildAgentTools(profile),
    // Each tool round-trip is a step; 4 allows lookup → answer with margin
    // while bounding worst-case free-tier quota burn per request.
    stopWhen: stepCountIs(4),
    // Profile answers fit comfortably; a cap keeps an injected "write me an
    // essay" from streaming unbounded output on the shared quota.
    maxOutputTokens: 700,
    onError({ error }) {
      console.error("[chat] streamText error", error);
    },
  });

  // UI message stream (not a plain text stream): tool calls, inputs, and
  // results arrive as typed parts so the client can render them as a real
  // harness transcript.
  return result.toUIMessageStreamResponse({
    onError: () => "upstream_error",
  });
}
