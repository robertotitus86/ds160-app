'use client';

import { Suspense, useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

// --- Catálogo de servicios ---
const PRICES: Record<string, number> = { llenado:45, asesoria:35, cita:15 };
const TITLES: Record<string, string> = {
  llenado: "Llenado DS-160",
  asesoria: "Asesoría Entrevista",
  cita: "Toma de Cita",
};

// --- WhatsApp destino ---
const WHATSAPP_PHONE = "00593987846751";

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

  // Estilos
  const card: React.CSSProperties = { background:'#0f172a', padding:18, borderRadius:14, border:'1px solid #111827' };
  const btn:  React.CSSProperties = { background:'#2563eb', color:'#fff', border:'none', borderRadius:10, padding:'10px 14px', textDecoration:'none' as const, cursor:'pointer' };
  const soft: React.CSSProperties = { background:'#0b1220', border:'1px solid #1f2937', borderRadius:12 };

  // Helpers
  const copy = (text: string) => navigator.clipboard?.writeText(text);

  // Construye el mensaje para WhatsApp
  function buildWhatsAppMessage() {
    const ts = new Date();
    const orderId = `DS160-${ts.getFullYear()}${String(ts.getMonth()+1).padStart(2,'0')}${String(ts.getDate()).padStart(2,'0')}-${String(ts.getHours()).padStart(2,'0')}${String(ts.getMinutes()).padStart(2,'0')}${String(ts.getSeconds()).padStart(2,'0')}`;
    const servicios = items.map(id => `• ${TITLES[id] || id} — $${PRICES[id]} USD`).join("\n");
    const url = typeof window !== "undefined" ? window.location.origin : "";
    const msg =
`Hola, envío el comprobante de pago de mi pedido.

ID: ${orderId}
Servicios:
${servicios}

Total: $${total} USD
Método: Transferencia

Adjunto imagen del comprobante aquí.
${url}`;
    return encodeURIComponent(msg);
  }

  // Abre WhatsApp con el mensaje prellenado
  function openWhatsAppWithMessage() {
    const encoded = buildWhatsAppMessage();
    const link = `https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`;
    window.open(link, "_blank");
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
                style={{ marginLeft:8, background:'#334155', color:'#fff', border:'none', borderRadius:8, padding:'4px 8px', cursor:'pointer' }}
              >
                Quitar
              </button>
            </li>
          ))}
        </ul>

        <p>Total: <b>${total} USD</b></p>
      </section>

      {/* PAGO CON DEUNA (QR) */}
      <section style={{...card, display:'grid', gap:12}}>
        <h3 style={{margin:0}}>Paga con Deuna (QR)</h3>

        <div style={{display:'grid', gap:16, gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', alignItems:'center'}}>
          {/* QR */}
          <div style={{...soft, padding:14, display:'grid', placeItems:'center'}}>
            <img
              src="/deuna-qr.png"
              alt="QR Deuna"
              style={{
                width: "220px",
                height: "auto",
                borderRadius: "12px",
                boxShadow: "0 8px 30px rgba(0,0,0,.35)"
              }}
            />
          </div>

          {/* Texto */}
          <div style={{display:'grid', gap:12}}>
            <p style={{margin:0, opacity:.9}}>
              1) Abre tu app Deuna<br/>
              2) Escanea el código<br/>
              3) Coloca el <b>mismo total</b> indicado arriba y confirma
            </p>

            <small style={{opacity:.7}}>
              Después del pago, sube tu comprobante abajo o envíalo por WhatsApp.
            </small>
          </div>
        </div>
      </section>

      {/* OTROS MÉTODOS */}
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

        {/* Datos visibles solo si es transferencia */}
        {method === "transferencia" && (
          <div style={{...soft, padding:14, marginTop:12, display:'grid', gap:12}}>
            <div style={{opacity:.8, fontSize:13}}>Datos para transferencia</div>

            <div style={{display:'grid', gap:6}}>
              <div><b>Número de cuenta:</b> 2200449871
                <button
                  onClick={()=>copy("2200449871")}
                  style={{ marginLeft:8, background:'#334155', color:'#fff', border:'none', borderRadius:6, padding:'4px 8px', cursor:'pointer' }}
                  title="Copiar número"
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
                <p style={{margin:'8px 0'}}>Sube tu comprobante de pago:</p>
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
              </div>

              {/* Botón: abrir WhatsApp con mensaje prellenado */}
              <button onClick={openWhatsAppWithMessage} style={btn}>
                Enviar comprobante por WhatsApp
              </button>
              <small style={{opacity:.75}}>
                Se abrirá WhatsApp con el mensaje listo. Solo adjunta la foto del comprobante y envía.
              </small>
            </div>
          </div>
        )}

        {method!=="transferencia" && (
          <p style={{marginTop:16}}>Este método se habilitará más adelante.</p>
        )}

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
