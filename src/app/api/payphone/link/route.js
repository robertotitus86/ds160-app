// src/app/api/payphone/link/route.js
//
// Esta ruta crea un enlace de pago mediante la API Button/Prepare de PayPhone.
// Puede recibir amountUSD o desglose de montos (withTaxUSD, noTaxUSD, taxUSD,
// serviceUSD, tipUSD). También admite `reference` para compatibilidad con
// tu frontend actual. Devuelve un JSON { ok, url, raw? }.

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Convierte un valor en USD (número o string) a centavos enteros */
function toCents(value) {
  const num = Number(value ?? 0);
  return Number.isFinite(num) ? Math.round(num * 100) : 0;
}

/** Añade cabeceras CORS básicas */
function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin ?? "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

// Maneja preflight CORS
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

  // Variables de entorno necesarias
  const storeId = process.env.PAYPHONE_STORE_ID;
  const baseUrl =
    process.env.PAYPHONE_BASE_URL ||
    "https://pay.payphonetodoesposible.com";
  const linkEndpoint =
    process.env.PAYPHONE_LINK_ENDPOINT || "/api/button/Prepare";

  if (!storeId) {
    return NextResponse.json(
      { ok: false, message: "Missing PAYPHONE_STORE_ID" },
      { status: 500, headers }
    );
  }

  // Usa token existente o genera uno nuevo al vuelo
  let token = process.env.PAYPHONE_TOKEN;
  if (!token) {
    try {
      const authEndpoint =
        process.env.PAYPHONE_AUTH_ENDPOINT || "/api/auth/token";
      const resToken = await fetch(`${baseUrl}${authEndpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: process.env.PAYPHONE_CLIENT_ID,
          clientSecret: process.env.PAYPHONE_CLIENT_SECRET,
        }),
      });
      const tokenData = await resToken.json().catch(() => ({}));
      token = tokenData.token;
    } catch (e) {
      return NextResponse.json(
        {
          ok: false,
          message: "Unable to obtain PayPhone token",
          detail: e.message,
        },
        { status: 500, headers }
      );
    }
  }

  // Lee y desestructura el body
  let body = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const {
    amountUSD,
    withTaxUSD = 0,
    noTaxUSD = 0,
    taxUSD = 0,
    serviceUSD = 0,
    tipUSD = 0,
    reference,
    description = reference || "Pago DS-160",
    clientTransactionId,
    responseUrl,
    cancellationUrl,
    timeZone = -5,
    lat,
    lng,
  } = body;

  // Genera ID de transacción si no se proporciona
  let txId = clientTransactionId;
  if (!txId) {
    txId = `DS${Date.now().toString(36)}`.substring(0, 15);
  } else if (String(txId).length > 15) {
    return NextResponse.json(
      {
        ok: false,
        message: "clientTransactionId must be <= 15 characters",
      },
      { status: 400, headers }
    );
  }

  // Calcula monto total en centavos
  const totalCents = toCents(
    amountUSD ||
      withTaxUSD + noTaxUSD + taxUSD + serviceUSD + tipUSD
  );

  // Calcula cada componente en centavos
  const centsWithTax = toCents(withTaxUSD);
  const centsNoTax = toCents(noTaxUSD || amountUSD);
  const centsTax = toCents(taxUSD);
  const centsService = toCents(serviceUSD);
  const centsTip = toCents(tipUSD);

  // Construye el payload para PayPhone
  const payload = {
    clientTransactionId: txId,
    storeId,
    currency: "USD",
    reference: description,
    amount: totalCents,
    amountWithTax: centsWithTax,
    amountWithoutTax: centsNoTax,
    tax: centsTax,
    service: centsService,
    tip: centsTip,
    responseUrl:
      responseUrl ||
      (process.env.NEXT_PUBLIC_APP_ORIGIN
        ? `${process.env.NEXT_PUBLIC_APP_ORIGIN}/gracias?method=payphone`
        : null),
    timeZone,
  };
  if (cancellationUrl) payload.cancellationUrl = cancellationUrl;
  if (lat != null) payload.lat = lat;
  if (lng != null) payload.lng = lng;

  if (!payload.responseUrl) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "responseUrl is missing; set NEXT_PUBLIC_APP_ORIGIN or provide responseUrl in the body",
      },
      { status: 400, headers }
    );
  }

  // Llama a la API de PayPhone
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
    let detail;
    try {
      detail = JSON.parse(text);
    } catch {
      detail = text;
    }
    return NextResponse.json(
      {
        ok: false,
        message: "PayPhone API error",
        status: apiRes.status,
        detail,
      },
      { status: 502, headers }
    );
  }

  // Normaliza la respuesta para el frontend
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  let responseBody = {};
  if (typeof data === "string") {
    responseBody = { ok: true, url: data };
  } else if (data && typeof data === "object") {
    const url =
      data.payWithPayPhone ||
      data.payWithCard ||
      data.link ||
      null;
    responseBody = { ok: true, url, raw: data };
  } else {
    responseBody = { ok: true, url: null, raw: data };
  }
  return NextResponse.json(responseBody, {
    status: 200,
    headers,
  });
}
