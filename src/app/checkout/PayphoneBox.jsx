"use client";
import { useEffect } from "react";

/**
 * Payphone Payment Box (Cajita)
 * totalUSD: número en dólares (ej. 68.90)
 * reference: texto de referencia (ej. "Servicio DS-160")
 * clientTxPrefix: prefijo para tu id único (ej. "ds160")
 */
export default function PayphoneBox({ totalUSD, reference, clientTxPrefix = "ds160" }) {
  useEffect(() => {
    // 1) Inyectar CSS & JS de la Cajita
    const cssId = "ppb-css";
    if (!document.getElementById(cssId)) {
      const link = document.createElement("link");
      link.id = cssId;
      link.rel = "stylesheet";
      link.href = "https://cdn.payphonetodoesposible.com/box/v1.1/payphone-payment-box.css";
      document.head.appendChild(link);
    }

    const jsId = "ppb-js";
    const alreadyLoaded = !!window.PPaymentButtonBox;
    const inject = () => {
      // 2) Montos en CENTAVOS (enteros)
      const amountCents = Math.round(Number(totalUSD || 0) * 100);

      // clientTransactionId único
      const clientTransactionId = `${clientTxPrefix}-${Date.now()}`;

      /* 3) Render Cajita (en el div #pp-button)
         Si no usas IVA:
           - Usa amount = amountCents
           - Y envía amountWithoutTax = amountCents
         Requisitos de Payphone: montos enteros y amount = suma de los campos. :contentReference[oaicite:4]{index=4}
      */
      // eslint-disable-next-line no-undef
      const ppb = new PPaymentButtonBox({
        token: process.env.NEXT_PUBLIC_PAYPHONE_TOKEN,
        storeId: process.env.NEXT_PUBLIC_PAYPHONE_STORE_ID,
        clientTransactionId,
        amount: amountCents,
        amountWithoutTax: amountCents,
        currency: "USD",
        reference: reference || "Pago DS-160",
        lang: "es",
        defaultMethod: "card",            // "card" o "payphone"
        backgroundColor: "#6d28d9",       // morado para que combine con tu tema
      });

      ppb.render("pp-button");
    };

    if (alreadyLoaded) {
      inject();
    } else {
      const script = document.createElement("script");
      script.id = jsId;
      script.type = "module";
      script.src = "https://cdn.payphonetodoesposible.com/box/v1.1/payphone-payment-box.js";
      script.onload = inject;
      document.body.appendChild(script);
    }
  }, [totalUSD, reference, clientTxPrefix]);

  // Contenedor donde Payphone pinta su botón
  return <div id="pp-button" />;
}
