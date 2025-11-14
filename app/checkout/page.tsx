"use client";
import React, { useState } from "react";
import Image from "next/image";

const css = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  inner: {
    width: "100%",
    maxWidth: 900,
    display: "grid",
    gap: 20,
  },
  card: {
    background: "#0f172a",
    padding: 20,
    borderRadius: 14,
    border: "1px solid #1e293b",
  },
  label: {
    fontSize: 13,
    opacity: 0.8,
    display: "block",
    marginBottom: 4,
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    background: "#020617",
    border: "1px solid #1e293b",
    borderRadius: 10,
    color: "white",
    outline: "none",
  },
  button: {
    background: "#2563eb",
    padding: "10px 16px",
    borderRadius: 10,
    color: "white",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
  },
  error: {
    background: "#7f1d1d",
    padding: 14,
    color: "white",
    borderRadius: 10,
  },
  ok: {
    background: "#14532d",
    padding: 14,
    color: "white",
    borderRadius: 10,
  },
};

export default function CheckoutPage() {
  const [name, setName] = useState("");
  const [last, setLast] = useState("");
  const [phone, setPhone] = useState("");
  const [mail, setMail] = useState("");
  const [method, setMethod] = useState("deuna");
  const [slip, setSlip] = useState<File | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [ok, setOk] = useState("");

  const validate = () => {
    const e = [];
    if (!name.trim()) e.push("Ingresa tu nombre.");
    if (!last.trim()) e.push("Ingresa tu apellido.");
    if (!phone.trim()) e.push("Ingresa tu número de WhatsApp.");
    if (!mail.trim() || !mail.includes("@")) e.push("Correo inválido.");
    if (method === "transferencia" && !slip)
      e.push("Debes subir el comprobante de pago.");
    return e;
  };

  const payNow = () => {
    const e = validate();
    setErrors(e);
    if (e.length === 0) {
      setOk(
        "Gracias. Tu pago está en revisión.\nTe enviaremos acceso al asistente una vez aprobado."
      );
    }
  };

  return (
    <div style={css.wrapper}>
      <div style={css.inner}>
        {/* -------------------- ERRORES Y MENSAJES -------------------- */}
        {errors.length > 0 && (
          <div style={css.error}>
            <b>Revisa antes de continuar:</b>
            <ul>
              {errors.map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
          </div>
        )}

        {ok && (
          <div style={css.ok}>
            <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{ok}</pre>
          </div>
        )}

        {/* -------------------- DATOS DE CONTACTO -------------------- */}
        <section style={css.card}>
          <h2>Tus datos de contacto</h2>
          <p style={{ fontSize: 13, opacity: 0.8, marginBottom: 16 }}>
            Usaremos estos datos para enviarte acceso al asistente y coordinar tu
            proceso DS-160.
          </p>

          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "repeat(2,minmax(0,1fr))",
            }}
          >
            <div>
              <label style={css.label}>Nombre</label>
              <input
                style={css.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej.: Roberto"
              />
            </div>

            <div>
              <label style={css.label}>Apellido</label>
              <input
                style={css.input}
                value={last}
                onChange={(e) => setLast(e.target.value)}
                placeholder="Ej.: Acosta"
              />
            </div>

            <div>
              <label style={css.label}>WhatsApp / Celular</label>
              <input
                style={css.input}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ej.: +593 987 846 751"
              />
            </div>

            <div>
              <label style={css.label}>Correo electrónico</label>
              <input
                style={css.input}
                value={mail}
                onChange={(e) => setMail(e.target.value)}
                placeholder="Ej.: ejemplo@gmail.com"
              />
            </div>
          </div>
        </section>

        {/* -------------------- RESUMEN -------------------- */}
        <section style={css.card}>
          <h3>Resumen de tu compra</h3>
          <p>Llenado DS-160 — <b>$45 USD</b></p>
          <p>Total: <b>$45 USD</b></p>
        </section>

        {/* -------------------- MÉTODOS DE PAGO -------------------- */}
        <section style={css.card}>
          <h3>Método de pago</h3>

          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            style={{
              ...css.input,
              cursor: "pointer",
              marginBottom: 18,
            }}
          >
            <option value="deuna">Deuna (QR)</option>
            <option value="transferencia">Transferencia bancaria</option>
            <option value="paypal">PayPal (Próximamente)</option>
            <option value="tarjeta">Tarjeta (Próximamente)</option>
          </select>

          {/* DEUNA */}
          {method === "deuna" && (
            <div>
              <Image
                src="/qr-deuna.png"
                width={270}
                height={270}
                alt="QR Deuna"
                style={{
                  borderRadius: 12,
                  border: "1px solid #1e293b",
                  display: "block",
                  margin: "0 auto",
                }}
              />
            </div>
          )}

          {/* TRANSFERENCIA */}
          {method === "transferencia" && (
            <div>
              <p><b>Número de cuenta:</b> 2200449871</p>
              <p><b>Tipo:</b> Ahorros</p>
              <p><b>Banco:</b> Pichincha</p>
              <p><b>Titular:</b> Roberto Acosta</p>

              <label style={css.label}>Sube tu comprobante</label>
              <input
                type="file"
                style={css.input}
                onChange={(e) => setSlip(e.target.files?.[0] || null)}
              />
            </div>
          )}

          {/* PRÓXIMAMENTE */}
          {(method === "paypal" || method === "tarjeta") && (
            <p style={{ opacity: 0.6 }}>Este método estará disponible pronto.</p>
          )}
        </section>

        {/* -------------------- BOTÓN -------------------- */}
        <button style={css.button} onClick={payNow}>
          Ya pagué, acceder al asistente
        </button>
      </div>
    </div>
  );
}

