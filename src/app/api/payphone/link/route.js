// src/app/api/payphone/link/route.js
// Crea el link de pago. Si defines PROXY_BASE_URL, usa proxy; si no, va directo a PayPhone.
// Fuerza Node.js, IPv4 y TLS >= 1.2. Sugiere regiones para evitar problemas geográficos.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const preferredRegion = ["iad1", "sfo1", "dub1", "gru1"];

import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

import https from "node:https";
import { Agent as UndiciAgent, fetch as ufetch } from "undici";

const httpsAgent = new https.Agent({ keepAlive: true, minVersion: "TLSv1.2", maxVersion: "TLSv1.3" });
const ipv4 = new UndiciAgent({ connect: { family: 4, tls: { minVersion: "TLSv1.2", maxVersion: "TLSv1.3", rejectUnauthorized: true } } });

function b64(s) { return Buffer.from(s).toString("base64"); }

async function getToken(BASE, AUTH, ID, SECRET) {
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
          Authorization: `Basic ${b64(`${ID}:${SECRET}`)}`
        },
        body: "grant_type=client_credentials"
      });
      const txt = await r.text();
      try {
        const js = JSON.parse(txt);
        if (r.ok && js?.access_token) return { token: js.access_token, urlTried: url, raw: js };
      } catch {/* cuerpo no JSON */}
      // Como fallback, si vino en texto y aparece access_token:
      const m = txt.match(/"access_token"\s*:\s*"([^"]+)"/i);
      if (r.ok && m) return { token: m[1], urlTried: url, raw: txt };
    } catch (e) {
      // seguimos probando siguiente URL
    }
  }
  return { token: null };
}

export async function GET() {
  return new Response(JSON.stringify({ ok: true, endpoint: "/api/payphone/link" }), {
    status: 200, headers: { "Content-Type": "application/json" }
  });
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { amountUSD, responseUrl, cancelUrl } = body;

    const amountNumber = Number(amountUSD);
    if (!amountNumber || isNaN(amountNumber) || amountNumber <= 0) {
      return new Response(JSON.stringify({ ok: false, message: "amountUSD inválido (> 0)" }), {
        status: 400, headers: { "Content-Type": "application/json" }
      });
    }

    const origin = (process.env.NEXT_PUBLIC_APP_ORIGIN || "").replace(/\/$/, "");
    const finalResponseUrl = responseUrl || (origin ? `${origin}/checkout/confirm` : null);
