import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const orderId: string = body?.orderId || '';

    const res = NextResponse.json({ ok: true, orderId });
    res.cookies.set('paid', 'true', {
      httpOnly: false,
      sameSite: 'lax',
      secure: true,
      maxAge: 60 * 60 * 24 * 3,
      path: '/'
    });

    return res;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
