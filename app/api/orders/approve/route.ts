import { NextResponse } from "next/server";
import { list, get, put } from "@vercel/blob";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { id, token } = await req.json();
    if (token !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
    }

    const blobs = await list({ prefix: "ds160/orders/" });
    const blob = blobs.blobs.find(b => b.pathname.endsWith(`${id}.json`));
    if (!blob) {
      return NextResponse.json({ ok: false, error: "Orden no encontrada" }, { status: 404 });
    }

    const order = await (await get(blob.pathname)).json();

    // Solo aprobar si está pendiente
    if (order.status === "pending") {
      order.status = "paid";
      order.approvedAt = new Date().toISOString();

      await put(blob.pathname, JSON.stringify(order, null, 2), {
        access: "public",
        contentType: "application/json",
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "Error al aprobar" }, { status: 500 });
  }
}

