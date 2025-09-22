// src/app/api/payphone/link/route.js

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Convierte montos en dólares a centavos enteros
function toCents(x) {
  const n = Number(x ?? 0);
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
}

// Genera cabeceras CORS simples
function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin ?? "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

// Maneja preflight CORS (OPTIONS)
export async function OPTIONS(req) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(req.headers.get("origin") ?? "*"),
  });
}

// Maneja la creación del enlace de pago
export async function POST(req) {
  const origin = req.headers.get("origin") ?? "*";
  const headers = corsHeaders(origin);

  // Store ID de tu comercio (lo obtienes en Payphone Business)
  const storeId = process.env.PAYPHONE_STORE_ID;
  const baseUrl = process.env.PAYPHONE_BASE_URL || "https://pay.payphonetodoesposible.com";
  const linkEndpoint =
    process.env.PAYPHONE_LINK_ENDPOINT || "/api/button/GeneratePaymentLink";

  if (!storeId) {
    return NextResponse.json(
      { error: "Falta PAYPHONE_STORE_ID en el entorno" },
      { status: 500, headers }
    );
  }

  // Toma token existente o lo genera on-the-fly si no existe
  let token = process.env.PAYPHONE_TOKEN;
  if (!token) {
    try {
      const authEndpoint = process.env.PAYPHONE_AUTH_ENDPOINT || "/api/auth/token";
      const resToken = await fetch(`${baseUrl}${authEndpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: process.env.PAYPHONE_CLIENT_ID,
          clientSecret: process.env.PAYPHONE_CLIENT_SECRET,
        }),
      });
      const tokenData = await resToken.json();
      token = tokenData.token;
    } catch (e) {
      return NextResponse.json(
        { error: "No se pudo obtener token", detail: e.message },
        { status: 500, headers }
      );
    }
  }

  // Lee el cuerpo de la solicitud
  let body = {};
  try {
    body = await req.json();
  } catch {
    /* usa valores por defecto */
  }

  // Extrae y valida campos
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
  } = body;

  if (!clientTransactionId || String(clientTransactionId).length > 15) {
    return NextResponse.json(
      { error: "clientTransactionId requerido y <= 15 caracteres" },
      { status: 400, headers }
    );
  }

  // Calcula el monto total en centavos
  const amount = toCents(
    amountUSD || withTaxUSD + noTaxUSD + taxUSD + serviceUSD + tipUSD
  );

  // Construye el payload que exige Payphone
  const payload = {
    clientTransactionId,
    storeId,
    currency: "USD",
    reference: description,
    amount,
    amountWithTax: toCents(withTaxUSD),
    amountWithoutTax: toCents(noTaxUSD),
    tax: toCents(taxUSD),
    service: toCents(serviceUSD),
    tip: toCents(tipUSD),
    responseUrl:
      responseUrl ||
      process.env.NEXT_PUBLIC_APP_ORIGIN +
        "/gracias?method=payphone",
  };

  // Llama a la API de Payphone con el token Bearer
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

  // La API devuelve la URL del link de pago
  return NextResponse.json({ link: text }, { status: 200, headers });
}

