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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Izquierda: QR Deuna (server-safe) */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Pago con Deuna</h2>

          <div className="rounded-2xl bg-[#0f172a]/40 border border-white/10 p-6 w-fit">
            <Image
              src="/deuna-qr.jpg"
              alt="QR Deuna"
              width={320}
              height={320}
              priority
              className="rounded-md"
            />
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
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

          <p className="text-sm text-gray-400 mt-3">
            Si no logras escanear, abre el QR en nueva pestaña o descárgalo.
          </p>
        </section>

        {/* Derecha: datos + formulario (client) */}
        <TransferenciaClient bank={BANK} />
      </div>
    </main>
  );
}
