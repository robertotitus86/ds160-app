import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const plan = formData.get("plan")?.toString();
    const file = formData.get("file") as File;

    if (!plan || !file) {
      return NextResponse.json({ ok: false, error: "Faltan datos" }, { status: 400 });
    }

    const orderId = `DS160-${Date.now()}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    // 1️⃣ Subir comprobante al Blob Storage
    const receiptBlob = await put(`ds160/receipts/${orderId}-${file.name}`, buffer, {
      access: "public",
      contentType: file.type || "image/jpeg",
    });

    // 2️⃣ Crear la orden como "pendiente"
    const orderJson = {
      id: orderId,
      plan,
      createdAt: new Date().toISOString(),
      status: "pending", // 👈 Ahora no se confirma automáticamente
      receiptUrl: receiptBlob.url,
    };

    // 3️⃣ Guardar el JSON de la orden
    const orderFile = `ds160/orders/${orderId}.json`;
    await put(orderFile, JSON.stringify(orderJson, null, 2), {
      access: "public",
      contentType: "application/json",
    });

    return NextResponse.json({ ok: true, orderId, receiptUrl: receiptBlob.url });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "Error interno" }, { status: 500 });
  }
}
