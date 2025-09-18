// src/app/api/payphone/token/route.js

// ────────────────────────────────────────────────────────────────
// Endpoint: POST /api/payphone/token
// Obtiene un token de PayPhone usando Client ID y Client Secret
// Requiere variables de entorno (todas en Vercel → Project → Settings → Environment Variables):
//   - PAYPHONE_CLIENT_ID        (obligatoria)
//   - PAYPHONE_CLIENT_SECRET    (obligatoria)
//   - PAYPHONE_BASE_URL         (opcional, por defecto https://pay.payphonetodoesposible.com)
//   - PAYPHONE_AUTH_ENDPOINT    (opcional, por defecto /api/auth/token)
// ────────────────────────────────────────────────────────────────

const BASE_URL =
  process.env.PAYPHONE_BASE_URL?.trim() ||
  "https://pay.payphonetodoesposible.com";

const AUTH_ENDPOINT =
  process.env.PAYPHONE_AUTH_ENDPOINT?.trim() ||
  "/api/auth/token";

const CLIENT_ID = process.env.PAYPHONE_CLIENT_ID?.trim();
const CLIENT_SECRET = process.env.PAYPHONE_CLIENT_SECRET?.trim();

// Habilitamos CORS básico para pruebas desde navegador si lo necesitas
export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

// POST /api/payphone/token
export async function POST() {
  try {
    // Validación de variables obligatorias
    if (!CLIENT_ID || !CLIENT_SECRET) {
      return Response.json(
        {
          ok: false,
          message:
            "Faltan variables de entorno: PAYPHONE_CLIENT_ID o PAYPHONE_CLIENT_SECRET.",
        },
        { status: 400 }
      );
    }

    const url = `${BASE_URL}${AUTH_ENDPOINT}`;

    // Algunas cuentas de PayPhone aceptan JSON { clientId, clientSecret }.
    // Dejamos este formato que funciona en la mayoría de integraciones actuales.
    const body = JSON.stringify({
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
    });

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // ¡Nunca uses NEXT_PUBLIC_* aquí! Este endpoint corre en servidor.
      body,
      // Si tu proyecto usa Vercel, no necesitas 'cache: "no-store"', pero ayuda en dev.
      cache: "no-store",
    });

    // Si la API devuelve 4xx/5xx
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return Response.json(
        {
          ok: false,
          message:
            "PayPhone devolvió un error al generar el token. Revisa credenciales/entorno.",
          status: res.status,
          response: text || "Sin cuerpo",
          endpoint: url,
        },
        { status: 502 }
      );
    }

    const data = await res.json();

    // Estándar de respuesta esperado: { token, expiresIn, ... }
    if (!data?.token) {
      return Response.json(
        {
          ok: false,
          message:
            "Respuesta de PayPhone sin 'token'. Verifica el endpoint y las credenciales.",
          raw: data,
        },
        { status: 502 }
      );
    }

    return Response.json(
      {
        ok: true,
        token: data.token,
        expiresIn: data.expiresIn ?? null,
        raw: data, // útil en pruebas; quítalo si no lo necesitas
      },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (err) {
    return Response.json(
      {
        ok: false,
        message: "Error inesperado obteniendo el token de PayPhone.",
        error: String(err?.message || err),
      },
      { status: 500 }
    );
  }
}
