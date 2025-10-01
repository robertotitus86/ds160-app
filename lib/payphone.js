// src/lib/payphone.js
const BASE_URL =
  process.env.PAYPHONE_BASE_URL?.trim() ||
  "https://pay.payphonetodoesposible.com";

const AUTH_ENDPOINT =
  process.env.PAYPHONE_AUTH_ENDPOINT?.trim() ||
  "/api/auth/token";

const LINK_ENDPOINT =
  process.env.PAYPHONE_LINK_ENDPOINT?.trim() ||
  "/api/button/GeneratePaymentLink";

const CLIENT_ID = process.env.PAYPHONE_CLIENT_ID?.trim();
const CLIENT_SECRET = process.env.PAYPHONE_CLIENT_SECRET?.trim();
const STORE_ID = process.env.PAYPHONE_STORE_ID?.trim();

export function requireEnv() {
  const missing = [];
  if (!CLIENT_ID) missing.push("PAYPHONE_CLIENT_ID");
  if (!CLIENT_SECRET) missing.push("PAYPHONE_CLIENT_SECRET");
  if (!STORE_ID) missing.push("PAYPHONE_STORE_ID");

  if (missing.length) {
    throw new Error(
      `Faltan variables de entorno: ${missing.join(", ")}`
    );
  }

  return { BASE_URL, AUTH_ENDPOINT, LINK_ENDPOINT, CLIENT_ID, CLIENT_SECRET, STORE_ID };
}

export async function requestToken() {
  const { BASE_URL, AUTH_ENDPOINT, CLIENT_ID, CLIENT_SECRET } = requireEnv();

  const url = `${BASE_URL}${AUTH_ENDPOINT}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({ clientId: CLIENT_ID, clientSecret: CLIENT_SECRET }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `PayPhone token error (${res.status}): ${text || "Sin cuerpo"}`
    );
  }
  const data = await res.json();
  if (!data?.token) throw new Error("Respuesta de PayPhone sin 'token'");
  return data.token;
}

export async function generatePaymentLink({
  amountUSD, // en dólares (float/number)
  reference = "DS160",
  expiresIn = 15, // minutos
}) {
  const { BASE_URL, LINK_ENDPOINT, STORE_ID } = requireEnv();
  const token = await requestToken();

  // Convertimos a centavos y agregamos recargo 6 %
  const cents = Math.round(amountUSD * 100);
  const fee = Math.round(cents * 0.06);
  const totalCents = cents + fee;

  const payload = {
    amount: totalCents,          // en centavos
    amountWithTax: 0,
    amountWithoutTax: totalCents,
    tax: 0,
    currency: "USD",
    clientTransactionId: `${reference}-${Date.now()}`,
    reference,
    storeId: STORE_ID,
    expiresIn,                   // minutos
  };

  const res = await fetch(`${BASE_URL}${LINK_ENDPOINT}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `PayPhone link error (${res.status}): ${text || "Sin cuerpo"}`
    );
  }

  const data = await res.json();
  if (!data?.paymentLink) {
    throw new Error(
      `Respuesta PayPhone sin 'paymentLink' → ${JSON.stringify(data)}`
    );
  }
  return {
    url: data.paymentLink,
    totalCents,
    feeCents: fee,
  };
}
