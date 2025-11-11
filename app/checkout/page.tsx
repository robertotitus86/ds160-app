'use client';

import { Suspense, useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

// --- Catálogo (mismo que antes) ---
const PRICES: Record<string, number> = { llenado:45, asesoria:35, cita:15 };
const TITLES: Record<string, string> = {
  llenado: "Llenado DS-160",
  asesoria: "Asesoría Entrevista",
  cita: "Toma de Cita",
};

export const dynamic = "force-dynamic";

function CheckoutInner() {
  const params = useSearchParams();
  const one = params.get("plan");
  const many = params.get("plans");
  const fromURL = useMemo(
    () => (many ? many.split(",").filter(Boolean) : (one ? [one] : [])),
    [one, many]
  );

  const [items, setItems] = useState<string[]>([]);
  const [method, setMethod] = useState("transferencia");

  useEffect(() => {
    if (fromURL.length) { setItems(fromURL); return; }
    try { const raw = localStorage.getItem("ds160_cart"); if (raw) setItems(JSON.parse(raw)); } catch {}
  }, [fromURL.join(",")]);

  const total = items.reduce((acc, id) => acc + (PRICES[id] || 0), 0);

  // ---- estilos coherentes ----
  const card: React.CSSProperties = { background:'#0f172a', padding:18, borderRadius:14, border:'1px solid #111827' };
  const btn:  React.CSSProperties = { background:'#2563eb', color:'#fff', border:'none', borderRadius:10, padding:'10px 14px', textDecoration:'none' as const };
  const soft: React.CSSProperties = { background:'#0b1220', border:'1px solid #1f2937', borderRadius:12 };

  // ---- Datos Deuna (personaliza) ----
  const deunaCuentaOculta = "Nro. ******0650";  // visible
  const deunaCuentaReal   = "XXXXXXXX0650";     // el que copia el botón

  function copy(text: string) {
    navigator.clipboard?.writeText(text).then(()=>alert("Copiado al portapapeles"));
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
              <span>{TITLES[id] || id}</span>
              <span>—</span>
              <b>${PRICES[id]} USD</b>
              <button
                onClick={()=>setItems(items.filter(x=>x!==id))}
                style={{ marginLeft:8, background:'#334155', color:'#fff', border:'none', borderRadius:8, padding:'4px 8px' }}
              >
                Quitar
              </button>
            </li>
          ))}
        </ul>

        <p>Total: <b>${total} USD</b></p>
      </section>

      {/* Pago con Deuna (QR) */}
      <section style={{...card, display:'grid', gap:12}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:12, flexWrap:'wrap'}}>
          <h3 style={{margin:0}}>Paga con Deuna (QR)</h3>
          <span style={{opacity:.8, fontSize:14}}>Rápido y sin comisión para ti</span>
        </div>

        <div style={{display:'grid', gap:16, gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', alignItems:'center'}}>
          {/* QR más pequeño */}
          <div style={{...soft, padding:14, display:'grid', placeItems:'center'}}>
            {/* Asegúrate de subir la imagen a /public/deuna-qr.png */}
            <img
              src="/deuna-qr.png"
              alt="QR Deuna"
              style={{
                width: "220px",   // <-- tamaño más pequeño
                height: "auto",
                borderRadius: "12px",
                boxShadow: "0 8px 30px rgba(0,0,0,.35)"
              }}
            />
          </div>

          {/* Instrucciones + cuenta */}
          <div style={{display:'grid', gap:12}}>
            <p style={{margin:0, opacity:.9}}>
              1) Abre tu app Deuna<br/>
              2) Escanea el código o envía al N° de cuenta<br/>
              3) Coloca el <b>mismo total</b> indicado arriba y confirma
            </p>

            <div style={{...soft, padding:12}}>
              <div style={{display:'flex', justifyContent:'space-between', gap:10, alignItems:'center', flexWrap:'wrap'}}>
                <div>
                  <div style={{opacity:.8, fontSize:12}}>Cuenta Deuna</div>
                  <div style={{fontWeight:700}}>{deunaCuentaOculta}</div>
                </div>
                <button
                  onClick={()=>copy(deunaCuentaReal)}
                  style={{ background:'#2563eb', color:'#fff', border:'none', borderRadius:8, padding:'8px 12px' }}
                  title="Copiar número"
                >
                  Copiar número
                </button>
              </div>
            </div>

            <small style={{opacity:.7}}>
              Después del pago, sube tu comprobante abajo o envíalo por WhatsApp. ¡Gracias!
            </small>
          </div>
        </div>
      </section>

      {/* Otros métodos (se mantienen) */}
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

        <div style={{marginTop:16}}>
          {method==="transferencia" && (
            <>
              <p>Sube tu comprobante de pago:</p>
              <input
                type="file"
                style={{
                  width:'100%',
                  padding:10,
                  borderRadius:8,
                  border:'1px solid #1f2937',
                  background:'#0b1220',
                  color:'#fff'
                }}
              />
              <div style={{marginTop:10}}>
                <button style={btn}>Enviar comprobante</button>
              </div>
            </>
          )}
          {method!=="transferencia" && <p>Este método se habilitará más adelante.</p>}
        </div>

        <div style={{marginTop:14}}>
          <a href="/" style={{...btn, background:'#334155'}}>Seguir comprando</a>
        </div>
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
