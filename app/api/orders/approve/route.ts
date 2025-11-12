import { NextResponse } from "next/server";
import { put, list } from "@vercel/blob";

export const runtime = "edge";

export async function POST(req: Request) {
  const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
  const token = req.headers.get("x-admin-token");
  if (!token || token !== ADMIN_TOKEN) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });
  }

  try {
    const { orderId, action } = await req.json();

    const result = await list({ prefix: `ds160/orders/${orderId}` });
    if (result.blobs.length === 0) {
      return NextResponse.json({ ok: false, error: "Orden no encontrada." });
    }

    const fileUrl = result.blobs[0].url;
    const current = await (await fetch(fileUrl)).json();

    current.status = action === "approve" ? "paid" : "rejected";

    await put(`ds160/orders/${orderId}.json`, JSON.stringify(current), {
      access: "public",
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message });
  }
}

