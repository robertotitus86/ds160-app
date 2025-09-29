"use client";
import { useState } from "react";

export default function PayphoneButton({ amountUSD = 31.80 }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pay() {
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/payphone/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(amountUSD * 100),
          reference: `ORD-${Date.now()}`,
          responseUrl: `${window.location.origin}/checkout/confirm?method=payphone`
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "No se pudo preparar el pago");
      const url = data.payWithPayPhoneURL || data.payWithCardURL || data.url;
      if (!url) throw new Error("PayPhone no devolvió un link de pago");
      window.location.href = url;
    } catch (e:any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{display:"grid", gap:12}}>
      <button className="btn" onClick={pay} disabled={loading}>
        {loading ? "Preparando..." : `Pagar $${amountUSD.toFixed(2)} con PayPhone`}
      </button>
      {error && <span style={{color:"#ff8c8c"}}>{error}</span>}
    </div>
  );
}