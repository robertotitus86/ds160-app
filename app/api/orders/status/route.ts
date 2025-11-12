import { NextResponse } from "next/server";
import { list, head } from "@vercel/blob";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");

  if (!orderId) {
    return NextResponse.json({ ok: false, error: "Falta orderId." });
  }

  try {
    const result = await list({ prefix: `ds160/orders/${orderId}` });
    if (result.blobs.length === 0) {
      return NextResponse.json({ ok: false, error: "Orden no encontrada." });
    }

    const fileUrl = result.blobs[0].url;
    const resp = await fetch(fileUrl);
    const json = await resp.json();

    return NextResponse.json({ ok: true, order: json });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message });
  }
}
