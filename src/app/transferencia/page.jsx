// src/app/transferencia/page.jsx
import TransferenciaClient from "./TransferenciaClient";

export const metadata = {
  title: "Pago por Transferencia | Asistente DS-160",
  description: "Transferencia bancaria, QR Deuna y validación de comprobante.",
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
    <main className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-10 space-y-6">
        {/* Título + intro */}
        <header className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold">Pago por Transferencia</h1>
          <p className="text-gray-300 max-w-3xl">
            Escanea el código QR para pagar con Deuna o realiza una transferencia bancaria y
            sube el comprobante para validarlo.
          </p>
        </header>

        {/* Tarjeta bancaria alineada a la derecha */}
        <div className="flex justify-end">
          <div className="w-full max-w-md rounded-2xl bg-[#0f172a] border border-white/10 p-6 shadow">
            <table className="w-full text-sm">
              <tbody className="[&>tr>td:first-child]:text-gray-400 [&>tr>td:first-child]:pr-3">
                <tr><td>Titular</td><td className="text-right font-medium">{BANK.titular}</td></tr>
                <tr><td>Banco</td><td className="text-right font-medium">{BANK.banco}</td></tr>
                <tr><td>Cuenta</td><td className="text-right font-medium">{BANK.cuenta}</td></tr>
                <tr><td>Tipo</td><td className="text-right font-medium">{BANK.tipo}</td></tr>
                <tr><td>Identificación</td><td className="text-right font-medium">{BANK.identificacion}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Bloque centrado: Pago con Deuna (QR visible) */}
        <section className="text-center pt-2">
          <h2 className="text-xl font-semibold">Pago con Deuna!</h2>
          <p className="text-gray-400 mt-2">
            Escanea el siguiente QR o descárgalo para pagar fácilmente:
          </p>

          {/* ✅ Usamos <img> nativo para evitar cualquier problema del optimizador de Next */}
          <div className="inline-block mt-4 rounded-2xl bg-[#0f172a]/40 border border-white/10 p-4">
            <img
              src="/deuna-qr.jpg"
              alt="QR Deuna"
              width={160}
              height={160}
              className="block rounded-md"
              loading="eager"
            />
          </div>

          {/* Botones debajo del QR */}
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

        {/* Botón banca web alineado a la izquierda */}
        <div>
          <a
            href="https://www.pichincha.com/portal"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 transition"
          >
            Ir a Banca Web
          </a>
        </div>

        {/* Validación del pago */}
        <section>
          <TransferenciaClient />
        </section>
      </div>
    </main>
  );
}
