"use client";

import { useState } from "react";

export default function PayPhonePage() {
  const [base, setBase] = useState(25.00); // USD (sin 6%)
  const [loading, setLoading] = useState(false);

  const crearLink = async () => {
    try {
      setLoading(true);
      const r = await fetch("/api/payphone/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseAmountUsd: base }),
      });
      const data = await r.json();
      if (data?.link) {
        window.location.href = data.link; // abre el formulario PayPhone
      } else {
        alert(data?.error || "No se pudo crear el Link");
      }
    } catch (e) {
      console.error(e);
      alert("Error creando el Link");
    } finally {
      setLoading(false);
    }
  };

  const total = +(base * 1.06).toFixed(2);

  const status = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("status")
    : null;

  return (
    <div style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:12,padding:20,maxWidth:640}}>
      <h2 style={{marginTop:0}}>Pagar con PayPhone</h2>

      {status === "success" && (
        <div style={{padding:12, background:'#dcfce7', borderRadius:10, marginBottom:12}}>
          ✅ Pago completado (demo). Verifica en tu panel de PayPhone.
        </div>
      )}
      {status === "cancel" && (
        <div style={{padding:12, background:'#fef9c3', borderRadius:10, marginBottom:12}}>
          ⚠️ Pago cancelado.
        </div>
      )}

      <label style={{display:'block',fontWeight:600,marginBottom:6}}>Monto base (USD)</label>
      <input
        type="number" step="0.01" min="0"
        style={{border:'1px solid #e5e7eb',borderRadius:8,padding:'8px 10px',width:'100%'}}
        value={base}
        onChange={(e) => setBase(parseFloat(e.target.value || "0"))}
      />
      <p style={{color:'#64748b',marginTop:8}}>
        Se aplicará un recargo del <b>6%</b>. Total: <b>${total.toFixed(2)}</b>
      </p>

      <button
        onClick={crearLink}
        disabled={loading || base <= 0}
        style={{padding:'10px 16px',borderRadius:10,border:'1px solid #0ea5e9',background:'#0ea5e9',color:'#fff',fontWeight:600,cursor:'pointer'}}
      >
        {loading ? "Creando link..." : "Pagar con PayPhone"}
      </button>
    </div>
  );
}
