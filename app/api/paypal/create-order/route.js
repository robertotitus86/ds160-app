import { NextResponse } from "next/server";
import { normalizeSelection, totalFromSelection, summaryLabel } from "@/lib/services";
import { getBaseUrl, getAccessToken } from "@/lib/paypal";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const selection = normalizeSelection(body?.services);
  const total = totalFromSelection(selection).toFixed(2);
  if (Number(total) <= 0) return NextResponse.json({ error: "Sin servicios" }, { status: 400 });

  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  const env = process.env.PAYPAL_ENV || "sandbox";
  if (!clientId || !secret) {
    return NextResponse.json({ error: "Faltan credenciales PayPal" }, { status: 500 });
  }
  const origin = req.headers.get("origin") || req.headers.get("referer") || "";
  const base = getBaseUrl(env);
  const { access_token } = await getAccessToken(clientId, secret, env);

  const orderRes = await fetch(`${base}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [{
        description: summaryLabel(selection),
        amount: { currency_code: "USD", value: total },
      }],
      application_context: {
        brand_name: "DS160 Services",
        landing_page: "LOGIN",
        user_action: "PAY_NOW",
        return_url: `${origin}/paypal/success`,
        cancel_url: `${origin}/paypal/cancel`,
      },
    }),
  });

  const order = await orderRes.json();
  const approve = order?.links?.find((l) => l.rel === "approve")?.href;
  if (!approve) return NextResponse.json({ error: "No approve URL" }, { status: 500 });
  return NextResponse.json({ approveUrl: approve, id: order.id });
}
