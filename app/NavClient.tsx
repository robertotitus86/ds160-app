"use client";

import { useEffect, useState } from "react";

export default function NavClient() {
  const [count, setCount] = useState<number>(0);

  // Lee el carrito desde localStorage y actualiza el contador
  const readCart = () => {
    try {
      const raw = localStorage.getItem("ds160_cart");
      const arr: unknown = raw ? JSON.parse(raw) : [];
      if (Array.isArray(arr)) setCount(arr.length);
      else setCount(0);
    } catch {
      setCount(0);
    }
  };

  useEffect(() => {
    readCart();

    // Escucha cambios entre pestañas
    const onStorage = (e: StorageEvent) => {
      if (e.key === "ds160_cart") readCart();
    };
    window.addEventListener("storage", onStorage);

    // Pequeño "poll" para reflejar cambios en la misma pestaña
    const t = setInterval(readCart, 800);

    return () => {
      window.removeEventListener("storage", onStorage);
      clearInterval(t);
    };
  }, []);

  const link: React.CSSProperties = {
    color: "#cbd5e1",
    textDecoration: "none",
    padding: "10px 12px",
    borderRadius: 10,
  };

  const badge: React.CSSProperties = {
    marginLeft: 8,
    background: "#1d4ed8",
    color: "#fff",
    borderRadius: 999,
    padding: "2px 8px",
    fontSize: 12,
    boxShadow: "0 6px 18px rgba(37,99,235,.35)",
  };

  return (
    <nav style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <a href="/" style={link}>
        Inicio
      </a>
      <a href="/wizard" style={link} title="Requiere pago">
        Formulario
      </a>
      <a href="/checkout" style={link}>
        Checkout
        {count > 0 && <span style={badge}>{count}</span>}
      </a>
    </nav>
  );
}
