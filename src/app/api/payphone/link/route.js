import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { amount, clientTransactionId } = await req.json();

    const storeId = process.env.NEXT_PUBLIC_PAYPHONE_STORE_ID;
    const token = process.env.NEXT_PUBLIC_PAYPHONE_TOKEN;

    const response = await fetch("https://pay.payphonetodoesposible.com/api/button/Generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        amount: amount * 100, // en centavos
        currency: "USD",
        clientTransactionId,
        storeId,
        reference: "Pago DS-160",
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error generando link de pago" }, { status: 500 });
  }
}
