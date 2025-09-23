// src/app/api/payphone/link/route.js
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const preferredRegion = ["gru1", "scl1", "iad1"];

import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

import { Agent, fetch as ufetch } from "undici";
const ipv4 = new Agent({ connect: { family: 4 } });

function toBase64(str) { return Buffer.from(str).toString("base64"); }

async function getToken(BASE, AUTH, clientId, clientSecret) {
  const urls = [
    `${BASE}${AUTH}`,
    `${BASE}/api/token`,
    `${BASE}/security/oauth/token`,
    `${BASE}/oauth/token`,
  ];
  for (const url of urls) {
    try {
      const r = await ufetch(url, {
        method: "POST",
        dispatcher: ipv4,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${toBase64(`${clientId}:${clientSecret}`)}`,
        },
        body: "grant_type=client_credentials",
      });
      const txt = await r.text();
      try {
        const js = JSON.parse(txt);
        if (r.ok && js?.access_token) return { token: js.access_token, url, raw: js };
      } catch {}
    } catch {}
  }
  return { token: null };
}

// ping
export async function GET() {
  return new Response(JSON.stringify({ ok: true, endpoint: "/api/payphone/link" }), {
    status: 200, headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { amountUSD, responseUrl, cancelUrl } = body;

    const amountNumber = Number(amountUSD);
    if (!amountNumber || isNaN(amountNumber) || amountNumber <= 0) {
      return new Response(JSON.stringify({ ok: false, message: "amountUSD inválido (>0)" }),
        { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const origin = (process.env.NEXT_PUBLIC_APP_ORIGIN || "").replace(/\/$/, "");
    const finalResponseUrl = responseUrl || (origin ? `${origin}/checkout/confirm` : null);
    const finalCancelUrl   = cancelUrl   || (origin ? `${origin}/checkout/cancel`  : null);
    if (!finalResponseUrl) {
      return new Response(JSON.stringify({
        ok: false, message: "responseUrl is missing; set NEXT_PUBLIC_APP_ORIGIN o envíalo en el body",
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const BASE   = (process.env.PAYPHONE_BASE_URL || "https://pay.payphonetodo.com").replace(/\/$/, "");
    const AUTH   = process.env.PAYPHONE_AUTH_ENDPOINT || "/api/token";
    const LINK   = process.env.PAYPHONE_LINK_ENDPOINT || "/api/button/Prepare";
    const ID     = process.env.PAYPHONE_CLIENT_ID;
    const SECRET = process.env.PAYPHONE_CLIENT_SECRET;
    const STORE  = process.env.PAYPHONE_STORE_ID;

    if (!ID || !SECRET || !STORE) {
      return new Response(JSON.stringify({
        ok: false, message: "Faltan PAYPHONE_CLIENT_ID/SECRET/STORE_ID",
      }), { status: 500, headers: { "Content-Type": "application/json" } });
    }

    const auth = await getToken(BASE, AUTH, ID, SECRET);
    if (!auth.token) {
      return new Response(JSON.stringify({
        ok: false, message: "No se pudo obtener token de PayPhone (revisa /api/payphone/debug).",
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const payload = {
      amount: Math.round(amountNumber * 100),
      clientTransactionId: `DS160-${Date.now()}`,
      responseUrl: finalResponseUrl,
      cancelUrl: finalCancelUrl,
      storeId: STORE,
    };

    const prep = await ufetch(`${BASE}${LINK}`, {
      method: "POST",
      dispatcher: ipv4,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth.token}` },
      body: JSON.stringify(payload),
    });

    const txt = await prep.text();
    let data = null; try { data = JSON.parse(txt); } catch {}

    if (!prep.ok) {
      return new Response(JSON.stringify({
        ok: false, message: (data && data.message) || "PayPhone API error", raw: data || txt
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const url =
      (data && (data.paymentUrl || data.url || data.payWithCardUrl)) ||
      (txt.match(/https?:\/\/[^\s"]+/) || [null])[0];

    if (!url) {
      return new Response(JSON.stringify({ ok: false, message: "Respuesta sin URL de pago", raw: data || txt }), {
        status: 400, headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true, url }), {
      status: 200, headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, message: e.message }), {
      status: 500, headers: { "Content-Type": "application/json" },
    });
  }
}
