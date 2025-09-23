// src/app/api/payphone/link/route.js
// ✅ Ruta para crear el link de pago (PayPhone) o, si defines PROXY_BASE_URL, llama a tu proxy.
// ✅ Corre en Node.js (no Edge) y siempre responde JSON.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function b64(s) {
  // Base64 estándar en Node
  return Buffer.from(s).toString("base64");
}

// --- Llamada directa a PayPhone (token + prepare) ---
async function createPayphoneLinkDirect({ amountUSD, responseUrl, cancelUrl }) {
  const BASE   = (process.env.PAYPHONE_BASE_URL || "https://pay.payphonetodo.com").replace(/\/$/, "");
  const AUTH   = process.env.PAYPHONE_AUTH_ENDPOINT || "/api/token";
  const LINK   = process.env.PAYPHONE_LINK_ENDPOINT || "/api/button/Prepare";
  const ID     = process.env.PAYPHONE_CLIENT_ID;
  const SECRET = process.env.PAYPHONE_CLIENT_SECRET;
  const STORE  = process.env.PAYPHONE_STORE_ID;

  if (!ID || !SECRET || !STORE) {
    return { ok: false, status: 500, message: "Faltan PAYPHONE_CLIENT_ID / PAYPH
