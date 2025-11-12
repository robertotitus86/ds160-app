import { NextResponse } from 'next/server';
import { list } from '@vercel/blob';

export const runtime = 'edge';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ ok: false, error: 'missing_id' }, { status: 400 });

    // Buscar el blob exacto por prefijo
    const key = `ds160/orders/${id}.json`;
    const { blobs } = await list({ prefix: key, limit: 1 });

    if (!blobs.length) {
      return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
    }

    const data = await fetch(blobs[0].url).then((r) => r.json());
    return NextResponse.json({
      ok: true,
      status: data?.status ?? 'pending',
      order: data,
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'status_failed' }, { status: 500 });
  }
}
