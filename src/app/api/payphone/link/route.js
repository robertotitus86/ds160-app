// src/app/api/payphone/link/route.js
// ✅ Ruta para crear el link de pago (PayPhone) o, si defines PROXY_BASE_URL, llama a tu proxy.
// ✅ Corre en Node.js (no Edge) y siempre responde JSON.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function b64(s) {
  // Base64 estándar en Node
  return Buffer.from(s).toString("base64");
}

// --- Llamada directa a PayPhone (token + prepare) ---
async function createPayphoneLinkDirect({ amountUSD, responseUrl, cancelUrl }) {
  const BASE   = (process.env.PAYPHONE_BASE_URL || "https://pay.payphonetodo.com").replace(/\/$/, "");
  const AUTH   = process.env.PAYPHONE_AUTH_ENDPOINT || "/api/token";
  const LINK   = process.env.PAYPHONE_LINK_ENDPOINT || "/api/button/Prepare";
  const ID     = process.env.PAYPHONE_CLIENT_ID;
  const SECRET = process.env.PAYPHONE_CLIENT_SECRET;
  const STORE  = process.env.PAYPHONE_STORE_ID;

  if (!ID || !SECRET || !STORE) {
    return { ok: false, status: 500, message: "Faltan PAYPHONE_CLIENT_ID / PAYPHONE_CLIENT_SECRET / PAYPHONE_STORE_ID" };
  }

  // 1) TOKEN (flujo típico: Basic + x-www-form-urlencoded)
  const authRes = await fetch(`${BASE}${AUTH}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${b64(`${ID}:${SECRET}`)}`
    },
    body: "grant_type=client_credentials"
  });
  const authTxt = await authRes.text();
  let authJson = null; try { authJson = JSON.parse(authTxt); } catch {}

  if (!authRes.ok || !authJson?.access_token) {
    return {
      ok: false,
      status: 400,
      message: authJson?.error_description || "No se pudo obtener token de PayPhone",
      raw: authJson || authTxt
    };
  }
  const token = authJson.access_token;

  // 2) PREPARE (crear link)
  const payload = {
    amount: Math.round(Number(amountUSD) * 100),
    clientTransactionId: `DS160-${Date.now()}`,
    responseUrl,
    cancelUrl,
    storeId: STORE,
    // Si tu cuenta requiere desglose de impuestos, agrega:
    // amountWithoutTax, tax, service, tip, etc.
  };

  const prepRes = await fetch(`${BASE}${LINK}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  const prepTxt = await prepRes.text();
  let prepJson = null; try { prepJson = JSON.parse(prepTxt); } catch {}

  if (!prepRes.ok) {
    return {
      ok: false,
      status: 400,
      message: (prepJson && prepJson.message) || "PayPhone API error (Prepare)",
      raw: prepJson || prepTxt
    };
  }

  const url =
    (prepJson && (prepJson.paymentUrl || prepJson.url || prepJson.payWithCardUrl)) ||
    (prepTxt.match(/https?:\/\/[^\s"]+/) || [null])[0];

  if (!url) {
    return { ok: false, status: 400, message: "PayPhone no devolvió URL de pago", raw: prepJson || prepTxt };
  }

  return { ok: true, status: 200, url };
}

export async function GET() {
  // Ping para probar en el navegador
  return new Response(JSON.stringify({ ok: true, endpoint: "/api/payphone/link" }), {
    status: 200, headers: { "Content-Type": "application/json" }
  });
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { amountUSD, responseUrl, cancelUrl } = body;

    const amountNumber = Number(amountUSD);
    if (!amountNumber || isNaN(amountNumber) || amountNumber <= 0) {
      return new Response(JSON.stringify({ ok: false, message: "amountUSD inválido (> 0)" }), {
        status: 400, headers: { "Content-Type": "application/json" }
      });
    }

    // Construir URLs por si no vienen en el body
    const origin = (process.env.NEXT_PUBLIC_APP_ORIGIN || "").replace(/\/$/, "");
    const finalResponseUrl = responseUrl || (origin ? `${origin}/checkout/confirm` : null);
    const finalCancelUrl   = cancelUrl   || (origin ? `${origin}/checkout/cancel`  : null);

    if (!finalResponseUrl) {
      return new Response(JSON.stringify({
        ok: false,
        message: "responseUrl is missing; set NEXT_PUBLIC_APP_ORIGIN o envíalo en el body"
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    // --- Plan B: usar PROXY si está definido ---
    const PROXY = process.env.PROXY_BASE_URL; // p.ej. https://tu-proxy.onrender.com
    if (PROXY) {
      const r = await fetch(`${PROXY.replace(/\/$/, "")}/pp/prepare`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountUSD: amountNumber,
          responseUrl: finalResponseUrl,
          cancelUrl: finalCancelUrl
        })
      });
      const data = await r.json().catch(() => null);
      if (!r.ok || !data?.ok) {
        return new Response(JSON.stringify({ ok: false, message: "Proxy error", raw: data }), {
          status: 400, headers: { "Content-Type": "application/json" }
        });
      }
      const url = data?.prep?.paymentUrl || data?.prep?.url || data?.prep?.payWithCardUrl;
      if (!url) {
        return new Response(JSON.stringify({ ok: false, message: "Proxy respondió sin URL", raw: data }), {
          status: 400, headers: { "Content-Type": "application/json" }
        });
      }
      return new Response(JSON.stringify({ ok: true, url }), {
        status: 200, headers: { "Content-Type": "application/json" }
      });
    }

    // --- Camino directo a PayPhone ---
    const result = await createPayphoneLinkDirect({
      amountUSD: amountNumber,
      responseUrl: finalResponseUrl,
      cancelUrl: finalCancelUrl
    });

    return new Response(JSON.stringify(result), {
      status: result.status || (result.ok ? 200 : 400),
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ ok: false, message: e.message }), {
      status: 500, headers: { "Content-Type": "application/json" }
    });
  }
}
