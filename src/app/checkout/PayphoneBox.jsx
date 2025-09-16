"use client";
import { useEffect } from "react";

/**
 * Botón de PayPhone (Cajita).
 * Props:
 *  - totalUSD: número en dólares (ej. 68.90)
 *  - reference: texto de referencia del pago
 *
 * Requisitos:
 *  - NEXT_PUBLIC_PAYPHONE_TOKEN y NEXT_PUBLIC_PAYPHONE_STORE_ID en tus env vars de Vercel.
 *  - Dominio de producción: https://ds160-app-6go6.vercel.app
 */
export default function PayphoneBox({ totalUSD, reference = "Pago DS-160" }) {
  useEffect(() => {
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
      // Monto en CENTAVOS (entero)
      const amountCents = Math.round(Number(totalUSD || 0) * 100);
      const clientTransactionId = `ds160-${Date.now()}`;

      if (!process.env.NEXT_PUBLIC_PAYPHONE_TOKEN || !process.env.NEXT_PUBLIC_PAYPHONE_STORE_ID) {
        console.error("Faltan variables NEXT_PUBLIC_PAYPHONE_TOKEN o NEXT_PUBLIC_PAYPHONE_STORE_ID");
        return;
      }

      // eslint-disable-next-line no-undef
      const ppb = new PPaymentButtonBox({
        token: process.env.NEXT_PUBLIC_PAYPHONE_TOKEN,
        storeId: process.env.NEXT_PUBLIC_PAYPHONE_STORE_ID,
        clientTransactionId,
        amount: amountCents,
        amountWithoutTax: amountCents, // si no aplicas IVA, manda todo aquí
        currency: "USD",
        reference,
        lang: "es",
        defaultMethod: "card",     // "card" o "payphone"
        backgroundColor: "#6d28d9" // para que combine con tu tema
      });

      ppb.render("pp-button");
    };

    if (window.PPaymentButtonBox) {
      renderButton();
    } else {
      const s = document.createElement("script");
      s.src = "https://cdn.payphonetodoesposible.com/box/v1.1/payphone-payment-box.js";
      s.type = "module";
      s.onload = renderButton;
      document.body.appendChild(s);
    }
  }, [totalUSD, reference]);

  // Contenedor donde PayPhone pintará su botón
  return <div id="pp-button" />;
}
