
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
    const { orderId } = await req.json();
    if (!orderId) return new Response(JSON.stringify({ error: "orderId requerido" }), { status: 400 });

    const accessToken = await getAccessToken();
    const res = await fetch(`${API_BASE}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${accessToken}`, "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (!res.ok) {
      console.error("PayPal capture error:", data);
      return new Response(JSON.stringify({ error: "No se pudo capturar el pago" }), { status: 500 });
    }
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: "Error interno" }), { status: 500 });
  }
}
