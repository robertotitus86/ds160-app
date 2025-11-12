import { NextResponse } from 'next/server';
import { list } from '@vercel/blob';

export const runtime = 'edge';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token') || '';
    const limit = Math.min(parseInt(searchParams.get('limit') || '25', 10) || 25, 100);

    if (!token) return NextResponse.json({ ok: false, error: 'missing_token' }, { status: 400 });
    if (token !== process.env.ADMIN_TOKEN) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });

    // Lista blobs bajo la carpeta de órdenes
    const { blobs } = await list({ prefix: 'ds160/orders/', limit });

    // Cargamos y parseamos cada JSON (orden). Si alguno falla, lo omitimos.
    const items = await Promise.all(
      blobs.map(async (b) => {
        try {
          const json = await fetch(b.url).then((r) => r.json());
          return {
            id: json?.id || b.pathname.replace('ds160/orders/', '').replace('.json', ''),
            status: (json?.status as 'pending' | 'approved' | 'rejected') || 'pending',
            createdAt: json?.createdAt,
            reviewedAt: json?.reviewedAt,
            plans: json?.plans,
            receiptUrl: json?.receiptUrl,
          };
        } catch {
          return null;
        }
      })
    );

    const filtered = items.filter(Boolean);
    // Ordena por fecha creación desc
    filtered.sort((a: any, b: any) => {
      const da = a?.createdAt ? Date.parse(a.createdAt) : 0;
      const db = b?.createdAt ? Date.parse(b.createdAt) : 0;
      return db - da;
    });

    return NextResponse.json({ ok: true, items: filtered });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'list_failed' }, { status: 500 });
  }
}
