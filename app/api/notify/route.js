import { NextResponse } from "next/server";
import { BRAND } from "@/lib/brand";
import { totalFromSelection, normalizeSelection, summaryLabel } from "@/lib/services";
import { saveRecord } from "@/lib/store";

export async function POST(req) {
  const body = await req.json().catch(()=>({}));

  const selection = normalizeSelection(body?.services);
  const total = totalFromSelection(selection);

  // Persist optional to Supabase
  await saveRecord({
    name: body?.name || "",
    email: body?.email || "",
    method: body?.method || "",
    services: summaryLabel(selection),
    total,
    status: body?.status || "pending",
    created_at: new Date().toISOString()
  }).catch(()=>{});

  // Email with Resend REST API (no SDK)
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || `DS160 <${BRAND.paymentsEmail}>`;
  if (!apiKey) return NextResponse.json({ ok: true, note: "no-resend" });

  const subject = body?.subject || `Nueva solicitud DS-160 (${body?.method || "sin método"})`;
  const html = `
    <div style="font-family:system-ui,Arial">
      <h2>${subject}</h2>
      <p><strong>Nombre:</strong> ${body?.name || ""}</p>
      <p><strong>Email:</strong> ${body?.email || ""}</p>
      <p><strong>Método:</strong> ${body?.method || ""}</p>
      <p><strong>Servicios:</strong> ${summaryLabel(selection)}</p>
      <p><strong>Total:</strong> $${total.toFixed(2)}</p>
      <p>Mensaje automático de ${BRAND.name}</p>
    </div>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: [BRAND.paymentsEmail],
      subject,
      html
    })
  });
  const data = await res.json().catch(()=>({}));

  return NextResponse.json({ ok: true, data });
}
