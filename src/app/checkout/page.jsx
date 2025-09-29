"use client";
import React, { useMemo, useState } from "react";

/**
 * Página de checkout que usa el proxy (Railway) para hablar con PayPhone.
 * El proxy expone POST /pp/prepare y nosotros lo consumimos desde el navegador.
 *
 * Env vars requeridas en Vercel:
 *  - NEXT_PUBLIC_PROXY_BASE_URL = https://<tu-subdominio>.up.railway.app
 */

const SERVICES = [
  { id: "form",     label: "Llenado de formulario DS-160", price: 30.0, default: true },
  { id: "appointment", label: "Toma de cita",                price: 10.0 },
  { id: "advice",   label: "Asesoría completa",             price: 25.0 },
];

export default function CheckoutPage() {
  const [selected, setSelected] = useState(() => {
    // por defecto solo el primero marcado
    const s = new Set();
    SERVICES.forEach((sv) => sv.default && s.add(sv.id));
    return s;
  });
  const [loading, setLoading] = useState(false);

  const subtotal = useMemo(() => {
    let tot = 0;
    SERVICES.forEach((sv) => { if (selected.has(sv.id)) tot += sv.price; });
    return tot;
  }, [selected]);

  // comisión estimada 6 %
  const feePct = 0.06;
  const total = useMemo(() => +(subtotal * (1 + feePct)).toFixed(2), [subtotal]);

  function toggle(id) {
    setSelected((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
  }

  async function handlePay() {
    try {
      setLoading(true);

      const proxyBase = process.env.NEXT_PUBLIC_PROXY_BASE_URL;
      if (!proxyBase) {
        alert("Falta NEXT_PUBLIC_PROXY_BASE_URL en Vercel");
        return;
      }

      // URL a donde PayPhone redirigirá cuando el pago termine
      const origin = window.location.origin.replace(/\/$/, "");
      const responseUrl = `${origin}/checkout/confirm`;
      const cancelUrl   = `${origin}/checkout/cancel`;

      // armamos el payload que espera el proxy
      const body = {
        amountUSD: subtotal, // el proxy convierte a centavos
        responseUrl,
        cancelUrl
      };

      const r = await fetch(`${proxyBase}/pp/prepare`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const txt = await r.text();
      let data = null; try { data = JSON.parse(txt); } catch {}

      if (!r.ok || !data?.ok) {
        const msg = data?.message || data?.error || "No se pudo preparar el pago";
        const extra = data?.raw ? `\nDetalles: ${JSON.stringify(data.raw)}` : `\n${txt}`;
        alert(`${msg}${extra}`);
        return;
      }

      // el proxy devuelve todo lo que responde PayPhone; normalmente viene una URL
      const payUrl =
        data?.prep?.paymentUrl ||
        data?.prep?.url ||
        data?.prep?.payWithCardUrl;

      if (!payUrl) {
        alert("La respuesta no contiene la URL de pago.");
        console.log("Respuesta:", data);
        return;
      }

      // redirigimos a PayPhone
      window.location.href = payUrl;

    } catch (err) {
      console.error(err);
      alert("fetch failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
      <h1>Asistente DS-160</h1>

      <h2 style={{ marginTop: 24 }}>Servicios</h2>
      <div style={{ marginTop: 8 }}>
        {SERVICES.map((sv) => (
          <label key={sv.id} style={{ display: "block", margin: "8px 0", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={selected.has(sv.id)}
              onChange={() => toggle(sv.id)}
              style={{ marginRight: 8 }}
            />
            {sv.label} — ${sv.price.toFixed(2)}
          </label>
        ))}
      </div>

      <div style={{ marginTop: 16, fontSize: 16 }}>
        <div>Subtotal: <b>${subtotal.toFixed(2)}</b></div>
        <div style={{ color: "#888" }}>* Comisión estimada {(feePct * 100).toFixed(0)} %. Pagarás <b>${total.toFixed(2)}</b>.</div>
      </div>

      <button
        onClick={handlePay}
        disabled={loading || subtotal <= 0}
        style={{
          marginTop: 20,
          padding: "12px 16px",
          borderRadius: 6,
          border: "1px solid #444",
          background: loading ? "#999" : "#eee",
          cursor: loading ? "not-allowed" : "pointer",
          fontWeight: 600,
        }}
      >
        {loading ? "Preparando pago..." : `Pagar $${total.toFixed(2)} con PayPhone`}
      </button>
    </main>
  );
}
