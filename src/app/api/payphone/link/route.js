// src/app/api/payphone/link/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { amount, reference, userEmail, userCellphone } = await request.json();

    if (!amount || !reference) {
      return NextResponse.json(
        { error: "Faltan amount o reference en el body" },
        { status: 400 }
      );
    }

    const clientId = process.env.PAYPHONE_CLIENT_ID;
    const clientSecret = process.env.PAYPHONE_CLIENT_SECRET;
    const storeId = process.env.PAYPHONE_STORE_ID;

    const baseUrl = process.env.PAYPHONE_BASE_URL || "https://pay.payphonetodoesposible.com";
    const authEndpoint = process.env.PAYPHONE_AUTH_ENDPOINT || "/api/auth/token";
    const linkEndpoint = process.env.PAYPHONE_LINK_ENDPOINT || "/api/button/generatePaymentLink";

    if (!clientId || !clientSecret || !storeId) {
      return NextResponse.json(
        { error: "Faltan variables PAYPHONE_CLIENT_ID / PAYPHONE_CLIENT_SECRET / PAYPHONE_STORE_ID" },
        { status: 500 }
      );
    }

    // 1) Obtener token
    const tokenRes = await fetch(`${baseUrl}${authEndpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId, clientSecret }),
    });
    const tokenText = await tokenRes.text();
    if (!tokenRes.ok) {
      return NextResponse.json(
        { error: "Error obteniendo token", status: tokenRes.status, detail: tokenText },
        { status: 500 }
      );
    }
    let tokenData;
    try {
      tokenData = JSON.parse(tokenText);
    } catch {
      return NextResponse.json(
        { error: "Respuesta de token no es JSON", raw: tokenText },
        { status: 500 }
      );
    }
    const token = tokenData.token;
    if (!token) {
      return NextResponse.json({ error: "No llegó 'token' en la respuesta" }, { status: 500 });
    }

    // 2) Generar link
    const payload = {
      amount,           // en centavos (ej: 3180 para $31.80)
      currency: "USD",
      storeId,
      reference,        // tu referencia (ej: "Pago DS-160 #123")
      userEmail: userEmail || undefined,      // opcional
      userCellphone: userCellphone || undefined, // opcional
    };

    const linkRes = await fetch(`${baseUrl}${linkEndpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const linkText = await linkRes.text();
    if (!linkRes.ok) {
      return NextResponse.json(
        { error: "Error PayPhone (link)", status: linkRes.status, detail: linkText },
        { status: 500 }
      );
    }

    let linkData;
    try {
      linkData = JSON.parse(linkText);
    } catch {
      return NextResponse.json({ error: "Respuesta de link no es JSON", raw: linkText }, { status: 500 });
    }

    // Respuesta típica: { paymentLink: "https://..." }
    return NextResponse.json(linkData);
  } catch (err) {
    return NextResponse.json({ error: "Error interno", detail: err.message }, { status: 500 });
  }
}
