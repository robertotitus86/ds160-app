import { NextResponse } from 'next/server';
import { get } from '@vercel/blob';

export const runtime = 'edge';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ ok:false, error:'missing_id' }, { status: 400 });

    // lee el JSON de la orden
    const { url } = await get(`ds160/orders/${id}.json`);
    const data = await fetch(url).then(r => r.json());
    return NextResponse.json({ ok:true, status: data?.status ?? 'pending', order: data });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:e?.message || 'not_found' }, { status: 404 });
  }
}
