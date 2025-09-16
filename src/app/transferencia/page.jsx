"use client";
import { useState } from "react";

export default function Transferencia() {
  const [uploaded, setUploaded] = useState(false);
  return (
    <div className="space-y-4">
      <h1 className="text-3xl" style={{fontWeight:900}}>Transferencia bancaria</h1>
      <p className="muted">Realiza la transferencia y valida tu pago subiendo el comprobante.</p>

      <div className="card">
        <div className="space-y-2">
          <div className="row"><span className="muted">Titular</span><strong>Roberto Acosta</strong></div>
          <div className="row"><span className="muted">Banco</span><strong>Banco Pichincha</strong></div>
          <div className="row"><span className="muted">Cuenta</span><strong>2200449871</strong></div>
          <div className="row"><span className="muted">Tipo</span><strong>Ahorros</strong></div>
          <div className="row"><span className="muted">Identificación</span><strong>1719731380</strong></div>
        </div>
      </div>
{/* Pago con Deuna! */}
<div style={{ marginTop: "2rem", textAlign: "center" }}>
  <h3 style={{ fontWeight: "bold" }}>Pago con Deuna!</h3>
  <p>Escanea el siguiente QR o descárgalo para pagar fácilmente:</p>

  <img
    src="/deuna-qr.jpg" // 🔹 nombre de tu archivo en /public
    alt="QR Deuna"
    style={{
      width: "100%",
      maxWidth: "300px",
      margin: "1rem auto",
      borderRadius: "12px",
      background: "#fff",
      padding: "8px"
    }}
  />

  <div style={{ marginTop: "1rem" }}>
    <a
      href="/deuna-qr.jpg"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        marginRight: "1rem",
        color: "#fff",
        background: "#6d28d9",
        padding: "0.5rem 1rem",
        borderRadius: "6px",
        textDecoration: "none"
      }}
    >
      Abrir QR
    </a>
    <a
      href="/deuna-qr.jpg"
      download="deuna-qr.jpg"
      style={{
        color: "#6d28d9",
        border: "1px solid #6d28d9",
        padding: "0.5rem 1rem",
        borderRadius: "6px",
        textDecoration: "none"
      }}
    >
      Descargar QR
    </a>
  </div>
</div>
      <div className="space-x-2">
        <a className="btn btn-ghost" href="https://www.pichincha.com/portal-personas" target="_blank">Ir a Banca Web</a>
      </div>

      <h3 style={{fontWeight:900}}>Validación del pago</h3>
      <p className="muted">Sube una foto o PDF del comprobante.</p>

      <div className="item-card">
        <input type="file" accept="image/*,application/pdf" onChange={() => setUploaded(true)} />
      </div>

      {uploaded && (
        <div className="card" style={{ borderColor: "#16a34a", background: "rgba(22,163,74,.12)" }}>
          ✅ Comprobante recibido. Te notificaremos tras la validación.
        </div>
      )}
    </div>
  );
}


