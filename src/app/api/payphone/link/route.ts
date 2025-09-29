import { NextRequest, NextResponse } from "next/server";
import { requiredEnv, fetchJSON } from "@/lib/server-utils";

const CLIENT_ID = requiredEnv("PAYPHONE_CLIENT_ID");
const CLIENT_SECRET = requiredEnv("PAYPHONE_CLIENT_SECRET");
const STORE_ID = requiredEnv("PAYPHONE_STORE_ID");

// Si no defines PAYPHONE_BASE_URL, usamos producción por defecto
const BASE = process.env.PAYPHONE_BASE_URL || "https://pay.payphonetodoesposible.com";

const METHOD_TOKEN: "GET" | "POST" = "GET";

async function getToken(): Promise<string> {
  const url = `${BASE}/api/auth/token`;
  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
  const init: RequestInit = {
    method: METHOD_TOKEN,
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  };
  const data: any = await fetchJSON(url, init);
  const token = data.token || data.accessToken || data.access_token;
  if (!token) throw new Error("No se recibió token de PayPhone");
  return token;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, reference = `ORD-${Date.now()}`, responseUrl } = body || {};

    if (!amount || !responseUrl) {
      return NextResponse.json(
        { error: "amount y responseUrl son obligatorios" },
        { status: 400 }
      );
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
      body: JSON.stringify({ amount, reference, responseUrl, ...body })
    });

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Error interno" }, { status: 500 });
  }
}