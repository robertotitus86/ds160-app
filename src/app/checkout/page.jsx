"use client";
import { useMemo, useState } from "react";

const ITEMS = [
  { id: "form", name: "Llenado de formulario DS-160", price: 3000 }, // 30.00
  { id: "cita", name: "Toma de cita", price: 1000 },                   // 10.00
  { id: "full", name: "Asesoría completa", price: 2500 },              // 25.00
];

export default function CheckoutPage() {
  const [selected, setSelected] = useState(["form"]);
  const [method, setMethod] = useState("payphone"); // payphone | transferencia

  const subtotal = useMemo(
    () => selected.reduce((acc, id) => acc + (ITEMS.find(i => i.id === id)?.price || 0), 0),
    [selected]
  );

  // +6% si PayPhone
  const fee = useMemo(() => (method === "payphone" ? Math.round(subtotal * 0.06) : 0), [method, subtotal]);
  const total = subtotal + fee;

  const handleToggle = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  async function pagar() {
    if (method === "transferencia") {
      window.location.href = "/transferencia";
      return;
    }

    if (!total) {
      alert("Selecciona al menos un servicio.");
      return;
    }

    try {
      const resp = await fetch("/api/payphone/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total, // en centavos
          reference: `DS160-${Date.now()}`,
          description: "Servicios DS-160",
          responseUrl: `${window.location.origin}/checkout/confirm`,
          cancelUrl: `${window.location.origin}/checkout/cancel`,
        }),
      });

      const data = await resp.json();
      if (!resp.ok) {
        console.error("Error PayPhone:", data);
        alert("No se pudo generar el link de pago.");
        return;
      }

      const url = data.checkoutUrl || data.payWithPayPhoneUrl || data.url || data.link;
      if (!url) {
        console.log("Respuesta PayPhone:", data);
        alert("Se creó el link, pero PayPhone no devolvió una URL de pago.");
        return;
      }

      window.location.href = url;
    } catch (e) {
      console.error(e);
      alert("Error inesperado iniciando el pago.");
    }
  }

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "32px" }}>
      <h1>Asistente DS-160</h1>

      <section style={{ marginTop: 24 }}>
        <h2>Servicios</h2>
        {ITEMS.map(item => (
          <label key={item.id} style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            border: "1px solid #2d3748",
            padding: "12px 16px",
            borderRadius: 10,
            marginBottom: 10,
            background: "#0f1623"
          }}>
            <span>
              <input
                type="checkbox"
                checked={selected.includes(item.id)}
                onChange={() => handleToggle(item.id)}
                style={{ marginRight: 10 }}
              />
              {item.name}
            </span>
            <strong>${(item.price / 100).toFixed(2)}</strong>
          </label>
        ))}
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Total</h2>
        <div style={{ fontSize: 18 }}>
          Subtotal: <strong>${(subtotal / 100).toFixed(2)}</strong>
          {method === "payphone" && (
            <span style={{ marginLeft: 12 }}>
              +6%: <strong>${(fee / 100).toFixed(2)}</strong>
            </span>
          )}
          <div style={{ fontSize: 22, marginTop: 6 }}>
            Total: <strong>${(total / 100).toFixed(2)}</strong>
          </div>
          {method === "payphone" && (
            <div style={{ marginTop: 6, opacity: 0.8 }}>
              * Con PayPhone se agrega +6%. Pagarás <strong>${(total / 100).toFixed(2)}</strong>.
            </div>
          )}
        </div>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Método de pago</h2>
        <label style={{ marginRight: 20 }}>
          <input
            type="radio"
            name="metodo"
            checked={method === "payphone"}
            onChange={() => setMethod("payphone")}
          />{" "}
          PayPhone
        </label>
        <label>
          <input
            type="radio"
            name="metodo"
            checked={method === "transferencia"}
            onChange={() => setMethod("transferencia")}
          />{" "}
          Transferencia
        </label>
      </section>

      <button
        onClick={pagar}
        style={{
          marginTop: 24,
          background: "#7c3aed",
          color: "white",
          padding: "12px 18px",
          borderRadius: 10,
          border: "none",
          fontWeight: 700,
          cursor: "pointer"
        }}
      >
        {method === "payphone"
          ? `Pagar $${(total / 100).toFixed(2)} con PayPhone`
          : "Ver datos de transferencia"}
      </button>
    </main>
  );
}
