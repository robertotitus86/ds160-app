// src/app/api/payphone/debug/route.js
// Diagnóstico de conectividad/token con PayPhone con logs detallados.
// Corre en Node.js, fuerza IPv4 y TLS >= 1.2, y sugiere regiones.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Prueba distintas regiones: USA-Este (iad1), USA-Oeste (sfo1), Europa (dub1), LatAm (gru1)
export const preferredRegion = ["iad1", "sfo1", "dub1", "gru1"];

import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

import https from "node:https";
import { Agent as UndiciAgent, fetch as ufetch } from "undici";

// https.Agent para forzar TLS1.2+ (por si el stack lo requiere)
const httpsAgent = new https.Agent({
  keepAlive: true,
  // Fuerza mínimo TLS 1.2
  minVersion: "TLSv1.2",
  maxVersion: "TLSv1.3"
});

// Undici Agent para forzar IPv4; habilitamos opciones TLS también
const ipv4 = new UndiciAgent({
  connect: {
    family: 4,
    // Opciones TLS (undici las pasa al socket)
    tls: {
      minVersion: "TLSv1.2",
      maxVersion: "TLSv1.3",
      rejectUnauthorized: true,
    }
  }
});

function b64(s) { return Buffer.from(s).toString("base64"); }

async function tryOnce(url, headers, body) {
  try {
    // Intento con undici (IPv4)
    const r = await ufetch(url, {
      method: "POST",
      dispatcher: ipv4,
      headers,
      body
    });
    const text = await r.text();
    return { via: "undici-ipv4", status: r.status, body: text.slice(0, 1000) };
  } catch (e) {
    // Intento alterno con https.request (para obtener errores TLS más verbosos)
    try {
      const res2 = await new Promise((resolve, reject) => {
        const req = https.request(url, {
          method: "POST",
          headers,
          agent: httpsAgent,
        }, (res) => {
          let data = "";
          res.on("data", (c) => (data += c));
          res.on("end", () => resolve({ statusCode: res.statusCode, body: data.slice(0, 1000) }));
        });
        req.on("error", reject);
        if (body) req.write(body);
        req.end();
      });
      return { via: "https-agent", status: res2.statusCode, body: res2.body, err1: e.message };
    } catch (e2) {
      return {
        via: "both-failed",
        error1: e?.message || String(e),
        error2: e2?.message || String(e2),
        name1: e?.name, code1: e?.code, cause1: e?.cause ? String(e.cause) : undefined,
        name2: e2?.name, code2: e2?.code, cause2: e2?.cause ? String(e2.cause) : undefined
      };
    }
  }
}

async function tryAuth(url, id, sec) {
  const results = [];

  // A) Basic + x-www-form-urlencoded
  results.push({
    variant: "A_basic+form",
    url,
    ...(await tryOnce(
      url,
      { "Content-Type": "application/x-www-form-urlencoded", "Authorization"
