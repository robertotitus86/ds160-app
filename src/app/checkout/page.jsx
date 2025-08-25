
"use client";

import { useMemo, useState, useEffect } from "react";
import PayPalButton from "./PayPalButton";
import Link from "next/link";

const SERVICES = [
  { id: "fill",  name: "Llenado de formulario DS-160", price: 30 },
  { id: "appt",  name: "Toma de cita",                   price: 10 },
  { id: "full",  name: "Asesoría completa",              price: 25 },
];

export default function CheckoutDS160() {
  const [selected, setSelected] = useState(["fill"]);
  const [method, setMethod] = useState("payphone"); // 'payphone' | 'paypal' | 'transfer'
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const m = new URLSearchParams(window.location.search).get("method");
      if (m && ["payphone","paypal","transfer"].includes(m)) setMethod(m);
    }
  }, []);

  const toggle = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const payWithPayPhone = async () => {
    try {
      setLoading(true);
      const r = await fetch("/api/payphone/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseAmountUsd: subtotal }),
      });
      const data = await r.json();
      if (data?.link) {
        window.location.href = data.link;
      } else {
        alert(data?.error || "No se pudo crear el Link PayPhone");
      }
    } catch (e) {
      console.error(e);
      alert("Error al iniciar el pago PayPhone");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h1 style={{fontSize:28, fontWeight:900}}>Checkout</h1>
      <div className="space" />

      <section style={{marginBottom:24}}>
        <h2 style={{fontSize:18, fontWeight:800, marginBottom:12}}>Servicios</h2>

        <div className="grid">
          {SERVICES.map(s => {
            const checked = selected.includes(s.id);
            return (
              <label key={s.id} className="card" style={{padding:12}}>
                <span style={{display:'flex', alignItems:'center', gap:12}}>
                  <input type="checkbox" checked={checked} onChange={() => toggle(s.id)} />
                  <span>{s.name}</span>
                </span>
                <div className="row" style={{marginTop:8}}>
                  <span className="muted">Precio</span>
                  <strong>${s.price.toFixed(2)}</strong>
                </div>
              </label>
            );
          })}
        </div>

        <div className="row" style={{marginTop:16}}>
          <strong>Subtotal</strong>
          <strong>${subtotal.toFixed(2)}</strong>
        </div>

        {method === "payphone" && (
          <div className="banner" style={{marginTop:10}}>
            Con PayPhone se agrega <b>+6%</b>: pagarás <b>${total.toFixed(2)}</b>.
          </div>
        )}
      </section>

      <section style={{marginBottom:24}}>
        <h3 style={{fontSize:18, fontWeight:800, marginBottom:8}}>Método de pago</h3>

        <div style={{display:"flex", gap:16, alignItems:"center", flexWrap:'wrap'}}>
          <label className="card" style={{padding:'8px 12px'}}>
            <input type="radio" name="method" value="payphone"
                   checked={method==="payphone"} onChange={()=>setMethod("payphone")} />{" "}
            PayPhone
          </label>
          <label className="card" style={{padding:'8px 12px'}}>
            <input type="radio" name="method" value="paypal"
                   checked={method==="paypal"} onChange={()=>setMethod("paypal")} />{" "}
            PayPal
          </label>
          <label className="card" style={{padding:'8px 12px'}}>
            <input type="radio" name="method" value="transfer"
                   checked={method==="transfer"} onChange={()=>setMethod("transfer")} />{" "}
            Transferencia
          </label>
        </div>
      </section>

      {method === "paypal" ? (
        <div>
          <p className="muted" style={{marginBottom:8}}>
            Pagarás <b>${subtotal.toFixed(2)}</b> con PayPal.
          </p>
          <PayPalButton amountUsd={subtotal} />
        </div>
      ) : method === "transfer" ? (
        <div>
          <p className="muted" style={{marginBottom:8}}>
            Te enviaremos a la página con instrucciones y validación.
          </p>
          <Link href="/transferencia" className="btn btn-outline">Ir a Transferencia</Link>
        </div>
      ) : (
        <button onClick={payWithPayPhone} disabled={loading || subtotal<=0} className="btn" style={{background:'var(--accent)', borderColor:'var(--accent)'}}>
          {loading ? "Procesando..." : `Pagar $${total.toFixed(2)} con PayPhone`}
        </button>
      )}
    </div>
  );
}
