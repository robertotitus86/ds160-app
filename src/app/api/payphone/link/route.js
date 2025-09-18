import { NextResponse } from "next/server";

/**
 * Crea un link/botón de pago en PayPhone.
 * Espera body JSON:
 * {
 *   "amount": 3000,                 // en centavos (30.00 -> 3000)
 *   "reference": "DS160-001",
 *   "description": "Servicios DS-160",
 *   "buyerEmail": "cliente@mail.com", // opcional
 *   "buyerPhone": "0999999999",       // opcional
 *   "responseUrl": "https://.../checkout/confirm",
 *   "cancelUrl": "https://.../checkout/cancel"
 * }
 */
export async function POST(req) {
  try {
    const { amount, reference, description, buyerEmail, buyerPhone, responseUrl, cancelUrl } =
      await req.json();

    if (!amount || !reference || !responseUrl) {
      return NextResponse.json(
        { error: "Faltan campos: amount, reference y responseUrl." },
        { status: 400 }
      );
    }

    // 1) Traemos token + storeId desde nuestro endpoint
    const base = process.env.NEXT_PUBLIC_BASE_URL || "";
    const tokenRes = await fetch(`${base}/api/payphone/token`, {
      method: "GET",
      cache: "no-store",
    });

    if (!tokenRes.ok) {
      return NextResponse.json(
        { error: "No se pudo obtener credenciales de PayPhone" },
        { status: 500 }
      );
    }
    const { token, storeId, env } = await tokenRes.json();

    // 2) Endpoint base según entorno
    const BASE_URL =
      (env || "prod") === "sandbox"
        ? "https://sandbox.payphonetodoesposible.com"
        : "https://pay.payphonetodoesposible.com";

    // 3) Según tenant/versión, puede ser /api/button o /api/button/Send, verifica tu doc.
    const LINK_ENDPOINT = "/api/button";

    const payload = {
      storeId,
      amount: Number(amount),
      reference: String(reference),
      description: String(description || "Pago con PayPhone"),
      userEmail: buyerEmail || undefined,
      userPhone: buyerPhone || undefined,
      responseUrl,
      cancelUrl: cancelUrl || undefined,
    };

    const res = await fetch(`${BASE_URL}${LINK_ENDPOINT}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        {
          error: "PayPhone rechazó la solicitud de link",
          status: res.status,
          sent: payload,
          detail: data,
        },
        { status: 500 }
      );
    }

    // Devuelve el objeto tal como lo entrega PayPhone
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Error inesperado creando el link de pago", detail: String(error) },
      { status: 500 }
    );
  }
}
