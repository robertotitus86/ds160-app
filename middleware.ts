import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Solo protegemos el wizard
  if (!pathname.startsWith('/wizard')) return NextResponse.next();

  const paid = req.cookies.get('paid')?.value === 'true';
  if (paid) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = '/checkout';
  url.searchParams.set('reason', 'payment_required');
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/wizard']
};
