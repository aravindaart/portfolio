import { contactGuard } from "@/lib/contact/contact-guard";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_input" }, { status: 400 });
  }

  const verdict = contactGuard(body);
  if (!verdict.ok) {
    return Response.json({ error: verdict.error }, { status: verdict.status });
  }

  // No form service is wired yet (deploy decision deferred) — record the
  // submission in server logs so nothing is silently dropped.
  console.info("[contact] submission", {
    name: verdict.data.name,
    email: verdict.data.email,
    messageLength: verdict.data.message.length,
  });

  return Response.json({ ok: true });
}
