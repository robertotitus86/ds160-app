'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const PRICES: Record<string, number> = { llenado: 45, asesoria: 35, cita: 15 };
const TITLES: Record<string, string> = {
  llenado: 'Llenado DS-160',
  asesoria: 'Asesoría Entrevista',
  cita: 'Toma de Cita',
};

const css = {
  card: { background: '#0f172a', padding: 18, borderRadius: 14, border: '1px solid #111827' },
  soft: { background: '#0b1220', border: '1px solid #1f2937', borderRadius: 12 },
  btn: { background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 14px', cursor: 'pointer' } as React.CSSProperties,
  ghost: { background: '#334155', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 14px', cursor: 'pointer' } as React.CSSProperties,
  input: { width: '100%', padding: 10, borderRadius: 8, border: '1px solid #1f2937', background: '#0b1220', color: '#fff' } as React.CSSProperties,
  label: { fontSize: 13, opacity: 0.9 },
  error: { background: '#7f1d1d', border: '1px solid #b91c1c', color: '#fff', padding: '10px 12px', borderRadius: 10 },
};

function CheckoutInner() {
  const params = useSearchParams();
  const router = useRouter();

  // ---- carrito desde URL ?plan= o ?plans=a,b ----
  const one = params.get('plan');
  const many = params.get('plans');
  const fromURL = useMemo(
    () => (many ? many.split(',').filter(Boolean) : one ? [one] : []),
    [one, many]
  );

  const [items, setItems] = useState<string[]>([]);
  const total = items.reduce((acc, id) => acc + (PRICES[id] || 0), 0);

  // ---- estados de validación / pago ----
  const [errors, setErrors] = useState<string[]>([]);

  // método elegido: 'deuna' | 'transferencia'
  const [method, setMethod] = useState<'deuna' | 'transferencia'>('deuna');

  // Deuna
  const [deunaChecked, setDeunaChecked] = useState(false);
  const [deunaRef, setDeunaRef] = useState('');
  const [deunaFile, setDeunaFile] = useState<File | null>(null);

  // Transferencia
  const [transRef, setTransRef] = useState('');
  const [transFile, setTransFile] = useState<File | null>(null);
  const [transConfirm, setTransConfirm] = useState(false);

  const [marking, setMarking] = useState(false);

  useEffect(() => {
    if (fromURL.length) {
      setItems(fromURL);
      return;
    }
    try {
      const raw = localStorage.getItem('ds160_cart');
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, [fromURL.join(',')]);

  // Utilidades
  function makeOrderId() {
    const ts = new Date();
    return `DS160-${ts.getFullYear()}${String(ts.getMonth() + 1).padStart(2, '0')}${String(ts.getDate()).padStart(2, '0')}-${String(
      ts.getHours()
    ).padStart(2, '0')}${String(ts.getMinutes()).padStart(2, '0')}${String(ts.getSeconds()).padStart(2, '0')}`;
  }

  function copy(text: string) {
    navigator.clipboard?.writeText(text);
  }

  // ---- VALIDACIÓN ANTES DE MARCAR PAGO ----
  function validate(): string[] {
    const out: string[] = [];

    if (!items.length) out.push('No hay servicios en el carrito.');
    if (!total || total <= 0) out.push('El total no es válido.');

    if (method === 'deuna') {
      if (!deunaChecked) out.push('Marca la casilla "Pagué con Deuna (QR)".');
      if (!deunaRef && !deunaFile) out.push('En Deuna indica un número de referencia o adjunta el comprobante.');
    }

    if (method === 'transferencia') {
      if (!transConfirm) out.push('Confirma que realizaste la transferencia.');
      if (!transRef && !transFile) out.push('En Transferencia pega el número de referencia o adjunta el comprobante.');
    }

    return out;
  }

  async function markPaidAndGo() {
    const v = validate();
    if (v.length) {
      setErrors(v);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      setErrors([]);
      setMarking(true);

      const orderId = makeOrderId();

      // Guardamos info útil para que la veas luego (no sube archivos al servidor)
      const payload = {
        order_id: orderId,
        items,
        total,
        method,
        deuna_ref: deunaRef || null,
        deuna_file: deunaFile?.name || null,
        trans_ref: transRef || null,
        trans_file: transFile?.name || null,
        ts: new Date().toISOString(),
      };
      localStorage.setItem('order_id', orderId);
      localStorage.setItem('ds160_cart', JSON.stringify(items));
      localStorage.setItem('payment_meta', JSON.stringify(payload));

      // Marca cookie paid=true para liberar /wizard
      const res = await fetch('/api/mark-paid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      if (!res.ok) throw new Error('No se pudo confirmar el pago.');

      alert(`¡Gracias! Pago confirmado.\nID de pedido: ${orderId}\nAccederás al asistente para completar tus datos.`);
      router.push('/wizard');
    } catch (e: any) {
      setErrors([e?.message || 'Error al confirmar el pago.']);
    } finally {
      setMarking(false);
    }
  }

  if (!items.length) {
    return (
      <div style={css.card}>
        <h2>Checkout</h2>
        <p>No hay servicios seleccionados.</p>
        <a href="/" style={css.btn as React.CSSProperties}>Volver a servicios</a>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {/* ERRORES */}
      {errors.length > 0 && (
        <div style={css.error}>
          <b>Revisa antes de continuar:</b>
          <ul style={{ margin: '6px 0 0 18px' }}>
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Resumen */}
      <section style={css.card}>
        <h2 style={{ marginTop: 0 }}>Checkout</h2>
        <ul style={{ margin: '6px 0 12px 18px' }}>
          {items.map((id) => (
            <li key={id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>{TITLES[id] || id}</span>
              <span>—</span>
              <b>${PRICES[id]} USD</b>
              <button
                onClick={() => setItems(items.filter((x) => x !== id))}
                style={{ marginLeft: 8, background: '#334155', color: '#fff', border: 'none', borderRadius: 8, padding: '4px 8px', cursor: 'pointer' }}
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

      {/* Selector de método */}
      <section style={css.card}>
        <h3 style={{ marginTop: 0 }}>Elige cómo pagaste</h3>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={() => setMethod('deuna')}
            style={{ ...(method === 'deuna' ? css.btn : css.ghost) }}
          >
            Deuna (QR)
          </button>
          <button
            onClick={() => setMethod('transferencia')}
            style={{ ...(method === 'transferencia' ? css.btn : css.ghost) }}
          >
            Transferencia bancaria
          </button>
        </div>
      </section>

      {/* Deuna */}
      {method === 'deuna' && (
        <section style={{ ...css.card, display: 'grid', gap: 12 }}>
          <h3 style={{ margin: 0 }}>Paga con Deuna (QR)</h3>

          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', alignItems: 'center' }}>
            <div style={{ ...css.soft, padding: 14, display: 'grid', placeItems: 'center' }}>
              <img
                src="/deuna-qr.png"
                alt="QR Deuna"
                style={{ width: '220px', height: 'auto', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,.35)' }}
              />
            </div>
            <div style={{ display: 'grid', gap: 10 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" checked={deunaChecked} onChange={(e) => setDeunaChecked(e.target.checked)} />
                <span>Confirmo que pagué con Deuna (QR)</span>
              </label>

              <div>
                <div style={css.label}>Número de referencia (recomendado)</div>
                <input
                  style={css.input}
                  value={deunaRef}
                  onChange={(e) => setDeunaRef(e.target.value)}
                  placeholder="Ej.: 123456 / últimos 4 dígitos / referencia de la app"
                />
              </div>

              <div>
                <div style={css.label}>Adjuntar comprobante (opcional)</div>
                <input
                  type="file"
                  onChange={(e) => setDeunaFile(e.target.files?.[0] || null)}
                  style={css.input}
                />
                {deunaFile && <small style={{ opacity: 0.75 }}>Archivo: {deunaFile.name}</small>}
              </div>

              <small style={{ opacity: 0.75 }}>
                Después de confirmar, guardaremos tu <b>ID de pedido</b> y podrás acceder al asistente.
              </small>
            </div>
          </div>
        </section>
      )}

      {/* Transferencia */}
      {method === 'transferencia' && (
        <section style={css.card}>
          <h3 style={{ marginTop: 0 }}>Transferencia bancaria</h3>

          <div style={{ ...css.soft, padding: 14, display: 'grid', gap: 12 }}>
            <div style={{ opacity: 0.8, fontSize: 13 }}>Datos para transferencia</div>
            <div style={{ display: 'grid', gap: 6 }}>
              <div>
                <b>Número de cuenta:</b> 2200449871
                <button
                  onClick={() => copy('2200449871')}
                  style={{ marginLeft: 8, background: '#334155', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 8px', cursor: 'pointer' }}
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

            <div>
              <div style={css.label}>Número de referencia (o adjunta el comprobante)</div>
              <input
                style={css.input}
                value={transRef}
                onChange={(e) => setTransRef(e.target.value)}
                placeholder="Ej.: 987654 / referencia del banco"
              />
            </div>

            <div>
              <div style={css.label}>Sube tu comprobante (opcional si pegaste la referencia)</div>
              <input
                type="file"
                onChange={(e) => setTransFile(e.target.files?.[0] || null)}
                style={css.input}
              />
              {transFile && <small style={{ opacity: 0.75 }}>Archivo: {transFile.name}</small>}
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" checked={transConfirm} onChange={(e) => setTransConfirm(e.target.checked)} />
              <span>Confirmo que realicé la transferencia por el total indicado</span>
            </label>
          </div>
        </section>
      )}

      {/* Acciones */}
      <section style={css.card}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <a href="/" style={css.ghost}>Seguir comprando</a>
          <button onClick={markPaidAndGo} style={css.btn} disabled={marking}>
            {marking ? 'Confirmando…' : 'Ya pagué, acceder al asistente'}
          </button>
        </div>
        <small style={{ opacity: 0.7, display: 'block', marginTop: 10 }}>
          Al confirmar, generaremos tu <b>ID de pedido</b>, marcaremos tu acceso y podrás completar el asistente.
        </small>
      </section>
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

