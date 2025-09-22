// GET: sanity check
export async function GET() {
  return new Response(
    JSON.stringify({ ok: true, endpoint: "/api/payphone/link" }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

// Utilidad: base64 sin depender de Buffer (por si se ejecuta en Edge)
function toBase64(str) {
  try {
    // Node (Buffer)
    // eslint-disable-next-line no-undef
    return Buffer.from(str).toString("base64");
  } catch {
    // Fallback web
    return btoa(unescape(encodeURIComponent(str)));
  }
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { amountUSD, responseUrl, cancelUrl } = body;

    // 1) Validaciones base
    const amountNumber = Number(amountUSD);
    if (!amountNumber || isNaN(amountNumber) || amountNumber <= 0) {
      return new Response(
        JSON.stringify({ ok: false, message: "amountUSD inválido (> 0)" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 2) URLs de retorno
    const originEnv = (process.env.NEXT_PUBLIC_APP_ORIGIN || "").replace(/\/$/, "");
    const finalResponseUrl =
      responseUrl || (originEnv ? `${originEnv}/checkout/confirm` : null);
    const finalCancelUrl =
      cancelUrl || (originEnv ? `${originEnv}/checkout/cancel` : null);

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

    // 3) Endpoints / credenciales
    const BASE_URL = (process.env.PAYPHONE_BASE_URL || "https://pay.payphonetodo.com").replace(/\/$/, "");
    const AUTH_ENDPOINT = process.env.PAYPHONE_AUTH_ENDPOINT || "/api/token";
    const LINK_ENDPOINT = process.env.PAYPHONE_LINK_ENDPOINT || "/api/button/Prepare";

    const CLIENT_ID = process.env.PAYPHONE_CLIENT_ID;
    const CLIENT_SECRET = process.env.PAYPHONE_CLIENT_SECRET;
    const STORE_ID = process.env.PAYPHONE_STORE_ID;

    if (!CLIENT_ID || !CLIENT_SECRET || !STORE_ID) {
      return new Response(
        JSON.stringify({
          ok: false,
          message:
            "Faltan variables: PAYPHONE_CLIENT_ID, PAYPHONE_CLIENT_SECRET, PAYPHONE_STORE_ID",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // ---------- 4) OBTENER TOKEN: probar dos variantes ----------
    let token = null;
    let debugAuth = {};

    // Variante A: x-www-form-urlencoded + Basic (muy común)
    try {
      const basic = toBase64(`${CLIENT_ID}:${CLIENT_SECRET}`);
      const resA = await fetch(`${BASE_URL}${AUTH_ENDPOINT}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${basic}`,
        },
        body: "grant_type=client_credentials",
      });
      const dataA = await resA.json().catch(() => null);
      debugAuth.variantA = { status: resA.status, data: dataA };
      if (resA.ok && dataA?.access_token) token = dataA.access_token;
    } catch (e) {
      debugAuth.variantA = { error: e?.message || String(e) };
    }

    // Variante B: x-www-form-urlencoded S/ Basic (client_id/secret en body)
    if (!token) {
      try {
        const resB = await fetch(`${BASE_URL}${AUTH_ENDPOINT}`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body:
            `client_id=${encodeURIComponent(CLIENT_ID)}` +
            `&client_secret=${encodeURIComponent(CLIENT_SECRET)}` +
            `&grant_type=client_credentials`,
        });
        const dataB = await resB.json().catch(() => null);
        debugAuth.variantB = { status: resB.status, data: dataB };
        if (resB.ok && dataB?.access_token) token = dataB.access_token;
      } catch (e) {
        debugAuth.variantB = { error: e?.message || String(e) };
      }
    }

    if (!token) {
      return new Response(
        JSON.stringify({
          ok: false,
          message: "No se pudo obtener token de PayPhone",
          raw: debugAuth, // <- AQUÍ VIENE EL MOTIVO REAL
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 5) Prepare (crear link)
    const amountCents = Math.round(amountNumber * 100);
    const payload = {
      amount: amountCents,
      clientTransactionId: `DS160-${Date.now()}`,
      responseUrl: finalResponseUrl,
      cancelUrl: finalCancelUrl,
      storeId: STORE_ID,
      // Si tu cuenta exige desglose: amountWithoutTax, tax, tip, service, reference, currency, etc.
    };

    const ppRes = await fetch(`${BASE_URL}${LINK_ENDPOINT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const ppData = await ppRes.json().catch(() => null);
    if (!ppRes.ok) {
      return new Response(
        JSON.stringify({
          ok: false,
          message: ppData?.message || "PayPhone API error",
          raw: ppData,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const paymentUrl =
      ppData?.paymentUrl || ppData?.url || ppData?.payWithCardUrl;
    if (!paymentUrl) {
      return new Response(
        JSON.stringify({
          ok: false,
          message: "PayPhone no devolvió una URL de pago",
          raw: ppData,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ ok: true, url: paymentUrl, raw: ppData }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, message: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
