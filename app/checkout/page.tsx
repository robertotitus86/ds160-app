'use client';

import { Suspense, useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const PRICES: Record<string, number> = { llenado:45, asesoria:35, cita:15 };
const TITLES: Record<string, string> = {
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
  const fromURL = useMemo(
    () => (many ? many.split(",").filter(Boolean) : (one ? [one] : [])),
    [one, many]
  );

  const [items, setItems] = useState<string[]>([]);
  const [method, setMethod] = useState("transferencia");
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    if (fromURL.length) { setItems(fromURL); return; }
    try { const raw = localStorage.getItem("ds160_cart"); if (raw) setItems(JSON.parse(raw)); } catch {}
  }, [fromURL.join(",")]);

  const total = items.reduce((acc, id) => acc + (PRICES[id] || 0), 0);

  const card: React.CSSProperties = { background:'#0f172a', padding:18, borderRadius:14, border:'1px solid #111827' };
  const btn:  React.CSSProperties = { background:'#2563eb', color:'#fff', border:'none', borderRadius:10, padding:'10px 14px', textDecoration:'none' as const, cursor:'pointer' };
  const soft: React.CSSProperties = { background:'#0b1220', border:'1px solid #1f2937', borderRadius:12 };

  // Utilidad: generar ID de orden
  function makeOrderId() {
    const ts = new Date();
    return `DS160-${ts.getFullYear()}${String(ts.getMonth()+1).padStart(2,'0')}${String(ts.getDate()).padStart(2,'0')}-${String(ts.getHours()).padStart(2,'0')}${String(ts.getMinutes()).padStart(2,'0')}${String(ts.getSeconds()).padStart(2,'0')}`;
  }

  // Marcar pago (cookie "paid") y llevar al wizard
  async function markPaidAndGo() {
    try {
      setMarking(true);
      const orderId = makeOrderId();
      // Guarda orden y carrito por referencia
      localStorage.setItem('order_id', orderId);
      localStorage.setItem('ds160_cart', JSON.stringify(items));
      // Marca pago en cookie
      const res = await fetch('/api/mark-paid', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ orderId })
      });
      if (!res.ok) throw new Error('No se pudo marcar el pago.');
      // Avisa y redirige al wizard
      alert(`¡Gracias! Pago confirmado.\nID de pedido: ${orderId}\nAhora podrás acceder al asistente.`);
      router.push('/wizard');
    } catch (e:any) {
      alert(e?.message || 'Error al confirmar pago.');
    } finally {
      setMarking(false);
    }
  }

  // Transferencia: copiar dato
  const copy = (text: string) => navigator.clipboard?.writeText(text);

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
              <span>{TITLES[id] || id}</span>
              <span>—</span>
              <b>${PRICES[id]} USD</b>
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

      {/* Deuna (QR) */}
      <section style={{...card, display:'grid', gap:12}}>
        <h3 style={{margin:0}}>Paga con Deuna (QR)</h3>
        <div style={{display:'grid', gap:16, gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', alignItems:'center'}}>
          <div style={{...soft, padding:14, display:'grid', placeItems:'center'}}>
            <img
              src="/deuna-qr.png"
              alt="QR Deuna"
              style={{ width:"220px", height:"auto", borderRadius:"12px", boxShadow:"0 8px 30px rgba(0,0,0,.35)" }}
            />
          </div>
          <div style={{display:'grid', gap:12}}>
            <p style={{margin:0, opacity:.9}}>
              1) Abre tu app Deuna<br/>
              2) Escanea el código<br/>
              3) Coloca el <b>mismo total</b> indicado arriba y confirma
            </p>
            <small style={{opacity:.7}}>
              Después del pago, confirma abajo con el botón <b>“Ya pagué”</b>.
            </small>
          </div>
        </div>
      </section>

      {/* Otros métodos */}
      <section style={card}>
        <h3 style={{marginTop:0}}>Otros métodos</h3>

        <label style={{display:'block', marginTop:12, opacity:.9}}>Método de pago</label>
        <select
          value={method}
          onChange={e=>setMethod(e.target.value)}
          style={{width:'100%', padding:10, borderRadius:8, border:'1px solid #1f2937', background:'#0b1220', color:'#fff'}}
        >
          <option value="transferencia">Transferencia</option>
          <option value="paypal">PayPal (próximamente)</option>
          <option value="2checkout">Tarjeta 2Checkout (próximamente)</option>
        </select>

        {method==="transferencia" && (
          <div style={{...soft, padding:14, marginTop:12, display:'grid', gap:12}}>
            <div style={{opacity:.8, fontSize:13}}>Datos para transferencia</div>
            <div style={{display:'grid', gap:6}}>
              <div><b>Número de cuenta:</b> 2200449871
                <button
                  onClick={()=>copy("2200449871")}
                  style={{ marginLeft:8, background:'#334155', color:'#fff', border:'none', borderRadius:6, padding:'4px 8px', cursor:'pointer' }}
                >
                  Copiar
                </button>
              </div>
              <div><b>Tipo de cuenta:</b> Ahorros</div>
              <div><b>Banco:</b> Pichincha</div>
              <div><b>Titular:</b> Roberto Acosta</div>
            </div>

            <div style={{display:'grid', gap:10}}>
              <div>
                <p style={{margin:'8px 0'}}>Sube tu comprobante (opcional):</p>
                <input
                  type="file"
                  style={{
                    width:'100%', padding:10, borderRadius:8, border:'1px solid #1f2937',
                    background:'#0b1220', color:'#fff'
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {method!=="transferencia" && <p style={{marginTop:16}}>Este método se habilitará más adelante.</p>}

        <div style={{marginTop:14, display:'flex', gap:10, flexWrap:'wrap'}}>
          <a href="/" style={{...btn, background:'#334155'}}>Seguir comprando</a>

          {/* BOTÓN CLAVE: Marca pago y libera wizard */}
          <button onClick={markPaidAndGo} style={btn} disabled={marking}>
            {marking ? 'Confirmando…' : 'Ya pagué, acceder al asistente'}
          </button>
        </div>

        <small style={{opacity:.7, display:'block', marginTop:10}}>
          Al confirmar, generaremos tu <b>ID de pedido</b>, marcaremos tu acceso y podrás completar el asistente.
        </small>
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
