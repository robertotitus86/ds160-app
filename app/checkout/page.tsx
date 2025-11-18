"use client";

import React, {
  Suspense,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";

const PRICES: Record<string, number> = {
  llenado: 45,
  asesoria: 35,
  cita: 15,
};

const TITLES: Record<string, string> = {
  llenado: "Llenado DS-160",
  asesoria: "Asesoría Entrevista",
  cita: "Toma de Cita",
};

type Method = "deuna" | "transferencia" | "paypal_soon" | "card_soon";

const css = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  } as React.CSSProperties,
  inner: {
    width: "100%",
    maxWidth: 900,
    display: "grid",
    gap: 18,
  } as React.CSSProperties,
  card: {
    background: "#0f172a",
    padding: 18,
    borderRadius: 14,
    border: "1px solid #1e293b",
  } as React.CSSProperties,
  label: {
    fontSize: 13,
    opacity: 0.8,
    display: "block",
    marginBottom: 4,
  } as React.CSSProperties,
  input: {
    width: "100%",
    padding: "8px 10px",
    background: "#020617",
    border: "1px solid #1e293b",
    borderRadius: 10,
    color: "#e5e7eb",
    outline: "none",
    fontSize: 14,
  } as React.CSSProperties,
  btn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: 600,
  } as React.CSSProperties,
  ghost: {
    background: "#334155",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: 500,
  } as React.CSSProperties,
  error: {
    background: "#7f1d1d",
    border: "1px solid #b91c1c",
    padding: 12,
    color: "#fee2e2",
    borderRadius: 10,
  } as React.CSSProperties,
  ok: {
    background: "#14532d",
    border: "1px solid #16a34a",
    padding: 12,
    color: "#dcfce7",
    borderRadius: 10,
  } as React.CSSProperties,
  tabs: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: 10,
  } as React.CSSProperties,
  tab(active: boolean, disabled?: boolean): React.CSSProperties {
    return {
      position: "relative",
      background: active ? "#2563eb" : "#334155",
      color: disabled ? "rgba(255,255,255,.5)" : "#fff",
      border: "none",
      borderRadius: 10,
      padding: "8px 12px",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.7 : 1,
      fontSize: 13,
      fontWeight: 500,
    };
  },
  soonBadge: {
    position: "absolute" as const,
    top: -8,
    right: -8,
    padding: "2px 6px",
    borderRadius: 8,
    background: "#f59e0b",
    color: "#111827",
    fontSize: 10,
    fontWeight: 700,
  } as React.CSSProperties,
};

async function uploadProof(file: File | null): Promise<string | null> {
  if (!file) return null;
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload-proof", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) return null;
    const data = await res.json();
    return (data.url as string) || null;
  } catch {
    return null;
  }
}

function CheckoutInner() {
  const params = useSearchParams();

  const one = params.get("plan");
  const many = params.get("plans");
  const fromURL = useMemo(
    () => (many ? many.split(",").filter(Boolean) : one ? [one] : []),
    [one, many]
  );

  const [items, setItems] = useState<string[]>([]);
  const total = items.reduce((acc, id) => acc + (PRICES[id] || 0), 0);

  // Contacto
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Método de pago
  const [method, setMethod] = useState<Method>("deuna");

  // Deuna
  const [deunaChecked, setDeunaChecked] = useState(false);
  const [deunaRef, setDeunaRef] = useState("");
  const [deunaFile, setDeunaFile] = useState<File | null>(null);

  // Transferencia
  const [transRef, setTransRef] = useState("");
  const [transFile, setTransFile] = useState<File | null>(null);
  const [transConfirm, setTransConfirm] = useState(false);

  const [errors, setErrors] = useState<string[]>([]);
  const [successMsg, setSuccessMsg] = useState("");
  const [sending, setSending] = useState(false);

  // Cargar carrito
  useEffect(() => {
    if (fromURL.length) {
      setItems(fromURL);
      return;
    }
    try {
      const raw = localStorage.getItem("ds160_cart");
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, [fromURL.join(",")]);

  function copy(text: string) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  }

  function makeOrderId() {
    const ts = new Date();
    return `DS160-${ts.getFullYear()}${String(
      ts.getMonth() + 1
    ).padStart(2, "0")}${String(ts.getDate()).padStart(2, "0")}-${String(
      ts.getHours()
    ).padStart(2, "0")}${String(ts.getMinutes()).padStart(2, "0")}${String(
      ts.getSeconds()
    ).padStart(2, "0")}`;
  }

  function validate(): string[] {
    const out: string[] = [];

    if (!items.length) out.push("No hay servicios en el carrito.");
    if (!total || total <= 0) out.push("El total no es válido.");

    if (!name.trim()) out.push("Ingresa tu nombre.");
    if (!lastName.trim()) out.push("Ingresa tu apellido.");
    if (!phone.trim()) out.push("Ingresa tu número de WhatsApp o celular.");
    if (!email.trim()) out.push("Ingresa tu correo electrónico.");
    if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      out.push("El correo electrónico no tiene un formato válido.");
    }

    if (method === "deuna") {
      if (!deunaChecked) out.push("Marca que confirmas tu pago con Deuna (QR).");
      if (!deunaRef && !deunaFile) {
        out.push(
          "En Deuna ingresa una referencia o adjunta el comprobante de pago."
        );
      }
    }

    if (method === "transferencia") {
      if (!transConfirm)
        out.push("Confirma que realizaste la transferencia por el total.");
      if (!transRef && !transFile) {
        out.push(
          "En Transferencia pega la referencia del banco o adjunta el comprobante."
        );
      }
    }

    return out;
  }

  async function sendForReview() {
    const v = validate();
    if (v.length) {
      setErrors(v);
      setSuccessMsg("");
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    try {
      setSending(true);
      setErrors([]);
      setSuccessMsg("");

      const orderId = makeOrderId();

      // Subir comprobantes (si existen) y obtener URL
      const deunaUrl =
        method === "deuna" ? await uploadProof(deunaFile) : null;
      const transUrl =
        method === "transferencia" ? await uploadProof(transFile) : null;

      const payload = {
        order_id: orderId,
        items,
        total,
        method,
        contact: {
          name: name.trim(),
          lastName: lastName.trim(),
          phone: phone.trim(),
          email: email.trim(),
        },
        deuna_ref: deunaRef || null,
        deuna_file_name: deunaFile?.name || null,
        deuna_file_url: deunaUrl,
        trans_ref: transRef || null,
        trans_file_name: transFile?.name || null,
        trans_file_url: transUrl,
        ts: new Date().toISOString(),
      };

      if (typeof window !== "undefined") {
        localStorage.setItem("order_id", orderId);
        localStorage.setItem("ds160_cart", JSON.stringify(items));
        localStorage.setItem("payment_meta", JSON.stringify(payload));
      }

      await fetch("/api/pending-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setSuccessMsg(
        `✅ Recibimos tu solicitud (#${orderId}).\n` +
          `Revisaremos el pago y te habilitaremos el acceso al asistente DS-160.\n` +
          `Te contactaremos al WhatsApp ${phone.trim()} o al correo ${email.trim()}.`
      );
    } catch (e: any) {
      setErrors([
        e?.message || "Error al enviar la solicitud. Intenta nuevamente.",
      ]);
    } finally {
      setSending(false);
    }
  }

  if (!items.length) {
    return (
      <div style={css.wrapper}>
        <div style={css.inner}>
          <div style={css.card}>
            <h2>Checkout</h2>
            <p>No hay servicios seleccionados.</p>
            <a href="/" style={css.btn}>
              Volver a servicios
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={css.wrapper}>
      <div style={css.inner}>
        {/* MENSAJES */}
        {errors.length > 0 && (
          <div style={css.error}>
            <b>Revisa antes de continuar:</b>
            <ul style={{ margin: "6px 0 0 18px" }}>
              {errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        )}

        {successMsg && (
          <div style={css.ok}>
            <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
              {successMsg}
            </pre>
          </div>
        )}

        {/* DATOS DE CONTACTO */}
        <section style={css.card}>
          <h2 style={{ marginTop: 0 }}>Tus datos de contacto</h2>
          <p style={{ fontSize: 13, opacity: 0.8, marginBottom: 14 }}>
            Usaremos estos datos para enviarte acceso al asistente y coordinar
            tu proceso DS-160.
          </p>

          <div
            style={{
              display: "grid",
              gap: 22,
              gridTemplateColumns: "repeat(2,minmax(0,1fr))",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <label style={css.label}>Nombre</label>
              <input
                style={{
                  ...css.input,
                  maxWidth: 320,
                  padding: "6px 10px",
                  fontSize: 13,
                }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej.: Roberto"
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <label style={css.label}>Apellido</label>
              <input
                style={{
                  ...css.input,
                  maxWidth: 320,
                  padding: "6px 10px",
                  fontSize: 13,
                }}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Ej.: Acosta"
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <label style={css.label}>WhatsApp / Celular</label>
              <input
                style={{
                  ...css.input,
                  maxWidth: 320,
                  padding: "6px 10px",
                  fontSize: 13,
                }}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ej.: +593 987 846 751"
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <label style={css.label}>Correo electrónico</label>
              <input
                style={{
                  ...css.input,
                  maxWidth: 320,
                  padding: "6px 10px",
                  fontSize: 13,
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ej.: ejemplo@gmail.com"
              />
            </div>
          </div>
        </section>

        {/* RESUMEN */}
        <section style={css.card}>
          <h3 style={{ marginTop: 0 }}>Resumen de tu compra</h3>
          <ul style={{ margin: "6px 0 12px 18px" }}>
            {items.map((id) => (
              <li
                key={id}
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <span>{TITLES[id] || id}</span>
                <span>—</span>
                <b>${PRICES[id]} USD</b>
                <button
                  onClick={() => setItems(items.filter((x) => x !== id))}
                  style={{
                    marginLeft: 8,
                    background: "#334155",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "4px 8px",
                    cursor: "pointer",
                    fontSize: 12,
                  }}
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>
          <p>
            Total: <b>${total} USD</b>
          </p>
        </section>

        {/* MÉTODO DE PAGO */}
        <section style={css.card}>
          <h3 style={{ marginTop: 0 }}>Elige cómo pagaste</h3>
          <div style={css.tabs}>
            <button
              style={css.tab(method === "deuna")}
              onClick={() => setMethod("deuna")}
            >
              Deuna (QR)
            </button>
            <button
              style={css.tab(method === "transferencia")}
              onClick={() => setMethod("transferencia")}
            >
              Transferencia
            </button>

            <div style={{ position: "relative" }}>
              <button style={css.tab(false, true)} aria-disabled>
                PayPal
              </button>
              <span style={css.soonBadge}>Próximamente</span>
            </div>

            <div style={{ position: "relative" }}>
              <button style={css.tab(false, true)} aria-disabled>
                Tarjeta (2Checkout)
              </button>
              <span style={css.soonBadge}>Próximamente</span>
            </div>
          </div>
        </section>

        {/* DE
