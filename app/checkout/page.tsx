'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type PlanId = 'llenado' | 'asesoria' | 'cita';
const PRICES: Record<PlanId, number> = { llenado:45, asesoria:35, cita:15 };
const TITLES: Record<PlanId, string> = {
  llenado: "Llenado DS-160",
  asesoria: "Asesoría Entrevista",
  cita: "Toma de Cita",
};

export const dynamic = "force-dynamic";

function CheckoutInner() {
  const params = useSearchParams();
  const router = useRouter();

  const one = params.get("plan");
  const many = params.get("plans");
  const fromURL = useMemo(() => (many ? many.split(",").filter(Boolean) : (one ? [one] : [])), [one, many]);

  const [items, setItems] = useState<string[]>([]);
  const [method, setMethod] = useState("transferencia");
  const [uploading, setUploading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle'|'pending'|'approved'|'rejected'>('idle');

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (fromURL.length) { setItems(fromURL); return; }
    try { const raw = localStorage.getItem("ds160_cart"); if (raw) setItems(JSON.parse(raw)); } catch {}
  }, [fromURL.join(",")]);

  const total = items.reduce((acc, id) => acc + (PRICES[id as PlanId] || 0), 0);

  const card: React.CSSProperties = { background:'#0f172a', padding:18, borderRadius:14, border:'1px solid #111827' };
  const btn:  React.CSSProperties = { background:'#2563eb', color:'#fff', border:'none', borderRadius:10, padding:'10px 14px', textDecoration:'none' as const, cursor:'pointer' };
  const soft: React.CSSProperties = { background:'#0b1220', border:'1px solid #1f2937', borderRadius:12 };

  function copy(text: string) { navigator.clipboard?.writeText(text); }

  async function handleUpload() {
    try {
      if (!fileRef.current?.files || fileRef.current.files.length === 0) {
        alert('Por favor, sube tu comprobante.');
        return;
      }
      const file = fileRef.current.files[0];
      setUploading(true);

      const fd = new FormData();
      fd.append('receipt', file);
      fd.append('plans', items.join(','));

      const res = await fetch('/api/orders/create', { method:'POST', body: fd });
      const data = await res.json();
      if (!data.ok) throw new Error(data?.error || 'No se pudo subir el comprobante');

      setOrderId(data.orderId);
      localStorage.setItem('order_id', data.orderId);
      setStatus('pending');

      alert(`Comprobante recibido.\nTu ID de pedido: ${data.orderId}\nQuedará en revisión. Cuando esté aprobado, podrás acceder al asistente.`);
    } catch (e:any) {
      alert(e?.message || 'Error subiendo el comprobante');
    } finally {
      setUploading(false);
    }
  }

  async function checkStatus() {
    try {
      const id = orderId || localStorage.getItem('order_id');
      if (!id) { alert('Aún no se ha generado un ID de pedido. Sube tu comprobante primero.'); return; }
      const res = await fetch(`/api/orders/status?id=${encodeURIComponent(id)}`);
      const data = await res.json();
      if (!data.ok) throw new Error(data?.error || 'No se pudo consultar');

      const st = (data.status as 'pending'|'approved'|'rejected') || 'pending';
      setStatus(st);

      if (st === 'approved') {
        // marca cookie paid=true
        const m = await fetch('/api/mark-paid', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ orderId: id }) });
        if (!m.ok) throw new Error('No se pudo confirmar acceso.');
        alert(`¡Gracias! Pago verificado.\nID de pedido: ${id}\nAhora podrás acceder al asistente.`);
        router.push('/wizard');
      } else if (st === 'rejected') {
        alert('Tu comprobante fue rechazado. Por favor, vuelve a subirlo o contáctanos por WhatsApp.');
      } else {
        alert('Tu comprobante sigue en revisión. Intenta más tarde.');
      }
    } catch (e:any) {
      alert(e?.message || 'Error verificando estado');
    }
  }

  if (items.length === 0) {
    return (
      <div style={card}>
        <h2>Checkout</h2>
        <p>No hay servicios seleccionados.</p>
        <a href="/" style={btn}>Volver a servicios</a>
      </div>
    );
  }

  return (
    <div style={{display:'grid', gap:16}}>
      {/* Resumen */}
      <section style={card}>
        <h2 style={{marginTop:0}}>Checkout</h2>
        <h3 style={{marginTop:0}}>Servicios</h3>
        <ul style={{margin:'6px 0 12px 18px'}}>
          {items.map((id) => (
            <li key={id} style={{display:'flex', alignItems:'center', gap:8}}>
              <span>{TITLES[id as PlanId] || id}</span>
              <span>—</span>
              <b>${PRICES[id as PlanId]} USD</b>
              <button
                onClick={()=>setItems(items.filter(x=>x!==id))}
                style={{ marginLeft:8, background:'#334155', color:'#fff', border:'none', borderRadius:8, padding:'4px 8px', cursor:'pointer' }}
              >
                Quitar
              </button>
            </li>
          ))}
        </ul>
        <p>Total: <b>${total} USD</b></p>
      </section>

      {/* Pago por transferencia + Deuna */}
      <section style={{...card, display:'grid', gap:12}}>
        <h3 style={{margin:0}}>Sube tu comprobante para continuar</h3>

        <div style={{...soft, padding:14}}>
          <div style={{display:'grid', gap:8}}>
            <div style={{opacity:.8, fontSize:13}}>Datos para transferencia</div>
            <div><b>Número de cuenta:</b> 2200449871 <button onClick={()=>copy("2200449871")} style={{ marginLeft:8, background:'#334155', color:'#fff', border:'none', borderRadius:6, padding:'4px 8px', cursor:'pointer' }}>Copiar</button></div>
            <div><b>Tipo de cuenta:</b> Ahorros</div>
            <div><b>Banco:</b> Pichincha</div>
            <div><b>Titular:</b> Roberto Acosta</div>
          </div>
        </div>

        <div style={{display:'grid', gap:10}}>
          <label style={{opacity:.9}}>Comprobante de pago (imagen o PDF)</label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*,.pdf"
            required
            style={{width:'100%', padding:10, borderRadius:8, border:'1px solid #1f2937', background:'#0b1220', color:'#fff'}}
          />
          <div style={{display:'flex', gap:10, flexWrap:'wrap'}}>
            <button onClick={handleUpload} style={btn} disabled={uploading}>
              {uploading ? 'Enviando...' : 'Enviar comprobante'}
            </button>
            <button onClick={checkStatus} style={{...btn, background:'#334155'}}>
              Verificar acceso
            </button>
          </div>

          {orderId && (
            <small style={{opacity:.8}}>
              Tu ID de pedido: <b>{orderId}</b> — Estado: <b>{status === 'idle' ? 'pendiente' : status}</b><br/>
              Comparte este ID al soporte si lo necesitas.
            </small>
          )}
        </div>
      </section>

      <section style={card}>
        <h4 style={{margin:'0 0 8px'}}>¿Pagaste con Deuna (QR)?</h4>
        <p style={{marginTop:0}}>Sube también el comprobante generado por tu app para validarlo.</p>
      </section>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{padding:20}}>Cargando checkout…</div>}>
      <CheckoutInner />
    </Suspense>
  );
}

