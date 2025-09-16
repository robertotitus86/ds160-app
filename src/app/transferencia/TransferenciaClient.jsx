// src/app/transferencia/TransferenciaClient.jsx
"use client";

import Image from "next/image";
import { useState } from "react";

export default function TransferenciaClient({ bank }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    const okType = f.type.startsWith("image/") || f.type === "application/pdf";
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
    setPreviewUrl(f.type.startsWith("image/") ? URL.createObjectURL(f) : "");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Adjunta el comprobante antes de enviar.");
      return;
    }

    // TODO: reemplaza por tu lógica real (FormData -> /api/upload/S3/Supabase)
    alert(`Comprobante listo para enviar: ${file.name}`);
  };

  return (
    <section className="space-y-6">
      {/* Datos bancarios */}
      <div className="rounded-2xl bg-[#0f172a] border border-white/10 p-6">
        <h2 className="text-xl font-semibold mb-4">Transferencia bancaria</h2>
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <span className="text-gray-400">Titular</span>
          <span className="text-right font-medium">{bank.titular}</span>

          <span className="text-gray-400">Banco</span>
          <span className="text-right font-medium">{bank.banco}</span>

          <span className="text-gray-400">Cuenta</span>
          <span className="text-right font-medium">{bank.cuenta}</span>

          <span className="text-gray-400">Tipo</span>
          <span className="text-right font-medium">{bank.tipo}</span>

          <span className="text-gray-400">Identificación</span>
          <span className="text-right font-medium">{bank.identificacion}</span>
        </div>

        <div className="mt-4">
          <a
            href="https://www.pichincha.com/portal"
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
  );
}
