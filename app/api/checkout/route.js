import { NextResponse } from "next/server";
import Stripe from "stripe";
import { SERVICES, normalizeSelection, totalFromSelection } from "@/lib/services";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const selection = normalizeSelection(body?.services);
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json({ error: "Falta STRIPE_SECRET_KEY" }, { status: 500 });
  }
  const stripe = new Stripe(stripeKey);

  // Construir line_items con precios dinámicos por servicio
  const line_items = SERVICES.filter(s => selection[s.id]).map(s => ({
    price_data: {
      currency: "usd",
      product_data: { name: s.label },
      unit_amount: Math.round(s.price * 100),
    },
    quantity: 1,
  }));

  if (line_items.length === 0) {
    return NextResponse.json({ error: "Sin servicios" }, { status: 400 });
  }

  const origin = req.headers.get("origin") || req.headers.get("referer") || "";
  const success_url = `${origin}/success`;
  const cancel_url = `${origin}/cancel`;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items,
    success_url,
    cancel_url,
  });

  return NextResponse.json({ url: session.url });
}
