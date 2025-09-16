// src/app/transferencia/TransferenciaClient.jsx
"use client";

import { useState } from "react";
import styles from "./transferencia.module.css";

export default function TransferenciaClient() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");

  function onFileChange(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const okType = f.type.startsWith("image/") || f.type === "application/pdf";
    const okSize = f.size <= 8 * 1024 * 1024;
    if (!okType) { alert("Solo imágenes (JPG/PNG) o PDF."); e.target.value = ""; return; }
    if (!okSize) { alert("El archivo supera 8 MB."); e.target.value = ""; return; }
    setFile(f);
    setPreviewUrl(f.type.startsWith("image/") ? URL.createObjectURL(f) : "");
    setUploadedUrl("");
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!file) return alert("Adjunta el comprobante antes de enviar.");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error al subir.");
      setUploadedUrl(data.url);
      alert("Comprobante subido correctamente.");
    } catch (err) {
      alert(`No se pudo subir: ${err.message}`);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <h2 className={styles.title} style={{fontSize:20, marginBottom:4}}>Validación del pago</h2>
      <p className={styles.intro} style={{marginTop:0}}>Sube una foto o PDF del comprobante (máx. 8 MB).</p>

      <form onSubmit={onSubmit} className={styles.formRow}>
        <input type="file" accept="image/*,application/pdf" onChange={onFileChange} className={styles.file} />

        {previewUrl && (
          <img src={previewUrl} alt="Vista previa del comprobante" className={styles.preview} />
        )}

        {file && !previewUrl && file.type === "application/pdf" && (
          <p>PDF seleccionado: <strong>{file.name}</strong></p>
        )}

        <div className={styles.buttonsRow}>
          <button type="submit" disabled={uploading} className={`${styles.btn} ${styles.btnSuccess}`}>
            {uploading ? "Enviando..." : "Enviar comprobante"}
          </button>
          {file && (
            <button
              type="button"
              onClick={() => { setFile(null); setPreviewUrl(""); setUploadedUrl(""); }}
              className={`${styles.btn} ${styles.btnOutline}`}
            >
              Quitar archivo
            </button>
          )}
        </div>

        {uploadedUrl && (
          <p style={{color:"#10b981"}}>
            Comprobante guardado:{" "}
            <a href={uploadedUrl} target="_blank" rel="noreferrer" style={{textDecoration:"underline", color:"#10b981"}}>
              {uploadedUrl}
            </a>
          </p>
        )}
      </form>
    </div>
  );
}
