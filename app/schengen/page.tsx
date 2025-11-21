"use client";

import React from "react";
import { useRouter } from "next/navigation";

type SchengenPlanId = "schengen_requisitos" | "schengen_llenado" | "schengen_completo";

const PLANS: {
  id: SchengenPlanId;
  title: string;
  price: number;
  short: string;
  badge?: string;
}[] = [
  {
    id: "schengen_requisitos",
    title: "Requisitos Schengen Express",
    price: 5,
    short:
      "Responde unas pocas preguntas y te entregamos una checklist clara de documentos según tu caso.",
    badge: "Entrada rápida",
  },
  {
    id: "schengen_llenado",
    title: "Llenado formulario Schengen",
    price: 40,
    short:
      "Te ayudamos a preparar la información y trasladarla al formulario oficial del país de destino.",
  },
  {
    id: "schengen_completo",
    title: "Acompañamiento completo Schengen",
    price: 70,
    short:
      "Incluye requisitos, llenado del formulario y guía para cita y presentación de documentos.",
    badge: "Más completo",
  },
];

const styles = {
  sectionCard: {
    background: "#ffffff",
    borderRadius: 16,
    border: "1px solid #e5e7eb",
    padding: 20,
    marginBottom: 16,
    boxShadow: "0 8px 18px rgba(15, 23, 42, 0.04)",
  } as React.CSSProperties,
  h1: {
    margin: "0 0 8px",
    fontSize: 22,
    fontWeight: 700,
  } as React.CSSProperties,
  h2: {
    margin: "0 0 8px",
    fontSize: 20,
    fontWeight: 700,
  } as React.CSSProperties,
  pMuted: {
    margin: "0 0 12px",
    fontSize: 13,
    color: "#6b7280",
  } as React.CSSProperties,
  plansGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 12,
  } as React.CSSProperties,
  planCard: {
    position: "relative",
    borderRadius: 16,
    border: "1px solid #e5e7eb",
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    background: "#ffffff",
  } as React.CSSProperties,
  badge: {
    position: "absolute",
    top: 10,
    right: 10,
    fontSize: 11,
    background: "#eff6ff",
    color: "#1d4ed8",
    padding: "4px 8px",
    borderRadius: 999,
    border: "1px solid #bfdbfe",
  } as React.CSSProperties,
  price: {
    fontSize: 16,
    fontWeight: 700,
  } as React.CSSProperties,
  btnPrimary: {
    background: "#2563eb",
    borderRadius: 999,
    border: "none",
    padding: "8px 16px",
    color: "#ffffff",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 14,
  } as React.CSSProperties,
  btnOutline: {
    background: "#ffffff",
    borderRadius: 999,
    border: "1px solid #d1d5db",
    padding: "8px 16px",
    color: "#111827",
    fontWeight: 500,
    cursor: "pointer",
    fontSize: 14,
  } as React.CSSProperties,
  heroGrid: {
    display: "grid",
    gap: 16,
  } as React.CSSProperties,
  bulletsList: {
    margin: 0,
    paddingLeft: 18,
    fontSize: 13,
    color: "#374151",
    display: "grid",
    gap: 4,
  } as React.CSSProperties,
} satisfies Record<string, React.CSSProperties>;

export default function SchengenLandingPage() {
  const router = useRouter();

  function goToWizard(plan?: SchengenPlanId) {
    const url = plan
      ? `/schengen/wizard?plan=${plan}`
      : "/schengen/wizard";
    router.push(url);
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <section style={styles.sectionCard}>
        <div style={styles.heroGrid}>
          <div>
            <h1 style={styles.h1}>
              Evita rechazos por documentos incompletos en tu visa Schengen
            </h1>
            <p style={styles.pMuted}>
              Te ayudamos a entender qué documentos necesitas, cómo presentarlos
              y cómo preparar la información que luego irá en el formulario oficial
              del país de destino.
            </p>
            <p style={styles.pMuted}>
              Esta plataforma es privada de acompañamiento. No es el sitio oficial
              de ningún consulado. Siempre debes verificar los requisitos actualizados
              en la página del consulado correspondiente.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
              <button
                type="button"
                style={styles.btnPrimary}
                onClick={() => goToWizard("schengen_requisitos")}
              >
                Empezar con requisitos (5 USD)
              </button>
              <button
                type="button"
                style={styles.btnOutline}
                onClick={() => goToWizard()}
              >
                Ver opciones completas
              </button>
            </div>
          </div>

          <div>
            <h2 style={styles.h2}>¿Qué tipo de ayuda ofrecemos?</h2>
            <ul style={styles.bulletsList}>
              <li>Checklist personalizada de requisitos según tu caso.</li>
              <li>Guía para organizar reservas, seguros y medios económicos.</li>
              <li>Acompañamiento para preparar la información del formulario Schengen.</li>
            </ul>
          </div>
        </div>
      </section>

      <section style={styles.sectionCard}>
        <h2 style={styles.h2}>Planes para visa Schengen</h2>
        <p style={styles.pMuted}>
          Puedes empezar solo con los requisitos o avanzar directo al llenado del
          formulario y el acompañamiento completo.
        </p>

        <div style={styles.plansGrid}>
          {PLANS.map((plan) => (
            <article key={plan.id} style={styles.planCard}>
              {plan.badge && <span style={styles.badge}>{plan.badge}</span>}
              <div>
                <h3 style={{ margin: "0 0 4px", fontSize: 16 }}>{plan.title}</h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: "#4b5563",
                  }}
                >
                  {plan.short}
                </p>
              </div>
              <div
                style={{
                  marginTop: 8,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span style={styles.price}>${plan.price} USD</span>
                <button
                  type="button"
                  style={styles.btnOutline}
                  onClick={() => goToWizard(plan.id)}
                >
                  Empezar
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
