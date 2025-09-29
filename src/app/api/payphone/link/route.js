// src/app/api/payphone/link/route.js
import { NextResponse } from "next/server";
import { requiredEnv, fetchJSON } from "@/lib/payphone";

const BASE = requiredEnv("PAYPHONE_BASE_URL");
const CLIENT_ID = requiredEnv("PAYPHONE_CLIENT_ID");
const CLIENT_SECRET = requiredEnv("PAYPHONE_CLIENT_SECRET");
const STORE_ID = requiredEnv("PAYPHONE_STORE_ID");

// Cambia a "POST" si tu tenant de PayPhone exige POST para el token
const METHOD_TOKEN = "GET";

async function getPayphoneToken() {
  const url = `${BASE}/api/auth/token`;
  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
  const init = {
    method: METHOD_TOKEN,
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  };
  const data = await fetchJSON(url, init);
  const token = data.token || data.accessToken || data.access_token;
  if (!token) throw new Error("No se recibió token de PayPhone");
  return token;
}

export async function POST(req) {
  try {
    const payload = await req.json();

    if (!payload?.amount || !payload?.reference || !payload?.responseUrl) {
      return NextResponse.json(
        { error: "amount, reference y responseUrl son obligatorios" },
        { status: 400 }
      );
    }

    const token = await getPayphoneToken();
    const prepareUrl = `${BASE}/api/button/Prepare`;

    const data = await fetchJSON(prepareUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        StoreId: STORE_ID
      },
      body: JSON.stringify(payload)
    });

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Error interno" }, { status: 500 });
  }
}
