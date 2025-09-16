// src/app/transferencia/page.jsx
import Image from "next/image";

export const metadata = {
  title: "Transferencia | Asistente DS-160",
  description: "Pantalla de transferencia y pago con código QR.",
};

export default function TransferenciaPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold">Pago por Transferencia</h1>
          <p className="text-gray-600">
            Escanea el código QR para realizar tu pago con Deuna.
          </p>
        </header>

        {/* La imagen debe existir en /public/deuna-qr.jpg */}
        <div className="flex justify-center">
          <Image
            src="/deuna-qr.jpg"
            alt="QR de Deuna para pago"
            width={320}
            height={320}
            priority
            // Si el archivo pesara mucho, puedes descomentar la siguiente línea:
            // placeholder="empty"
          />
        </div>

        <section className="text-sm text-gray-600 space-y-2">
          <p>Si no logras escanear, recarga la página e inténtalo de nuevo.</p>
          <p>
            Archivo servido desde <code>/public/deuna-qr.jpg</code>.
          </p>
        </section>
      </div>
    </main>
  );
}
