import { NextResponse } from "next/server";

function getBaseUrl(env) {
  return env === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
}

async function getAccessToken(clientId, secret, env) {
  const base = getBaseUrl(env);
  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
    // @ts-ignore
    cache: "no-store",
    credentials: "include",
    // @ts-ignore
    next: { revalidate: 0 },
    headers: {
      Authorization: "Basic " + Buffer.from(`${clientId}:${secret}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  if (!res.ok) throw new Error("No token PayPal");
  return res.json();
}

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const orderID = body?.orderID;
  if (!orderID) return NextResponse.json({ error: "Falta orderID" }, { status: 400 });

  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  const env = process.env.PAYPAL_ENV || "sandbox";
  if (!clientId || !secret) {
    return NextResponse.json({ error: "Faltan credenciales PayPal" }, { status: 500 });
  }
  const base = getBaseUrl(env);
  const { access_token } = await getAccessToken(clientId, secret, env);

  const capRes = await fetch(`${base}/v2/checkout/orders/${orderID}/capture`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
  });
  const data = await capRes.json();
  return NextResponse.json(data);
}
