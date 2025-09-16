// src/app/transferencia/page.jsx
import Image from "next/image";
import TransferenciaClient from "./TransferenciaClient";

export const metadata = {
  title: "Pago por Transferencia | Asistente DS-160",
  description: "Pantalla de transferencia con QR Deuna y validación de comprobante.",
};

const BANK = {
  titular: "Roberto Acosta",
  banco: "Banco Pichincha",
  cuenta: "2200449871",
  tipo: "Ahorros",
  identificacion: "1719731380",
};

export default function TransferenciaPage() {
  return (
    <main className="min-h-screen px-6 md:px-12 py-10">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-6">Pago por Transferencia</h1>

      <p className="text-gray-300 max-w-3xl mb-8">
        Escanea el código QR para pagar con Deuna o realiza una transferencia bancaria
        y sube el comprobante para validarlo.
      </p>

      {/* Tarjeta bancaria alineada a la derecha (como tu diseño anterior) */}
      <div className="flex justify-end mb-10">
        <div className="w-full max-w-md rounded-2xl bg-[#0f172a] border border-white/10 p-6">
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <span className="text-gray-400">Titular</span>
            <span className="text-right font-medium">{BANK.titular}</span>

            <span className="text-gray-400">Banco</span>
            <span className="text-right font-medium">{BANK.banco}</span>

            <span className="text-gray-400">Cuenta</span>
            <span className="text-right font-medium">{BANK.cuenta}</span>

            <span className="text-gray-400">Tipo</span>
            <span className="text-right font-medium">{BANK.tipo}</span>

            <span className="text-gray-400">Identificación</span>
            <span className="text-right font-medium">{BANK.identificacion}</span>
          </div>
        </div>
      </div>

      {/* Bloque centrado: Pago con Deuna + QR pequeño */}
      <section className="text-center mb-8">
        <h2 className="text-xl font-semibold mb-2">Pago con Deuna!</h2>
        <p className="text-gray-400 mb-5">
          Escanea el siguiente QR o descárgalo para pagar fácilmente:
        </p>

        {/* ⬇️ QR más pequeño: ajusta width/height si quieres aún más chico */}
        <div className="inline-block rounded-2xl bg-[#0f172a]/40 border border-white/10 p-4">
          <Image
            src="/deuna-qr.jpg"
            alt="QR Deuna"
            width={220}
            height={220}
            priority
            className="rounded-md"
          />
        </div>

        <div className="flex justify-center gap-3 mt-5">
          <a
            href="/deuna-qr.jpg"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-[#6d28d9] hover:bg-[#5b21b6] transition"
          >
            Abrir QR
          </a>
          <a
            href="/deuna-qr.jpg"
            download
            className="px-4 py-2 rounded-xl border border-[#6d28d9] hover:bg-[#6d28d9]/10 transition"
          >
            Descargar QR
          </a>
        </div>
      </section>

      {/* Botón banca web alineado a la izquierda, como tu diseño previo */}
      <div className="mb-8">
        <a
          href="https://www.pichincha.com/portal" // cambia si usas otra banca
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 transition"
        >
          Ir a Banca Web
        </a>
      </div>

      {/* Validación del pago (componente cliente) */}
      <TransferenciaClient />
    </main>
  );
}
