// src/app/checkout/page.jsx
import PayphoneBox from "./PayphoneBox";

export const metadata = {
  title: "Checkout | Asistente DS-160",
  description: "Pago de servicios con PayPhone.",
};

export default function CheckoutPage() {
  // === Montos base (ajústalos a tu lógica real) ===
  const subtotal = 30 + 10 + 25; // ejemplo con 3 servicios: 65.00
  const fee = Math.round(subtotal * 0.06 * 100) / 100; // 6% → 3.90
  const total = Number((subtotal + fee).toFixed(2));   // 68.90

  return (
    <main className="px-6 py-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-6">Checkout</h1>

      {/* Resumen (puedes sustituir por tu UI actual) */}
      <section className="mb-6 space-y-1">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-400">
          <span>Fee PayPhone (6%)</span>
          <span>${fee.toFixed(2)}</span>
        </div>
        <hr className="my-2 opacity-20" />
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <p className="text-sm text-gray-400">
          * Con PayPhone pagarás ${total.toFixed(2)}.
        </p>
      </section>

      {/* Botón oficial de PayPhone (Cajita) */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Pagar con PayPhone</h2>
        <PayphoneBox totalUSD={total} reference="Pago DS-160" />
      </section>
    </main>
  );
}
