// src/app/transferencia/page.jsx
"use client";

import Image from "next/image";
import { useState } from "react";

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
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    // Validaciones básicas
    const okType =
      f.type.startsWith("image/") || f.type === "application/pdf";
    const okSize = f.size <= 8 * 1024 * 1024; // 8 MB

    if (!okType) {
      alert("Solo se aceptan imágenes (JPG/PNG) o PDF.");
      e.target.value = "";
      return;
    }
    if (!okSize) {
      alert("El archivo supera 8 MB. Comprime o selecciona otro.");
      e.target.value = "";
      return;
    }
    setFile(f);

    // Preview solo para imágenes
    if (f.type.startsWith("image/")) {
      const url = URL.createObjectURL(f);
      setPreviewUrl(url);
    } else {
      setPreviewUrl("");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Adjunta el comprobante antes de enviar.");
      return;
    }
    // TODO: reemplaza este bloque con tu lógica real de subida:
    // - /api/upload (FormData)
    // - S3 / Supabase / Cloudinary, etc.
    // Por ahora, solo notificamos al usuario.
    alert("Comprobante listo para enviar (implementa tu endpoint de subida).");
  };

  return (
    <main className="min-h-screen px-6 md:px-12 py-10">
      {/* Título */}
      <h1 className="text-3xl md:text-4xl font-extrabold mb-6">
        Pago por Transferencia
      </h1>

      {/* Intro */}
      <p className="text-gray-300 max-w-3xl mb-8">
        Escanea el código QR para pagar con Deuna o realiza una transferencia
        bancaria y sube el comprobante para validarlo.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Columna izquierda: QR Deuna */}
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
            Si no logras escanear, abre el QR en nueva pestaña o descárgalo y
            compártelo.
          </p>
        </section>

        {/* Columna derecha: datos bancarios + validación */}
        <section className="space-y-6">
          {/* Datos bancarios */}
          <div className="rounded-2xl bg-[#0f172a] border border-white/10 p-6">
            <h2 className="text-xl font-semibold mb-4">Transferencia bancaria</h2>
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
              <span className="text-right font-medium">
                {BANK.identificacion}
              </span>
            </div>

            <div className="mt-4">
              <a
                href="https://www.pichincha.com/portal" // cambia a tu banca web preferida
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 transition"
              >
                Ir a Banca Web
              </a>
            </div>
          </div>

          {/* Validación del pago */}
          <div className="rounded-2xl bg-[#0f172a] border border-white/10 p-6">
            <h2 className="text-xl font-semibold mb-4">Validación del pago</h2>
            <p className="text-sm text-gray-400 mb-4">
              Sube una imagen (JPG/PNG) o un PDF del comprobante (máx. 8&nbsp;MB).
            </p>

            <form onSubmit={onSubmit} className="space-y-4">
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={onFileChange}
                className="block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-[#6d28d9] file:px-4 file:py-2 file:text-white hover:file:bg-[#5b21b6]"
              />

              {/* Preview si es imagen */}
              {previewUrl && (
                <div className="mt-2">
                  <Image
                    src={previewUrl}
                    alt="Vista previa del comprobante"
                    width={360}
                    height={360}
                    className="rounded-md border border-white/10"
                  />
                </div>
              )}

              {/* Estado si es PDF */}
              {file && !previewUrl && file.type === "application/pdf" && (
                <p className="text-sm text-gray-300">
                  Archivo PDF seleccionado: <span className="font-medium">{file.name}</span>
                </p>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition"
                >
                  Enviar comprobante
                </button>
                {file && (
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setPreviewUrl("");
                    }}
                    className="px-4 py-2 rounded-xl border border-white/20 hover:bg-white/5 transition"
                  >
                    Quitar archivo
                  </button>
                )}
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
