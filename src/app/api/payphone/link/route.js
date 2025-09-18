// src/app/api/payphone/link/route.js
import { generatePaymentLink } from "@/lib/payphone";

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

export async function POST(req) {
  try {
    const { amountUSD = 0, reference = "DS160" } = await req.json();
    if (!amountUSD || amountUSD <= 0) {
      return Response.json(
        { ok: false, message: "amountUSD debe ser > 0" },
        { status: 400 }
      );
    }

    const { url, totalCents, feeCents } = await generatePaymentLink({
      amountUSD,
      reference,
    });

    return Response.json(
      {
        ok: true,
        url,
        totalUSD: (totalCents / 100).toFixed(2),
        feeUSD: (feeCents / 100).toFixed(2),
      },
      { status: 200, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  } catch (err) {
    return Response.json(
      {
        ok: false,
        message: err.message || String(err),
      },
      { status: 500 }
    );
  }
}
