import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token') || '';
    if (!token) return NextResponse.json({ ok: false, error: 'missing_token' }, { status: 400 });

    const secret = new TextEncoder().encode(process.env.ADMIN_SECRET || 'insecure');
    const { payload } = await jwtVerify(token, secret);

    // Si el token es válido, seteamos cookie paid=true por 3 días y redirigimos al wizard
    const res = NextResponse.redirect(new URL('/wizard', url));
    cookies().set('paid', 'true', {
      httpOnly: false,
      sameSite: 'lax',
      secure: true,
      maxAge: 60 * 60 * 24 * 3,
      path: '/',
    });

    // Opcional: podrías loggear la orden aprobada
    console.log('[GRANTED]', payload);

    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: 'invalid_or_expired_token' }, { status: 400 });
  }
}
