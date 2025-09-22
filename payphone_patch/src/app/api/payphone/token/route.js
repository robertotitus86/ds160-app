// src/app/api/payphone/token/route.js
//
// This handler fetches a Bearer token from PayPhone's authentication
// endpoint using the clientId and clientSecret provided via environment
// variables. It responds with a JSON object containing the token or
// an error description.

import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Pull required credentials from environment variables. You must
    // configure these in Vercel under Project → Settings → Environment Variables.
    const clientId = process.env.PAYPHONE_CLIENT_ID;
    const clientSecret = process.env.PAYPHONE_CLIENT_SECRET;
    const baseUrl = process.env.PAYPHONE_BASE_URL ||
      "https://pay.payphonetodoesposible.com";
    const authEndpoint = process.env.PAYPHONE_AUTH_ENDPOINT || "/api/auth/token";

    // Validate credentials exist.
    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: "Missing PAYPHONE_CLIENT_ID or PAYPHONE_CLIENT_SECRET" },
        { status: 500 }
      );
    }

    // Make the request to PayPhone to obtain a Bearer token.
    const res = await fetch(`${baseUrl}${authEndpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId, clientSecret }),
    });

    // PayPhone may respond with either text or JSON. Always attempt to
    // parse JSON first; fallback to plain text.
    const text = await res.text();
    if (!res.ok) {
      return NextResponse.json(
        { error: "Error obtaining PayPhone token", status: res.status, detail: text },
        { status: 500 }
      );
    }
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { token: text };
    }
    if (!data.token) {
      return NextResponse.json(
        { error: "Invalid response from PayPhone token endpoint", raw: data },
        { status: 500 }
      );
    }

    // Return the token to the client.
    return NextResponse.json({ token: data.token });
  } catch (err) {
    return NextResponse.json(
      { error: "Unexpected server error", detail: err.message },
      { status: 500 }
    );
  }
}