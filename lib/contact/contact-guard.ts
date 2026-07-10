import { z } from "zod";

const submissionSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(1).max(2000),
});

export type ContactSubmission = z.infer<typeof submissionSchema>;

export type ContactGuardVerdict =
  | { ok: true; data: ContactSubmission }
  | { ok: false; status: 400; error: "invalid_input" };

/** Pure request guard for the contact route: shape + size validation. */
export function contactGuard(body: unknown): ContactGuardVerdict {
  const parsed = submissionSchema.safeParse(body);
  if (!parsed.success) {
    return { ok: false, status: 400, error: "invalid_input" };
  }
  return { ok: true, data: parsed.data };
}
