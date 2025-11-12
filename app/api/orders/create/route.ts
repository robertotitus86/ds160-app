import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export const runtime = 'nodejs'; // Necesario para multipart/form-data

function makeOrderId() {
  const ts = new Date();
  return `DS160-${ts.getFullYear()}${String(ts.getMonth()+1).padStart(2,'0')}${String(ts.getDate()).padStart(2,'0')}-${String(ts.getHours()).padStart(2,'0')}${String(ts.getMinutes()).padStart(2,'0')}${String(ts.getSeconds()).padStart(2,'0')}`;
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get('receipt') as File | null;
    const planList = (form.get('plans') as string | null) || '';
    if (!file || file.size === 0) {
      return NextResponse.json({ ok: false, error: 'No file' }, { status: 400 });
    }

    const orderId = makeOrderId();

    // 1) Guardar archivo del comprobante
    const receiptBlob = await put(`ds160/receipts/${orderId}-${file.name}`, file, {
      access: 'private',
    });

    // 2) Guardar JSON de la orden
    const orderJson = {
      id: orderId,
      plans: planList.split(',').filter(Boolean),
      status: 'pending' as 'pending'|'approved'|'rejected',
      createdAt: new Date().toISOString(),
      receiptUrl: receiptBlob.url,
    };

    const jsonBlob = await put(`ds160/orders/${orderId}.json`, JSON.stringify(orderJson, null, 2), {
      access: 'private',
      contentType: 'application/json',
    });

    return NextResponse.json({
      ok: true,
      orderId,
      receiptUrl: receiptBlob.url,
      orderJsonUrl: jsonBlob.url,
    });
  } catch (e:any) {
    return NextResponse.json({ ok: false, error: e?.message || 'upload_failed' }, { status: 500 });
  }
}
