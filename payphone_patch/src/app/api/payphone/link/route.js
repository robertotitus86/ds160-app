// src/app/api/payphone/link/route.js
//
// This API route prepares a PayPhone payment link for the Button/Prepare
// integration. It expects a POST request with JSON describing the
// transaction. At minimum, provide:
//   - amountUSD: The total amount in USD (decimal). This can be omitted
//     if you provide individual amounts (withTaxUSD, noTaxUSD, taxUSD,
//     serviceUSD, tipUSD), in which case the total will be computed.
//   - clientTransactionId: A unique identifier (max 15 characters).
// Optionally you may provide: description, withTaxUSD, noTaxUSD, taxUSD,
// serviceUSD, tipUSD, responseUrl, cancellationUrl, timeZone, lat, lng.
//
// Environment variables required:
//   PAYPHONE_STORE_ID         – your store ID from PayPhone Business
//   PAYPHONE_BASE_URL         – root PayPhone API URL (default: https://pay.payphonetodoesposible.com)
//   PAYPHONE_LINK_ENDPOINT    – relative path to Button/Prepare (e.g. /api/button/Prepare)
//   PAYPHONE_AUTH_ENDPOINT    – relative path to auth token (default: /api/auth/token)
//   PAYPHONE_CLIENT_ID        – your client ID for token generation
//   PAYPHONE_CLIENT_SECRET    – your client secret for token generation
//   PAYPHONE_TOKEN            – (optional) pre-generated Bearer token
//   NEXT_PUBLIC_APP_ORIGIN    – used to construct responseUrl when not provided

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Convert a USD amount (string or number) into integer cents. */
function toCents(value) {
  const num = Number(value ?? 0);
  return Number.isFinite(num) ? Math.round(num * 100) : 0;
}

/** Simple helper to set CORS headers for local and external requests. */
function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin ?? "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

// Respond to preflight CORS
export async function OPTIONS(req) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(req.headers.get("origin") ?? "*"),
  });
}

// Main handler for creating a payment link.
export async function POST(req) {
  const origin = req.headers.get("origin") ?? "*";
  const headers = corsHeaders(origin);

  // Required environment values
  const storeId = process.env.PAYPHONE_STORE_ID;
  const baseUrl = process.env.PAYPHONE_BASE_URL ||
    "https://pay.payphonetodoesposible.com";
  const linkEndpoint = process.env.PAYPHONE_LINK_ENDPOINT ||
    "/api/button/Prepare";

  if (!storeId) {
    return NextResponse.json(
      { ok: false, message: "Missing PAYPHONE_STORE_ID" },
      { status: 500, headers }
    );
  }

  // Obtain a token from the environment or generate a new one if missing.
  let token = process.env.PAYPHONE_TOKEN;
  if (!token) {
    try {
      const authEndpoint = process.env.PAYPHONE_AUTH_ENDPOINT ||
        "/api/auth/token";
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
        { ok: false, message: "Unable to obtain PayPhone token", detail: e.message },
        { status: 500, headers }
      );
    }
  }

  // Parse the incoming JSON body
  let body = {};
  try {
    body = await req.json();
  } catch (_) {
    // Use defaults if body cannot be parsed
    body = {};
  }

  const {
    // Total amount in USD. If only this value is provided, it will be
    // converted to cents and used for both amount and amountWithoutTax.
    amountUSD,
    withTaxUSD = 0,
    noTaxUSD = 0,
    taxUSD = 0,
    serviceUSD = 0,
    tipUSD = 0,
    // `reference` is accepted for compatibility with existing frontend.
    reference,
    description = reference || "Pago DS-160",
    clientTransactionId,
    responseUrl,
    cancellationUrl,
    timeZone = -5,
    lat,
    lng,
  } = body;

  // Generate a transaction ID if not provided. Maximum 15 characters.
  let txId = clientTransactionId;
  if (!txId) {
    txId = `DS${Date.now().toString(36)}`.substring(0, 15);
  } else if (String(txId).length > 15) {
    return NextResponse.json(
      { ok: false, message: "clientTransactionId must be <= 15 characters" },
      { status: 400, headers }
    );
  }

  // Calculate the total in cents. If amountUSD is provided, use it; otherwise
  // sum the individual components.
  const totalCents = toCents(
    amountUSD ||
      withTaxUSD + noTaxUSD + taxUSD + serviceUSD + tipUSD
  );

  // Compute each component in cents
  const centsWithTax = toCents(withTaxUSD);
  const centsNoTax = toCents(noTaxUSD || amountUSD);
  const centsTax = toCents(taxUSD);
  const centsService = toCents(serviceUSD);
  const centsTip = toCents(tipUSD);

  // Build the payload for Button/Prepare. Include only relevant fields.
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
    responseUrl: responseUrl ||
      (process.env.NEXT_PUBLIC_APP_ORIGIN ?
        `${process.env.NEXT_PUBLIC_APP_ORIGIN}/gracias?method=payphone` : null),
    timeZone,
  };

  // Add optional properties only if provided
  if (cancellationUrl) payload.cancellationUrl = cancellationUrl;
  if (lat != null) payload.lat = lat;
  if (lng != null) payload.lng = lng;

  // Ensure we have a valid responseUrl; if null, reject the request
  if (!payload.responseUrl) {
    return NextResponse.json(
      { ok: false, message: "responseUrl is missing; set NEXT_PUBLIC_APP_ORIGIN or provide responseUrl in the body" },
      { status: 400, headers }
    );
  }

  // POST the data to PayPhone to obtain the payment URL
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
    // Attempt to parse JSON error details
    let detail;
    try {
      detail = JSON.parse(text);
    } catch (_) {
      detail = text;
    }
    return NextResponse.json(
      { ok: false, message: "PayPhone API error", status: apiRes.status, detail },
      { status: 502, headers }
    );
  }

  // Successful call returns the payment URL(s). Attempt to parse JSON;
  // fallback to treating the response as a plain string URL.
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    data = text;
  }
  // Normalize the response for the frontend. It expects an `ok` flag
  // and a `url` property. PayPhone returns either an object with
  // `payWithPayPhone`/`payWithCard` or a direct URL string.
  let responseBody = {};
  if (typeof data === "string") {
    responseBody = { ok: true, url: data };
  } else if (data && typeof data === "object") {
    const url = data.payWithPayPhone || data.payWithCard || data.link || null;
    responseBody = { ok: true, url, raw: data };
  } else {
    responseBody = { ok: true, url: null, raw: data };
  }
  return NextResponse.json(responseBody, { status: 200, headers });
}