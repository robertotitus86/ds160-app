"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function PaypalSuccess() {
  const params = useSearchParams();
  const token = params.get("token");
  const [status, setStatus] = useState("Procesando pago con PayPal...");

  useEffect(() => {
    async function go() {
      if (!token) return;
      const res = await fetch("/api/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderID: token }),
      });
      const data = await res.json();
      if (data?.status === "COMPLETED") {
        setStatus("✅ Pago completado con PayPal.");
      } else {
        setStatus("⚠️ No se pudo confirmar el pago. Revisa tu cuenta PayPal o intenta de nuevo.");
      }
    }
    go();
  }, [token]);

  return (
    <main style={{maxWidth:720, margin:'60px auto', padding:24, textAlign:'center'}}>
      <h1>{status}</h1>
      <p><a href="/ds160" style={{color:'#2563eb', textDecoration:'underline'}}>Volver al asistente</a></p>
    </main>
  );
}
