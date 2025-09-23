// src/app/api/payphone/debug/route.js
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const preferredRegion = ["gru1", "scl1", "iad1"]; // Sao Paulo / Santiago / Virginia

import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first"); // evita problemas con IPv6

import { Agent, fetch as ufetch } from "undici"; // undici = fetch de Node
const ipv4 = new Agent({ connect: { family: 4 } });

function toBase64(str) {
  return Buffer.from(str).toString("base64");
}

async function tryAuth(url, clientId, clientSecret) {
  const results = [];

  // A) Basic + x-www-form-urlencoded
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
    const text = await r.text();
    results.push({ variant: "A_basic+form", url, status: r.status, body: text.slice(0, 500) });
  } catch (e) {
    results.push({ variant: "A_basic+form", url, error: e?.message || String(e) });
  }

  // B) client_id/secret en el body
  try {
    const r = await ufetch(url, {
      method: "POST",
      dispatcher: ipv4,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body:
        `client_id=${encodeURIComponent(clientId)}` +
        `&client_secret=${encodeURIComponent(clientSecret)}` +
        `&grant_type=client_credentials`,
    });
    const text = await r.text();
    results.push({ variant: "B_form_only", url, status: r.status, body: text.slice(0, 500) });
  } catch (e) {
    results.push({ variant: "B_form_only", url, error: e?.message || String(e) });
  }

  // C) JSON
  try {
    const r = await ufetch(url, {
      method: "POST",
      dispatcher: ipv4,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "client_credentials",
      }),
    });
    const text = await r.text();
    results.push({ variant: "C_json_body", url, status: r.status, body: text.slice(0, 500) });
  } catch (e) {
    results.push({ variant: "C_json_body", url, error: e?.message || String(e) });
  }

  return results;
}

export async function GET() {
  try {
    const BASE = (process.env.PAYPHONE_BASE_URL || "https://pay.payphonetodo.com").replace(/\/$/, "");
    const AUTH = process.env.PAYPHONE_AUTH_ENDPOINT || "/api/token";
    const id = process.env.PAYPHONE_CLIENT_ID;
    const secret = process.env.PAYPHONE_CLIENT_SECRET;

    if (!id || !secret) {
      return new Response(JSON.stringify({ ok: false, message: "Faltan PAYPHONE_CLIENT_ID/SECRET" }), {
        status: 400, headers: { "Content-Type": "application/json" },
      });
    }

    const candidates = [
      `${BASE}${AUTH}`,
      `${BASE}/api/token`,
      `${BASE}/security/oauth/token`,
      `${BASE}/oauth/token`,
      `${BASE}/api/auth/token`,
      `${BASE}/api/authentication/token`,
    ];

    const seen = new Set();
    const urls = candidates.filter(u => (seen.has(u) ? false : (seen.add(u), true)));

    let attempts = [];
    for (const u of urls) attempts = attempts.concat(await tryAuth(u, id, secret));

    return new Response(JSON.stringify({ ok: true, attempts }, null, 2), {
      status: 200, headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, message: e.message }), {
      status: 500, headers: { "Content-Type": "application/json" },
    });
  }
}
