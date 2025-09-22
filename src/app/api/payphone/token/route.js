// src/app/api/payphone/token/route.js

import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Credenciales que debes definir en Vercel
    const clientId = process.env.PAYPHONE_CLIENT_ID;
    const clientSecret = process.env.PAYPHONE_CLIENT_SECRET;

    // Valores por defecto que puedes redefinir por variable de entorno
    const baseUrl = process.env.PAYPHONE_BASE_URL || "https://pay.payphonetodoesposible.com";
    const authEndpoint = process.env.PAYPHONE_AUTH_ENDPOINT || "/api/auth/token";

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: "Faltan credenciales PAYPHONE_CLIENT_ID / PAYPHONE_CLIENT_SECRET" },
        { status: 500 }
      );
    }

    // Solicita el token usando tus credenciales
    const res = await fetch(`${baseUrl}${authEndpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId, clientSecret }),
    });

    const text = await res.text();

    if (!res.ok) {
      return NextResponse.json(
        { error: "Error PayPhone (token)", status: res.status, detail: text },
        { status: 500 }
      );
    }

    const data = JSON.parse(text);
    if (!data.token) {
      return NextResponse.json(
        { error: "Token no recibido", raw: data },
        { status: 500 }
      );
    }

    // Devuelve el token
    return NextResponse.json({ token: data.token });
  } catch (err) {
    return NextResponse.json(
      { error: "Error interno", detail: err.message },
      { status: 500 }
    );
  }
}
