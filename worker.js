export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/feedback" && request.method === "POST") {
      return handleFeedback(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};

async function handleFeedback(request, env) {
  // 1. Content-Type guard
  const contentType = request.headers.get("Content-Type") ?? "";
  if (!contentType.includes("application/json")) {
    return Response.json({ error: "Unsupported content type" }, {
      status: 415,
    });
  }

  // 2. Parse body
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const message = (body.message ?? "").trim();
  const turnstileToken = (body.turnstileToken ?? "").trim();
  const ip = request.headers.get("CF-Connecting-IP") ||
    request.headers.get("X-Forwarded-For") ||
    "unknown";

  // 3. Basic field validation
  if (!message) {
    return Response.json({ error: "Message is required" }, { status: 400 });
  }
  if (message.length > 1000) {
    return Response.json({ error: "Message too long" }, { status: 400 });
  }
  if (!turnstileToken) {
    return Response.json({ error: "Missing verification token" }, {
      status: 400,
    });
  }

  // 4. Server-side Turnstile validation
  const turnstileValid = await validateTurnstile(
    turnstileToken,
    ip,
    env.TURNSTILE_SECRET_KEY,
  );
  if (!turnstileValid) {
    return Response.json({ error: "Verification failed" }, { status: 403 });
  }

  // 5. Persist to DB
  try {
    await env.feedback_db
      .prepare(
        "INSERT INTO feedback (message, ip_hash, created_at) VALUES (?, ?, ?)",
      )
      .bind(message, simpleHash(ip), new Date().toISOString())
      .run();
  } catch (err) {
    console.error("DB error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }

  return Response.json({ ok: true }, { status: 201 });
}

// https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
async function validateTurnstile(token, remoteip, secretKey) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const formData = new FormData();
    formData.append("secret", secretKey);
    formData.append("response", token);
    formData.append("remoteip", remoteip);

    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body: formData, signal: controller.signal },
    );
    const result = await res.json();
    if (!result.success) {
      console.warn("Turnstile rejected:", result["error-codes"]);
    }
    return result.success === true;
  } catch (err) {
    console.error("Turnstile validation error:", err);
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash).toString(36);
}
