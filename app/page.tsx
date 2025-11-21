"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type PlanId = "llenado" | "asesoria" | "cita";

const PLANS: {
  id: PlanId;
  title: string;
  price: number;
  short: string;
  badge?: string;
}[] = [
  {
    id: "llenado",
    title: "Llenado DS-160",
    price: 45,
    short:
      "Te guiamos paso a paso y nuestro equipo completa tu DS-160 en el portal oficial.",
    badge: "Más elegido",
  },
  {
    id: "asesoria",
    title: "Asesoría Entrevista",
    price: 35,
    short:
      "Simulación de entrevista, preguntas frecuentes y recomendaciones personalizadas.",
  },
  {
    id: "cita",
    title: "Toma de Cita",
    price: 15,
    short:
      "Te ayudamos a programar tu cita (requiere DS-160 listo). Revisión de datos clave.",
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
  btnPrimary: {
    background: "#2563eb",
    borderRadius: 999,
    border: "none",
    padding: "9px 16px",
    color: "#ffffff",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 14,
  } as React.CSSProperties,
  btnOutline: {
    background: "#ffffff",
    borderRadius: 999,
    border: "1px solid #d1d5db",
    padding: "9px 16px",
    color: "#111827",
    fontWeight: 500,
    cursor: "pointer",
    fontSize: 14,
  } as React.CSSProperties,
  btnGhost: {
    borderRadius: 999,
    border: "none",
    padding: "6px 12px",
    background: "#f3f4f6",
    cursor: "pointer",
    fontSize: 12,
    color: "#374151",
  } as React.CSSProperties,
  badge: {
    fontSize: 11,
    padding: "3px 8px",
    borderRadius: 999,
    background: "#eff6ff",
    color: "#1d4ed8",
    fontWeight: 600,
  } as React.CSSProperties,
  plansGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
    gap: 16,
  } as React.CSSProperties,
  planCard: {
    background: "#ffffff",
    borderRadius: 16,
    border: "1px solid #e5e7eb",
    padding: 18,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  } as React.CSSProperties,
  price: {
    fontSize: 18,
    fontWeight: 700,
  } as React.CSSProperties,
  cartBar: {
    background: "#eff6ff",
    borderRadius: 999,
    padding: "10px 14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    border: "1px solid #bfdbfe",
  } as React.CSSProperties,
  cartLeft: {
    display: "flex",
    flexDirection: "column",
    fontSize: 13,
    gap: 2,
  } as React.CSSProperties,
  cartItems: {
    fontWeight: 500,
  } as React.CSSProperties,
  heroRow: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 16,
  } as React.CSSProperties,
  heroButtonsRow: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: 10,
    marginTop: 8,
  } as React.CSSProperties,
};

export default function LandingPage() {
  const router = useRouter();
  const [cart, setCart] = useState<PlanId[]>([]);

  // Cargar carrito desde localStorage
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const raw = window.localStorage.getItem("ds160_cart");
      if (raw) {
        const parsed = JSON.parse(raw) as string[];
        const valid = parsed.filter((id) =>
          ["llenado", "asesoria", "cita"].includes(id)
        ) as PlanId[];
        setCart(valid);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Guardar carrito
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      window.localStorage.setItem("ds160_cart", JSON.stringify(cart));
    } catch {
      /* ignore */
    }
  }, [cart]);

  const total = useMemo(
    () =>
      cart.reduce((acc, id) => {
        const plan = PLANS.find((p) => p.id === id);
        return acc + (plan?.price ?? 0);
      }, 0),
    [cart]
  );

  function handleAdd(id: PlanId) {
    setCart((prev) => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
  }

  function handleRemove(id: PlanId) {
    setCart((prev) => prev.filter((x) => x !== id));
  }

  function goToCheckout() {
    if (!cart.length) return;
    router.push("/checkout");
  }

  function quickBuy(id: PlanId) {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("ds160_cart", JSON.stringify([id]));
      }
    } catch {
      /* ignore */
    }
    router.push(`/checkout?plans=${id}`);
  }

  const cartLabel =
    cart.length === 0
      ? "No has agregado servicios todavía."
      : cart
          .map((id) => {
            const plan = PLANS.find((p) => p.id === id);
            return plan ? `${plan.title} — $${plan.price} USD` : id;
          })
          .join(" · ");

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {/* Tu selección */}
      <section style={styles.sectionCard}>
        <h2 style={styles.h2}>Tu selección</h2>
        <p style={styles.pMuted}>
          Revisa los servicios que vas a contratar antes de ir al checkout.
        </p>

        <div style={styles.cartBar}>
          <div style={styles.cartLeft}>
            <span style={styles.cartItems}>{cartLabel}</span>
            <span style={{ fontSize: 12, color: "#4b5563" }}>
              Total:{" "}
              <b>
                ${total} USD
              </b>
            </span>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {cart.length > 0 && (
              <button
                type="button"
                style={styles.btnPrimary}
                onClick={goToCheckout}
              >
                Ir a Checkout
              </button>
            )}
            {cart.length > 0 && (
              <button
                type="button"
                style={styles.btnGhost}
                onClick={() => setCart([])}
              >
                Vaciar
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Hero explicativo */}
      <section style={styles.sectionCard}>
        <div style={styles.heroRow}>
          <div>
            <h2 style={styles.h2}>Tu DS-160 guiado, fácil y seguro</h2>
            <p style={styles.pMuted}>
              Responde en español con ayuda paso a paso. Al finalizar, nuestro
              equipo completa tu DS-160 en el portal oficial y te acompaña con
              la cita y la entrevista.
            </p>
          </div>

          <div style={styles.heroButtonsRow}>
            <button
              type="button"
              style={styles.btnPrimary}
              onClick={() => {
                handleAdd("llenado");
                goToCheckout();
              }}
            >
              Comenzar ahora
            </button>
            <button
              type="button"
              style={styles.btnOutline}
              onClick={() => router.push("/wizard")}
            >
              Ver ejemplo del asistente
            </button>
          </div>

          <p
            style={{
              margin: "4px 0 0",
              fontSize: 11,
              color: "#6b7280",
            }}
          >
            No somos el sitio oficial de la Embajada. Usamos tu información
            únicamente para ayudarte a completar el formulario.
          </p>
        </div>
      </section>

      {/* Planes */}
      <section style={styles.sectionCard}>
        <h2 style={styles.h2}>Planes</h2>
        <p style={styles.pMuted}>
          Puedes contratar solo el llenado del DS-160 o complementar con
          asesoría para tu entrevista y ayuda con la cita.
        </p>

        <div style={styles.plansGrid}>
          {PLANS.map((plan) => {
            const inCart = cart.includes(plan.id);
            return (
              <article key={plan.id} style={styles.planCard}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 8,
                  }}
                >
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: 16,
                        fontWeight: 600,
                      }}
                    >
                      {plan.title}
                    </h3>
                    <p
                      style={{
                        margin: "4px 0 0",
                        fontSize: 13,
                        color: "#4b5563",
                      }}
                    >
                      {plan.short}
                    </p>
                  </div>
                  {plan.badge && <span style={styles.badge}>{plan.badge}</span>}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  <div>
                    <div style={styles.price}>${plan.price} USD</div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                      alignItems: "flex-end",
                    }}
                  >
                    <div style={{ display: "flex", gap: 8 }}>
                      {!inCart ? (
                        <button
                          type="button"
                          style={styles.btnOutline}
                          onClick={() => handleAdd(plan.id)}
                        >
                          Agregar
                        </button>
                      ) : (
                        <button
                          type="button"
                          style={styles.btnGhost}
                          onClick={() => handleRemove(plan.id)}
                        >
                          Quitar
                        </button>
                      )}

                      <button
                        type="button"
                        style={styles.btnPrimary}
                        onClick={() => quickBuy(plan.id)}
                      >
                        Comprar rápido
                      </button>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        color: "#6b7280",
                        textAlign: "right" as const,
                      }}
                    >
                      Al pagar, revisamos los datos y te confirmamos por WhatsApp
                      o correo.
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

