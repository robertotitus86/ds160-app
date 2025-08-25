export async function POST(req) {
  try {
    const { baseAmountUsd } = await req.json();
    if (!baseAmountUsd || baseAmountUsd <= 0) {
      return new Response(JSON.stringify({ error: "Monto inválido" }), { status: 400 });
    }

    // +6% recargo
    const totalUsd = +(baseAmountUsd * 1.06).toFixed(2);
    const baseCents = Math.round(baseAmountUsd * 100);
    const feeCents  = Math.round((totalUsd - baseAmountUsd) * 100);
    const amountCents = baseCents + feeCents;

    const res = await fetch("https://pay.payphonetodoesposible.com/api/Links", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYPHONE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amountCents,
        amountWithoutTax: baseCents,
        amountWithTax: 0,
        tax: 0,
        service: feeCents, // aquí viaja el 6%
        tip: 0,
        currency: "USD",
        reference: `DS-160 (${baseAmountUsd.toFixed(2)} + 6%)`,
        clientTransactionId: `DS${Date.now()}`.slice(0, 15),
        storeId: process.env.PAYPHONE_STORE_ID,
        additionalData: "Recargo del 6% aplicado",
        oneTime: true,
        expireIn: 24,
        isAmountEditable: false
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("PayPhone error:", data);
      return new Response(JSON.stringify({ error: "No se pudo crear el Link PayPhone" }), { status: 500 });
    }

    const link = data?.link || data?.url || data?.payWithCardUrl;
    if (!link) {
      return new Response(JSON.stringify({ error: "No llegó el link de pago" }), { status: 500 });
    }

    return new Response(JSON.stringify({ link, totalUsd }), { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: "Error interno" }), { status: 500 });
  }
}
