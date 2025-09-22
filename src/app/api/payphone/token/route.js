// src/app/api/payphone/token/route.js
//
// Obtiene un token Bearer de PayPhone utilizando tu clientId y clientSecret.
// Si la respuesta no contiene la propiedad "token" o la llamada falla,
// devuelve un mensaje de error.

import { NextResponse } from "next/server";

export async function POST() {
  try {
    const clientId = process.env.PAYPHONE_CLIENT_ID;
    const clientSecret = process.env.PAYPHONE_CLIENT_SECRET;
    const baseUrl =
      process.env.PAYPHONE_BASE_URL ||
      "https://pay.payphonetodoesposible.com";
    const authEndpoint =
      process.env.PAYPHONE_AUTH_ENDPOINT || "/api/auth/token";

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        {
          error:
            "Missing PAYPHONE_CLIENT_ID or PAYPHONE_CLIENT_SECRET",
        },
        { status: 500 }
      );
    }

    const res = await fetch(`${baseUrl}${authEndpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId, clientSecret }),
    });

    const text = await res.text();
    if (!res.ok) {
      return NextResponse.json(
        {
          error: "Error obtaining PayPhone token",
          status: res.status,
          detail: text,
        },
        { status: 500 }
      );
    }
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { token: text };
    }
    if (!data.token) {
      return NextResponse.json(
        {
          error:
            "Invalid response from PayPhone token endpoint",
          raw: data,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ token: data.token });
  } catch (err) {
    return NextResponse.json(
      {
        error: "Unexpected server error",
        detail: err.message,
      },
      { status: 500 }
    );
  }
}
