"use client";

import { useRef, useState } from "react";
import Image from "next/image";

export default function Transferencia() {
  // -------- Estado del envío de comprobante (opcional) ----------
  const formRef = useRef(null);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  // Si ya creaste /api/upload, este submit lo usa. Si no, borra todo el bloque del <form>.
  const onSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus("");

    try {
      const fd = new FormData(formRef.current);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();

      if (res.ok) {
        setStatus("✅ Comprobante enviado correctamente. Te confirmaremos por correo.");
        formRef.current.reset();
      } else {
        setStatus(data?.error || "❌ Ocurrió un error al enviar. Intenta nuevamente.");
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Ocurrió un error al enviar. Intenta nuevamente.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Título */}
      <header className="card">
        <h1 className="text-3xl" style={{ fontWeight: 900, margin: 0 }}>
          Transferencia bancaria
        </h1>
        <p className="muted" style={{ marginTop: 6 }}>
          Realiza la transferencia y valida tu pago con el comprobante o usando el QR de <b>Deuna!</b>.
        </p>
      </header>

      {/* Datos bancarios */}
      <section className="card">
        <h3 style={{ fontWeight: 900, marginTop: 0, marginBottom: 12 }}>Datos de la cuenta</h3>
        <div className="space-y-2">
          <div className="row"><span className="muted">Titular</span><strong>Roberto Acosta</strong></div>
          <div className="row"><span className="muted">Banco</span><strong>Banco Pichincha</strong></div>
          <div className="row"><span className="muted">Cuenta</span><strong>2200449871</strong></div>
          <div className="row"><span className="muted">Tipo</span><strong>Ahorros</strong></div>
          <div className="row"><span className="muted">Identificación</span><strong>1719731380</strong></div>
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <a
            className="btn btn-ghost"
            href="https://www.pichincha.com/portal-personas"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ir a Banca Web
          </a>
        </div>
      </section>

      {/* Pago con Deuna */}
      <section className="card">
        <div className="row" style={{ alignItems: "center", marginBottom: 8 }}>
          <h3 style={{ fontWeight: 900, margin: 0 }}>Pago con Deuna!</h3>
          <span className="muted" style={{ fontSize: 14 }}>
            Escanea el código QR o ábrelo en otra pestaña.
          </span>
        </div>

        <div style={{ display: "grid", placeItems: "center", padding: 12 }}>
          <Image
            src="/deuna-qr.jpg"            // Asegúrate que existe en /public con este nombre
            alt="QR Deuna"
            width={340}
            height={340}
            priority
            style={{
              width: "100%",
              height: "auto",
              maxWidth: 320,
              borderRadius: 12,
              background: "#fff",
              padding: 8
            }}
          />

          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <a href="/deuna-qr.jpg?v=1" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Abrir QR
            </a>
            <a href="/deuna-qr.jpg?v=1" download="deuna-qr.jpg" className="btn btn-ghost">
              Descargar QR
            </a>
          </div>

          {/* Si quieres mostrar el número en texto:
          <p className="muted" style={{ marginTop: 8 }}>
            También puedes usar el número de cuenta Deuna: <b>******0650</b>
          </p>
          */}
        </div>
      </section>

      {/* Subir comprobante (opcional, requiere /api/upload configurado) */}
      <section className="card">
        <h3 style={{ fontWeight: 900, marginTop: 0 }}>Validación del pago</h3>
        <p className="muted" style={{ marginBottom: 10 }}>
          Sube una foto o PDF del comprobante para validarlo más rápido.
        </p>

        <form ref={formRef} onSubmit={onSubmit} className="space-y-3">
          <div className="item-card" style={{ padding: 12 }}>
            <div style={{ display: "grid", gap: 10, width: "100%" }}>
              <input name="user_name" type="text" placeholder="Tu nombre (opcional)" className="item-card" />
              <input name="user_email" type="email" placeholder="Tu correo (opcional)" className="item-card" />
              <textarea name="message" placeholder="Mensaje (opcional)" className="item-card" rows={3} />
              <div className="item-card" style={{ padding: 10 }}>
                <input type="file" name="file" accept="image/*,application/pdf" required />
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={sending}>
            {sending ? "Enviando..." : "Enviar comprobante"}
          </button>
        </form>

        {status && <div className="card" style={{ marginTop: 12 }}>{status}</div>}
      </section>
    </div>
  );
}
