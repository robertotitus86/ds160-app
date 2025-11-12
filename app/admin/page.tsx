"use client";

import React, { useEffect, useState } from "react";

type OrderStatus = "pending" | "paid" | "rejected";
type StatusResp =
  | { ok: true; order: { id: string; status: OrderStatus; receiptUrl?: string } }
  | { ok: false; error?: string };

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState<OrderStatus | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Recupera el token para no escribirlo cada vez
    const saved = localStorage.getItem("ds160_admin_token");
    if (saved) setToken(saved);
  }, []);

  const saveToken = () => {
    localStorage.setItem("ds160_admin_token", token);
    setMessage("Token guardado en este navegador.");
    setTimeout(() => setMessage(""), 2000);
  };

  const fetchStatus = async () => {
    setMessage("");
    setStatus(null);
    setReceiptUrl(undefined);
    if (!orderId) {
      setMessage("Debes indicar un Order ID.");
      return;
    }
    try {
      const r = await fetch(`/api/orders/status?orderId=${encodeURIComponent(orderId)}`, {
        cache: "no-store",
      });
      const data = (await r.json()) as StatusResp;
      if (data.ok) {
        setStatus(data.order.status);
        setReceiptUrl(data.order.receiptUrl);
      } else {
        setMessage(data.error || "No se pudo consultar el estado.");
      }
    } catch (e: any) {
      setMessage(e?.message || "Error consultando estado.");
    }
  };

  const approve = async () => {
    if (!token) {
      setMessage("Escribe tu ADMIN_TOKEN para aprobar.");
      return;
    }
    if (!orderId) {
      setMessage("Debes indicar un Order ID.");
      return;
    }
    try {
      const r = await fetch("/api/orders/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify({ orderId, action: "approve" }),
      });
      const data = (await r.json()) as { ok: boolean; error?: string };
      if (data.ok) {
        setMessage("Orden aprobada.");
        setStatus("paid");
      } else {
        setMessage(data.error || "No se pudo aprobar.");
      }
    } catch (e: any) {
      setMessage(e?.message || "Error aprobando.");
    }
  };

  const reject = async () => {
    if (!token) {
      setMessage("Escribe tu ADMIN_TOKEN para rechazar.");
      return;
    }
    if (!orderId) {
      setMessage("Debes indicar un Order ID.");
      return;
    }
    try {
      const r = await fetch("/api/orders/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify({ orderId, action: "reject" }),
      });
      const data = (await r.json()) as { ok: boolean; error?: string };
      if (data.ok) {
        setMessage("Orden rechazada.");
        setStatus("rejected");
      } else {
        setMessage(data.error || "No se pudo rechazar.");
      }
    } catch (e: any) {
      setMessage(e?.message || "Error rechazando.");
    }
  };

  const tagStyle = (s: OrderStatus | null) => {
    const base: React.CSSProperties = {
      display: "inline-block",
      borderRadius: 999,
      padding: "4px 10px",
      fontWeight: 700,
      fontSize: 12,
      marginLeft: 8,
      color: "#0b1120",
    };
    if (s === "paid") return { ...base, background: "#86efac" };
    if (s === "pending") return { ...base, background: "#fde68a" };
    if (s === "rejected") return { ...base, background: "#fca5a5" };
    return { ...base, background: "#e5e7eb" };
    };

  const container: React.CSSProperties = {
    maxWidth: 880,
    margin: "0 auto",
    padding: "24px 16px",
    color: "#e5e7eb",
  };
  const card: React.CSSProperties = {
    background: "#0f172a",
    border: "1px solid #172554",
    borderRadius: 16,
    padding: 20,
  };
  const row: React.CSSProperties = { display: "flex", gap: 12, flexWrap: "wrap" };
  const label: React.CSSProperties = { fontSize: 14, opacity: 0.8 };
  const input: React.CSSProperties = {
    background: "#0b1220",
    border: "1px solid #1f2a44",
    color: "#e5e7eb",
    borderRadius: 8,
    padding: "10px 12px",
    minWidth: 260,
  };
  const btn: React.CSSProperties = {
    background: "#2563eb",
    color: "#fff",
    border: 0,
    borderRadius: 10,
    padding: "10px 14px",
    fontWeight: 700,
    cursor: "pointer",
  };
  const btnGhost: React.CSSProperties = {
    background: "transparent",
    border: "1px solid #334155",
    color: "#e5e7eb",
    borderRadius: 10,
    padding: "10px 14px",
    fontWeight: 600,
    cursor: "pointer",
  };

  return (
    <div style={container}>
      <div style={card}>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Panel Admin – DS-160</h2>
        <p style={{ opacity: 0.8, marginTop: 0 }}>
          Revisa el estado de un pedido por su <b>Order ID</b>, y aprueba/rechaza el pago.
        </p>

        <div style={{ height: 16 }} />

        <div style={row}>
          <div>
            <div style={label}>ADMIN_TOKEN</div>
            <input
              style={input}
              type="password"
              placeholder="Escribe tu token de admin"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </div>
          <button style={btnGhost} onClick={saveToken}>Guardar token</button>
        </div>

        <div style={{ height: 20 }} />

        <div style={row}>
          <div>
            <div style={label}>Order ID</div>
            <input
              style={input}
              placeholder="DS160-YYYYMMDD-HHMMSS"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            />
          </div>
          <button style={btnGhost} onClick={fetchStatus}>Consultar estado</button>
        </div>

        <div style={{ height: 14 }} />

        {status && (
          <div style={{ opacity: 0.9 }}>
            Estado actual: <b>{status.toUpperCase()}</b>
            <span style={tagStyle(status)}>{status.toUpperCase()}</span>
          </div>
        )}

        {receiptUrl && (
          <>
            <div style={{ height: 10 }} />
            <div style={{ opacity: 0.85 }}>
              Comprobante:{" "}
              <a href={receiptUrl} target="_blank" rel="noreferrer" style={{ color: "#93c5fd" }}>
                abrir
              </a>
            </div>
          </>
        )}

        <div style={{ height: 20 }} />

        <div style={row}>
          <button style={btn} onClick={approve}>Aprobar</button>
          <button style={btnGhost} onClick={reject}>Rechazar</button>
        </div>

        {message && (
          <>
            <div style={{ height: 12 }} />
            <div style={{ opacity: 0.85 }}>{message}</div>
          </>
        )}

        <div style={{ height: 20 }} />
        <div style={{ opacity: 0.6, fontSize: 12 }}>
          Tip: Si vas a aprobar varios pedidos, guarda tu <b>ADMIN_TOKEN</b> con “Guardar token”
          y no tendrás que volver a pegarlo.
        </div>
      </div>
    </div>
  );
}
