"use client";
import { useState } from "react";

export default function PayphoneBox({ total = 31.80 }) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  async function pagar() {
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/payphone/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(total * 100),               // en centavos
          reference: `ORD-${Date.now()}`,
          responseUrl: `${window.location.origin}/checkout/confirm?method=payphone`
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "No se pudo preparar el pago");

      const url = data.payWithPayPhoneURL || data.payWithCardURL || data.url;
      if (!url) throw new Error("PayPhone no devolvió el link de pago");
      window.location.href = url;
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{display:"grid", gap:12}}>
      <button onClick={pagar} disabled={loading} className="btn">
        {loading ? "Preparando..." : `Pagar $${total.toFixed(2)} con PayPhone`}
      </button>
      {err && <small style={{color:"#ff8c8c"}}>{err}</small>}
    </div>
  );
}
