// src/app/api/payphone/debug/route.js
// ✅ Ruta para probar varios endpoints de token y ver el status/body sin romper el build
// ✅ Corre en Node.js (no Edge)

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function uniq(arr) {
  const seen = new Set(); const out = [];
  for (const x of arr) if (!seen.has(x)) { seen.add(x); out.push(x); }
  return out;
}

async function tryAuth(url, headers, body) {
  try {
    const r = await fetch(url, { method: "POST", headers, body });
    const text = await r.text();
    return { status: r.status, body: text.slice(0, 1000) };
  } catch (e) {
    return { error: e?.message || String(e) };
  }
}

export async function GET() {
  try {
    const BASE = (process.env.PAYPHONE_BASE_URL || "https://pay.payphonetodo.com").replace(/\/$/, "");
    const AUTH = process.env.PAYPHONE_AUTH_ENDPOINT || "/api/token";
    const id   = process.env.PAYPHONE_CLIENT_ID;
    const sec  = process.env.PAYPHONE_CLIENT_SECRET;

    if (!id || !sec) {
      return new Response(JSON.stringify({ ok: false, message: "Faltan PAYPHONE_CLIENT_ID / PAYPHONE_CLIENT_SECRET" }), {
        status: 400, headers: { "Content-Type": "application/json" }
      });
    }

    const candidates = uniq([
      `${BASE}${AUTH}`,
      `${BASE}/api/token`,
      `${BASE}/security/oauth/token`,
      `${BASE}/oauth/token`,
      `${BASE}/api/auth/token`,
      `${BASE}/api/authentication/token`
    ]);

    const basic = Buffer.from(`${id}:${sec}`).toString("base64");

    const attempts = [];
    for (const url of candidates) {
      // A) Basic + x-www-form-urlencoded
      attempts.push({
        variant: "A_basic+form",
        url,
        ...(await tryAuth(
          url,
          { "Content-Type": "application/x-www-form-urlencoded", "Authorization": `Basic ${basic}` },
          "grant_type=client_credentials"
        ))
      });

      // B) client_id/secret en el body
      attempts.push({
        variant: "B_form_only",
        url,
        ...(await tryAuth(
          url,
          { "Content-Type": "application/x-www-form-urlencoded" },
          `client_id=${encodeURIComponent(id)}&client_secret=${encodeURIComponent(sec)}&grant_type=client_credentials`
        ))
      });

      // C) JSON
      attempts.push({
        variant: "C_json_body",
        url,
        ...(await tryAuth(
          url,
          { "Content-Type": "application/json" },
          JSON.stringify({ client_id: id, client_secret: sec, grant_type: "client_credentials" })
        ))
      });
    }

    return new Response(JSON.stringify({ ok: true, attempts }, null, 2), {
      status: 200, headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, message: e.message }), {
      status: 500, headers: { "Content-Type": "application/json" }
    });
  }
}
