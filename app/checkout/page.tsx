"use client";

import { useState } from "react";

export default function CheckoutPage() {
  const cuenta = "******0650";

  const copiar = () => {
    navigator.clipboard.writeText("0650");
    alert("Número copiado ✅");
  };

  return (
    <div style={{ display: "flex", gap: 40, minHeight: "80vh", paddingTop: 40 }}>

      {/* COLUMNA IZQUIERDA (QR) */}
      <div style={{
        flex: 1, display: "flex", justifyContent: "center", alignItems: "center"
      }}>
        <img
          src="/deuna-qr.png"
          alt="QR Deuna"
          style={{
            width: "260px",
            height: "auto",
            borderRadius: "14px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.35)"
          }}
        />
      </div>

      {/* COLUMNA DERECHA (INSTRUCCIONES) */}
      <div style={{ flex: 1, paddingRight: 20 }}>
        <p style={{ marginBottom: 14, lineHeight: 1.6 }}>
          <strong>1)</strong> Abre tu app Deuna <br />
          <strong>2)</strong> Escanea el código o envía al N° de cuenta <br />
          <strong>3)</strong> Coloca el <strong>mismo total</strong> indicado arriba y confirma
        </p>

        <div style={{
          padding: "16px 18px",
          border: "1px solid #1e293b",
          background: "#0f172a",
          borderRadius: 14,
          marginTop: 14,
          marginBottom: 18
        }}>
          <div style={{ opacity: 0.7, fontSize: 13 }}>Cuenta Deuna</div>
          <div style={{ marginTop: 4, fontSize: 18, fontWeight: 700 }}>
            Nro. {cuenta}
          </div>

          <button
            onClick={copiar}
            style={{
              marginTop: 8,
              background: "#2563eb",
              border: "none",
              padding: "8px 14px",
              borderRadius: 8,
              color: "#fff",
              cursor: "pointer",
              fontWeight: 600
            }}
          >
            Copiar número
          </button>
        </div>

        <p style={{ opacity: 0.75, fontSize: 14 }}>
          Después del pago, sube tu comprobante o envíalo por WhatsApp. ¡Gracias!
        </p>
      </div>
    </div>
  );
}
