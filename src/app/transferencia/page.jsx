
"use client";

import { useState, useEffect } from "react";

export default function Transferencia() {
  const [uploaded, setUploaded] = useState(false);

  const openPichincha = () => {
    window.open("https://play.google.com/store/apps/details?id=com.pichincha.movil", "_blank");
  };

  return (
    <div className="card">
      <h1 style={{fontSize:28, fontWeight:900, marginBottom:8}}>Transferencia bancaria</h1>
      <p className="muted">Usa estos datos para transferir y valida tu pago.</p>

      <div className="space" />
      <div className="grid">
        <div className="row"><span className="muted">Titular</span><strong>Tu Empresa</strong></div>
        <div className="row"><span className="muted">Banco</span><strong>Banco Pichincha</strong></div>
        <div className="row"><span className="muted">Cuenta</span><strong>0000000000</strong></div>
        <div className="row"><span className="muted">Tipo</span><strong>Ahorros</strong></div>
        <div className="row"><span className="muted">Identificación</span><strong>1799999999001</strong></div>
      </div>

      <div className="space" />
      <button onClick={openPichincha} className="btn">Abrir app Banco Pichincha (De Una!)</button>
      <p className="muted" style={{marginTop:8}}>Este botón abre la ficha de la app. Para validación automática necesitarás un acuerdo/SDK del banco o conciliación via webhook externo.</p>

      <div className="space" />
      <hr style={{border:'none', borderTop:'1px solid var(--border)'}} />
      <div className="space" />

      <h2 style={{fontSize:18, fontWeight:800}}>Sube el comprobante</h2>
      <p className="muted">Validación temporal: sube el comprobante y marcaremos la orden como pendiente.</p>
      <input type="file" accept="image/*,application/pdf" onChange={() => setUploaded(true)} />
      {uploaded && <div className="banner" style={{marginTop:10}}>Comprobante recibido. Validaremos y te confirmaremos por email.</div>}
    </div>
  );
}
