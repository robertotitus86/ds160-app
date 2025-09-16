// src/app/transferencia/TransferenciaClient.jsx
"use client";

import { useState } from "react";

export default function TransferenciaClient() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");

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
    setUploadedUrl("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Adjunta el comprobante antes de enviar.");
      return;
    }
    setIsSending(true);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error al subir");

      setUploadedUrl(data.url);
      alert("Comprobante subido correctamente.");
    } catch (err) {
      alert(`No se pudo subir: ${err.message}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="rounded-2xl bg-[#0f172a] border border-white/10 p-6">
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
            <img
              src={previewUrl}
              alt="Vista previa del comprobante"
              className="rounded-md border border-white/10 max-w-full h-auto"
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
            disabled={isSending}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 transition"
          >
            {isSending ? "Enviando..." : "Enviar comprobante"}
          </button>
          {file && (
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setPreviewUrl("");
                setUploadedUrl("");
              }}
              className="px-4 py-2 rounded-xl border border-white/20 hover:bg-white/5 transition"
            >
              Quitar archivo
            </button>
          )}
        </div>

        {uploadedUrl && (
          <p className="text-sm text-emerald-400">
            Comprobante guardado:{" "}
            <a
              className="underline break-all"
              href={uploadedUrl}
              target="_blank"
              rel="noreferrer"
            >
              {uploadedUrl}
            </a>
          </p>
        )}
      </form>
    </section>
  );
}
