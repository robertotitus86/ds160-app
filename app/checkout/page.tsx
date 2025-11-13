'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const PRICES: Record<string, number> = {
  llenado: 45,
  asesoria: 35,
  cita: 15,
};

const TITLES: Record<string, string> = {
  llenado: 'Llenado DS-160',
  asesoria: 'Asesoría Entrevista',
  cita: 'Toma de Cita',
};

type Method = 'deuna' | 'transferencia' | 'paypal_soon' | 'card_soon';

const css = {
  card: {
    background: '#0f172a',
    padding: 18,
    borderRadius: 14,
    border: '1px solid #111827',
  } as React.CSSProperties,
  soft: {
    background: '#0b1220',
    border: '1px solid #1f2937',
    borderRadius: 12,
  } as React.CSSProperties,
  btn: {
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '10px 14px',
    cursor: 'pointer',
    fontWeight: 600,
  } as React.CSSProperties,
  ghost: {
    background: '#334155',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '10px 14px',
    cursor: 'pointer',
    fontWeight: 500,
  } as React.CSSProperties,
  input: {
    width: '100%',
    padding: 10,
    borderRadius: 8,
    border: '1px solid #1f2937',
    background: '#020617',
    color: '#e5e7eb',
    fontSize: 14,
  } as React.CSSProperties,
  label: {
    fontSize: 13,
    opacity: 0.9,
    marginBottom: 4,
    display: 'inline-block',
  } as React.CSSProperties,
  error: {
    background: '#7f1d1d',
    border: '1px solid #b91c1c',
    color: '#fff',
    padding: '10px 12px',
    borderRadius: 10,
  } as React.CSSProperties,
  ok: {
    background: '#064e3b',
    border: '1px solid #10b981',
    color: '#ecfdf5',
    padding: '10px 12px',
    borderRadius: 10,
  } as React.CSS_PROPERTIES,
  tabs: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap' as const,
  },
  tab: (active: boolean, disabled?: boolean) =>
    ({
      background: active ? '#2563eb' : '#334155',
      color: disabled ? 'rgba(255,255,255,.5)' : '#fff',
      border: 'none',
      borderRadius: 10,
      padding: '10px 14px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      position: 'relative',
      opacity: disabled ? 0.7 : 1,
      fontWeight: 500,
    }) as React.CSSProperties,
  soonBadge: {
    position: 'absolute' as const,
    top: -8,
    right: -8,
    background: '#f59e0b',
    color: '#111827',
    borderRadius: 8,
    padding: '2px 6px',
    fontSize: 10,
    fontWeight: 700,
  },
};

function CheckoutInner() {
  const params = useSearchParams();

  // carrito desde URL
  const one = params.get('plan');
  const many = params.get('plans');
  const fromURL = useMemo(
    () => (many ? many.split(',').filter(Boolean) : one ? [one] : []),
    [one, many]
  );

  const [items, setItems] = useState<string[]>([]);
  const total = items.reduce((acc, id) => acc + (PRICES[id] || 0), 0);

  // datos de contacto
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // errores / éxito
  const [errors, setErrors] = useState<string[]>([]);
  const [successMsg, setSuccessMsg] = useState('');

  // métodos
  const [method, setMethod] = useState<Method>('deuna');

  // Deuna
  const [deunaChecked, setDeunaChecked] = useState(false);
  const [deunaRef, setDeunaRef] = useState('');
  const [deunaFile, setDeunaFile] = useState<File | null>(null);

  // Transferencia
  const [transRef, setTransRef] = useState('');
  const [transFile, setTransFile] = useState<File | null>(null);
  const [transConfirm, setTransConfirm] = useState(false);

  const [sending, setSending] = useState(false);

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

  // utils
  function copy(text: string) {
    navigator.clipboard?.writeText(text);
  }

  function makeOrderId() {
    const ts = new Date();
    return `DS160-${ts.getFullYear()}${String(ts.getMonth() + 1).padStart(
      2,
      '0'
    )}${String(ts.getDate()).padStart(2, '0')}-${String(ts.getHours()).padStart(
      2,
      '0'
    )}${String(ts.getMinutes()).padStart(2, '0')}${String(
      ts.getSeconds()
    ).padStart(2, '0')}`;
  }

  // VALIDACIÓN
  function validate(): string[] {
    const out: string[] = [];
    if (!items.length) out.push('No hay servicios en el carrito.');
    if (!total || total <= 0) out.push('El total no es válido.');

    if (!name.trim()) out.push('Ingresa tu nombre.');
    if (!lastName.trim()) out.push('Ingresa tu apellido.');
    if (!phone.trim()) out.push('Ingresa tu número de WhatsApp o celular.');
    if (!email.trim()) out.push('Ingresa tu correo electrónico.');
    if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      out.push('El correo electrónico no tiene un formato válido.');
    }

    if (method === 'deuna') {
      if (!deunaChecked) out.push('Marca “Confirmo que pagué con Deuna (QR)”.');
      if (!deunaRef && !deunaFile)
        out.push('En Deuna ingresa una referencia o adjunta el comprobante.');
    }

    if (method === 'transferencia') {
      if (!transConfirm)
        out.push('Confirma que realizaste la transferencia por el total.');
      if (!transRef && !transFile)
        out.push(
          'En Transferencia pega la referencia del banco o adjunta el comprobante.'
        );
    }

    return out;
  }

  async function sendForReview() {
    const v = validate();
    if (v.length) {
      setErrors(v);
      setSuccessMsg('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      setSending(true);
      setErrors([]);
      setSuccessMsg('');

      const orderId = makeOrderId();

      const payload = {
        order_id: orderId,
        items,
        total,
        method: method as 'deuna' | 'transferencia',
        contact: {
          name: name.trim(),
          lastName: lastName.trim(),
          phone: phone.trim(),
          email: email.trim(),
        },
        deuna_ref: deunaRef || null,
        deuna_file_name: deunaFile?.name || null,
        trans_ref: transRef || null,
        trans_file_name: transFile?.name || null,
        ts: new Date().toISOString(),
      };

      localStorage.setItem('order_id', orderId);
      localStorage.setItem('ds160_cart', JSON.stringify(items));
      localStorage.setItem('payment_meta', JSON.stringify(payload));

      await fetch('/api/pending-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      setSuccessMsg(
        `✅ Recibimos tu solicitud de pago (#${orderId}). 
Nuestro equipo revisará el comprobante y te habilitará el acceso al asistente DS-160. 
Te contactaremos al WhatsApp ${phone.trim()} o al correo ${email.trim()}.`
      );
    } catch (e: any) {
      setErrors([
        e?.message || 'Error al enviar la solicitud. Intenta nuevamente.',
      ]);
    } finally {
      setSending(false);
    }
  }

  if (!items.length) {
    return (
      <div style={css.card}>
        <h2>Checkout</h2>
        <p>No hay servicios seleccionados.</p>
        <a href="/" style={css.btn}>
          Volver a servicios
        </a>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {/* ERRORES / OK */}
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
      {successMsg && (
        <div style={css.ok}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
            {successMsg}
          </pre>
        </div>
      )}

      {/* DATOS DE CONTACTO */}
      <section style={css.card}>
        <h2 style={{ marginTop: 0 }}>Tus datos de contacto</h2>
        <p style={{ fontSize: 13, opacity: 0.8 }}>
          Usaremos estos datos para enviarte el acceso al asistente y coordinar
          cualquier duda sobre tu DS-160.
        </p>
        <div
          style={{
            display: 'grid',
            gap: 12,
            gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
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
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ej.: nanotiendaec@gmail.com"
            />
          </div>
        </div>
      </section>

      {/* Resumen */}
      <section style={css.card}>
        <h3 style={{ marginTop: 0 }}>Resumen de tu compra</h3>
        <ul style={{ margin: '6px 0 12px 18px' }}>
          {items.map((id) => (
            <li
              key={id}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <span>{TITLES[id] || id}</span>
              <span>—</span>
              <b>${PRICES[id]} USD</b>
              <button
                onClick={() => setItems(items.filter((x) => x !== id))}
                style={{
                  marginLeft: 8,
                  background: '#334155',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '4px 8px',
                  cursor: 'pointer',
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

      {/* Tabs método */}
      <section style={css.card}>
        <h3 style={{ marginTop: 0 }}>Elige cómo pagaste</h3>
        <div style={css.tabs}>
          <button
            onClick={() => setMethod('deuna')}
            style={css.tab(method === 'deuna')}
          >
            Deuna (QR)
          </button>
          <button
            onClick={() => setMethod('transferencia')}
            style={css.tab(method === 'transferencia')}
          >
            Transferencia
          </button>

          <div style={{ position: 'relative' }}>
            <button style={css.tab(false, true)} aria-disabled>
              PayPal
            </button>
            <span style={css.soonBadge}>Próximamente</span>
          </div>

          <div style={{ position: 'relative' }}>
            <button style={css.tab(false, true)} aria-disabled>
              Tarjeta (2Checkout)
            </button>
            <span style={css.soonBadge}>Próximamente</span>
          </div>
        </div>
      </section>

      {/* Deuna */}
      {method === 'deuna' && (
        <section
          style={{
            ...css.card,
            display: 'grid',
            gap: 12,
          }}
        >
          <h3 style={{ margin: 0 }}>Paga con Deuna (QR)</h3>
          <div
            style={{
              display: 'grid',
              gap: 16,
              gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                ...css.soft,
                padding: 14,
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <img
                src="/deuna-qr.png"
                alt="QR Deuna"
                style={{
                  width: '220px',
                  height: 'auto',
                  borderRadius: '12px',
                  boxShadow: '0 8px 30px rgba(0,0,0,.35)',
                }}
              />
            </div>
            <div style={{ display: 'grid', gap: 10 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  checked={deunaChecked}
                  onChange={(e) => setDeunaChecked(e.target.checked)}
                />
                <span>Confirmo que pagué con Deuna (QR)</span>
              </label>
              <div>
                <div style={css.label}>Referencia (recomendado)</div>
                <input
                  style={css.input}
                  value={deunaRef}
                  onChange={(e) => setDeunaRef(e.target.value)}
                  placeholder="Ej.: código / referencia en la app"
                />
              </div>
              <div>
                <div style={css.label}>
                  Adjuntar comprobante (opcional si pusiste referencia)
                </div>
                <input
                  type="file"
                  onChange={(e) =>
                    setDeunaFile(e.target.files?.[0] || null)
                  }
                  style={css.input}
                />
                {deunaFile && (
                  <small style={{ opacity: 0.75 }}>
                    Archivo: {deunaFile.name}
                  </small>
                )}
              </div>
              <small style={{ opacity: 0.75 }}>
                Al enviar, tu pago quedará <b>pendiente de revisión</b>. Te
                habilitaremos el acceso cuando sea aprobado.
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
            <div style={{ opacity: 0.8, fontSize: 13 }}>
              Datos para transferencia
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              <div>
                <b>Número de cuenta:</b> 2200449871
                <button
                  onClick={() => copy('2200449871')}
                  style={{
                    marginLeft: 8,
                    background: '#334155',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '4px 8px',
                    cursor: 'pointer',
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
            </div>
            <div>
              <div style={css.label}>Referencia (o adjunta comprobante)</div>
              <input
                style={css.input}
                value={transRef}
                onChange={(e) => setTransRef(e.target.value)}
                placeholder="Ej.: referencia del banco"
              />
            </div>
            <div>
              <div style={css.label}>
                Comprobante (opcional si pegaste referencia)
              </div>
              <input
                type="file"
                onChange={(e) =>
                  setTransFile(e.target.files?.[0] || null)
                }
                style={css.input}
              />
              {transFile && (
                <small style={{ opacity: 0.75 }}>
                  Archivo: {transFile.name}
                </small>
              )}
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                checked={transConfirm}
                onChange={(e) => setTransConfirm(e.target.checked)}
              />
              <span>
                Confirmo que realicé la transferencia por el total indicado
              </span>
            </label>
            <small style={{ opacity: 0.75 }}>
              Al enviar, tu pago quedará <b>pendiente de revisión</b>. Te
              habilitaremos el acceso cuando sea aprobado.
            </small>
          </div>
        </section>
      )}

      {/* Acciones */}
      <section style={css.card}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <a href="/" style={css.ghost}>
            Seguir comprando
          </a>
          <button
            onClick={sendForReview}
            style={css.btn}
            disabled={sending}
          >
            {sending ? 'Enviando…' : 'Enviar para revisión'}
          </button>
        </div>
        <small style={{ opacity: 0.7, display: 'block', marginTop: 10 }}>
          Después de aprobar tu pago, activaremos tu acceso al asistente paso a
          paso para completar tu DS-160.
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
