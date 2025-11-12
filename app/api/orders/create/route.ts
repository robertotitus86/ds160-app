import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("receipt") as File | null;

    if (!file) {
      return NextResponse.json({ ok: false, error: "No se adjuntó ningún comprobante." });
    }

    const orderId = `DS160-${new Date()
      .toISOString()
      .replace(/[-T:.Z]/g, "")
      .slice(0, 15)}`;

    // Guarda el archivo del comprobante en Vercel Blob (público para admin)
    const { url } = await put(`ds160/receipts/${orderId}-${file.name}`, file, {
      access: "public",
    });

    // Guarda los datos de la orden (estado pendiente)
    const orderData = {
      id: orderId,
      createdAt: new Date().toISOString(),
      status: "pending",
      receiptUrl: url,
    };

    await put(`ds160/orders/${orderId}.json`, JSON.stringify(orderData), {
      access: "public",
    });

    return NextResponse.json({ ok: true, orderId });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message });
  }
}
