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
    throw new Error(`Faltan variables de entorno: ${missing.join(", ")}`);
  }
  return { BASE_URL, AUTH_ENDPOINT, LINK_ENDPOINT, CLIENT_ID, CLIENT_SECRET, STORE_ID };
}

/**
 * Intenta pedir token en JSON y si falla, reintenta en x-www-form-urlencoded
 */
export async function requestToken() {
  const { BASE_URL, AUTH_ENDPOINT, CLIENT_ID, CLIENT_SECRET } = requireEnv();
  const url = `${BASE_URL}${AUTH_ENDPOINT}`;

  // 1) Intento JSON
  let res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({ clientId: CLIENT_ID, clientSecret: CLIENT_SECRET }),
  });

  if (!res.ok) {
    // 2) Reintento como form-urlencoded
    const form = new URLSearchParams();
    form.set("clientId", CLIENT_ID);
    form.set("clientSecret", CLIENT_SECRET);

    res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json",
      },
      cache: "no-store",
      body: form.toString(),
    });
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `PayPhone token error (${res.status}): ${text?.slice(0, 400) || "Sin cuerpo"}`
    );
  }

  let data;
  try {
    data = await res.json();
  } catch {
    const text = await res.text().catch(() => "");
    throw new Error(`PayPhone token: respuesta no JSON → ${text?.slice(0, 400)}`);
  }

  if (!data?.token) {
    throw new Error(`Respuesta de PayPhone sin 'token' → ${JSON.stringify(data)}`);
  }

  return data.token;
}

export async function generatePaymentLink({
  amountUSD,
  reference = "DS160",
  expiresIn = 15,
}) {
  const { BASE_URL, LINK_ENDPOINT, STORE_ID } = requireEnv();
  const token = await requestToken();

  // Convertimos a centavos + recargo 6 %
  const cents = Math.round(amountUSD * 100);
  const fee = Math.round(cents * 0.06);
  const totalCents = cents + fee;

  const payload = {
    amount: totalCents,
    amountWithTax: 0,
    amountWithoutTax: totalCents,
    tax: 0,
    currency: "USD",
    clientTransactionId: `${reference}-${Date.now()}`,
    reference,
    storeId: STORE_ID,
    expiresIn,
  };

  const res = await fetch(`${BASE_URL}${LINK_ENDPOINT}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `PayPhone link error (${res.status}): ${text?.slice(0, 400) || "Sin cuerpo"}`
    );
  }

  const data = await res.json().catch(async () => {
    const text = await res.text().catch(() => "");
    throw new Error(`PayPhone link: respuesta no JSON → ${text?.slice(0, 400)}`);
  });

  if (!data?.paymentLink) {
    throw new Error(`Respuesta PayPhone sin 'paymentLink' → ${JSON.stringify(data)}`);
  }

  return {
    url: data.paymentLink,
    totalCents,
    feeCents: fee,
  };
}
