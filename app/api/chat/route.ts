import { streamText } from "ai";
import { chatGuard } from "@/lib/ai/chat-guard";
import { buildSystemPrompt } from "@/lib/ai/system-prompt";
import { profile } from "@/content/profile";

export const maxDuration = 30;

export async function POST(request: Request) {
  const apiKey =
    process.env.AI_GATEWAY_API_KEY ?? process.env.ANTHROPIC_API_KEY;

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

  const result = streamText({
    model: "anthropic/claude-sonnet-5",
    system: buildSystemPrompt(profile),
    messages: verdict.messages.map((message) => ({
      role: message.role,
      content: message.content,
    })),
  });

  return result.toTextStreamResponse();
}
