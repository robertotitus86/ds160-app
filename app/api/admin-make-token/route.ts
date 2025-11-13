import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { headers } from 'next/headers';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const h = headers();
    const adminHeader = h.get('x-admin-secret') || '';
    if (!adminHeader || adminHeader !== (process.env.ADMIN_SECRET || '')) {
      return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
    }

    const { order_id, total, method } = await req.json();
    if (!order_id || !total || !method) {
      return NextResponse.json({ ok: false, error: 'missing_fields' }, { status: 400 });
    }

    const secret = new TextEncoder().encode(process.env.ADMIN_SECRET || 'insecure');
    const token = await new SignJWT({ order_id, total, method })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret);

    const proto = h.get('x-forwarded-proto') || 'https';
    const host = h.get('x-forwarded-host') || h.get('host') || 'localhost:3000';
    const grant_url = `${proto}://${host}/api/grant?token=${encodeURIComponent(token)}`;

    return NextResponse.json({ ok: true, grant_url });
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'invalid_request' }, { status: 400 });
  }
}
