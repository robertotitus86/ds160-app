"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import PayphoneBox from "./PayphoneBox";

const ALL_SERVICES = [
  { id: "form",        name: "Llenado de formulario DS-160", price: 30, defaultSelected: true },
  { id: "appointment", name: "Toma de cita",                 price: 10, defaultSelected: false },
  { id: "advice",      name: "Asesoría completa",            price: 25, defaultSelected: false },
];

function Currency({ value }) {
  return <span>${value.toFixed(2)}</span>;
}

export default function CheckoutClient() {
  // selección de servicios
  const [selected, setSelected] = useState(
    new Set(ALL_SERVICES.filter(s => s.defaultSelected).map(s => s.id))
  );

  // método de pago
  const [method, setMethod] = useState("payphone"); // "payphone" | "transfer"

  const subtotal = useMemo(
    () => ALL_SERVICES.filter(s => selected.has(s.id)).reduce((a, s) => a + s.price, 0),
    [selected]
  );

  const fee = useMemo(
    () => (method === "payphone" ? Math.round(subtotal * 0.06 * 100) / 100 : 0),
    [method, subtotal]
  );

  const total = useMemo(() => Number((subtotal + fee).toFixed(2)), [subtotal, fee]);

  const toggle = (id) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const envOK =
    typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_PAYPHONE_TOKEN &&
    process.env.NEXT_PUBLIC_PAYPHONE_STORE_ID;

  return (
    <main className="px-6 py-10">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Título */}
        <header>
          <h1 className="text-3xl md:text-4xl font-extrabold">Checkout</h1>
        </header>

        {/* Card: Servicios */}
        <section className="rounded-2xl border border-white/10 bg-[#0f172a] p-6">
          <h2 className="text-xl font-semibold mb-4">Servicios</h2>

          <div className="space-y-3">
            {ALL_SERVICES.map((s) => (
              <label
                key={s.id}
                className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/10 px-4 py-3 hover:bg-white/5 transition"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selected.has(s.id)}
                    onChange={() => toggle(s.id)}
                    className="h-5 w-5 rounded accent-[#6d28d9]"
                  />
                  <span className="text-gray-200">{s.name}</span>
                </div>
                <span className="font-medium min-w-[80px] text-right">
                  <Currency value={s.price} />
                </span>
              </label>
            ))}
          </div>
        </section>

        {/* Card: Resumen */}
        <section className="rounded-2xl border border-white/10 bg-[#0f172a] p-6">
          <h2 className="text-xl font-semibold mb-4">Resumen</h2>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-gray-300">
              <span>Subtotal</span>
              <span><Currency value={subtotal} /></span>
            </div>

            <div className="flex items-center justify-between text-gray-400">
              <span>Fee PayPhone (6%)</span>
              <span><Currency value={fee} /></span>
            </div>

            <div className="h-px bg-white/10 my-2" />

            <div className="flex items-center justify-between text-lg font-bold">
              <span>Total</span>
              <span><Currency value={total} /></span>
            </div>

            <p className="text-sm text-gray-400 mt-1">
              {method === "payphone"
                ? `* Con PayPhone pagarás $${total.toFixed(2)}.`
                : `* Con Transferencia no se aplica recargo.`}
            </p>
          </div>
        </section>

        {/* Card: Método de pago */}
        <section className="rounded-2xl border border-white/10 bg-[#0f172a] p-6">
          <h2 className="text-xl font-semibold mb-4">Método de pago</h2>

          <div className="flex flex-wrap gap-4 mb-4">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="method"
                value="payphone"
                checked={method === "payphone"}
                onChange={() => setMethod("payphone")}
                className="h-4 w-4 accent-[#6d28d9]"
              />
              <span>PayPhone</span>
            </label>

            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="method"
                value="transfer"
                checked={method === "transfer"}
                onChange={() => setMethod("transfer")}
                className="h-4 w-4 accent-[#6d28d9]"
              />
              <span>Transferencia</span>
            </label>
          </div>

          {/* PayPhone */}
          {method === "payphone" && (
            <div className="space-y-3">
              {envOK ? (
                <PayphoneBox totalUSD={total} reference="Pago DS-160" />
              ) : (
                <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-yellow-200">
                  Faltan credenciales de PayPhone en variables de entorno
                  (<code className="px-1">NEXT_PUBLIC_PAYPHONE_TOKEN</code> y{" "}
                  <code className="px-1">NEXT_PUBLIC_PAYPHONE_STORE_ID</code>).
                </div>
              )}
              <p className="text-xs text-gray-500">
                Usa el dominio de producción{" "}
                <span className="underline">https://ds160-app-6go6.vercel.app</span>.
              </p>
            </div>
          )}

          {/* Transferencia */}
          {method === "transfer" && (
            <div className="space-y-3">
              <p className="text-gray-300">
                Paga mediante transferencia bancaria y sube el comprobante.
              </p>
              <Link
                href="/transferencia"
                className="inline-flex items-center justify-center rounded-xl bg-[#6d28d9] px-4 py-2 font-semibold hover:bg-[#5b21b6] transition"
              >
                Continuar a Transferencia
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
