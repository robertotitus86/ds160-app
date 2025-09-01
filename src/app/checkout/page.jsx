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
    () => selected.reduce((acc, id) => {
      const s = SERVICES.find(x => x.id === id);
      return acc + (s ? s.price : 0);
    }, 0),
    [selected]
  );

  const total = useMemo(
    () => (method === "payphone" ? +(subtotal * 1.06).toFixed(2) : subtotal),
    [subtotal, method]
  );

  const toggle = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const payWithPayPhone = async () => {
    if (subtotal <= 0) return alert("Selecciona al menos un servicio.");
    const r = await fetch("/api/payphone/link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ baseAmountUsd: subtotal }),
    });
    const data = await r.json();
    if (data?.link) window.location.href = data.link;
    else alert(data?.error || "No se pudo crear el Link PayPhone");
  };

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", paddingBottom: 40 }}>
      <h1 style={{ fontSize: 44, fontWeight: 900, margin: "24px 0 16px" }}>
        Asistente DS-160
      </h1>

      <section style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>Servicios</h2>

        <div style={{ display: "grid", gap: 12 }}>
          {SERVICES.map(s => {
            const checked = selected.includes(s.id);
            return (
              <label key={s.id} className="card item-card">
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

      <section style={{ marginTop: 8, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800 }}>
          <span>Total</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {method === "payphone" && (
          <p className="help" style={{ marginTop: 6 }}>
            * Con PayPhone se agrega <b>+6%</b>: pagarás <b>${total.toFixed(2)}</b>.
          </p>
        )}
      </section>

      <section style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Método de pago</h3>
        <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
          <label><input type="radio" name="method" value="payphone" checked={method==="payphone"} onChange={()=>setMethod("payphone")} /> PayPhone</label>
          <label><input type="radio" name="method" value="paypal" checked={method==="paypal"} onChange={()=>setMethod("paypal")} /> PayPal</label>
          <label><input type="radio" name="method" value="transfer" checked={method==="transfer"} onChange={()=>setMethod("transfer")} /> Transferencia</label>
        </div>
      </section>

      {method === "paypal" ? (
        <div>
          <p className="help" style={{ marginBottom: 8 }}>
            Pagarás <b>${subtotal.toFixed(2)}</b> con PayPal.
          </p>
          <PayPalButton amountUsd={subtotal} />
        </div>
      ) : method === "transfer" ? (
        <div>
          <p className="help" style={{ marginBottom: 8 }}>
            Te enviaremos a la página con instrucciones de transferencia.
          </p>
          <Link className="btn-primary" href="/transferencia" style={{ display: "inline-block", textDecoration: "none", padding: "10px 16px", borderRadius: 10 }}>
            Ir a Transferencia
          </Link>
        </div>
      ) : (
        <button onClick={payWithPayPhone} disabled={subtotal <= 0} className="btn-primary">
          {`Pagar $${total.toFixed(2)} con PayPhone`}
        </button>
      )}
    </div>
  );
}

