import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const runtime = "nodejs"; // necesario para FormData en prod

type OrderStatus = "pending" | "paid" | "rejected";

function makeOrderId() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `DS160-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("receipt") as File | null;
    const plansRaw = (form.get("plans") as string | null) || "";

    if (!file || file.size === 0) {
      return NextResponse.json({ ok: false, error: "No se adjuntó el comprobante." }, { status: 400 });
    }
    const plans = plansRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const orderId = makeOrderId();

    // 1) Subir el archivo del comprobante
    const receiptBlob = await put(`ds160/receipts/${orderId}-${file.name}`, file, {
      access: "public",
    });

    // 2) Crear JSON de la orden en estado 'pending'
    const order = {
      id: orderId,
      status: "pending" as OrderStatus,
      plans,
      createdAt: new Date().toISOString(),
      receiptUrl: receiptBlob.url,
      approvedAt: null as string | null,
      reviewedAt: null as string | null,
    };

    await put(`ds160/orders/${orderId}.json`, JSON.stringify(order, null, 2), {
      access: "public",
      contentType: "application/json",
    });

    return NextResponse.json({ ok: true, orderId, receiptUrl: receiptBlob.url });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "upload_failed" }, { status: 500 });
  }
}
