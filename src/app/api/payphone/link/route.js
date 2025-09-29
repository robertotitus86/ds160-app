import { NextResponse } from "next/server";
import { requiredEnv, fetchJSON } from "@/lib/payphone"; // usamos tu util existente

const CLIENT_ID = requiredEnv("PAYPHONE_CLIENT_ID");
const CLIENT_SECRET = requiredEnv("PAYPHONE_CLIENT_SECRET");
const STORE_ID = requiredEnv("PAYPHONE_STORE_ID");
const BASE = process.env.PAYPHONE_BASE_URL || "https://pay.payphonetodoesposible.com";

// Si tu tenant requiere POST para el token, cambia a "POST"
const METHOD_TOKEN = "GET";

async function getToken() {
  const url = `${BASE}/api/auth/token`;
  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
  const init = {
    method: METHOD_TOKEN,
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: "application/json",
      "Content-Type": "application/json"
    }
    // Si tu tenant exige body con POST, me avisas y te paso el body.
  };
  const data = await fetchJSON(url, init);
  const token = data.token || data.accessToken || data.access_token;
  if (!token) throw new Error("No se recibió token de PayPhone");
  return token;
}

export async function POST(req) {
  try {
    const payload = await req.json(); // { amount, reference?, responseUrl, ... }
    const { amount, responseUrl } = payload || {};
    if (!amount || !responseUrl) {
      return NextResponse.json({ error: "amount y responseUrl son obligatorios" }, { status: 400 });
    }

    const token = await getToken();
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

