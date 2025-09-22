// src/app/api/payphone/link/route.js

function toBase64(str) {
  try { return Buffer.from(str).toString("base64"); }
  catch { return btoa(unescape(encodeURIComponent(str))); }
}

async function getToken(BASE, AUTH, clientId, clientSecret) {
  const urls = [
    `${BASE}${AUTH}`,
    `${BASE}/api/token`,
    `${BASE}/security/oauth/token`,
    `${BASE}/oauth/token`,
    `${BASE}/api/auth/token`,
    `${BASE}/api/authentication/token`,
  ];
  const seen = new Set();
  const uniqueUrls = urls.filter(u => (seen.has(u) ? false : (seen.add(u), true)));

  // A: Basic + form
  for (const url of uniqueUrls) {
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
      const txt = await res.text();
      try {
        const js = JSON.parse(txt);
        if (res.ok && js?.access_token) return { token: js.access_token, tried: url, variant: "A_basic+form" };
      } catch {}
      if (res.ok && /access_token/i.test(txt)) {
        const m = txt.match(/"access_token"\s*:\s*"([^"]+)"/i);
        if (m) return { token: m[1], tried: url, variant: "A_basic+form:text" };
      }
    } catch {}
  }

  // B: form sin Basic
  for (const url of uniqueUrls) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body:
          `client_id=${encodeURIComponent(clientId)}` +
          `&client_secret=${encodeURIComponent(clientSecret)}` +
          `&grant_type=client_credentials`,
      });
      const txt = await res.text();
      try {
        const js = JSON.parse(txt);
        if (res.ok && js?.access_token) return { token: js.access_token, tried: url, variant: "B_form_only" };
      } catch {}
      if (res.ok && /access_token/i.test(txt)) {
        const m = txt.match(/"access_token"\s*:\s*"([^"]+)"/i);
        if (m) return { token: m[1], tried: url, variant: "B_form_only:text" };
      }
    } catch {}
  }

  // C: JSON
  for (const url of uniqueUrls) {
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
      const txt = await res.text();
      try {
        const js = JSON.parse(txt);
        if (res.ok && js?.access_token) return { token: js.access_token, tried: url, variant: "C_json" };
      } catch {}
      if (res.ok && /access_token/i.test(txt)) {
        const m = txt.match(/"access_token"\s*:\s*"([^"]+)"/i);
        if (m) return { token: m[1], tried: url, variant: "C_json:text" };
      }
    } catch {}
  }

  return { token: null };
}

// Ping
export async function GET() {
  return new Response(
    JSON.stringify({ ok: true, endpoint: "/api/payphone/link" }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { amountUSD, responseUrl, cancelUrl } = body;

    const amountNumber = Number(amountUSD);
    if (!amountNumber || isNaN(amountNumber) || amountNumber <= 0) {
      return new Response(JSON.stringify({ ok: false, message: "amountUSD inválido (> 0)" }),
        { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const originEnv = (process.env.NEXT_PUBLIC_APP_ORIGIN || "").replace(/\/$/, "");
    const finalResponseUrl = responseUrl || (originEnv ? `${originEnv}/checkout/confirm` : null);
    const finalCancelUrl   = cancelUrl   || (originEnv ? `${originEnv}/checkout/cancel`  : null);
    if (!finalResponseUrl) {
      return new Response(JSON.stringify({
        ok: false, message: "responseUrl is missing; set NEXT_PUBLIC_APP_ORIGIN o envíalo en el body"
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const BASE = (process.env.PAYPHONE_BASE_URL || "https://pay.payphonetodo.com").replace(/\/$/, "");
    const AUTH = process.env.PAYPHONE_AUTH_ENDPOINT || "/api/token";
    const LINK = process.env.PAYPHONE_LINK_ENDPOINT || "/api/button/Prepare";
    const ID = process.env.PAYPHONE_CLIENT_ID;
    const SECRET = process.env.PAYPHONE_CLIENT_SECRET;
    const STORE = process.env.PAYPHONE_STORE_ID;

    if (!ID || !SECRET || !STORE) {
      return new Response(JSON.stringify({
        ok: false, message: "Faltan variables: PAYPHONE_CLIENT_ID, PAYPHONE_CLIENT_SECRET, PAYPHONE_STORE_ID"
      }), { status: 500, headers: { "Content-Type": "application/json" } });
    }

    const auth = await getToken(BASE, AUTH, ID, SECRET);
    if (!auth.token) {
      return new Response(JSON.stringify({
        ok: false, message: "No se pudo obtener token de PayPhone. Revisa /api/payphone/debug",
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const payload = {
      amount: Math.round(amountNumber * 100),
      clientTransactionId: `DS160-${Date.now()}`,
      responseUrl: finalResponseUrl,
      cancelUrl: finalCancelUrl,
      storeId: STORE,
    };

    const ppRes = await fetch(`${BASE}${LINK}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth.token}` },
      body: JSON.stringify(payload),
    });

    const txt = await ppRes.text();
    let ppData = null;
    try { ppData = JSON.parse(txt); } catch {}

    if (!ppRes.ok) {
      return new Response(JSON.stringify({
        ok: false,
        message: (ppData && ppData.message) || "PayPhone API error",
        raw: ppData || txt,
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const url =
      (ppData && (ppData.paymentUrl || ppData.url || ppData.payWithCardUrl)) ||
      (txt.match(/https?:\/\/[^\s"]+/) || [null])[0];

    if (!url) {
      return new Response(JSON.stringify({
        ok: false, message: "PayPhone no devolvió una URL de pago", raw: ppData || txt,
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ ok: true, url, raw: ppData || txt }), {
      status: 200, headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, message: e.message }), {
      status: 500, headers: { "Content-Type": "application/json" },
    });
  }
}
