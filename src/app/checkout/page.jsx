"use client";
import React, { useMemo, useState } from "react";

export default function CheckoutPage() {
  const [selected, setSelected] = useState({
    form: true,
    appointment: false,
    full: false,
  });

  const services = [
    { id: "form", label: "Llenado de formulario DS-160", price: 30.0 },
    { id: "appointment", label: "Toma de cita", price: 10.0 },
    { id: "full", label: "Asesoría completa", price: 25.0 },
  ];

  const subtotal = useMemo(
    () =>
      services
        .filter((s) => selected[s.id])
        .reduce((acc, s) => acc + s.price, 0),
    [selected]
  );

  const feePct = 0.06;
  const total = useMemo(() => +(subtotal * (1 + feePct)).toFixed(2), [subtotal]);

  async function handlePay() {
    try {
      const r = await fetch("/api/payphone/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountUSD: total,
          responseUrl: "https://ds160-app-6go6.vercel.app/checkout/confirm",
          cancelUrl:   "https://ds160-app-6go6.vercel.app/checkout/cancel",
          items: services.filter((s) => selected[s.id]),
        }),
      });

      // 👇 SOLO UNA VEZ
      const data = await r.json();

      if (!r.ok || !data?.ok) {
        const extra = data?.raw ? `\nDetalles: ${JSON.stringify(data.raw)}` : "";
        throw new Error(`${data?.message || "PayPhone API error"}${extra}`);
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        alert("La respuesta no contiene URL de pago.");
      }
    } catch (e) {
      alert(e.message || "Error inesperado");
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
      <h1>Asistente DS-160</h1>
      <h2>Servicios</h2>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {services.map((s) => (
          <li key={s.id} style={{ marginBottom: 8 }}>
            <label>
              <input
                type="checkbox"
                checked={!!selected[s.id]}
                onChange={(e) =>
                  setSelected((prev) => ({ ...prev, [s.id]: e.target.checked }))
                }
              />{" "}
              {s.label} — ${s.price.toFixed(2)}
            </label>
          </li>
        ))}
      </ul>

      <p>Subtotal: ${subtotal.toFixed(2)}</p>
      <p>
        * Comisión estimada 6 %. Pagarás <strong>${total.toFixed(2)}</strong>.
      </p>

      <button onClick={handlePay} style={{ padding: "10px 16px", cursor: "pointer" }}>
        Pagar ${total.toFixed(2)} con PayPhone
      </button>
    </main>
  );
}
