import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { SignJWT } from 'jose';
import { headers } from 'next/headers';

export const runtime = 'nodejs';

type Payload = {
  order_id: string;
  items: string[];
  total: number;
  method: 'deuna' | 'transferencia';
  deuna_ref?: string | null;
  deuna_file_name?: string | null;
  trans_ref?: string | null;
  trans_file_name?: string | null;
  ts: string;
};

function resolveBaseUrl() {
  const h = headers();
  const proto = h.get('x-forwarded-proto') || 'https';
  const host = h.get('x-forwarded-host') || h.get('host') || 'localhost:3000';
  return `${proto}://${host}`;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Payload;

    const secret = new TextEncoder().encode(process.env.ADMIN_SECRET || 'insecure');
    const token = await new SignJWT({
      order_id: body.order_id,
      total: body.total,
      method: body.method,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret);

    const base = resolveBaseUrl();
    const approveLink = `${base}/api/grant?token=${encodeURIComponent(token)}`;

    const methodLabel = body.method === 'deuna' ? 'Deuna (QR)' : 'Transferencia';
    const lines: string[] = [];
    lines.push(`<p><b>Orden:</b> ${body.order_id}</p>`);
    lines.push(`<p><b>Método:</b> ${methodLabel}</p>`);
    lines.push(`<p><b>Total:</b> $${body.total} USD</p>`);
    lines.push(`<p><b>Servicios:</b> ${body.items.join(', ')}</p>`);

    if (body.method === 'deuna') {
      lines.push(`<p><b>Referencia Deuna:</b> ${body.deuna_ref || '-'}</p>`);
      lines.push(`<p><b>Comprobante Deuna:</b> ${body.deuna_file_name || '-'}</p>`);
    }
    if (body.method === 'transferencia') {
      lines.push(`<p><b>Referencia Transferencia:</b> ${body.trans_ref || '-'}</p>`);
      lines.push(`<p><b>Comprobante Transferencia:</b> ${body.trans_file_name || '-'}</p>`);
    }

    const html = `
      <div style="font-family:system-ui,Segoe UI,Roboto,Arial">
        <h2>Nuevo pago pendiente de revisión</h2>
        ${lines.join('')}
        <p><b>Fecha:</b> ${new Date(body.ts).toLocaleString()}</p>
        <hr />
        <p>
          <a href="${approveLink}"
             style="display:inline-block;background:#2563eb;color:#fff;padding:10px 14px;border-radius:8px;text-decoration:none">
            Aprobar y habilitar acceso
          </a>
        </p>
        <p style="opacity:.7">El enlace expira en 7 días.</p>
      </div>
    `;

    const resend = new Resend(process.env.RESEND_API_KEY);
    const to = process.env.NOTIFY_TO || 'nanotiendaec@gmail.com';

    await resend.emails.send({
      from: 'DS-160 <no-reply@yourdomain.com>',
      to,
      subject: `Pago pendiente: ${body.order_id} ($${body.total})`,
      html,
    });

    console.log('[PENDING_PAYMENT]', body);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: 'invalid_request' }, { status: 400 });
  }
}
