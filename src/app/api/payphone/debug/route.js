// src/app/api/payphone/debug/route.js

function toBase64(str) {
  try { return Buffer.from(str).toString("base64"); }
  catch { return btoa(unescape(encodeURIComponent(str))); }
}

async function tryAuth(url, clientId, clientSecret) {
  const results = [];

  // Variante A: x-www-form-urlencoded + Basic
  try {
    const basic = toBase64(`${clientId}:${clientSecret}`);
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basic}`,
      },
      body: "grant_type=client_credentials",
    });
    const text = await res.text(); // <-- texto crudo por si no es JSON
    results.push({ variant: "A_basic+form", url, status: res.status, body: text });
  } catch (e) {
    results.push({ variant: "A_basic+form", url, error: e?.message || String(e) });
  }

  // Variante B: x-www-form-urlencoded (client_id/secret en body)
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body:
        `client_id=${encodeURIComponent(clientId)}` +
        `&client_secret=${encodeURIComponent(clientSecret)}` +
        `&grant_type=client_credentials`,
    });
    const text = await res.text();
    results.push({ variant: "B_form_only", url, status: res.status, body: text });
  } catch (e) {
    results.push({ variant: "B_form_only", url, error: e?.message || String(e) });
  }

  // Variante C: JSON (algunas instalaciones privadas lo aceptan)
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "client_credentials",
      }),
    });
    const text = await res.text();
    results.push({ variant: "C_json_body", url, status: res.status, body: text });
  } catch (e) {
    results.push({ variant: "C_json_body", url, error: e?.message || String(e) });
  }

  return results;
}

export async function GET() {
  try {
    const BASE = (process.env.PAYPHONE_BASE_URL || "").replace(/\/$/, "");
    const AUTH = process.env.PAYPHONE_AUTH_ENDPOINT || "/api/token";
    const id = process.env.PAYPHONE_CLIENT_ID;
    const secret = process.env.PAYPHONE_CLIENT_SECRET;

    if (!BASE || !id || !secret) {
      return new Response(
        JSON.stringify({ ok: false, message: "Faltan PAYPHONE_BASE_URL, CLIENT_ID o CLIENT_SECRET" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Intentaremos varios endpoints comunes
    const candidates = [
      `${BASE}${AUTH}`,                          // lo que tengas configurado
      `${BASE}/api/token`,
      `${BASE}/security/oauth/token`,
      `${BASE}/oauth/token`,
      `${BASE}/api/auth/token`,
      `${BASE}/api/authentication/token`,
    ];

    const seen = new Set();
    const urls = candidates.filter(u => {
      if (seen.has(u)) return false;
      seen.add(u); return true;
    });

    let attempts = [];
    for (const u of urls) {
      const r = await tryAuth(u, id, secret);
      attempts = attempts.concat(r);
    }

    return new Response(JSON.stringify({ ok: true, attempts }, null, 2), {
      status: 200, headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, message: e.message }), {
      status: 500, headers: { "Content-Type": "application/json" },
    });
  }
}
