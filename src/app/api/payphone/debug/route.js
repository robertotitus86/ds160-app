// src/app/api/payphone/debug/route.js
// Diagnóstico de token con PayPhone (prueba varios endpoints y variantes)
// Corre en Node.js (no Edge) y devuelve JSON siempre.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function toBase64(s) {
  return Buffer.from(s).toString("base64");
}

async function tryOnce(url, headers, body) {
  try {
    const res = await fetch(url, { method: "POST", headers, body });
    const text = await res.text();
    return { status: res.status, body: text.slice(0, 1000) };
  } catch (e) {
    return { error: e?.message || String(e) };
  }
}

async function tryAuth(url, clientId, clientSecret) {
  const attempts = [];

  // A) Basic + x-www-form-urlencoded
  attempts.push({
    variant: "A_basic+form",
    url,
    ...(await tryOnce(
      url,
      {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${toBase64(`${clientId}:${clientSecret}`)}`
      },
      "grant_type=client_credentials"
    ))
  });

  // B) form sin Basic (client_id y client_secret en el body)
  attempts.push({
    variant: "B_form_only",
    url,
    ...(await tryOnce(
      url,
      { "Content-Type": "application/x-www-form-urlencoded" },
      `client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}&grant_type=client_credentials`
    ))
  });

  // C) JSON
  attempts.push({
    variant: "C_json_body",
    url,
    ...(await tryOnce(
      url,
      { "Content-Type": "application/json" },
      JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "client_credentials"
      })
    ))
  });

  return attempts;
}

export async function GET() {
  try {
    const BASE = (process.env.PAYPHONE_BASE_URL || "https://pay.payphonetodo.com").replace(/\/$/, "");
    const AUTH = process.env.PAYPHONE_AUTH_ENDPOINT || "/api/token";

    const CLIENT_ID = process.env.PAYPHONE_CLIENT_ID;
    const CLIENT_SECRET = process.env.PAYPHONE_CLIENT_SECRET;

    if (!CLIENT_ID || !CLIENT_SECRET) {
      return new Response(
        JSON.stringify({ ok: false, message: "Faltan PAYPHONE_CLIENT_ID / PAYPHONE_CLIENT_SECRET" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const candidates = Array.from(
      new Set([
        `${BASE}${AUTH}`,
        `${BASE}/api/token`,
        `${BASE}/security/oauth/token`,
        `${BASE}/oauth/token`,
        `${BASE}/api/auth/token`,
        `${BASE}/api/authentication/token`
      ])
    );

    let attempts = [];
    for (const url of candidates) {
      const r = await tryAuth(url, CLIENT_ID, CLIENT_SECRET);
      attempts = attempts.concat(r);
    }

    return new Response(JSON.stringify({ ok: true, attempts }, null, 2), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, message: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
