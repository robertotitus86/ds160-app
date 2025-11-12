"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

type OrderStatus = "pending" | "paid" | "rejected";
type CreateResp =
  | { ok: true; orderId: string; receiptUrl: string }
  | { ok: false; error?: string };

type StatusResp =
  | { ok: true; order: { id: string; status: OrderStatus; receiptUrl?: string } }
  | { ok: false; error?: string };

const styles = {
  card: {
    background: "#0f172a",
    border: "1px solid #172554",
    borderRadius: 16,
    padding: 20,
    color: "#e5e7eb",
  },
  h2: { fontSize: 20, fontWeight: 700, marginBottom: 10 },
  hint: { opacity: 0.85, fontSize: 14 },
  row: { display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" as const },
  btn: {
    background: "#2563eb",
    color: "#fff",
    border: 0,
    borderRadius: 10,
    padding: "10px 14px",
    fontWeight: 700,
    cursor: "pointer",
  },
  btnGhost: {
    background: "transparent",
    border: "1px solid #334155",
    color: "#e5e7eb",
    borderRadius: 10,
    padding: "10px 14px",
    fontWeight: 600,
    cursor: "pointer",
  },
  muted: { opacity: 0.7 },
  badge: (bg: string) => ({
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    background: bg,
    color: "#0b1120",
  }),
};

function getPlansFromUrlOrLocal(searchParams: URLSearchParams): string[] {
  const fromQuery = searchParams.get("plans");
  if (fromQuery) {
    return fromQuery
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  }
  try {
    const stored = localStorage.getItem("ds160_cart");
    if (stored) {
      const parsed = JSON.parse(stored) as string[] | { id: string }[];
      if (Array.isArray(parsed)) {
        if (parsed.length && typeof parsed[0] === "string") return parsed as string[];
        if (parsed.length && typeof (parsed[0] as any).id === "string")
          return (parsed as any[]).map((p) => p.id);
      }
    }
  } catch {}
  return [];
}

export default function CheckoutPage() {
  const sp = useSearchParams();
  const [plans, setPlans] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [orderId, setOrderId] = useState<string | null>(null);
  const [status, setStatus] = useState<OrderStatus | null>(null);
  const [message, setMessage] = useState<string>("");

  const pollTimer = useRef<NodeJS.Timeout | null>(null);

  // Inicializa planes y restablece orden previa si existe
  useEffect(() => {
    const p = getPlansFromUrlOrLocal(sp as unknown as URLSearchParams);
    setPlans(p);

    const saved = localStorage.getItem("ds160_order");
    if (saved) {
      try {
        const { orderId: savedId } = JSON.parse(saved);
        if (savedId) {
          setOrderId(savedId);
          setStatus("pending");
        }
      } catch {}
    }
  }, [sp]);

  // Polling a /api/orders/status cuando haya orderId y status!=paid/rejected
  const startPolling = useCallback((id: string) => {
    if (pollTimer.current) clearInterval(pollTimer.current);
    pollTimer.current = setInterval(async () => {
      try {
        const r = await fetch(`/api/orders/status?orderId=${encodeURIComponent(id)}`, {
          cache: "no-store",
        });
        const data = (await r.json()) as StatusResp;
        if (data.ok) {
          const st = data.order.status;
          setStatus(st);
          if (st === "paid") {
            setMessage("¡Pago aprobado! Ya puedes continuar.");
            if (pollTimer.current) clearInterval(pollTimer.current);
          } else if (st === "rejected") {
            setMessage("El pago fue revisado y rechazado. Vuelve a subir un comprobante válido.");
            if (pollTimer.current) clearInterval(pollTimer.current);
          } else {
            setMessage("Comprobante en revisión. Te avisaremos cuando esté aprobado…");
          }
        } else {
          setMessage("No se pudo consultar el estado. Intentando de nuevo…");
        }
      } catch {
        setMessage("No se pudo consultar el estado. Intentando de nuevo…");
      }
    }, 5000);
  }, []);

  // Si ya tenemos orderId pendiente al entrar a la página, arrancar polling
  useEffect(() => {
    if (orderId && (!status || status === "pending")) {
      startPolling(orderId);
    }
    return () => {
      if (pollTimer.current) clearInterval(pollTimer.current);
    };
  }, [orderId, status, startPolling]);

  const handleSubmit = async () => {
    if (!file) {
      setMessage("Adjunta el comprobante (imagen o PDF).");
      return;
    }
    if (!plans.length) {
      setMessage("No hay servicios seleccionados.");
      return;
    }

    setSubmitting(true);
    setMessage("");
    try {
      const fd = new FormData();
      fd.append("receipt", file);
      fd.append("plans", plans.join(","));

      const res = await fetch("/api/orders/create", { method: "POST", body: fd });
      const data = (await res.json()) as CreateResp;

      if (!data.ok) {
        setMessage(data.error || "No se pudo crear la orden.");
        setSubmitting(false);
        return;
      }

      // Orden creada: estado siempre PENDING
      setOrderId(data.orderId);
      setStatus("pending");
      localStorage.setItem("ds160_order", JSON.stringify({ orderId: data.orderId }));
      setMessage("Comprobante cargado. Queda EN REVISIÓN. Te avisaremos al aprobarse.");

      // Arranca el polling hasta que el admin apruebe (paid) o rechace
      startPolling(data.orderId);
    } catch (e: any) {
      setMessage(e?.message || "Error al enviar el comprobante.");
    } finally {
      setSubmitting(false);
    }
  };

  const continuarDisabled = useMemo(() => status !== "paid", [status]);

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "24px 16px" }}>
      <div style={styles.card}>
        <h2 style={styles.h2}>Checkout</h2>

        {plans.length ? (
          <p style={styles.hint}>
            Servicios seleccionados: <b>{plans.join(", ")}</b>
          </p>
        ) : (
          <p style={{ ...styles.hint, color: "#fca5a5" }}>
            No hay servicios seleccionados.
          </p>
        )}

        <div style={{ height: 12 }} />

        <div style={styles.row}>
          <div>
            <div style={{ marginBottom: 8, fontWeight: 700 }}>Comprobante de pago (imagen o PDF)</div>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>

          <button
            onClick={handleSubmit}
            style={styles.btn}
            disabled={submitting}
          >
            {submitting ? "Enviando..." : "Subir y generar orden"}
          </button>
        </div>

        <div style={{ height: 12 }} />

        {orderId && (
          <div style={styles.hint}>
            <div>
              <b>ID de pedido:</b> {orderId}{" "}
              {status === "paid" && <span style={styles.badge("#86efac")}>APROBADO</span>}
              {status === "pending" && <span style={styles.badge("#fde68a")}>EN REVISIÓN</span>}
              {status === "rejected" && <span style={styles.badge("#fca5a5")}>RECHAZADO</span>}
            </div>
          </div>
        )}

        {message && (
          <>
            <div style={{ height: 8 }} />
            <div style={styles.hint}>{message}</div>
          </>
        )}

        <div style={{ height: 16 }} />

        <div style={styles.row}>
          <button
            style={{
              ...(continuarDisabled ? styles.btnGhost : styles.btn),
              opacity: continuarDisabled ? 0.6 : 1,
              cursor: continuarDisabled ? "not-allowed" : "pointer",
            }}
            disabled={continuarDisabled}
            onClick={() => {
              // Aquí envía a tu ruta del asistente / formulario
              window.location.href = "/wizard";
            }}
            title={
              continuarDisabled
                ? "Aún no aprobado. Espera a que validemos tu comprobante."
                : "Continuar al asistente"
            }
          >
            {continuarDisabled ? "Esperando aprobación…" : "Ir al formulario"}
          </button>

          <button
            style={styles.btnGhost}
            onClick={() => {
              // Volver a tienda / inicio
              window.location.href = "/";
            }}
          >
            Seguir comprando
          </button>
        </div>

        <div style={{ height: 8 }} />
        <div style={styles.muted}>Al confirmar, generamos un ID de pedido. El acceso al asistente se habilita solo cuando el pago esté <b>APROBADO</b>.</div>
      </div>
    </div>
  );
}

