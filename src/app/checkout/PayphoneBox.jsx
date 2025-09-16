"use client";
import { useEffect, useState } from "react";

/**
 * Botón oficial de PayPhone (Cajita)
 * Requiere:
 *  - NEXT_PUBLIC_PAYPHONE_TOKEN
 *  - NEXT_PUBLIC_PAYPHONE_STORE_ID
 * Dominio de producción: https://ds160-app-6go6.vercel.app
 */
export default function PayphoneBox({ totalUSD, reference = "Pago DS-160" }) {
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setErrorMsg("");

    // 1) Inyectar CSS de la cajita
    const cssId = "ppb-css";
    if (!document.getElementById(cssId)) {
      const link = document.createElement("link");
      link.id = cssId;
      link.rel = "stylesheet";
      link.href = "https://cdn.payphonetodoesposible.com/box/v1.1/payphone-payment-box.css";
      document.head.appendChild(link);
    }

    // 2) Cargar script y renderizar
    const renderButton = () => {
      try {
        const token = process.env.NEXT_PUBLIC_PAYPHONE_TOKEN;
        const storeId = process.env.NEXT_PUBLIC_PAYPHONE_STORE_ID;
        if (!token || !storeId) {
          setErrorMsg("Faltan credenciales de PayPhone en variables de entorno.");
          return;
        }

        // Monto en CENTAVOS (entero)
        const amountCents = Math.round(Number(totalUSD || 0) * 100);
        const clientTransactionId = `ds160-${Date.now()}`;

        // eslint-disable-next-line no-undef
        const ppb = new PPaymentButtonBox({
          token,
          storeId,
          clientTransactionId,
          // Si no aplicas IVA, manda todo en amount y amountWithoutTax
          amount: amountCents,
          amountWithoutTax: amountCents,
          currency: "USD",
          reference,
          lang: "es",
          defaultMethod: "card",
          backgroundColor: "#6d28d9",
        });

        // Limpia contenedor por si se remonta
        const container = document.getElementById("pp-button");
        if (container) container.innerHTML = "";

        ppb.render("pp-button");
      } catch (e) {
        setErrorMsg("No se pudo inicializar PayPhone.");
        console.error(e);
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
      <div id="pp-button" className="min-h-[44px]" />
      {errorMsg && (
        <p className="mt-3 text-sm text-red-400">
          {errorMsg}
        </p>
      )}
      <p className="mt-2 text-xs text-gray-500">
        Nota: paga desde el dominio de producción{" "}
        <span className="underline">https://ds160-app-6go6.vercel.app</span> para evitar
        errores de dominio en PayPhone.
      </p>
    </div>
  );
}
