// src/app/api/payphone/link/route.js

// Ping rápido para verificar que la ruta existe y SIEMPRE devuelva JSON
export async function GET() {
  return new Response(
    JSON.stringify({ ok: true, endpoint: "/api/payphone/link" }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
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

    // 2) Construir URLs de retorno
    const originEnv = (process.env.NEXT_PUBLIC_APP_ORIGIN || "").replace(/\/$/, "");
    const finalResponseUrl =
      responseUrl || (originEnv ? `${originEnv}/checkout/confirm` : null);
    const finalCancelUrl =
      cancelUrl || (originEnv ? `${originEnv}/checkout/cancel` : null);

    if (!finalResponseUrl
