import { NextResponse } from "next/server";
import { list, get } from "@vercel/blob";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ ok: false, error: "Falta ID" }, { status: 400 });
  }

  const blobs = await list({ prefix: "ds160/orders/" });
  const blob = blobs.blobs.find(b => b.pathname.endsWith(`${id}.json`));

  if (!blob) {
    return NextResponse.json({ ok: false, error: "Orden no encontrada" }, { status: 404 });
  }

  const order = await (await get(blob.pathname)).json();
  return NextResponse.json({ ok: true, order });
}
