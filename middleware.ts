import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // Rutas protegidas (puedes añadir más si lo necesitas)
  const protectedPaths = ['/wizard'];

  // Si no es ruta protegida, dejar pasar
  if (!protectedPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Revisa cookie "paid"
  const paid = req.cookies.get('paid')?.value === 'true';
  if (paid) return NextResponse.next();

  // Redirige a checkout si no ha pagado
  const url = req.nextUrl.clone();
  url.pathname = '/checkout';
  url.searchParams.set('reason', 'payment_required');
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/wizard'],
};
