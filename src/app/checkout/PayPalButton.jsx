
"use client";

import { useEffect, useRef } from "react";

export default function PayPalButton({ amountUsd = 1 }) {
  const divRef = useRef(null);

  useEffect(() => {
    const srcBase = process.env.NEXT_PUBLIC_PAYPAL_ENV === "live"
      ? "https://www.paypal.com/sdk/js"
      : "https://www.sandbox.paypal.com/sdk/js";
    const src = `${srcBase}?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`;

    function renderButtons() {
      if (!window.paypal || !divRef.current) return;
      divRef.current.innerHTML = "";
      window.paypal.Buttons({
        style: { layout: "vertical", shape: "rect", label: "pay" },
        createOrder: async () => {
          const r = await fetch("/api/paypal/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amountUsd }),
          });
          const data = await r.json();
          if (!data?.id) throw new Error("No se creó la orden");
          return data.id;
        },
        onApprove: async (data) => {
          const r = await fetch("/api/paypal/capture", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: data.orderID }),
          });
          const cap = await r.json();
          window.location.href = "/gracias?method=paypal";
        },
        onError: (err) => {
          console.error("PayPal error:", err);
          alert("Error con PayPal");
        }
      }).render(divRef.current);
    }

    if (!document.getElementById("paypal-sdk")) {
      const s = document.createElement("script");
      s.id = "paypal-sdk";
      s.src = src;
      s.onload = renderButtons;
      document.body.appendChild(s);
    } else {
      renderButtons();
    }
  }, [amountUsd]);

  return <div ref={divRef} />;
}
