// src/app/api/payphone/link/route.js

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      amountUSD,
      responseUrl, // si no llega, se construye con NEXT_PUBLIC_APP_ORIGIN
      cancelUrl,
      // amountWithoutTax, tax, etc. -> si ya los calculas aparte, puedes enviarlos
    } = body || {};

    // ---------- Origen/URLs ----------
    const envOrigin = process.env.NEXT_PUBLIC_APP_ORIGIN;
    const origin = envOrigin ? envOrigin.replace(/\/$/, "") : undefined;

    const finalResponseUrl =
      responseUrl ||
      (origin ? `${origin}/checkout/confirm` : null);

    const finalCancelUrl =
      cancelUrl ||
      (origin ? `${origin}/checkout/cancel` : null);

    if (!finalResponseUrl) {
      return new Response(
        JSON.stringify({
          ok: false,
          message:
            "responseUrl is missing; set NEXT_PUBLIC_APP_ORIGIN o envíalo en el body",
        }),
        { status: 400 }
      );
    }

    // ---------- Validación monto ----------
    const amountNumber = Number(amountUSD);
    if (!amountNumber || isNaN(amountNumber) || amountNumber <= 0) {
      return new Response(
        JSON.stringify({
          ok: false,
          message: "amountUSD inválido. Envía un número > 0",
        }),
        { status: 400 }
      );
    }
    const amountCents = Math.round(amountNumber * 100);

    // ---------- ENV & Endpoints ----------
    const BASE_URL =
      process.env.PAYPHONE_BASE_URL || "https://pay.payphonetodo.com";
    const AUTH_ENDPOINT =
      process.env.PAYPHONE_AUTH_ENDPOINT || "/api/token";
    const LINK_ENDPOINT =
      process.env.PAYPHONE_LINK_ENDPOINT || "/api/button/Prepare";

    const CLIENT_ID = process.env.PAYPHONE_CLIENT_ID;
    const CLIENT_SECRET = process.env.PAYPHONE_CLIENT_SECRET;
    const STORE_ID = process.env.PAYPHONE_STORE_ID; // tu “Identificador”/storeId

    if (!CLIENT_ID || !CLIENT_SECRET || !STORE_ID) {
      return new Response(
        JSON.stringify({
          ok: false,
          message:
            "Faltan credenciales PayPhone (PAYPHONE_CLIENT_ID, PAYPHONE_CLIENT_SECRET, PAYPHONE_STORE_ID).",
        }),
        { status: 500 }
      );
    }

    // ---------- 1) Obtener token (OAuth/propio de PayPhone) ----------
    // Algunos tenants usan Basic + form-data, otros JSON. Ajusta si tu doc indica distinto.
    const authRes = await fetch(`${BASE_URL}${AUTH_ENDPOINT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Si tu auth requiere form-url-encoded, cambia este body.
      body: JSON.stringify({
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
      }),
    });

    const authData = await authRes.json();
    if (!authRes.ok || !authData?.accessToken) {
      return new Response(
        JSON.stringify({
          ok: false,
          message: authData?.message || "No se pudo obtener token de PayPhone",
          raw: authData,
        }),
        { status: 400 }
      );
    }

    const token = authData.accessToken;

    // ---------- 2) Crear link (Prepare) ----------
    // Ajusta payload según tu esquema fiscal/IVA:
    const payload = {
      amount: amountCents, // centavos
      clientTransactionId: `DS160-${Date.now()}`,
      responseUrl: finalResponseUrl,
      cancelUrl: finalCancelUrl,
      storeId: STORE_ID,
      // amountWithoutTax, tax, tip, currency, service, reference, etc. si tu cuenta lo exige
    };

    const ppRes = await fetch(`${BASE_URL}${LINK_ENDPOINT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const ppData = await ppRes.json();

    if (!ppRes.ok) {
      // Devuelve el detalle real del error
      return new Response(
        JSON.stringify({
          ok: false,
          message: ppData?.message || "PayPhone API error",
          raw: ppData,
        }),
        { status: 400 }
      );
    }

    const paymentUrl = ppData?.paymentUrl || ppData?.url || ppData?.payWithCardUrl;
    if (!paymentUrl) {
      return new Response(
        JSON.stringify({
          ok: false,
          message: "PayPhone no devolvió una URL de pago",
          raw: ppData,
        }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ ok: true, url: paymentUrl, raw: ppData }),
      { status: 200 }
    );
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, message: e.message }), {
      status: 500,
    });
  }
}
