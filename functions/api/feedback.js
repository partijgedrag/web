export async function onRequestPost(context) {
  const body = await context.request.json();
  const message = body.message?.trim();

  if (!message) {
    return new Response("Missing message", { status: 400 });
  }

  await context.env.DB.prepare(
    "INSERT INTO feedback (message) VALUES (?)",
  ).bind(message).run();

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
}
