import { NextResponse } from "next/server";
import { Resend } from "resend";
import { SignJWT } from "jose";
import { headers } from "next/headers";

export const runtime = "nodejs";

type Contact = {
  name: string;
  lastName: string;
  phone: string;
  email: string;
};

type Payload = {
  order_id: string;
  items: string[];
  total: number;
  method: "deuna" | "transferencia";
  contact: Contact;
  deuna_ref?: string | null;
  deuna_file_name?: string | null;
  trans_ref?: string | null;
  trans_file_name?: string | null;
  ts: string;
};

function resolveBaseUrl() {
  const h = headers();
  const proto = h.get("x-forwarded-proto") || "https";
  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3000";
  return `${proto}://${host}`;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Payload;

    const secret = new TextEncoder().encode(
      process.env.ADMIN_SECRET || "insecure"
    );

    // Token para aprobar la orden
    const token = await new SignJWT({
      order_id: body.order_id,
      total: body.total,
      method: body.method,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    const base = resolveBaseUrl();
    const approveLink = `${base}/api/grant?token=${encodeURIComponent(token)}`;

    const methodLabel =
      body.method === "deuna" ? "Deuna (QR)" : "Transferencia bancaria";

    const contact = body.contact || {
      name: "",
      lastName: "",
      phone: "",
      email: "",
    };

    const lines: string[] = [];
    lines.push(`<p><b>Orden:</b> ${body.order_id}</p>`);
    lines.push(`<p><b>Método:</b> ${methodLabel}</p>`);
    lines.push(`<p><b>Total:</b> $${body.total} USD</p>`);
    lines.push(
      `<p><b>Servicios:</b> ${
        body.items && body.items.length
          ? body.items.join(", ")
          : "(sin items)"
      }</p>`
    );
    lines.push("<hr/>");
    lines.push("<h3>Datos del cliente</h3>");
    lines.push(`<p><b>Nombre:</b> ${contact.name} ${contact.lastName}</p>`);
    lines.push(`<p><b>WhatsApp:</b> ${contact.phone}</p>`);
    lines.push(`<p><b>Email:</b> ${contact.email}</p>`);

    if (body.method === "deuna") {
      lines.push("<h3>Deuna (QR)</h3>");
      lines.push(`<p><b>Referencia:</b> ${body.deuna_ref || "-"}</p>`);
      lines.push(
        `<p><b>Comprobante:</b> ${
          body.deuna_file_name || "(no adjunto, revisar referencia)"
        }</p>`
      );
    }

    if (body.method === "transferencia") {
      lines.push("<h3>Transferencia</h3>");
      lines.push(`<p><b>Referencia:</b> ${body.trans_ref || "-"}</p>`);
      lines.push(
        `<p><b>Comprobante:</b> ${
          body.trans_file_name || "(no adjunto, revisar referencia)"
        }</p>`
      );
    }

    const html = `
      <div style="font-family:system-ui,Segoe UI,Roboto,Arial;background:#020617;color:#e5e7eb;padding:16px">
        <h2 style="margin-top:0">Nuevo pago pendiente de revisión</h2>
        ${lines.join("")}
        <p><b>Fecha:</b> ${new Date(body.ts).toLocaleString()}</p>
        <hr style="border-color:#1f2937;margin:16px 0"/>
        <p>Cuando verifiques el pago, haz clic en el botón para habilitar el acceso al asistente DS-160 del cliente:</p>
        <p>
          <a href="${approveLink}"
             style="display:inline-block;background:#2563eb;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:600">
            Aprobar y habilitar acceso
          </a>
        </p>
        <p style="opacity:.7;font-size:12px">El enlace expira en 7 días. Este correo fue generado por DS-160 Asistido.</p>
      </div>
    `;

    const resend = new Resend(process.env.RESEND_API_KEY);
    const to = process.env.NOTIFY_TO || "nanotiendaec@gmail.com";

    await resend.emails.send({
      from: "DS-160 Asistido <onboarding@resend.dev>",
      to,
      subject: `Pago pendiente: ${body.order_id} ($${body.total} USD)`,
      html,
      // para poder responder directo al cliente desde el correo
      replyTo: contact.email || undefined,
    });

    console.log("[PENDING_PAYMENT]", body);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { ok: false, error: "invalid_request" },
      { status: 400 }
    );
  }
}
