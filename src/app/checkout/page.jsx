"use client";

import { useMemo, useState } from "react";

const SERVICES = [
  { id: "ds160", label: "Llenado de formulario DS-160", price: 30 },
  { id: "cita", label: "Toma de cita", price: 10 },
  { id: "asesoria", label: "Asesoría completa", price: 25 },
];

export default function CheckoutPage() {
  const [selected, setSelected] = useState(["ds160"]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const subtotal = useMemo(
    () => SERVICES.filter(s => selected.includes(s.id))
                  .reduce((acc, s) => acc + s.price, 0),
    [selected]
  );

  const totalConFee = useMemo(
    () => Math.round(subtotal * 1.06 * 100) / 100,
    [subtotal]
  );

  const toggle = (id) => {
    setSelected((curr) =>
      curr.includes(id) ? curr.filter(x => x !== id) : [...curr, id]
    );
  };

  const payWithPayPhone = async () => {
    try {
      setMessage("");
      setLoading(true);
      const res = await fetch("/api/payphone/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountUSD: subtotal,
          reference: "DS160",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.message || "Error generando link");
      window.location.href = data.url; // redirige al link de pago
    } catch (err) {
      setMessage(`PayPhone devolvió un error. No se pudo generar el link de pago. Detalle: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="px-8 py-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Asistente DS-160</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Servicios</h2>
        <div className="space-y-3">
          {SERVICES.map(s => (
            <label key={s.id} className="flex items-center justify-between p-3 rounded bg-white/5">
              <span className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selected.includes(s.id)}
                  onChange={() => toggle(s.id)}
                />
                {s.label}
              </span>
              <span className="font-semibold">${s.price.toFixed(2)}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="mb-3">
        <div className="flex items-center justify-between text-lg">
          <span>Subtotal:</span>
          <span className="font-semibold">${subtotal.toFixed(2)}</span>
        </div>
        <p className="text-sm text-zinc-400">
          * Con PayPhone se agrega +6%. Pagarás <strong>${totalConFee.toFixed(2)}</strong>.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Método de pago</h2>
        <div className="space-x-3">
          <button
            onClick={payWithPayPhone}
            disabled={loading || subtotal <= 0}
            className="px-4 py-2 rounded bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50"
          >
            {loading ? "Creando link..." : `Pagar $${totalConFee.toFixed(2)} con PayPhone`}
          </button>
        </div>
        {message && (
          <p className="mt-4 text-sm text-red-400">{message}</p>
        )}
      </section>
    </main>
  );
}
