// src/app/api/payphone/link/route.js

import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function toCents(x) {
  const n = Number(x ?? 0);
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
}

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin ?? "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

export async function OPTIONS(req) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(req.headers.get("origin") ?? "*"),
  });
}

export async function POST(req) {
  const origin = req.headers.get("origin") ?? "*";
  const headers = corsHeaders(origin);

  const storeId = process.env.PAYPHONE_STORE_ID;
  const baseUrl = process.env.PAYPHONE_BASE_URL || "https://pay.payphonetodoesposible.com";
  const linkEndpoint = process.env.PAYPHONE_LINK_ENDPOINT || "/api/button/Prepare";

  if (!storeId) {
    return NextResponse.json(
      { error: "Falta PAYPHONE_STORE_ID en el entorno" },
      { status: 500, headers }
    );
  }

  // Obtiene un token si no existe
  let token = process.env.PAYPHONE_TOKEN;
  if (!token) {
    const authEndpoint = process.env.PAYPHONE_AUTH_ENDPOINT || "/api/auth/token";
    const resToken = await fetch(`${baseUrl}${authEndpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId: process.env.PAYPHONE_CLIENT_ID,
        clientSecret: process.env.PAYPHONE_CLIENT_SECRET,
      }),
    });
    const { token: newToken } = await resToken.json();
    token = newToken;
  }

  let body = {};
  try {
    body = await req.json();
  } catch {
    /* usa valores por defecto */
  }

  const {
    amountUSD,
    withTaxUSD = 0,
    noTaxUSD = 0,
    taxUSD = 0,
    serviceUSD = 0,
    tipUSD = 0,
    description = "Pago DS-160",
    clientTransactionId,
    responseUrl,
    cancellationUrl,
    timeZone = -5,
    lat,
    lng,
  } = body;

  // Valida clientTransactionId
  if (!clientTransactionId || String(clientTransactionId).length > 15) {
    return NextResponse.json(
      { error: "clientTransactionId requerido y <= 15 caracteres" },
      { status: 400, headers }
    );
  }

  // Calcula montos en centavos
  const amount =
    toCents(
      amountUSD ||
        withTaxUSD + noTaxUSD + taxUSD + serviceUSD + tipUSD
    );
  const amountWithTaxCents = toCents(withTaxUSD);
  const amountWithoutTaxCents =
    toCents(noTaxUSD || amountUSD); // si no especificas noTaxUSD, asume todo el total
  const taxCents = toCents(taxUSD);
  const serviceCents = toCents(serviceUSD);
  const tipCents = toCents(tipUSD);

  // Construye el payload
  const payload = {
    clientTransactionId,
    storeId,
    currency: "USD",
    reference: description,
    amount,
    amountWithTax: amountWithTaxCents,
    amountWithoutTax: amountWithoutTaxCents,
    tax: taxCents,
    service: serviceCents,
    tip: tipCents,
    responseUrl:
      responseUrl ||
      `${process.env.NEXT_PUBLIC_APP_ORIGIN}/gracias?method=payphone`,
    timeZone,
  };
  if (cancellationUrl) payload.cancellationUrl = cancellationUrl;
  if (lat != null) payload.lat = lat;
  if (lng != null) payload.lng = lng;

  const apiRes = await fetch(`${baseUrl}${linkEndpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const text = await apiRes.text();
  if (!apiRes.ok) {
    return NextResponse.json(
      { error: "Error PayPhone", status: apiRes.status, detail: text },
      { status: 502, headers }
    );
  }

  return NextResponse.json({ link: text }, { status: 200, headers });
}


