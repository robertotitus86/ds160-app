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
  // Fondo general claro para todo el checkout
  page: {
    width: "100%",
    minHeight: "100vh",
    background: "#f3f4f6", // gris claro
    padding: "32px 16px",
    boxSizing: "border-box",
  } as React.CSSProperties,

  wrapper: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  } as React.CSSProperties,

  inner: {
    width: "100%",
    maxWidth: 960,
    display: "grid",
    gap: 20,
  } as React.CSSProperties,

  // Tarjetas tipo banca / SaaS
  card: {
    background: "#ffffff",
    padding: 20,
    borderRadius: 16,
    border: "1px solid #e5e7eb",
    boxShadow: "0 10px 25px rgba(15,23,42,0.06)",
  } as React.CSSProperties,

  label: {
    fontSize: 13,
    opacity: 0.9,
    display: "block",
    marginBottom: 4,
    color: "#4b5563",
  } as React.CSSProperties,

  input: {
    width: "100%",
    padding: "8px 10px",
    background: "#f9fafb",
    border: "1px solid #d1d5db",
    borderRadius: 10,
    color: "#111827",
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
    fontSize: 14,
    boxShadow: "0 8px 18px rgba(37,99,235,0.25)",
  } as React.CSSProperties,

  ghost: {
    background: "#e5e7eb",
    color: "#111827",
    border: "none",
    borderRadius: 10,
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: 500,
    fontSize: 14,
  } as React.CSSProperties,

  // Error en rojo suave
  error: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    padding: 12,
    color: "#b91c1c",
    borderRadius: 12,
  } as React.CSSProperties,

  // Toast flotante de éxito
  toastContainer: {
    position: "fixed",
    top: 80,
    right: 24,
    zIndex: 60,
  } as React.CSSProperties,

  okToast: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    maxWidth: 360,
    background: "#ecfdf3",
    border: "1px solid #bbf7d0",
    padding: 14,
    color: "#166534",
    borderRadius: 14,
    boxShadow: "0 16px 40px rgba(22,163,74,0.25)",
  } as React.CSSProperties,

  okIconCircle: {
    width: 24,
    height: 24,
    borderRadius: "999px",
    background: "#22c55e",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ecfdf3",
    fontSize: 14,
    flexShrink: 0,
  } as React.CSSProperties,

  okTitle: {
    fontWeight: 600,
    marginBottom: 2,
  } as React.CSSProperties,

  okBody: {
    fontSize: 13,
    whiteSpace: "pre-wrap",
  } as React.CSSProperties,

  okCloseBtn: {
    marginLeft: 8,
    background: "transparent",
    border: "none",
    color: "#166534",
    cursor: "pointer",
    fontSize: 16,
    lineHeight: 1,
  } as React.CSSProperties,

  tabs: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: 10,
  } as React.CSSProperties,

  tab(active: boolean, disabled?: boolean): React.CSSProperties {
    return {
      position: "relative",
      background: active ? "#2563eb" : "#e5e7eb",
      color: disabled ? "rgba(55,65,81,.6)" : active ? "#ffffff" : "#111827",
      border: "none",
      borderRadius: 999,
      padding: "8px 14px",
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
    background: "#f97316",
    color: "#111827",
    fontSize: 10,
    fontWeight: 700,
  } as React.CSSProperties,
};

// Helper para subir comprobante (opcional, si existe archivo)
async function uploadProof(file: File | null): Promise<string | null> {
  if (!file) return null;

  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload-proof", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      console.error("[UPLOAD_PROOF] respuesta no OK", res.status);
      return null;
    }

    const data = await res.json();
    if (data && typeof data.url === "string") {
      return data.url;
    }

    return null;
  } catch (err) {
    console.error("[UPLOAD_PROOF] error", err);
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
    if (typeof navigator !== "undefined" && (navigator as any).clipboard) {
      (navigator as any).clipboard.writeText(text).catch(() => {});
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
      if (!deunaChecked) out.push("Marca que confirmas tu pago con Pago con QR / PayPhone (recomendado).");
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

      // Subir comprobante(s) si existen
      const deunaUrl =
        method === "deuna" ? await uploadProof(deunaFile) : null;
      const transUrl =
        method === "transferencia" ? await uploadProof(transFile) : null;

      const payload = {
        order_id: orderId,
        items,
        total,
        method:
          method === "deuna" || method === "transferencia"
            ? method
            : ("deuna" as "deuna" | "transferencia"), // fallback
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
        `Recibimos tu solicitud (#${orderId}).\n` +
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
      <div style={css.page}>
        <div style={css.wrapper}>
          <div style={css.inner}>
            <div style={css.card}>
              <h2 style={{ marginTop: 0, color: "#111827" }}>Confirmar y pagar tu acompañamiento</h2>
              <p style={{ color: "#4b5563" }}>No hay servicios seleccionados.</p>
              <a href="/" style={css.btn}>
                Volver a servicios
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={css.page}>
      {/* Toast flotante de éxito */}
      {successMsg && (
        <div style={css.toastContainer}>
          <div style={css.okToast}>
            <div style={css.okIconCircle}>✓</div>
            <div style={{ flex: 1 }}>
              <div style={css.okTitle}>Pago enviado a revisión</div>
              <div style={css.okBody}>{successMsg}</div>
            </div>
            <button
              type="button"
              onClick={() => setSuccessMsg("")}
              style={css.okCloseBtn}
              aria-label="Cerrar aviso"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div style={css.wrapper}>
        <div style={css.inner}>
          {/* MENSAJES DE ERROR (en la parte superior) */}
          {errors.length > 0 && (
            <div style={css.error}>
              <b style={{ display: "block", marginBottom: 4 }}>
                Revisa antes de continuar:
              </b>
              <ul style={{ margin: "4px 0 0 18px" }}>
                {errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          )}

          {/* DATOS DE CONTACTO */}
          <section style={css.card}>
            <h2 style={{ marginTop: 0, color: "#111827" }}>
              Tus datos de contacto
            </h2>
            <p
              style={{
                fontSize: 13,
                opacity: 0.9,
                marginBottom: 14,
                color: "#4b5563",
              }}
            >
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
            <h3 style={{ marginTop: 0, color: "#111827" }}>
              Resumen de tu compra
            </h3>
            <ul style={{ margin: "6px 0 12px 18px", color: "#374151" }}>
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
                      background: "#f3f4f6",
                      color: "#111827",
                      border: "1px solid #e5e7eb",
                      borderRadius: 999,
                      padding: "4px 10px",
                      cursor: "pointer",
                      fontSize: 12,
                    }}
                  >
                    Quitar
                  </button>
                </li>
              ))}
            </ul>
            <p style={{ color: "#111827" }}>
              Total: <b>${total} USD</b>
            </p>
          </section>

          {/* MÉTODO DE PAGO */}
          <section style={css.card}>
            <h3 style={{ marginTop: 0, color: "#111827" }}>
              Elige cómo pagaste
            </h3>
            <div style={css.tabs}>
              <button
                style={css.tab(method === "deuna")}
                onClick={() => setMethod("deuna")}
              >
                Pago con QR / PayPhone (recomendado)
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

          {/* DEUNA */}
          {method === "deuna" && (
            <section style={css.card}>
              <h3 style={{ marginTop: 0, color: "#111827" }}>
                Pago con Pago con QR / PayPhone (recomendado)
              </h3>
              <div
                style={{
                  display: "grid",
                  gap: 16,
                  gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: 14,
                    padding: 14,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <img
                    src="/deuna-qr.png"
                    alt="QR Deuna"
                    style={{
                      width: 190,
                      height: "auto",
                      borderRadius: 12,
                      boxShadow: "0 10px 30px rgba(15,23,42,.18)",
                    }}
                  />
                </div>
                <div style={{ display: "grid", gap: 10 }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 13,
                      color: "#374151",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={deunaChecked}
                      onChange={(e) => setDeunaChecked(e.target.checked)}
                    />
                    Confirmo que pagué con Pago con QR / PayPhone (recomendado) por el total indicado
                  </label>

                  <div>
                    <div style={css.label}>Referencia (recomendado)</div>
                    <input
                      style={css.input}
                      value={deunaRef}
                      onChange={(e) => setDeunaRef(e.target.value)}
                      placeholder="Ej.: referencia / código en la app Deuna"
                    />
                  </div>

                  <div>
                    <div style={css.label}>
                      Adjuntar comprobante (opcional si ingresaste referencia)
                    </div>
                    <input
                      type="file"
                      style={css.input}
                      onChange={(e) =>
                        setDeunaFile(e.target.files?.[0] || null)
                      }
                    />
                    {deunaFile && (
                      <small style={{ opacity: 0.8, color: "#4b5563" }}>
                        Archivo: {deunaFile.name}
                      </small>
                    )}
                  </div>

                  <small style={{ opacity: 0.8, fontSize: 12, color: "#4b5563" }}>
                    Al enviar, tu pago quedará <b>pendiente de revisión</b>. Te
                    habilitaremos el acceso cuando sea aprobado.
                  </small>
                </div>
              </div>
            </section>
          )}

          {/* TRANSFERENCIA */}
          {method === "transferencia" && (
            <section style={css.card}>
              <h3 style={{ marginTop: 0, color: "#111827" }}>
                Transferencia bancaria
              </h3>
              <div
                style={{
                  background: "#f9fafb",
                  borderRadius: 14,
                  border: "1px solid #e5e7eb",
                  padding: 14,
                  display: "grid",
                  gap: 10,
                  color: "#111827",
                }}
              >
                <div style={{ fontSize: 13, opacity: 0.9 }}>
                  Datos para transferencia
                </div>
                <div>
                  <b>Número de cuenta:</b> 2200449871{" "}
                  <button
                    onClick={() => copy("2200449871")}
                    style={{
                      marginLeft: 6,
                      background: "#e5e7eb",
                      color: "#111827",
                      border: "none",
                      borderRadius: 999,
                      padding: "3px 10px",
                      cursor: "pointer",
                      fontSize: 11,
                    }}
                  >
                    Copiar
                  </button>
                </div>
                <div>
                  <b>Tipo de cuenta:</b> Ahorros
                </div>
                <div>
                  <b>Banco:</b> Pichincha
                </div>
                <div>
                  <b>Titular:</b> Roberto Acosta
                </div>

                <div>
                  <div style={css.label}>Referencia (o concepto del banco)</div>
                  <input
                    style={css.input}
                    value={transRef}
                    onChange={(e) => setTransRef(e.target.value)}
                    placeholder="Ej.: referencia / código de la transferencia"
                  />
                </div>

                <div>
                  <div style={css.label}>
                    Adjuntar comprobante (opcional si ingresaste referencia)
                  </div>
                  <input
                    type="file"
                    style={css.input}
                    onChange={(e) =>
                      setTransFile(e.target.files?.[0] || null)
                    }
                  />
                  {transFile && (
                    <small style={{ opacity: 0.8, color: "#4b5563" }}>
                      Archivo: {transFile.name}
                    </small>
                  )}
                </div>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 13,
                    color: "#374151",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={transConfirm}
                    onChange={(e) => setTransConfirm(e.target.checked)}
                  />
                  Confirmo que realicé la transferencia por el total indicado
                </label>

                <small style={{ opacity: 0.8, fontSize: 12, color: "#4b5563" }}>
                  Al enviar, tu pago quedará <b>pendiente de revisión</b>. Te
                  habilitaremos el acceso cuando sea aprobado.
                </small>
              </div>
            </section>
          )}

          {/* BOTÓN FINAL */}
          <section style={css.card}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  opacity: 0.9,
                  maxWidth: 420,
                  color: "#4b5563",
                }}
              >
                Al continuar, enviaremos tu pago a revisión. Te contactaremos
                usando los datos que ingresaste para habilitar el acceso al
                asistente DS-160 y continuar tu proceso.
              </div>
              <button
                style={css.btn}
                onClick={sendForReview}
                disabled={sending}
              >
                {sending ? "Enviando..." : "Enviar pago para revisión"}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ padding: 20 }}>Cargando checkout…</div>}>
      <CheckoutInner />
    </Suspense>
  );
}
