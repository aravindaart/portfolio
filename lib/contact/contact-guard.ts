import { z } from "zod";

const submissionSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(1).max(2000),
});

export type ContactSubmission = z.infer<typeof submissionSchema>;

export type ContactGuardVerdict =
  | { ok: true; data: ContactSubmission }
  | {
      ok: false;
      status: 400 | 503;
      error: "invalid_input" | "email_unavailable";
    };

/** Pure request guard for the contact route: key presence + shape/size validation. */
export function contactGuard(
  apiKey: string | undefined,
  body: unknown,
): ContactGuardVerdict {
  if (!apiKey) {
    return { ok: false, status: 503, error: "email_unavailable" };
  }
  const parsed = submissionSchema.safeParse(body);
  if (!parsed.success) {
    return { ok: false, status: 400, error: "invalid_input" };
  }
  return { ok: true, data: parsed.data };
}
