"use client";

import { useState } from "react";

export default function Transferencia() {
  const [uploaded, setUploaded] = useState(false);

  const openPichincha = () => {
    // Abre la ficha de la app "De Una!" (placeholder)
    window.open(
      "https://play.google.com/store/apps/details?id=com.pichincha.movil",
      "_blank"
    );
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
        Transferencia bancaria
      </h1>
      <p className="muted" style={{ marginBottom: 16 }}>
        Realiza la transferencia con los siguientes datos y valida tu pago
        subiendo el comprobante.
      </p>

      {/* Datos bancarios */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: "grid", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span className="muted">Titular</span>
            <strong>Tu Empresa S.A.</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span className="muted">Banco</span>
            <strong>Banco Pichincha</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span className="muted">Cuenta</span>
            <strong>0000000000</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span className="muted">Tipo</span>
            <strong>Ahorros</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span className="muted">Identificación</span>
            <strong>1799999999001</strong>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <button onClick={openPichincha} className="btn">
          Abrir app Banco Pichincha (De Una!)
        </button>
        <a
          className="btn btn-outline"
          href="https://www.pichincha.com/portal-personas"
          target="_blank"
        >
          Ir a Banca Web
        </a>
      </div>

      {/* Subir comprobante */}
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
        Validación del pago
      </h2>
      <p className="muted" style={{ marginBottom: 12 }}>
        Sube una foto o PDF del comprobante. Marcaremos tu orden como
        <b> pendiente</b> y la confirmaremos por correo una vez validada.
      </p>

      <div className="card light" style={{ marginBottom: 12 }}>
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={() => setUploaded(true)}
        />
      </div>

      {uploaded && (
        <div className="card" style={{ borderColor: "#16a34a", background: "rgba(22,163,74,.12)" }}>
          ✅ Comprobante recibido. Te notificaremos tras la validación.
        </div>
      )}
    </div>
  );
}
