// src/app/api/payphone/link/route.js
//
// Genera un link de pago PayPhone usando token dinámico.
// Requiere estas variables en Vercel (All Environments):
// - PAYPHONE_CLIENT_ID         -> (Id Cliente)   Ej: W9T8RiEtuk2...
// - PAYPHONE_CLIENT_SECRET     -> (Clave secreta) Ej: S2hlXbBWf0n...
// - NEXT_PUBLIC_PAYPHONE_STORE_ID -> (Identificador / Store ID) Ej: e9WFx5Ef...
//
// Opcionales (si no las pones, usan los valores por defecto de producción):
// - PAYPHONE_BASE_URL          -> https://pay.payphonetodoesposible.com
// - PAYPHONE_LINK_ENDPOINT     -> /api/button/GeneratePaymentLink
// - PAYPHONE_AUTH_ENDPOINT     -> /api/auth/token

const BASE_URL =
  process.env.PAYPHONE_BASE_URL ||
  "https://pay.payphonetodoesposible.com";

const AUTH_ENDPOINT =
  process.env.PAYPHONE_AUTH_ENDPOINT || "/api/auth/token";

const LINK_ENDPOINT =
  process.env.PAYPHONE_LINK_ENDPOINT || "/api/button/GeneratePaymentLink";

const STORE_ID = process.env.NEXT_PUBLIC_PAYPHONE_STORE_ID;
const CLIENT_ID = process.env.PAYPHONE_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPHONE_CLIENT_SECRET;

// Utilidad para respuestas JSON
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// Obtiene token dinámicamente desde PayPhone
async function getPayPhoneToken() {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error(
      "Faltan PAYPHONE_CLIENT_ID o PAYPHONE_CLIENT_SECRET en las variables de entorno."
    );
  }

  const res = await fetch(`${BASE_URL}${AUTH_ENDPOINT}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
    }),
    // Importante en Next.js para evitar caching del edge:
    cache: "no-store",
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(
      `No se pudo obtener token PayPhone (HTTP ${res.status}). ${txt}`
    );
  }

  const data = await res.json();
  // Algunos endpoints devuelven {accessToken: '...'} y otros {token:'...'}
  const token = data?.accessToken || data?.token;
  if (!token) throw new Error("La respuesta del token no contiene accessToken.");
  return token;
}

// Convierte dólares a centavos (PayPhone suele trabajar en centavos)
function toCents(amountNumber) {
  // Acepta 31.8 o 31.80 y lo lleva a 3180
  return Math.round(Number(amountNumber) * 100);
}

export async function POST(req) {
  try {
    if (!STORE_ID) {
      return json(
        {
          error:
            "Falta NEXT_PUBLIC_PAYPHONE_STORE_ID en las variables de entorno.",
        },
        400
      );
    }

    // Datos que envía tu frontend (ajusta a lo que ya estés enviando)
    const body = await req.json();
    const {
      // Requeridos
      amount, // en dólares (ej: 31.80)
      reference, // texto/folio único
      // Opcionales
      responseUrl, // URL de retorno OK
      cancellationUrl, // URL de retorno Cancelado
      customerEmail,
      customerName,
      customerPhone,
      // Si ya calculas un +6% para PayPhone, envíalo en amount; aquí no se recalcula.
      // Puedes pasar otros campos específicos de PayPhone si los necesitas.
    } = body || {};

    if (!amount || !reference) {
      return json(
        {
          error:
            "Faltan campos requeridos: 'amount' (monto en dólares) y 'reference'.",
        },
        400
      );
    }

    // 1) Obtener token dinámico
    const token = await getPayPhoneToken();

    // 2) Construir payload para generar link
    // NOTA: El nombre exacto de campos puede variar según versión de API de PayPhone.
    // Este payload es genérico y funciona con el endpoint de "GeneratePaymentLink".
    const cents = toCents(amount);

    const payload = {
      storeId: STORE_ID,
      amount: cents, // en centavos
      currency: "USD",
      reference, // tu folio interno visible para el cliente
      // Las URL son recomendables, pero PayPhone puede tener defaults en tu app
      responseUrl:
        responseUrl ||
        `${req.nextUrl.origin}/checkout/confirm?ref=${encodeURIComponent(
          reference
        )}`,
      cancellationUrl:
        cancellationUrl ||
        `${req.nextUrl.origin}/checkout/cancel?ref=${encodeURIComponent(
          reference
        )}`,

      // Datos opcionales del cliente (si los tienes)
      email: customerEmail || undefined,
      name: customerName || undefined,
      phoneNumber: customerPhone || undefined,
    };

    // 3) Crear link de pago en PayPhone
    const linkRes = await fetch(`${BASE_URL}${LINK_ENDPOINT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!linkRes.ok) {
      const errTxt = await linkRes.text().catch(() => "");
      return json(
        {
          error: `PayPhone rechazó la creación del link (HTTP ${linkRes.status}).`,
          details: errTxt,
          payloadSent: payload,
        },
        502
      );
    }

    const linkData = await linkRes.json();

    // Algunos endpoints devuelven { url: 'https://...' } u otros campos como {paymentUrl}
    const paymentUrl =
      linkData?.url || linkData?.paymentUrl || linkData?.shortUrl;

    if (!paymentUrl) {
      return json(
        {
          error:
            "La respuesta de PayPhone no contiene la URL del pago (url/paymentUrl/shortUrl).",
          linkData,
        },
        502
      );
    }

    return json(
      {
        ok: true,
        paymentUrl,
        raw: linkData, // por si necesitas otros campos
      },
      200
    );
  } catch (err) {
    return json(
      {
        error: "No se pudo generar el link de pago.",
        message: err?.message || String(err),
      },
      500
    );
  }
}

// (Opcional) Healthcheck sencillo
export async function GET() {
  return json({ ok: true, service: "payphone-link" });
}
