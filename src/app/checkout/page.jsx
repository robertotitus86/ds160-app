// src/app/checkout/page.jsx
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

  const subtotal = useMemo(() => {
    return services
      .filter((s) => selected[s.id])
      .reduce((acc, s) => acc + s.price, 0);
  }, [selected]);

  const feePct = 0.06;
  const total = useMemo(() => +(subtotal * (1 + feePct)).toFixed(2), [subtotal]);

  async function handlePay() {
    try {
      const r = await fetch("/api/payphone/create-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total, // tu API lo convertirá a centavos si hace falta
          items: services.filter((s) => selected[s.id]),
        }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "No se pudo generar el link");
      // PayPhone suele devolver una URL para redirigir:
      if (data?.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        alert("No llegó paymentUrl desde PayPhone.");
      }
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
      <h1>Asistente DS-160</h1>
      <h2>Servicios</

