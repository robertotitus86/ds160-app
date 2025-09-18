// src/app/api/payphone/token/route.js
import { NextResponse } from "next/server";

/**
 * Verifica que las variables de entorno de PayPhone están bien
 * y que el token es válido en Producción.
 *
 * Cómo funciona:
 * - Envía un POST mínimo al endpoint de "Generate" (producción).
 * - Si el token es inválido => PayPhone devuelve 401 (Unauthorized).
 * - Si el token es válido pero el body es incompleto => 400 (Bad Request).
 *   Eso nos sirve para afirmar que el token es correcto sin crear un cargo.
 */
export async function GET() {
  const storeId = process.env.NEXT_PUBLIC_PAYPHONE_STORE_ID;
  const token = process.env.NEXT_PUBLIC_PAYPHONE_TOKEN;

  if (!storeId || !token) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Faltan variables de entorno: NEXT_PUBLIC_PAYPHONE_STORE_ID o NEXT_PUBLIC_PAYPHONE_TOKEN.",
      },
      { status: 500 }
    );
  }

  try {
    // Endpoint de producción de PayPhone para generar links
    const url = "https://pay.payphonetodoesposible.com/api/button/Generate";

    // Enviamos un body "intencionalmente incompleto" para no generar cobro.
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        // Falta amount/clientTransactionId a propósito.
        storeId,
      }),
    });

    // Respuesta esperada:
    // 400 -> token válido (pero body incompleto) => OK para nosotros.
    // 401 -> token inválido o sin permisos.
    // Otros -> los mostramos.
    if (res.status === 400) {
      return NextResponse.json({
        ok: true,
        message:
          "Token y Store ID válidos. (PayPhone respondió 400 por body incompleto, lo cual es esperado en esta prueba.)",
      });
    }

    if (res.status === 401) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Token inválido o sin permisos (401 Unauthorized). Revisa que el token corresponda a este comercio/ambiente.",
        },
        { status: 401 }
      );
    }

    const text = await res.text().catch(() => "");
    return NextResponse.json(
      {
        ok: false,
        message: `Respuesta inesperada de PayPhone (${res.status}).`,
        raw: text,
      },
      { status: 502 }
    );
  } catch (err) {
    return NextResponse.json(
      { ok: false, message: "Error de red verificando PayPhone.", error: String(err) },
      { status: 500 }
    );
  }
}
