// src/app/transferencia/page.jsx
import TransferenciaClient from "./TransferenciaClient";

export const metadata = {
  title: "Transferencia | Asistente DS-160",
  description:
    "Pago con Deuna, datos bancarios y validación de comprobante para la transferencia.",
};

const BANK = {
  titular: "Roberto Acosta",
  banco: "Banco Pichincha",
  cuenta: "2200449871",
  tipo: "Ahorros",
  identificacion: "1719731380",
};

// cache-bust para evitar versiones en caché del QR
const QR_SRC = "/deuna-qr.jpg?v=4";

export default function TransferenciaPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-10 space-y-8">
        {/* Cabecera */}
        <header className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold">
            Pago por Transferencia
          </h1>
          <p className="text-gray-300 max-w-3xl">
            Completa tu pago escaneando el QR de Deuna o usa los datos bancarios.
            Al finalizar, sube el comprobante para validar la transacción.
          </p>
        </header>

        {/* Grid principal: QR + Banco */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card: Pago con Deuna */}
          <div className="rounded-2xl bg-[#0f172a] border border-white/10 p-6">
            <h2 className="text-xl font-semibold mb-1 text-center">
              Pago con Deuna
            </h2>
            <p className="text-gray-400 text-center mb-5">
              Escanea el código o abre/descarga el QR.
            </p>

            <div className="flex justify-center">
              <div className="rounded-2xl bg-black/20 border border-white/10 p-4">
                {/* Usamos <img> nativo para que SIEMPRE se muestre el QR */}
                <img
                  src={QR_SRC}
                  alt="QR de Deuna"
                  width={180}
                  height={180}
                  className="block rounded-md"
                  loading="eager"
                />
              </div>
            </div>

            {/* Acciones */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
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
              <a
                href="https://www.pichincha.com/portal"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 transition"
              >
                Ir a Banca Web
              </a>
            </div>
          </div>

          {/* Card: Datos bancarios */}
          <div className="rounded-2xl bg-[#0f172a] border border-white/10 p-6">
            <h2 className="text-xl font-semibold mb-4">Datos bancarios</h2>
            <table className="w-full text-sm">
              <tbody className="[&>tr>td:first-child]:text-gray-400 [&>tr>td:first-child]:pr-4">
                <tr>
                  <td>Titular</td>
                  <td className="text-right font-medium">{BANK.titular}</td>
                </tr>
                <tr>
                  <td>Banco</td>
                  <td className="text-right font-medium">{BANK.banco}</td>
                </tr>
                <tr>
                  <td>Cuenta</td>
                  <td className="text-right font-medium">{BANK.cuenta}</td>
                </tr>
                <tr>
                  <td>Tipo</td>
                  <td className="text-right font-medium">{BANK.tipo}</td>
                </tr>
                <tr>
                  <td>Identificación</td>
                  <td className="text-right font-medium">{BANK.identificacion}</td>
                </tr>
              </tbody>
            </table>
            <p className="text-xs text-gray-500 mt-4">
              * Si transfieres desde otro banco, confirma que el número y tipo de
              cuenta coincidan.
            </p>
          </div>
        </section>

        {/* Card: Validación del pago */}
        <section className="rounded-2xl bg-[#0f172a] border border-white/10 p-6">
          <TransferenciaClient />
        </section>
      </div>
    </main>
  );
}

