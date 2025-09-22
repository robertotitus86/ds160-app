// src/app/api/payphone/link/route.js

// Salud del endpoint: útil para probar en el navegador
export async function GET() {
  return new Response(JSON.stringify({ ok: true, endpoint: "/api/payphone/link" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

// Crea link de pago (placeholder estable con JSON SIEMPRE)
export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { amountUSD, responseUrl, cancelUrl } = body;

    // Validaciones básicas para no explotar
    if (!amountUSD || Number(amountUSD) <= 0) {
      return new Response(JSON.stringify({ ok: false, message: "amountUSD inválido" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Construye URLs de retorno: usa body si viene; si no, usa env
    const origin = (process.env.NEXT_PUBLIC_APP_ORIGIN || "").replace(/\/$/, "");
    const finalResponseUrl =
      responseUrl || (origin ? `${origin}/checkout/confirm` : null);
    const finalCancelUrl =
      cancelUrl || (origin ? `${origin}/checkout/cancel` : null);

    if (!finalResponseUrl) {
      return new Response(
        JSON.stringify({
          ok: false,
          message:
            "responseUrl is missing; set NEXT_PUBLIC_APP_ORIGIN o envíalo en el body",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // ---------- LLAMADA REAL A PAYPHONE ----------
    // 1) Credenciales y endpoints
    const BASE_URL = process.env.PAYPHONE_BASE_URL || "https://pay.payphonetodo.com";
    const AUTH_ENDPOINT = process.env.PAYPHONE_AUTH_ENDPOINT || "/api/token";
    const LINK_ENDPOINT = process.env.PAYPHONE_LINK_ENDPOINT || "/api/button/Prepare";
    const CLIENT_ID = process.env.PAYPHONE_CLIENT_ID;
    const CLIENT_SECRET = process.env.PAYPHONE_CLIENT_SECRET;
    const STORE_ID = process.env.PAYPHONE_STORE_ID;

    // Si faltan variables, responde JSON (no explotes)
    if (!CLIENT_ID || !CLIENT_SECRET || !STORE_ID) {
      return new Response(
        JSON.stringify({
          ok: false,
          message:
            "Faltan variables: PAYPHONE_CLIENT_ID, PAYPHONE_CLIENT_SECRET, PAYPHONE_STORE_ID.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // 2) Token (ajusta si tu tenant requiere form-urlencoded)
    const authRes = await fetch(`${BASE_URL}${AUTH_ENDPOINT}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: CLIENT_ID, clientSecret: CLIENT_SECRET }),
    });

    const authData = await authRes.json().catch(() => null);
    if (!authRes.ok || !authData?.accessToken) {
      return new Response(
        JSON.stringify({
          ok: false,
          message: authData?.message || "No se pudo obtener token de PayPhone",
          raw: authData,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3) Prepare
    const amountCents = Math.round(Number(amountUSD) * 100);
    const payload = {
      amount: amountCents,
