// src/app/api/payphone/link/route.js
import { NextResponse } from "next/server";

/**
 * Crea un "link/botón de cobro" en PayPhone.
 *
 * Variables de entorno requeridas:
 * - NEXT_PUBLIC_PAYPHONE_STORE_ID   (Identificador)
 * - PAYPHONE_ENV = "prod" | "sandbox"  (opcional, por defecto "prod")
 *
 * Body JSON esperado (ejemplo):
 * {
 *   "amount": 3000,               // en centavos (USD 30.00 -> 3000)
 *   "reference": "DS160-123",
 *   "description": "Llenado de formulario DS-160",
 *   "buyerEmail": "cliente@dominio.com",   // opcional
 *   "buyerPhone": "0999999999",            // opcional
 *   "responseUrl": "https://tu-dominio/checkout/confirm",
 *   "cancelUrl":   "https://tu-dominio/checkout/cancel"   // opcional
 * }
 *
 * Respuesta (200): Objeto JSON devuelto por PayPhone. Normalmente incluye
 * algún "checkoutUrl" o "payWithPayPhoneUrl" para redirigir al usuario.
 */

export async function POST(req) {
  try {
    const storeId = process.env.NEXT_PUBLIC_PAYPHONE_STORE_ID;
    const env = (process.env.PAYPHONE_ENV || "prod").toLowerCase();

    if (!storeId) {
      return NextResponse.json(
        { error: "Falta NEXT_PUBLIC_PAYPHONE_STORE_ID en variables de entorno" },
        { status: 500 }
      );
    }

    const body = await req.json();

    // Validaciones básicas
    if (!body?.amount || !body?.reference || !body?.responseUrl) {
      return NextResponse.json(
        {
          error:
            "Faltan campos obligatorios: amount, reference y responseUrl.",
        },
        { status: 400 }
      );
    }

    // 1) Obtener el Bearer desde nuestra propia API
    const tokenResp = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/payphone/token`, {
      method: "GET",
      cache: "no-store",
    });

    // Si tu proyecto no define NEXT_PUBLIC_BASE_URL, usa ruta relativa:
    // const tokenResp = await fetch("/api/payphone/token", { method: "GET", cache: "no-store" });

    const tokenJson = await tokenResp.json();
    if (!tokenResp.ok || !tokenJson?.accessToken) {
      return NextResponse.json(
        {
          error: "No se pudo obtener Bearer de PayPhone",
          detail: tokenJson,
        },
        { status: 500 }
      );
    }

    const bearer = tokenJson.accessToken;

    // 2) Determinar la URL base según entorno
    const BASE_URL =
      env === "sandbox"
        ? "https://sandbox.payphonetodoesposible.com"
        : "https://pay.payphonetodoesposible.com";

    /**
     * 3) Endpoint para crear el link/botón de cobro.
     *    IMPORTANTE: este path puede variar por tenant / versión.
     *    Si tu consola/documentación indica otro, cámbialo aquí.
     *
     * Ejemplos frecuentes:
     * - "/api/button"                (crear botón/link)
     * - "/api/Buttons/Request"       (algunas instancias)
     * - "/api/Collect"               (link de cobro directo)
     */
    const LINK_ENDPOINT = "/api/button";

    // 4) Construir payload para PayPhone
    const payload = {
      storeId,
      // Monto en centavos (ej: 3000 -> $30.00)
      amount: Number(body.amount),
      reference: String(body.reference),
      description: String(body.description || "Pago con PayPhone"),

      // Datos opcionales del comprador si los tienes
      userEmail: body.buyerEmail || undefined,
      userPhone: body.buyerPhone || undefined,

      // URLs
      responseUrl: body.responseUrl, // obligatorio
      cancelUrl: body.cancelUrl || undefined,

      // Puedes agregar otros campos de tu tenant si son requeridos:
      // expiration: "2025-12-31T23:59:59Z",
      // currency: "USD",
      // amountWithTax, amountWithoutTax, tax, etc. (según API de tu tenant)
    };

    // 5) Llamar a PayPhone
    const res = await fetch(`${BASE_URL}${LINK_ENDPOINT}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${bearer}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        {
          error: "No se pudo crear el link de cobro en PayPhone",
          status: res.status,
          detail: data,
          sent: payload,
        },
        { status: 500 }
      );
    }

    // Devuelve el objeto completo (normalmente trae la URL para redirigir)
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      {
        error: "Error inesperado creando link de cobro",
        detail: String(err?.message || err),
      },
      { status: 500 }
    );
  }
}
