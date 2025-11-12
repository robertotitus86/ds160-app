import { NextResponse } from "next/server";
import { list, put } from "@vercel/blob";

export const runtime = "edge";

type ApproveBody = {
  orderId?: string;
  action?: "approve" | "reject";
  token?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as ApproveBody;
    const id = body.orderId;
    const action = body.action || "approve";

    // Acepta token por header o por body
    const headerToken = req.headers.get("x-admin-token") || undefined;
    const provided = headerToken || body.token || "";
    if (!id) return NextResponse.json({ ok: false, error: "missing_orderId" }, { status: 400 });
    if (!provided || provided !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }

    // Ubicar el JSON de la orden
    const { blobs } = await list({ prefix: `ds160/orders/${id}.json`, limit: 1 });
    if (!blobs.length) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });

    // Leer el JSON de la orden
    const current = await fetch(blobs[0].url).then((r) => r.json());

    // Actualizar estado
    if (action === "reject") {
      current.status = "rejected";
    } else {
      current.status = "paid";
    }
    current.reviewedAt = new Date().toISOString();
    if (current.status === "paid") current.approvedAt = current.reviewedAt;

    // Guardar de vuelta
    await put(blobs[0].pathname, JSON.stringify(current, null, 2), {
      access: "public",
      contentType: "application/json",
    });

    return NextResponse.json({ ok: true, id, status: current.status });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "approve_failed" }, { status: 500 });
  }
}

