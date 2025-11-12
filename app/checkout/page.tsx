'use client';

import Image from 'next/image';
import React, { useEffect, useMemo, useRef, useState } from 'react';

type PlanId = 'llenado' | 'asesoria' | 'cita';
type Plan = { id: PlanId; title: string; price: number };

const PLANS: Plan[] = [
  { id: 'llenado', title: 'Llenado DS-160', price: 45 },
  { id: 'asesoria', title: 'Asesoría Entrevista', price: 35 },
  { id: 'cita', title: 'Toma de Cita', price: 15 },
];

const styles = {
  section: {
    background: '#0f1629',
    border: '1px solid #0b1220',
    borderRadius: 14,
    padding: 18,
  } as React.CSSProperties,
  h2: { margin: 0, marginBottom: 8 } as React.CSSProperties,
  small: { opacity: 0.8, fontSize: 14 } as React.CSSProperties,
  btn: {
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '10px 14px',
    cursor: 'pointer',
  } as React.CSSProperties,
  btnGhost: {
    background: '#334155',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '8px 12px',
    cursor: 'pointer',
  } as React.CSSProperties,
  muted: { opacity: 0.7 } as React.CSSProperties,
  card: {
    background: '#0b1220',
    border: '1px solid #0f172a',
    borderRadius: 12,
    padding: 14,
  } as React.CSSProperties,
};

export default function CheckoutPage() {
  const [cart, setCart] = useState<PlanId[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('ds160_cart');
      if (raw) {
        const arr = JSON.parse(raw) as PlanId[];
        setCart(arr.filter((x) => ['llenado', 'asesoria', 'cita'].includes(x)));
      }
    } catch {}
  }, []);

  const total = useMemo(() => {
    const map = new Map<PlanId, number>();
    PLANS.forEach((p) => map.set(p.id, p.price));
    return cart.reduce((acc, pid) => acc + (map.get(pid) || 0), 0);
  }, [cart]);

  function removePlan(p: PlanId) {
    const next = cart.filter((x) => x !== p);
    setCart(next);
    localStorage.setItem('ds160_cart', JSON.stringify(next));
  }

  const fileRef = useRef<HTMLInputElement>(null);
  const [sending, setSending] = useState(false);

  async function submitReceipt() {
    if (!cart.length) {
      alert('Agrega al menos un servicio antes de continuar.');
      return;
    }
    const file = fileRef.current?.files?.[0];
    if (!file) {
      alert('Sube tu comprobante de pago (imagen o PDF).');
      return;
    }
    try {
      setSending(true);
      const form = new FormData();
      form.append('receipt', file);
      form.append('plans', cart.join(','));

      const res = await fetch('/api/orders/create', { method: 'POST', body: form });
      const data = await res.json();
      if (!data.ok) throw new Error(data?.error || 'No se pudo crear la orden.');

      const mark = await fetch('/api/mark-paid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: data.orderId }),
      });
      const mk = await mark.json();
      if (!mk.ok) throw new Error('No se pudo marcar el pago.');

      alert(`¡Gracias! Pago confirmado.\nID de pedido: ${data.orderId}\nAhora podrás acceder al asistente.`);
      window.location.href = '/wizard';
    } catch (e: any) {
      alert(e?.message || 'Error al enviar el comprobante.');
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {/* Carrito */}
      <section style={styles.section}>
        <h2 style={styles.h2}>Checkout</h2>
        <div>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Servicios</div>
          {cart.length === 0 ? (
            <p style={{ ...styles.muted, marginTop: 8 }}>No has seleccionado servicios todavía.</p>
          ) : (
            <div style={{ display: 'grid', gap: 10 }}>
              {cart.map((pid) => {
                const p = PLANS.find((x) => x.id === pid)!;
                return (
                  <div
                    key={pid}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: '#0b1220',
                      border: '1px solid #0f172a',
                      borderRadius: 10,
                      padding: '10px 12px',
                    }}
                  >
                    <div>
                      <b>{p.title}</b> — <span style={{ color: '#93c5fd' }}>${p.price} USD</span>
                    </div>
                    <button onClick={() => removePlan(pid)} style={styles.btnGhost}>
                      Quitar
                    </button>
                  </div>
                );
              })}
              <div style={{ textAlign: 'right', marginTop: 4 }}>
                <b>Total:</b> ${total} USD
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Pago */}
      <section style={styles.section}>
        <h3 style={styles.h2}>Sube tu comprobante para continuar</h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 320px) 1fr', gap: 16 }}>
          <div style={{ ...styles.card, display: 'grid', gap: 12 }}>
            <div style={{ fontWeight: 700 }}>Transferencia / Deuna</div>
            <div style={{ textAlign: 'center', fontSize: 14, color: '#93c5fd' }}>Escanea para pagar con Deuna</div>

            <div
              style={{
                borderRadius: 12,
                overflow: 'hidden',
                border: '1px solid #0f172a',
                background: '#0b1220',
                display: 'grid',
                placeItems: 'center',
                padding: 8,
              }}
            >
              <Image
                src="/deuna-qr.png"
                alt="QR Deuna"
                width={200}
                height={200}
                style={{ width: '100%', height: 'auto', maxWidth: 200 }}
                priority
              />
            </div>

            <div style={{ fontSize: 14, lineHeight: 1.5 }}>
              <div>
                <b>Número de cuenta:</b> 2200449871{' '}
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText('2200449871');
                    alert('Número de cuenta copiado');
                  }}
                  style={{ ...styles.btnGhost, padding: '4px 8px', marginLeft: 8 }}
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
            </div>
          </div>

          <div style={{ display: 'grid', gap: 12 }}>
            <div style={styles.card}>
              <ol style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>
                <li>Abre tu app Deuna o banco y escanea el QR o usa el número de cuenta.</li>
                <li>Coloca el <b>mismo total</b> indicado arriba y confirma.</li>
                <li>Sube abajo tu comprobante (imagen o PDF) y confirma.</li>
              </ol>
            </div>

            <div style={styles.card}>
              <div style={{ fontWeight: 700, marginBottom: 10 }}>Comprobante de pago (imagen o PDF)</div>
              <input ref={fileRef} type="file" accept="image/*,.pdf" />
              <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button onClick={submitReceipt} style={styles.btn} disabled={sending || !cart.length}>
                  {sending ? 'Confirmando...' : 'Confirmar pago y continuar'}
                </button>
                <a href="/" style={{ ...styles.btnGhost, textDecoration: 'none', display: 'inline-block' }}>
                  Seguir comprando
                </a>
              </div>
              <div style={{ ...styles.small, marginTop: 8 }}>
                Al confirmar, generaremos tu <b>ID de pedido</b>, marcaremos tu acceso y podrás completar el asistente.
              </div>
            </div>
          </div>
        </div>

        {/* Otros métodos */}
        <div
          style={{
            marginTop: 16,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 12,
          }}
        >
          <div style={styles.card}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Transferencia / Deuna</div>
            <div style={{ ...styles.small, marginBottom: 10 }}>
              Método disponible. Usa el QR o el número de cuenta y sube tu comprobante.
            </div>
            <button style={styles.btn} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              Usar transferencia
            </button>
          </div>

          <div style={{ ...styles.card, opacity: 0.6 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>PayPal</div>
            <div style={{ ...styles.small, marginBottom: 10 }}>Próximamente</div>
            <button style={{ ...styles.btnGhost, cursor: 'not-allowed' }} disabled>
              Próximamente
            </button>
          </div>

          <div style={{ ...styles.card, opacity: 0.6 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>2Checkout (Tarjeta)</div>
            <div style={{ ...styles.small, marginBottom: 10 }}>Próximamente</div>
            <button style={{ ...styles.btnGhost, cursor: 'not-allowed' }} disabled>
              Próximamente
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
