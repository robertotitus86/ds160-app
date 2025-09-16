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

// cache-bust para evitar que el navegador muestre una versión vieja del QR
const QR_SRC = "/deuna-qr.jpg?v=3";

export default function TransferenciaPage() {
  return (
    <main className="min-h-screen">
      {/* contenedor global */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-10">
        {/* Título e intro */}
        <h1 className="text-3xl md:text-4xl font-extrabold">Pago por Transferencia</h1>
        <p className="text-gray-300 mt-2 max-w-3xl">
          Escanea el código QR para pagar con Deuna o realiza una transferencia bancaria
          y sube el comprobante para validarlo.
        </p>

        {/* TARJETA BANCARIA (arriba derecha, como tu imagen) */}
        <div className="mt-6 flex justify-end">
          <div className="w-full max-w-md rounded-2xl bg-[#0f172a] border border-white/10 p-6 shadow">
            <table className="w-full text-sm">
              <tbody className="[&>tr>td:first-child]:text-gray-400 [&>tr>td:first-child]:pr-4">
                <tr><td>Titular</td><td className="text-right font-medium">{BANK.titular}</td></tr>
                <tr><td>Banco</td><td className="text-right font-medium">{BANK.banco}</td></tr>
                <tr><td>Cuenta</td><td className="text-right font-medium">{BANK.cuenta}</td></tr>
                <tr><td>Tipo</td><td className="text-right font-medium">{BANK.tipo}</td></tr>
                <tr><td>Identificación</td><td className="text-right font-medium">{BANK.identificacion}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGO CON DEUNA (centrado, igual al diseño) */}
        <section className="mt-10 text-center">
          <h2 className="text-xl font-semibold">Pago con Deuna!</h2>
          <p className="text-gray-400 mt-2">
            Escanea el siguiente QR o descárgalo para pagar fácilmente:
          </p>

          {/* QR VISIBLE (img nativo + cache-bust) */}
          <div className="inline-block mt-4 rounded-2xl bg-[#0f172a]/40 border border-white/10 p-4">
            <img
              src={QR_SRC}
              alt="QR Deuna"
              width={160}
              height={160}
              className="block rounded-md"
              loading="eager"
            />
          </div>

          {/* Botones en fila */}
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

        {/* Botón banca web (alineado a la izquierda, como tu UI) */}
        <div className="mt-6">
          <a
            href="https://www.pichincha.com/portal"
            target="_blank"
            rel="noopener noreferrer"
            className="inline

