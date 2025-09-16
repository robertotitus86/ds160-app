"use client";
import { useEffect } from "react";

export default function PayphoneBox({ totalUSD, reference = "Asistente DS-160" }) {
  useEffect(() => {
    // Inyecta CSS + JS de la cajita
    const cssId = "ppb-css";
    if (!document.getElementById(cssId)) {
      const link = document.createElement("link");
      link.id = cssId; link.rel = "stylesheet";
      link.href = "https://cdn.payphonetodoesposible.com/box/v1.1/payphone-payment-box.css";
      document.head.appendChild(link);
    }

    const inject = () => {
      const amountCents = Math.round(Number(totalUSD || 0) * 100); // 68.90 -> 6890
      const clientTransactionId = `ds160-${Date.now()}`;

      // eslint-disable-next-line no-undef
      const ppb = new PPaymentButtonBox({
        token: process.env.NEXT_PUBLIC_PAYPHONE_TOKEN,
        storeId: process.env.NEXT_PUBLIC_PAYPHONE_STORE_ID,
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
    };

    if (window.PPaymentButtonBox) inject();
    else {
      const s = document.createElement("script");
      s.src = "https://cdn.payphonetodoesposible.com/box/v1.1/payphone-payment-box.js";
      s.type = "module";
      s.onload = inject;
      document.body.appendChild(s);
    }
  }, [totalUSD, reference]);

  return <div id="pp-button" />;
}
