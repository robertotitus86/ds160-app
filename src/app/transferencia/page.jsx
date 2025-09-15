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
          <div className="row"><span className="muted">Titular</span><strong>Tu Empresa S.A.</strong></div>
          <div className="row"><span className="muted">Banco</span><strong>Banco Pichincha</strong></div>
          <div className="row"><span className="muted">Cuenta</span><strong>0000000000</strong></div>
          <div className="row"><span className="muted">Tipo</span><strong>Ahorros</strong></div>
          <div className="row"><span className="muted">Identificación</span><strong>1799999999001</strong></div>
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


