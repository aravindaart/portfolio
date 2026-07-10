import { z } from "zod";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(1000),
});

const bodySchema = z.object({
  messages: z.array(messageSchema).min(1).max(20),
});

export type ChatMessage = z.infer<typeof messageSchema>;

export type ChatGuardVerdict =
  | { ok: true; messages: ChatMessage[] }
  | { ok: false; status: 400 | 503; error: "invalid_input" | "ai_unavailable" };

/** Pure request guard for the chat route: key presence + input validation. */
export function chatGuard(
  apiKey: string | undefined,
  body: unknown,
): ChatGuardVerdict {
  if (!apiKey) {
    return { ok: false, status: 503, error: "ai_unavailable" };
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return { ok: false, status: 400, error: "invalid_input" };
  }
  return { ok: true, messages: parsed.data.messages };
}
