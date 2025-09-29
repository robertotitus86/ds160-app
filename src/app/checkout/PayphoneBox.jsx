"use client";
import { useState } from "react";

export default function PayphoneBox({ amount }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/payphone/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amount * 100, // PayPhone espera valores en centavos
        }),
      });

      if (!res.ok) {
        throw new Error("Error preparando el pago");
      }

      const data = await res.json();

      if (data?.payWithPayPhoneUrl) {
        window.location.href = data.payWithPayPhoneUrl;
      } else {
        throw new Error("No se generó el link de pago");
      }
    } catch (err) {
      alert(err.message || "Error en el pago con PayPhone");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      style={{
        padding: "10px 20px",
        backgroundColor: "#0070f3",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      {loading ? "Procesando..." : `Pagar $${amount.toFixed(2)} con PayPhone`}
    </button>
  );
}
