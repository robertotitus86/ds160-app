'use client';

import { useMemo, useState } from 'react';

// Utilidad para formato de moneda
function money(n) {
  const value = Number(n || 0);
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

// Genera un folio único legible
function refCode(prefix = 'DS160') {
  const stamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
  const rnd = Math.floor(Math.random() * 9000 + 1000);
  return `${prefix}-${stamp}-${rnd}`;
}

// Catálogo de servicios (puedes editar precios y nombres)
const CATALOG = [
  { id: 'form', label: 'Llenado de formulario DS-160', price: 30 },
  { id: 'appointment', label: 'Toma de cita', price: 10 },
  { id: 'advice', label: 'Asesoría completa', price: 25 },
];

export default function CheckoutPage() {
  const [selected, setSelected] = useState(() => new Set(['form'])); // 'form' seleccionado por defecto
  const [method, setMethod] = useState('payphone'); // payphone | transferencia
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null); // mensajes de error/estado

  // Subtotal según selección
  const subtotal = useMemo(() => {
    let s = 0;
    for (const it of CATALOG) {
      if (selected.has(it.id)) s += it.price;
    }
    return Number(s.toFixed(2));
  }, [selected]);

  // Total con PayPhone (+6%)
  const totalPayPhone = useMemo(() => {
    if (!subtotal) return 0;
    const t = subtotal * 1.06; // 6%
    return Number(t.toFixed(2));
  }, [subtotal]);

  // Total según método
  const total = useMemo(() => {
    if (method === 'payphone') return totalPayPhone;
    return subtotal; // transferencia = sin recargo
  }, [method, subtotal, totalPayPhone]);

  const hasSelection = selected.size > 0;

  function toggle(id) {
    setMsg(null);
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handlePay() {
    setMsg(null);

    if (!hasSelection) {
      setMsg({ type: 'warn', text: 'Seleccione al menos un servicio.' });
      return;
    }
    if (!total || total <= 0) {
      setMsg({ type: 'warn', text: 'No hay total calculado.' });
      return;
    }

    if (method === 'transferencia') {
      // Redirige a la pantalla de transferencia
      // Puedes pasar el total por query si lo quieres mostrar allí:
      const q = new URLSearchParams({ total: String(total) }).toString();
      window.location.href = `/transferencia?${q}`;
      return;
    }

    // ===== PAGO CON PAYPHONE =====
    setLoading(true);
    try {
      const reference = refCode('DS160');

      const res = await fetch('/api/payphone/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,              // total ya incluye +6% para PayPhone
          reference,
          // Campos opcionales del cliente, agrega los reales si los tienes:
          // customerName: 'Nombre Cliente',
          // customerEmail: 'correo@dominio.com',
          // customerPhone: '0999999999',
          // También puedes definir urls de retorno:
          // responseUrl: `${window.location.origin}/checkout/confirm`,
          // cancellationUrl: `${window.location.origin}/checkout/cancel`,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.ok || !data?.paymentUrl) {
        const reason =
          data?.error || data?.details || 'No se pudo generar el link de pago.';
        setMsg({
          type: 'error',
          text: `PayPhone devolvió un error. ${reason}`,
        });
        return;
      }

      // Todo ok -> abrir el link de pago
      window.location.href = data.paymentUrl;
    } catch (err) {
      setMsg({
        type: 'error',
        text: `No se pudo iniciar el pago: ${err?.message || String(err)}`,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      {/* Encabezado */}
      <h1 className="text-3xl font-bold text-white mb-6">
        Asistente DS-160
      </h1>

      {/* Caja de servicios */}
      <section className="rounded-xl border border-slate-700 bg-slate-900/50">
        <div className="px-5 py-4 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-slate-100">Servicios</h2>
        </div>

        <div className="p-5 space-y-4">
          {CATALOG.map((item) => (
            <label
              key={item.id}
              className="flex items-center justify-between rounded-lg bg-slate-800/50 hover:bg-slate-800/80 transition border border-slate-700 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selected.has(item.id)}
                  onChange={() => toggle(item.id)}
                  className="w-5 h-5 accent-violet-500"
                />
                <span className="text-slate-100">{item.label}</span>
              </div>
              <div className="text-slate-200 font-semibold">{money(item.price)}</div>
            </label>
          ))}

          <div className="pt-2 text-right text-slate-300">
            <div className="text-base">
              Subtotal:{' '}
              <span className="font-semibold text-white">{money(subtotal)}</span>
            </div>
            {method === 'payphone' && (
              <div className="text-sm text-slate-400">
                * Con PayPhone se agrega <b>+6%</b>. Pagarás{' '}
                <span className="text-white font-semibold">
                  {money(totalPayPhone)}
                </span>
                .
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Método de pago */}
      <section className="mt-6 rounded-xl border border-slate-700 bg-slate-900/50">
        <div className="px-5 py-4 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-slate-100">Método de pago</h2>
        </div>

        <div className="p-5 space-y-3">
          <label className="inline-flex items-center gap-2 text-slate-200">
            <input
              type="radio"
              name="paymethod"
              value="payphone"
              checked={method === 'payphone'}
              onChange={() => setMethod('payphone')}
              className="w-4 h-4 accent-violet-500"
            />
            PayPhone (recargo 6%)
          </label>

          <label className="inline-flex items-center gap-2 text-slate-200">
            <input
              type="radio"
              name="paymethod"
              value="transferencia"
              checked={method === 'transferencia'}
              onChange={() => setMethod('transferencia')}
              className="w-4 h-4 accent-violet-500"
            />
            Transferencia (sin recargo)
          </label>
        </div>
      </section>

      {/* Mensajes */}
      {msg && (
        <div
          className={`mt-4 rounded-lg border px-4 py-3 text-sm ${
            msg.type === 'error'
              ? 'border-red-600 bg-red-950/40 text-red-200'
              : msg.type === 'warn'
              ? 'border-amber-600 bg-amber-950/40 text-amber-200'
              : 'border-slate-700 bg-slate-900/40 text-slate-200'
          }`}
        >
          {msg.text}
        </div>
      )}

      {/* Botón Pagar */}
      <div className="mt-6">
        <button
          disabled={!hasSelection || loading}
          onClick={handlePay}
          className={`w-full sm:w-auto inline-flex items-center gap-3 px-6 py-3 rounded-lg font-semibold transition ${
            !hasSelection || loading
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-violet-600 hover:bg-violet-500 text-white'
          }`}
          title={!hasSelection ? 'Seleccione un servicio para continuar' : 'Continuar con el pago'}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              Procesando…
            </>
          ) : (
            <>Pagar {money(total || 0)} {method === 'payphone' ? 'con PayPhone' : 'por Transferencia'}</>
          )}
        </button>
      </div>
    </main>
  );
}
