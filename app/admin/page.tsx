'use client';

import React, { useEffect, useMemo, useState } from 'react';

type OrderStatus = 'pending' | 'approved' | 'rejected';
type Order = {
  id: string;
  status: OrderStatus;
  createdAt?: string;
  reviewedAt?: string;
  plans?: string[];
  receiptUrl?: string;
};

const styles = {
  card: {
    background: '#0f172a',
    padding: 18,
    borderRadius: 14,
    border: '1px solid #111827',
  } as React.CSSProperties,

  btn: {
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '9px 12px',
    cursor: 'pointer',
  } as React.CSSProperties,

  btnGhost: {
    background: '#334155',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '9px 12px',
    cursor: 'pointer',
  } as React.CSSProperties,

  badge: (s: OrderStatus) =>
    ({
      display: 'inline-block',
      fontSize: 12,
      padding: '2px 8px',
      borderRadius: 999,
      background: s === 'approved' ? '#16a34a' : s === 'rejected' ? '#dc2626' : '#f59e0b',
      color: '#fff',
    } as React.CSSProperties),

  table: {
    width: '100%',
    borderCollapse: 'collapse',
  } as React.CSSProperties,

  th: {
    textAlign: 'left',
    padding: '8px 10px',
    borderBottom: '1px solid #1f2937',
    color: '#cbd5e1',
  } as React.CSSProperties,

  td: {
    padding: '8px 10px',
    borderBottom: '1px solid #0b1220',
  } as React.CSSProperties,
};

export default function AdminPage() {
  const [token, setToken] = useState('');
  const [tokenOk, setTokenOk] = useState(false);

  const [searchId, setSearchId] = useState('');
  const [found, setFound] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  const [list, setList] = useState<Order[]>([]);
  const [listLoading, setListLoading] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem('admin_token') || '';
    if (t) {
      setToken(t);
      setTokenOk(true);
      void loadRecent(t);
    }
  }, []);

  const hasToken = useMemo(() => token.trim().length > 0, [token]);

  async function saveToken() {
    if (!hasToken) {
      alert('Ingresa un token');
      return;
    }
    localStorage.setItem('admin_token', token.trim());
    setTokenOk(true);
    await loadRecent(token.trim());
  }

  async function loadRecent(tk = token) {
    try {
      setListLoading(true);
      const res = await fetch(`/api/orders/list?limit=25&token=${encodeURIComponent(tk)}`);
      const data = await res.json();
      if (!data.ok) throw new Error(data?.error || 'No se pudo listar');
      setList(data.items as Order[]);
    } catch (e: any) {
      alert(e?.message || 'Error listando órdenes');
    } finally {
      setListLoading(false);
    }
  }

  async function findById() {
    try {
      if (!searchId.trim()) {
        alert('Ingresa un ID');
        return;
      }
      setLoading(true);
      const res = await fetch(`/api/orders/status?id=${encodeURIComponent(searchId.trim())}`);
      const data = await res.json();
      if (!data.ok) throw new Error(data?.error || 'No encontrado');
      const o = data.order as Order;
      setFound({
        id: o.id || searchId.trim(),
        status: (o.status as OrderStatus) || 'pending',
        createdAt: o.createdAt,
        reviewedAt: o.reviewedAt,
        plans: o.plans || [],
        receiptUrl: o.receiptUrl,
      });
    } catch (e: any) {
      alert(e?.message || 'Error buscando orden');
      setFound(null);
    } finally {
      setLoading(false);
    }
  }

  async function act(id: string, action: 'approve' | 'reject') {
    try {
      if (!tokenOk) {
        alert('Configura tu token primero');
        return;
      }
      const res = await fetch('/api/orders/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, token, action }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data?.error || 'No se pudo actualizar');

      alert(`Orden ${id} -> ${data.status.toUpperCase()}`);
      if (found?.id === id) await findById();
      await loadRecent(token);
    } catch (e: any) {
      alert(e?.message || 'Error aprobando/rechazando');
    }
  }

  function copy(txt?: string) {
    if (!txt) return;
    navigator.clipboard?.writeText(txt);
    alert('Copiado al portapapeles.');
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <section style={styles.card}>
        <h2 style={{ marginTop: 0 }}>Panel de Administración</h2>
        <p style={{ marginTop: 0, opacity: 0.85 }}>
          Ingresa tu <b>ADMIN_TOKEN</b> para listar y gestionar órdenes. Este panel consume
          <code> /api/orders/list </code> y <code> /api/orders/approve</code>.
        </p>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Pegue aquí su ADMIN_TOKEN"
            style={{
              flex: '1 1 320px',
              minWidth: 260,
              padding: 10,
              borderRadius: 8,
              border: '1px solid #1f2937',
              background: '#0b1220',
              color: '#fff',
            }}
          />
          <button onClick={saveToken} style={styles.btn}>
            Usar token
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('admin_token');
              setToken('');
              setTokenOk(false);
            }}
            style={styles.btnGhost}
          >
            Quitar token
          </button>
        </div>
      </section>

      {/* Buscar por ID */}
      <section style={styles.card}>
        <h3 style={{ marginTop: 0 }}>Buscar por ID de pedido</h3>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Ej: DS160-20251112-101403"
            style={{
              flex: '1 1 320px',
              minWidth: 260,
              padding: 10,
              borderRadius: 8,
              border: '1px solid #1f2937',
              background: '#0b1220',
              color: '#fff',
            }}
          />
          <button onClick={findById} style={styles.btn} disabled={loading}>
            {loading ? 'Buscando…' : 'Buscar'}
          </button>
        </div>

        {found && (
          <div
            style={{
              marginTop: 14,
              padding: 12,
              border: '1px solid #1f2937',
              borderRadius: 10,
              background: '#0b1220',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 8 }}>
              <div>
                <div>
                  <b>ID:</b> {found.id}
                </div>
                <div>
                  <b>Estado:</b> <span style={styles.badge(found.status)}>{found.status}</span>
                </div>
                {found.createdAt && (
                  <div>
                    <b>Creada:</b> {new Date(found.createdAt).toLocaleString()}
                  </div>
                )}
                {found.reviewedAt && (
                  <div>
                    <b>Revisada:</b> {new Date(found.reviewedAt).toLocaleString()}
                  </div>
                )}
                {found.plans?.length ? (
                  <div>
                    <b>Planes:</b> {found.plans.join(', ')}
                  </div>
                ) : null}
                {found.receiptUrl && (
                  <div style={{ marginTop: 6 }}>
                    <b>Comprobante:</b>{' '}
                    <button onClick={() => window.open(found.receiptUrl!, '_blank')} style={styles.btnGhost}>
                      Ver
                    </button>
                    <button onClick={() => copy(found.receiptUrl)} style={{ ...styles.btnGhost, marginLeft: 8 }}>
                      Copiar URL
                    </button>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => act(found.id, 'approve')} style={styles.btn}>
                  Aprobar
                </button>
                <button onClick={() => act(found.id, 'reject')} style={styles.btnGhost}>
                  Rechazar
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Recientes */}
      <section style={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ marginTop: 0 }}>Órdenes recientes</h3>
          <button onClick={() => loadRecent()} style={styles.btnGhost} disabled={!tokenOk || listLoading}>
            {listLoading ? 'Actualizando…' : 'Actualizar'}
          </button>
        </div>

        {!tokenOk ? (
          <p style={{ opacity: 0.8 }}>Ingresa tu token para ver el listado.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Estado</th>
                  <th style={styles.th}>Creada</th>
                  <th style={styles.th}>Revisada</th>
                  <th style={styles.th}>Planes</th>
                  <th style={styles.th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {list.map((o) => (
                  <tr key={o.id}>
                    <td style={styles.td}>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setSearchId(o.id);
                          setFound(o);
                        }}
                        style={{ color: '#93c5fd' }}
                      >
                        {o.id}
                      </a>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.badge(o.status)}>{o.status}</span>
                    </td>
                    <td style={styles.td}>{o.createdAt ? new Date(o.createdAt).toLocaleString() : '-'}</td>
                    <td style={styles.td}>{o.reviewedAt ? new Date(o.reviewedAt).toLocaleString() : '-'}</td>
                    <td style={styles.td}>{o.plans?.join(', ') || '-'}</td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <button onClick={() => act(o.id, 'approve')} style={styles.btn}>
                          Aprobar
                        </button>
                        <button onClick={() => act(o.id, 'reject')} style={styles.btnGhost}>
                          Rechazar
                        </button>
                        {o.receiptUrl && (
                          <button onClick={() => window.open(o.receiptUrl!, '_blank')} style={styles.btnGhost}>
                            Ver comprobante
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {list.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ ...styles.td, opacity: 0.7 }}>
                      Sin resultados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
