"use client";
import { useState } from "react";

export default function PayphoneBox({ amountUSD = 31.80 }) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const amountCents = Math.round(amountUSD * 100);

  async function pagar() {
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/payphone/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountCents,                         // en centavos
          reference: `ORD-${Date.now()}`,             // tu referencia
          responseUrl: `${window.location.origin}/checkout/confirm?method=payphone`,
          // agrega aquí otros campos que tú usas (email, phoneNumber, etc.)
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "No se pudo preparar el pago");

      const url = data.payWithPayPhoneURL || data.payWithCardURL || data.url;
      if (!url) throw new Error("PayPhone no devolvió URL de pago");
      window.location.href = url;
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <button onClick={pagar} disabled={loading}>
        {loading ? "Preparando..." : `Pagar $${amountUSD.toFixed(2)} con PayPhone`}
      </button>
      {err && <small style={{ color: "crimson" }}>{err}</small>}
    </div>
  );
}
