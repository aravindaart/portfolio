import type { ContactSubmission } from "@/lib/contact/contact-guard";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export interface ContactEmail {
  subject: string;
  html: string;
  text: string;
}

/** Pure formatter: turns a validated submission into a Resend-ready payload. */
export function formatContactEmail(
  submission: ContactSubmission,
): ContactEmail {
  const { name, email, message } = submission;
  return {
    subject: `Portfolio contact — ${name}`,
    html: `<p><strong>${escapeHtml(name)}</strong> (${escapeHtml(email)}) sent:</p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
    text: `${name} (${email}) sent:\n\n${message}`,
  };
}
