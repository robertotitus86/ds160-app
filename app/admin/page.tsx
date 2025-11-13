'use client';

import { useState } from 'react';

export default function AdminPage() {
  const [orderId, setOrderId] = useState('');
  const [total, setTotal] = useState('');
  const [method, setMethod] = useState<'deuna'|'transferencia'>('deuna');
  const [secret, setSecret] = useState('');
  const [grantUrl, setGrantUrl] = useState('');

  async function makeLink() {
    const res = await fetch('/api/admin-make-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
      body: JSON.stringify({ order_id: orderId, total: Number(total), method }),
    });
    const data = await res.json();
    if (data.ok) setGrantUrl(data.grant_url);
    else alert('Error: ' + (data.error || 'desconocido'));
  }

  return (
    <div style={{maxWidth:520,margin:'40px auto',padding:20,border:'1px solid #1f2937',borderRadius:12,background:'#0f172a',color:'#e5e7eb'}}>
      <h2>Admin: Generar enlace de aprobación</h2>
      <label>Admin secret</label>
      <input value={secret} onChange={e=>setSecret(e.target.value)} style={{width:'100%',margin:'6px 0 12px',padding:10}}/>
      <label>Order ID</label>
      <input value={orderId} onChange={e=>setOrderId(e.target.value)} style={{width:'100%',margin:'6px 0 12px',padding:10}}/>
      <label>Total</label>
      <input value={total} onChange={e=>setTotal(e.target.value)} style={{width:'100%',margin:'6px 0 12px',padding:10}}/>
      <label>Método</label>
      <select value={method} onChange={e=>setMethod(e.target.value as any)} style={{width:'100%',margin:'6px 0 12px',padding:10}}>
        <option value="deuna">Deuna (QR)</option>
        <option value="transferencia">Transferencia</option>
      </select>

      <button onClick={makeLink} style={{padding:'10px 14px',borderRadius:8,background:'#2563eb',color:'#fff',border:'none'}}>Generar</button>

      {grantUrl && (
        <>
          <hr />
          <p>Enlace de aprobación:</p>
          <a href={grantUrl} target="_blank" style={{color:'#60a5fa'}}>{grantUrl}</a>
        </>
      )}
    </div>
  );
}
