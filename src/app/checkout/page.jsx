// src/app/checkout/page.jsx
import PayphoneBox from "./PayphoneBox";

export const metadata = {
  title: "Checkout | Asistente DS-160",
  description: "Pago de servicios con PayPhone.",
};

export default function CheckoutPage() {
  // Servicios (ajústalos a tu lógica real si vienen del estado/carrito)
  const services = [
    { name: "Llenado de formulario DS-160", price: 30 },
    { name: "Toma de cita", price: 10 },
    { name: "Asesoría completa", price: 25 },
  ];

  const subtotal = services.reduce((acc, s) => acc + s.price, 0); // 65
  const fee = Math.round(subtotal * 0.06 * 100) / 100;           // 3.90 (6%)
  const total = Number((subtotal + fee).toFixed(2));             // 68.90

  return (
    <main className="px-6 py-10">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Título */}
        <header>
          <h1 className="text-3xl md:text-4xl font-extrabold">Checkout</h1>
        </header>

        {/* Card resumen */}
        <section className="rounded-2xl border border-white/10 bg-[#0f172a] p-6">
          <h2 className="text-xl font-semibold mb-4">Resumen de compra</h2>

          <ul className="divide-y divide-white/10">
            {services.map((s, i) => (
              <li key={i} className="py-3 flex items-center justify-between">
                <span className="text-gray-200">{s.name}</span>
                <span className="font-medium">${s.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>

          <div className="h-px bg-white/10 my-4" />

          <div className="space-y-1">
            <div className="flex items-center justify-between text-gray-300">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-gray-400">
              <span>Fee PayPhone (6%)</span>
              <span>${fee.toFixed(2)}</span>
            </div>
            <div className="h-px bg-white/10 my-2" />
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              * Con PayPhone pagarás ${total.toFixed(2)}.
            </p>
          </div>
        </section>

        {/* Card método de pago */}
        <section className="rounded-2xl border border-white/10 bg-[#0f172a] p-6">
          <h2 className="text-xl font-semibold mb-4">Pagar con PayPhone</h2>

          {/* Botón oficial de PayPhone (cajita) */}
          <div className="mt-2">
            <PayphoneBox totalUSD={total} reference="Pago DS-160" />
          </div>
        </section>
      </div>
    </main>
  );
}
