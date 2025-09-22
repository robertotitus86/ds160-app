"use client";

import React, { useState, useMemo } from "react";

interface Service {
  id: string;
  label: string;
  price: number;
}

// List of services offered. Each has an id, description and price in USD.
const services: Service[] = [
  { id: "ds160", label: "Llenado de formulario DS-160", price: 30 },
  { id: "cita", label: "Toma de cita", price: 10 },
  { id: "asesoria", label: "Asesoría completa", price: 25 },
];

export default function CheckoutPage() {
  // Which services are currently selected.
  const [selected, setSelected] = useState<string[]>(["ds160"]);
  // Loading state for the payment link creation.
  const [loading, setLoading] = useState(false);
  // Error message to display when a link cannot be generated.
  const [error, setError] = useState("");

  // Compute the subtotal based on selected services.
  const subtotal = useMemo(() => {
    return services
      .filter((s) => selected.includes(s.id))
      .reduce((total, s) => total + s.price, 0);
  }, [selected]);

  // Total including PayPhone fee of 6%. Rounded to two decimal places.
  const total = useMemo(() => {
    return Math.round(subtotal * 1.06 * 100) / 100;
  }, [subtotal]);

  // Toggle a service in the selected list.
  const toggleService = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  // Handle PayPhone payment. Requests the link from the server and redirects.
  const handlePay = async () => {
    setError("");
    if (subtotal <= 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/payphone/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountUSD: total, reference: "DS160" }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Error generando link");
      }
      // Redirect to the payment URL provided by PayPhone
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(
          "La respuesta de PayPhone no contiene una URL de pago válida"
        );
      }
    } catch (err: any) {
      setError(
        `PayPhone devolvió un error. No se pudo generar el link de pago. Detalle: ${err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="px-8 py-10 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Asistente DS-160</h1>
      <section>
        <h2 className="text-xl font-semibold mb-4">Servicios</h2>
        <div className="space-y-2">
          {services.map((s) => (
            <label
              key={s.id}
              className="flex items-center justify-between p-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 cursor-pointer"
            >
              <span className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selected.includes(s.id)}
                  onChange={() => toggleService(s.id)}
                  className="form-checkbox text-violet-600"
                />
                {s.label}
              </span>
              <span className="font-semibold">
                ${s.price.toFixed(2)}
              </span>
            </label>
          ))}
        </div>
      </section>
      <section>
        <div className="flex items-center justify-between text-lg">
          <span>Subtotal:</span>
          <span className="font-semibold">${subtotal.toFixed(2)}</span>
        </div>
        <p className="text-sm text-zinc-400 mt-2">
          * Con PayPhone se agrega +6%. Pagarás <strong>${total.toFixed(2)}</strong>.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Método de pago</h2>
        <button
          onClick={handlePay}
          disabled={loading || subtotal <= 0}
          className="px-5 py-3 rounded-lg bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50"
        >
          {loading ? "Creando link..." : `Pagar $${total.toFixed(2)} con PayPhone`}
        </button>
        {error && (
          <p className="mt-4 text-sm text-red-400">
            {error}
          </p>
        )}
      </section>
    </main>
  );
}