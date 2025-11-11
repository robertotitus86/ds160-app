'use client';
import { useEffect, useState } from "react";

type Service = { id: string; title: string; desc: string; price: number };

const SERVICES: Service[] = [
  { id: "llenado",  title: "Llenado DS-160",       desc: "Asistente paso a paso. Tus datos llegan al administrador para completar en el portal oficial.", price: 45 },
  { id: "asesoria", title: "Asesoría Entrevista",  desc: "Preparación por Zoom para tu entrevista en la embajada/consulado.",                            price: 35 },
  { id: "cita",     title: "Toma de Cita",         desc: "Disponible solo cuando el DS-160 esté completamente lleno.",                                   price: 15 },
];

export default function Page() {
  const [cart, setCart] = useState<string[]>([]);

  useEffect(() => {
    try { const raw = localStorage.getItem("ds160_cart"); if (raw) setCart(JSON.parse(raw)); } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem("ds160_cart", JSON.stringify(cart)); } catch {}
  }, [cart]);

  const toggle = (id: string) =>
    setCart(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const total = cart.reduce((a, id) => a + (SERVICES.find(s => s.id === id)?.price || 0), 0);
  const goCheckoutHref = cart.length ? `/checkout?plans=${encodeURIComponent(cart.join(","))}` : "#";

  // --- estilos consistentes ---
  const grid: React.CSSProperties = {
    display: "grid",
    gap: 16,
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    alignItems: "stretch",
  };
  const card: React.CSSProperties = {
    background: "#0f172a",
    border: "1px solid #111827",
    borderRadius: 14,
    padding: 18,
    display: "flex",
    flexDirection: "column",
    minHeight: 260,         // <- altura mínima igual
  };
  const actions: React.CSSProperties = {
    marginTop: "auto",      // <- empuja los botones al fondo
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  };
  const btn: React.CSSProperties = { background:"#2563eb", color:"#fff", border:"none", borderRadius:10, padding:"10px 14px" };
  const btnGhost: React.CSSProperties = { background:"#334155", color:"#fff", border:"none", borderRadius:10, padding:"10px 14px" };

  return (
    <>
      {/* Mini carrito */}
      <section style={{...card, minHeight:"auto", marginBottom:16}}>
        <h2 style={{marginTop:0}}>Tu selección</h2>
        {cart.length === 0 ? (
          <p style={{opacity:.8}}>No has seleccionado servicios todavía.</p>
        ) : (
          <>
            <ul style={{margin:"6px 0 12px 18px"}}>
              {cart.map(id => {
                const s = SERVICES.find(x => x.id === id)!;
                return <li key={id}>{s.title} — <b>${s.price} USD</b></li>;
              })}
            </ul>
            <p style={{marginBottom:12}}>Total: <b>${total} USD</b></p>
          </>
        )}
        <div style={{display:"flex", gap:8, flexWrap:"wrap"}}>
          <a href={goCheckoutHref} style={{...btn, pointerEvents: cart.length? "auto":"none", opacity: cart.length? 1:.5}}>Ir a Checkout</a>
          {cart.length>0 && <button onClick={()=>setCart([])} style={btnGhost}>Vaciar selección</button>}
        </div>
      </section>

      {/* Cards */}
      <main style={grid}>
        {SERVICES.map(s => {
          const selected = cart.includes(s.id);
          return (
            <section key={s.id} style={card}>
              <span style={{fontSize:12, opacity:.8}}>Servicio</span>
              <h2 style={{margin:"6px 0"}}>{s.title}</h2>
              <p style={{opacity:.95}}>{s.desc}</p>
              <p><b>${s.price} USD</b></p>

              <div style={actions}>
                <button onClick={()=>toggle(s.id)} style={btn}>
                  {selected ? "Quitar" : "Agregar"}
                </button>
                {!selected && (
                  <a href={`/checkout?plans=${s.id}`} style={btnGhost}>Comprar rápido</a>
                )}
              </div>
            </section>
          );
        })}
      </main>
    </>
  );
}
