import type { UIMessage } from "ai";
import { z } from "zod";

// The useChat transport sends full UIMessages (text parts + tool parts from
// earlier turns). Text parts are strictly capped; tool parts are structurally
// validated but stay open-shaped — the server re-executes tools itself and
// never trusts client-supplied tool output for anything but model context.
const textPartSchema = z.looseObject({
  type: z.literal("text"),
  text: z.string().min(1).max(4000),
});

const otherPartSchema = z
  .looseObject({ type: z.string().min(1).max(64) })
  .refine((part) => part.type !== "text");

const partSchema = z.union([textPartSchema, otherPartSchema]);

// 'system' is deliberately absent: the system prompt is server-owned and a
// client-injected system message must never reach the model.
const messageSchema = z.looseObject({
  id: z.string().min(1).max(128),
  role: z.enum(["user", "assistant"]),
  parts: z.array(partSchema).min(1).max(24),
});

// 20 messages ≈ 10 visitor turns per request — plenty for a portfolio chat,
// and a hard ceiling on how much re-sent history each request can bill
// against the shared quota.
const bodySchema = z.looseObject({
  messages: z.array(messageSchema).min(1).max(20),
});

export type ChatGuardVerdict =
  | { ok: true; messages: UIMessage[] }
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
  return { ok: true, messages: parsed.data.messages as unknown as UIMessage[] };
}
