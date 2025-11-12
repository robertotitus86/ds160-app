import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const protectedPaths = ['/wizard'];

  if (!protectedPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const paid = req.cookies.get('paid')?.value === 'true';
  if (paid) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = '/checkout';
  url.searchParams.set('reason', 'payment_required');
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/wizard'],
};
