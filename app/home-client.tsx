'use client';

import { useEffect, useMemo, useState } from 'react';

type PlanId = 'llenado' | 'asesoria' | 'cita';

const PRICES: Record<PlanId, number> = { llenado: 45, asesoria: 35, cita: 15 };
const TITLES: Record<PlanId, string> = {
  llenado: 'Llenado DS-160',
  asesoria: 'Asesoría Entrevista',
  cita: 'Toma de Cita',
};

export default function HomeClient() {
  // ---------- estilos ----------
  const card: React.CSSProperties = {
  background: "#ffffff",
  padding: 18,
  borderRadius: 14,
  border: "1px solid #e5e7eb",
  boxShadow: "0 1px 2px rgba(15,23,42,0.06)",
};
  const btn: React.CSSProperties = {
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '10px 14px',
    textDecoration: 'none',
    display: 'inline-block',
    cursor: 'pointer',
  };
  const ghost: React.CSSProperties = {
    background: '#334155',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '10px 14px',
    textDecoration: 'none',
    display: 'inline-block',
    cursor: 'pointer',
  };
  const softBox: React.CSSProperties = {
    background: '#0b1220',
    border: '1px solid #1f2937',
    borderRadius: 12,
  };

  // ---------- carrito ----------
  const [cart, setCart] = useState<PlanId[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('ds160_cart');
      if (raw) setCart(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('ds160_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  const total = useMemo(
    () => cart.reduce((sum, id) => sum + (PRICES[id] || 0), 0),
    [cart]
  );

  function addItem(id: PlanId) {
    setCart((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }

  function removeItem(id: PlanId) {
    setCart((prev) => prev.filter((x) => x !== id));
  }

  function goCheckout() {
    const plans = cart.join(',');
    if (plans.length) {
      window.location.href = `/checkout?plans=${encodeURIComponent(plans)}`;
    } else {
      window.location.href = '/checkout';
    }
  }

  function buyNow(id: PlanId) {
    const plans = cart.length ? cart.join(',') : id;
    window.location.href = `/checkout?plans=${encodeURIComponent(plans as any)}`;
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {/* Barra de selección */}
      <section style={{ ...card, display: 'grid', gap: 10 }}>
        <h2 style={{ margin: 0 }}>Tu selección</h2>

        {cart.length === 0 ? (
          <p style={{ margin: 0, opacity: 0.85 }}>
            No has seleccionado servicios todavía.
          </p>
        ) : (
          <>
            <div style={{ display: 'grid', gap: 8 }}>
              {cart.map((id) => (
                <div
                  key={id}
                  style={{
                    ...softBox,
                    padding: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 10,
                  }}
                >
                  <span>
                    {TITLES[id]} — <b>${PRICES[id]} USD</b>
                  </span>
                  <button
                    onClick={() => removeItem(id)}
                    style={{
                      ...ghost,
                      padding: '6px 10px',
                      borderRadius: 8,
                      background: '#3b4252',
                    }}
                  >
                    Quitar
                  </button>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <b>Total: ${total} USD</b>
              <button onClick={goCheckout} style={btn}>
                Ir a Checkout
              </button>
            </div>
          </>
        )}
      </section>

      {/* Hero */}
      <section style={card}>
        <h1 style={{ margin: '0 0 8px' }}>Tu DS-160 guiado, fácil y seguro</h1>
        <p style={{ opacity: 0.9, marginTop: 0 }}>
          Responde paso a paso con ayudas en español. Al finalizar, nuestro
          equipo <b>completa tu DS-160 en el portal oficial</b> y te acompaña
          con la cita y la entrevista.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={goCheckout} style={btn}>
            Comenzar ahora
          </button>
          <a href="/wizard" style={ghost} title="Requiere pago">
            Ver ejemplo del asistente
          </a>
        </div>
      </section>

      {/* Planes */}
      <section style={card}>
        <h2 style={{ marginTop: 0 }}>Planes</h2>
        <div
          style={{
            display: 'grid',
            gap: 12,
            gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
          }}
        >
          {/* Llenado */}
          <article style={{ ...softBox, padding: 16 }}>
            <h3 style={{ marginTop: 0 }}>{TITLES.llenado}</h3>
            <p>Te guiamos y nuestro equipo llena el formulario oficial.</p>
            <p>
              <b>${PRICES.llenado} USD</b>
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button onClick={() => addItem('llenado')} style={btn}>
                Agregar
              </button>
              <button onClick={() => buyNow('llenado')} style={ghost}>
                Comprar rápido
              </button>
            </div>
          </article>

          {/* Asesoría */}
          <article style={{ ...softBox, padding: 16 }}>
            <h3 style={{ marginTop: 0 }}>{TITLES.asesoria}</h3>
            <p>Simulación por Zoom y consejos reales para tu cita.</p>
            <p>
              <b>${PRICES.asesoria} USD</b>
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button onClick={() => addItem('asesoria')} style={btn}>
                Agregar
              </button>
              <button onClick={() => buyNow('asesoria')} style={ghost}>
                Comprar rápido
              </button>
            </div>
          </article>

          {/* Cita */}
          <article style={{ ...softBox, padding: 16 }}>
            <h3 style={{ marginTop: 0 }}>{TITLES.cita}</h3>
            <p>Programamos tu cita (requiere DS-160 listo).</p>
            <p>
              <b>${PRICES.cita} USD</b>
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button onClick={() => addItem('cita')} style={btn}>
                Agregar
              </button>
              <button onClick={() => buyNow('cita')} style={ghost}>
                Comprar rápido
              </button>
            </div>
          </article>
        </div>
      </section>

      {/* Cómo funciona */}
      <section style={card}>
        <h2 style={{ marginTop: 0 }}>¿Cómo funciona?</h2>
        <ol style={{ marginTop: 0 }}>
          <li>Elige uno o varios servicios y realiza el pago.</li>
          <li>Acceso inmediato al asistente DS-160 (wizard).</li>
          <li>Respondes en español con ayudas y validaciones.</li>
          <li>
            Nos envías tus respuestas y <b>nosotros llenamos el DS-160</b>.
          </li>
        </ol>
      </section>
    </div>
  );
}
