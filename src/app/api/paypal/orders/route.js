
const API_BASE = process.env.PAYPAL_ENV === "live"
  ? "https://api-m.paypal.com"
  : "https://api-m.sandbox.paypal.com";

async function getAccessToken() {
  const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64");
  const res = await fetch(`${API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
  });
  if (!res.ok) throw new Error("No se pudo obtener token PayPal");
  return (await res.json()).access_token;
}

export async function POST(req) {
  try {
    const { amountUsd } = await req.json();
    if (!amountUsd || Number(amountUsd) <= 0) {
      return new Response(JSON.stringify({ error: "Monto inválido" }), { status: 400 });
    }
    const accessToken = await getAccessToken();
    const res = await fetch(`${API_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{ amount: { currency_code: "USD", value: Number(amountUsd).toFixed(2) }, description: "Asistente DS-160" }],
        application_context: { brand_name: "Asistente DS-160", shipping_preference: "NO_SHIPPING", user_action: "PAY_NOW" },
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      console.error("PayPal create order error:", data);
      return new Response(JSON.stringify({ error: "No se pudo crear la orden PayPal" }), { status: 500 });
    }
    return new Response(JSON.stringify({ id: data.id }), { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: "Error interno" }), { status: 500 });
  }
}
