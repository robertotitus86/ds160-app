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
  const [selected, setSelected] = useState(["fill"]);
  const [method, setMethod] = useState("payphone"); // payphone | paypal | transfer
  const subtotal = useMemo(
    () => selected.reduce((acc, id) => {
      const s = SERVICES.find(x => x.id === id);
      return acc + (s ? s.price : 0);
    }, 0), [selected]
  );
  const total = useMemo(() => method === "payphone" ? +(subtotal * 1.06).toFixed(2) : subtotal, [subtotal, method]);
  const toggle = (id) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

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
    <div style={{maxWidth:720, margin:"0 auto"}}>
      <h1 style={{fontSize:36, fontWeight:800, marginBottom:24}}>Asistente DS-160</h1>

      <section style={{marginBottom:24}}>
        <h2 style={{fontSize:18, fontWeight:700, marginBottom:12}}>Servicios</h2>
        <div style={{display:"grid", gap:12}}>
          {SERVICES.map(s => {
            const checked = selected.includes(s.id);
            return (
              <label key={s.id} style={{display:"flex",justifyContent:"space-between",gap:12,padding:"12px 16px",border:"1px solid #e5e7eb",borderRadius:12,background:"#fff"}}>
                <span style={{display:"flex",alignItems:"center",gap:12}}>
                  <input type="checkbox" checked={checked} onChange={() => toggle(s.id)} />
                  {s.name}
                </span>
                <strong>${s.price.toFixed(2)}</strong>
              </label>
            );
          })}
        </div>
        <div style={{display:"flex", justifyContent:"space-between", marginTop:16}}>
          <strong>Total</strong><strong>${subtotal.toFixed(2)}</strong>
        </div>
        {method === "payphone" && (
          <div style={{marginTop:8, color:"#64748b"}}>
            * Con PayPhone se agrega <b>+6%</b>: pagarás <b>${total.toFixed(2)}</b>.
          </div>
        )}
      </section>

      <section style={{marginBottom:24}}>
        <h3 style={{fontSize:18, fontWeight:700, marginBottom:8}}>Método de pago</h3>
        <div style={{display:"flex", gap:16, alignItems:"center", flexWrap:"wrap"}}>
          <label><input type="radio" name="method" value="payphone" checked={method==="payphone"} onChange={()=>setMethod("payphone")} /> PayPhone</label>
          <label><input type="radio" name="method" value="paypal" checked={method==="paypal"} onChange={()=>setMethod("paypal")} /> PayPal</label>
          <label><input type="radio" name="method" value="transfer" checked={method==="transfer"} onChange={()=>setMethod("transfer")} /> Transferencia</label>
        </div>
      </section>

      {method === "paypal" ? (
        <div>
          <p style={{color:"#64748b", marginBottom:8}}>Pagarás <b>${subtotal.toFixed(2)}</b> con PayPal.</p>
          <PayPalButton amountUsd={subtotal} />
        </div>
      ) : method === "transfer" ? (
        <div>
          <p style={{color:"#64748b", marginBottom:8}}>Te enviaremos a la página con instrucciones.</p>
          <Link href="/transferencia">Ir a Transferencia</Link>
        </div>
      ) : (
        <button onClick={payWithPayPhone} disabled={subtotal<=0}
          style={{padding:"10px 16px", borderRadius:8, border:"none", background:"#16a34a", color:"#fff", fontWeight:700, cursor:"pointer"}}>
          {`Pagar $${total.toFixed(2)} con PayPhone`}
        </button>
      )}
    </div>
  );
}

