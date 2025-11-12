import { NextResponse } from 'next/server';
import { list, put } from '@vercel/blob';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { id, token, action } = body as { id?: string; token?: string; action?: 'approve' | 'reject' };

    if (!id || !token)
      return NextResponse.json({ ok: false, error: 'missing_params' }, { status: 400 });

    if (token !== process.env.ADMIN_TOKEN)
      return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });

    // Buscar el JSON de la orden en el blob storage
    const key = `ds160/orders/${id}.json`;
    const { blobs } = await list({ prefix: key, limit: 1 });

    if (!blobs.length)
      return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });

    const current = await fetch(blobs[0].url).then((r) => r.json());
    current.status = action === 'reject' ? 'rejected' : 'approved';
    current.reviewedAt = new Date().toISOString();

    // Guardar de nuevo la orden actualizada
    await put(blobs[0].pathname, JSON.stringify(current, null, 2), {
      access: 'public', // 👈 requerido por @vercel/blob
      contentType: 'application/json',
    });

    return NextResponse.json({ ok: true, id, status: current.status });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'approve_failed' }, { status: 500 });
  }
}

