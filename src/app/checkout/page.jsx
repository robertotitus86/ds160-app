"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
// Si tienes PayPal activo, descomenta la siguiente línea y asegúrate de tener el componente:
// import PayPalButton from "./PayPalButton";

const SERVICES = [
  { id: "fill",  name: "Llenado de formulario DS-160", price: 30 },
  { id: "appt",  name: "Toma de cita",                   price: 10 },
  { id: "full",  name: "Asesoría completa",              price: 25 },
];

// Lee tu endpoint y si el frontend debe sumar +6%
const PAYPHONE_ENDPOINT =
  process.env.NEXT_PUBLIC_PAYPHONE_ENDPOINT || "/api/payphone/link";
const ADD_6PCT =
  String(process.env.NEXT_PUBLIC_PAYPHONE_ADD_6PCT || "true") === "true";

export default function CheckoutDS160() {
  const [selected, setSelected] = useState([]);
  const [method, setMethod] = useState("payphone"); // payphone | paypal | transfer

  const subtotal = useMemo(
    () => selected.reduce((acc, id) => acc + (SERVICES.find(x => x.id === id)?.price || 0), 0),
    [selected]
  );

  const totalUi = useMemo(
    () => ADD_6PCT && method === "payphone" ? +(subtotal * 1.06).toFixed(2) : subtotal,
    [subtotal, method]
  );

  const toggle = (id) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  // ADAPTA los nombres del body y de la respuesta a TU API si difieren
  const payWithPayPhone = async () => {
    if (subtotal <= 0) return alert("Selecciona al menos un servicio.");

    const montoAEnviar = ADD_6PCT ? totalUi : subtotal; // evita doble +6% si tu backend ya lo hace
    const body = {
      // ⬇️ CAMBIA el nombre del campo al que espera tu backend:
      baseAmountUsd: montoAEnviar
      // p.ej. usa "amountUsd" o "total" si así lo definiste en tu API
    };

    const r = await fetch(PAYPHONE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    let data;
    try { data = await r.json(); } catch { data = null; }

    // ⬇️ CAMBIA la propiedad que retorna tu backend con el link de pago:
    const link = data?.paymentUrl || data?.link || data?.url;

    if (link) window.location.href = link;
    else alert(data?.error || "No se pudo crear el Link PayPhone");
  };

  return (
    <div>
      <div className="card" style={{marginBottom:16}}>
        <h1 className="text-3xl" style={{fontWeight:900}}>Asistente DS-160</h1>
      </div>

      {/* Servicios */}
      <section style={{marginBottom:16}}>
        <h2 style={{fontWeight:900, marginBottom:10}}>Servicios</h2>
        <div style={{display:"grid", gap:12}}>
          {SERVICES.map(s => {
            const checked = selected.includes(s.id);
            return (
              <label key={s.id} className="item-card">
                <span style={{display:"flex", alignItems:"center", gap:12}}>
                  <input type="checkbox" checked={checked} onChange={() => toggle(s.id)} />
                  {s.name}
                </span>
                <strong>${s.price.toFixed(2)}</strong>
              </label>
            );
          })}
        </div>
      </section>

      {/* Totales */}
      <section style={{marginBottom:16}}>
        <div className="row" style={{fontWeight:900}}>
          <span>Total</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {method === "payphone" && ADD_6PCT && (
          <p className="muted" style={{marginTop:6}}>
            * Con PayPhone se agrega <b>+6%</b>: pagarás <b>${totalUi.toFixed(2)}</b>.
          </p>
        )}
      </section>

      {/* Método de pago */}
      <section style={{marginBottom:16}}>
        <h3 style={{fontWeight:900, marginBottom:8}}>Método de pago</h3>
        <div style={{display:"flex", gap:16, alignItems:"center", flexWrap:"wrap"}}>
          <label><input type="radio" name="m" checked={method==="payphone"} onChange={()=>setMethod("payphone")} /> PayPhone</label>
          <label><input type="radio" name="m" checked={method==="paypal"}   onChange={()=>setMethod("paypal")} /> PayPal</label>
          <label><input type="radio" name="m" checked={method==="transfer"} onChange={()=>setMethod("transfer")} /> Transferencia</label>
        </div>
      </section>

      {/* Acción según método */}
      {method === "paypal" ? (
        <div>
          <p className="muted" style={{marginBottom:8}}>
            Pagarás <b>${subtotal.toFixed(2)}</b> con PayPal.
          </p>
          {/* Descomenta si tienes PayPal listo:
          <PayPalButton amountUsd={subtotal} />
          */}
          <p className="muted">PayPal no está configurado en este entorno.</p>
        </div>
      ) : method === "transfer" ? (
        <div>
          <p className="muted" style={{marginBottom:8}}>Te enviaremos a la página con instrucciones.</p>
          <Link href="/transferencia" className="btn btn-ghost">Ir a Transferencia</Link>
        </div>
      ) : (
        <button onClick={payWithPayPhone} disabled={subtotal<=0} className="btn btn-primary">
          {`Pagar $${totalUi.toFixed(2)} con PayPhone`}
        </button>
      )}
    </div>
  );
}
