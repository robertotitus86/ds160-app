import { NextResponse } from "next/server";
import { normalizeSelection, summaryLabel, totalFromSelection } from "@/lib/services";

export async function POST(req) {
  const body = await req.json().catch(()=>({}));
  const selection = normalizeSelection(body?.services);
  const total = totalFromSelection(selection);
  const payload = {
    name: body?.name || "",
    email: body?.email || "",
    transferRef: body?.transferRef || "",
    transferBank: body?.transferBank || "",
    transferDate: body?.transferDate || "",
    services: summaryLabel(selection),
    total,
    receivedAt: new Date().toISOString(),
  };
  console.log("TRANSFER SUBMISSION:", payload);
  // Aquí podrías enviar un correo o almacenar en una BD.
  return NextResponse.json({ ok: true });
}
