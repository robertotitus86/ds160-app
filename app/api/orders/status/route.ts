import { NextResponse } from "next/server";
import { list } from "@vercel/blob";

export const runtime = "edge";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("orderId") || searchParams.get("id");
    if (!id) return NextResponse.json({ ok: false, error: "missing_orderId" }, { status: 400 });

    const { blobs } = await list({ prefix: `ds160/orders/${id}.json`, limit: 1 });
    if (!blobs.length) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });

    const order = await fetch(blobs[0].url).then((r) => r.json());
    return NextResponse.json({ ok: true, order });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "status_failed" }, { status: 500 });
  }
}
