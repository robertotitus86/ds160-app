import { NextResponse } from 'next/server';
import { get, put } from '@vercel/blob';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(()=> ({}));
    const { id, token, action } = body as { id?:string; token?:string; action?:'approve'|'reject' };

    if (!id || !token) return NextResponse.json({ ok:false, error:'missing_params' }, { status: 400 });
    if (token !== process.env.ADMIN_TOKEN) return NextResponse.json({ ok:false, error:'unauthorized' }, { status: 401 });

    // Lee orden actual
    const { url, pathname } = await get(`ds160/orders/${id}.json`);
    const order = await fetch(url).then(r => r.json());

    order.status = action === 'reject' ? 'rejected' : 'approved';
    order.reviewedAt = new Date().toISOString();

    await put(pathname, JSON.stringify(order, null, 2), {
      access: 'private',
      contentType: 'application/json',
    });

    return NextResponse.json({ ok:true, id, status: order.status });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:e?.message || 'approve_failed' }, { status: 500 });
  }
}
