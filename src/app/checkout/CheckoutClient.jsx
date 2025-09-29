"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PayphoneBox from "./PayphoneBox";

// === Servicios disponibles (ajústalos si hace falta) ===
const ALL_SERVICES = [
  { id: "form",        name: "Llenado de formulario DS-160", price: 30, defaultSelected: true },
  { id: "appointment", name: "Toma de cita",                 price: 10, defaultSelected: false },
  { id: "advice",      name: "Asesoría completa",            price: 25, defaultSelected: false },
];

const fmt = new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

export default function CheckoutClient() {
  // Selección inicial (forzamos al montar para evitar cualquier des-sincronización)
  const initial = useMemo(
    () => new Set(ALL_SERVICES.filter(s => s.defaultSelected).map(s => s.id)),
    []
  );
  const [selected, setSelected] = useState(initial);
  useEffect(() => { setSelected(initial); }, [initial]);

  // Método de pago
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

  const disabledCheckout = subtotal <= 0;

  return (
    <main className="px-6 py-10">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Título */}
        <header>
          <h1 className="text-3xl md:text-4xl font-extrabold">Checkout</h1>
        </header>

        {/* === Card: Servicios === */}
        <section className="rounded-2xl border border-[#6d28d9]/30 bg-[#0d1426] p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Servicios</h2>

          <div className="grid gap-3">
            {ALL_SERVICES.map((s) => {
              const checked = selected.has(s.id);
              return (
                <label
                  key={s.id}
                  className={`flex items-center justify-between gap-4 rounded-xl px-4 py-3 transition border
                    ${checked ? "border-[#6d28d9] bg-[#121a33]" : "border-white/10 bg-black/10 hover:bg-white/5"}`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(s.id)}
                      className="h-5 w-5 rounded accent-[#6d28d9]"
                    />
                    <span className="text-gray-200">{s.name}</span>
                  </div>
                  <span className="font-semibold min-w-[90px] text-right">
                    {fmt.format(s.price)}
                  </span>
                </label>
              );
            })}
          </div>
        </section>

        {/* === Card: Resumen === */}
        <section className="rounded-2xl border border-[#6d28d9]/30 bg-[#0d1426] p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Resumen</h2>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-gray-300">
              <span>Subtotal</span>
              <span>{fmt.format(subtotal)}</span>
            </div>

            <div className="flex items-center justify-between text-gray-400">
              <span>Fee PayPhone (6%)</span>
              <span>{fmt.format(fee)}</span>
            </div>

            <div className="h-px bg-white/10 my-3" />

            <div className="flex items-center justify-between text-lg font-bold">
              <span>Total</span>
              <span>{fmt.format(total)}</span>
            </div>

            <p className="text-sm text-gray-400 mt-2">
              {method === "payphone"
                ? `* Con PayPhone pagarás ${fmt.format(total)}.`
                : `* Con Transferencia no se aplica recargo.`}
            </p>
          </div>
        </section>

        {/* === Card: Método de pago === */}
        <section className="rounded-2xl border border-[#6d28d9]/30 bg-[#0d1426] p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Método de pago</h2>

          <div className="flex flex-wrap gap-6 mb-5">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="method"
                value="payphone"
                checked={method === "payphone"}
                onChange={() => setMethod("payphone")}
                className="h-4 w-4 accent-[#6d28d9]"
              />
              <span className="font-medium">PayPhone</span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="method"
                value="transfer"
                checked={method === "transfer"}
                onChange={() => setMethod("transfer")}
                className="h-4 w-4 accent-[#6d28d9]"
              />
              <span className="font-medium">Transferencia</span>
            </label>
          </div>

          {/* Bloque PayPhone */}
          {method === "payphone" && (
            <div className="space-y-4">
              {disabledCheckout ? (
                <div className="rounded-xl border border-white/15 bg-white/5 p-4 text-gray-300">
                  Selecciona al menos un servicio para continuar con el pago.
                </div>
              ) : envOK ? (
                <div className="rounded-xl border border-white/10 bg-black/10 p-4">
                  <PayphoneBox totalUSD={total} reference="Pago DS-160" />
                </div>
              ) : (
                <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
                  <p className="text-yellow-200 font-medium">
                    Faltan credenciales de PayPhone
                    <span className="opacity-80"> (NEXT_PUBLIC_PAYPHONE_TOKEN y NEXT_PUBLIC_PAYPHONE_STORE_ID)</span>.
                  </p>
                  <p className="text-yellow-200/80 mt-1 text-sm">
                    Configúralas en Vercel y vuelve a recargar.
                  </p>
                </div>
              )}

              <p className="text-xs text-gray-500">
                Usa el dominio de producción{" "}
                <span className="underline">https://ds160-app-6go6.vercel.app</span>.
              </p>
            </div>
          )}

          {/* Bloque Transferencia */}
          {method === "transfer" && (
            <div className="space-y-3">
              <p className="text-gray-300">
                Paga mediante transferencia bancaria y sube el comprobante en la siguiente pantalla.
              </p>
              <Link
                href="/transferencia"
                className={`inline-flex items-center justify-center rounded-xl px-4 py-2 font-semibold transition
                ${disabledCheckout ? "bg-gray-600 cursor-not-allowed" : "bg-[#6d28d9] hover:bg-[#5b21b6]"}`}
                aria-disabled={disabledCheckout}
                tabIndex={disabledCheckout ? -1 : 0}
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
