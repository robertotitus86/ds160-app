"use client";

import { useMemo, useState } from "react";
import PayPalButton from "./PayPalButton";
import Link from "next/link";

const SERVICES = [
  { id: "fill",  name: "Llenado de formulario DS-160", price: 30 },
  { id: "appt",  name: "Toma de cita",                   price: 10 },
  { id: "full",  name: "Asesoría completa",              price: 25 },
];

export default function CheckoutDS160() {
  const [selected, setSelected] = useState([]);
  const [method, setMethod] = useState("payphone"); // payphone | paypal | transfer

  const subtotal = useMemo(
    () => selected.reduce((acc, id) => acc + (SERVICES.find(x => x.id === id)?.price || 0), 0),
    [selected]
  );
  const total = useMemo(() => (method === "payphone" ? +(subtotal * 1.06).toFixed(2) : subtotal), [subtotal, method]);

  const toggle = (id) =>
    setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const payWithPayPhone = async () => {
    if (subtotal <= 0) return alert("Selecciona al menos un servicio.");
    const r = await fetch("/api/payphone/link", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ baseAmountUsd: subtotal }),
    });
    const data = await r.json();
    if (data?.link) window.location.href = data.link;
    else alert(data?.error || "No se pudo crear el Link PayPhone");
  };

  return (
    <>
      <div className="panel hero" style={{marginBottom:16}}>
        <h1 className="h1" style={{marginBottom:0}}>Asistente DS-160</h1>
      </div>

      {/* Servicios */}
      <section className="section">
        <h2 style={{fontWeight:900, marginBottom:10}}>Servicios</h2>
        <div style={{display:"grid", gap:12}}>
          {SERVICES.map(s => {
            const checked = selected.includes(s.id);
            return (
              <label key={s.id} className="card item">
                <span className="left">
                  <input type="checkbox" checked={checked} onChange={() => toggle(s.id)} />
                  {s.name}
                </span>
                <span className="price">${s.price.toFixed(2)}</span>
              </label>
            );
          })}
        </div>
      </section>

      {/* Totales */}
      <section className="section">
        <div className="row" style={{fontWeight:900}}>
          <span>Total</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {method === "payphone" && (
          <p className="muted" style={{marginTop:6}}>
            * Con PayPhone se agrega <b>+6%</b>: pagarás <b>${total.toFixed(2)}</b>.
          </p>
        )}
      </section>

      {/* Método */}
      <section className="section">
        <h3 style={{fontWeight:900, marginBottom:8}}>Método de pago</h3>
        <div style={{display:"flex", gap:18, alignItems:"center", flexWrap:"wrap"}}>
          <label><input type="radio" name="m" checked={method==="payphone"} onChange={()=>setMethod("payphone")} /> PayPhone</label>
          <label><input type="radio" name="m" checked={method==="paypal"}   onChange={()=>setMethod("paypal")} /> PayPal</label>
          <label><input type="radio" name="m" checked={method==="transfer"} onChange={()=>setMethod("transfer")} /> Transferencia</label>
        </div>
      </section>

      {/* Acción */}
      {method === "paypal" ? (
        <div className="section">
          <p className="muted" style={{marginBottom:8}}>Pagarás <b>${subtotal.toFixed(2)}</b> con PayPal.</p>
          <PayPalButton amountUsd={subtotal} />
        </div>
      ) : method === "transfer" ? (
        <div className="section">
          <p className="muted" style={{marginBottom:8}}>Te enviaremos a la página con instrucciones.</p>
          <Link href="/transferencia" className="btn btn-ghost">Ir a Transferencia</Link>
        </div>
      ) : (
        <div className="section">
          <button onClick={payWithPayPhone} disabled={subtotal<=0} className="btn btn-primary">
            {`Pagar $${total.toFixed(2)} con PayPhone`}
          </button>
        </div>
      )}
    </>
  );
}
