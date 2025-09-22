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
      const r = await fetch("/api/payphone/crea
