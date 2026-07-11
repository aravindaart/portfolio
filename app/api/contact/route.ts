import { Resend } from "resend";
import { contactGuard } from "@/lib/contact/contact-guard";
import { formatContactEmail } from "@/lib/contact/format-email";
import { profile } from "@/content/profile";

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_input" }, { status: 400 });
  }

  const verdict = contactGuard(apiKey, body);
  if (!verdict.ok) {
    return Response.json({ error: verdict.error }, { status: verdict.status });
  }

  const resend = new Resend(apiKey);
  const email = formatContactEmail(verdict.data);
  const { error } = await resend.emails.send({
    from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
    to: [profile.contact.email],
    replyTo: verdict.data.email,
    subject: email.subject,
    html: email.html,
    text: email.text,
  });

  if (error) {
    console.error("[contact] resend error", error);
    return Response.json({ error: "send_failed" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
