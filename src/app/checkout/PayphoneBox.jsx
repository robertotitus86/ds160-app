"use client";
import { useEffect, useState } from "react";

/**
 * Botón (Cajita) de PayPhone.
 * Requiere:
 *  - NEXT_PUBLIC_PAYPHONE_TOKEN
 *  - NEXT_PUBLIC_PAYPHONE_STORE_ID
 * Prueba en: https://ds160-app-6go6.vercel.app/checkout
 */
export default function PayphoneBox({ totalUSD, reference = "Pago DS-160" }) {
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setErrorMsg("");

    // CSS de la cajita
    const cssId = "ppb-css";
    if (!document.getElementById(cssId)) {
      const link = document.createElement("link");
      link.id = cssId;
      link.rel = "stylesheet";
      link.href = "https://cdn.payphonetodoesposible.com/box/v1.1/payphone-payment-box.css";
      document.head.appendChild(link);
    }

    const renderButton = () => {
      try {
        const token = process.env.NEXT_PUBLIC_PAYPHONE_TOKEN;
        const storeId = process.env.NEXT_PUBLIC_PAYPHONE_STORE_ID;
        if (!token || !storeId) {
          setErrorMsg("Faltan credenciales de PayPhone.");
          return;
        }

        const amountCents = Math.round(Number(totalUSD || 0) * 100); // 68.90 -> 6890
        const clientTransactionId = `ds160-${Date.now()}`;

        // Limpia contenedor si se remonta
        const container = document.getElementById("pp-button");
        if (container) container.innerHTML = "";

        // eslint-disable-next-line no-undef
        const ppb = new PPaymentButtonBox({
          token,
          storeId,
          clientTransactionId,
          amount: amountCents,
          amountWithoutTax: amountCents, // si no aplicas IVA
          currency: "USD",
          reference,
          lang: "es",
          defaultMethod: "card",
          backgroundColor: "#6d28d9",
        });

        ppb.render("pp-button");
      } catch (e) {
        console.error(e);
        setErrorMsg("No se pudo inicializar PayPhone.");
      }
    };

    if (window.PPaymentButtonBox) {
      renderButton();
    } else {
      const s = document.createElement("script");
      s.src = "https://cdn.payphonetodoesposible.com/box/v1.1/payphone-payment-box.js";
      s.type = "module";
      s.onload = renderButton;
      s.onerror = () => setErrorMsg("No se pudo cargar el script de PayPhone.");
      document.body.appendChild(s);
    }
  }, [totalUSD, reference]);

  return (
    <div>
      <div id="pp-button" className="min-h-[46px]" />
      {errorMsg && (
        <p className="mt-3 text-sm text-red-400">
          {errorMsg}
        </p>
      )}
    </div>
  );
}
