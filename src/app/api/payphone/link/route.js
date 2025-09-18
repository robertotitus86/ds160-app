// src/app/api/payphone/link/route.js
import { NextResponse } from "next/server";

/**
 * Crea un link/botón de pago en PayPhone.
 * Body JSON esperado:
 * {
 *   "amount": 3000, // en centavos
 *   "reference": "DS160-001",
 *   "description": "Llenado DS-160",
 *   "buyerEmail": "cliente@mail.com", // opcional
 *   "buyerPhone": "0999999999",       // opcional
 *   "responseUrl": "https://tu-dominio/checkout/confirm",
 *   "cancelUrl": "https://tu-dominio/checkout/cancel" // opcional
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

    // 1) Traemos token + storeId desde nuestro endpoint /api/payphone/token
    const tokenRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/payphone/token`, {
      method: "GET",
      cache: "no-store",
    }).catch(() => null);

    // Si no tienes NEXT_PUBLIC_BASE_URL configurado, usa ruta relativa:
    // const tokenRes = await fetch("/api/payphone/token", { method: "GET", cache: "no-store" });

    if (!tokenRes || !tokenRes.ok) {
      return NextResponse.json(
        { error: "No se pudo obtener credenciales de PayPhone" },
        { status: 500 }
      );
    }
    const { token, storeId, env } = await tokenRes.json();

    const BASE_URL =
      (env || "prod") === "sandbox"
        ? "https://sandbox.payphonetodoesposible.com"
        : "https://pay.payphonetodoesposible.com";

    // ⚠️ Este endpoint puede variar según el tenant. Si tu doc indica otro, cámbialo aquí:
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

    // La mayoría de tenants devuelven alguna URL para redirigir al pago:
    // checkoutUrl | payWithPayPhoneUrl | url | link
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Error inesperado creando el link de pago", detail: String(error) },
      { status: 500 }
    );
  }
}
