'use client';

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export const dynamic = "force-dynamic";

function CheckoutInner() {
  const params = useSearchParams();
  const plan = params.get("plan") || "llenado";
  const prices: Record<string, number> = { llenado:45, asesoria:35, cita:15 };
  const [method, setMethod] = useState("transferencia");

  return (
    <div className="card">
      <h2>Checkout</h2>
      <p>Servicio: <b>{plan}</b> — <b>${prices[plan]||0} USD</b></p>

      <label className="label">Método de pago</label>
      <select value={method} onChange={e=>setMethod(e.target.value)} className="input">
        <option value="transferencia">Transferencia</option>
        <option value="paypal">PayPal</option>
        <option value="2checkout">Tarjeta (2Checkout)</option>
      </select>

      <div style={{marginTop:16}}>
        {method==="transferencia" && (<>
          <p>Sube tu comprobante de pago:</p>
          <input type="file" className="input" />
          <div style={{marginTop:10}}><button className="btn">Enviar comprobante</button></div>
        </>)}
        {method==="paypal" && (<p>Botón de PayPal (lo activamos luego con tu llave).</p>)}
        {method==="2checkout" && (<p>Botón de 2Checkout (lo activamos luego).</p>)}
      </div>
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
