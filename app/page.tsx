export default function Page() {
  const card = { background:'#0f172a', padding:18, borderRadius:14, border:'1px solid #111827' };
  const grid = { display:'grid', gap:16, gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))' };

  const btn = { background:'#2563eb', color:'#fff', border:'none', borderRadius:10, padding:'10px 14px', textDecoration:'none' as const };

  return (
    <main style={grid}>
      <section style={card}>
        <span style={{fontSize:12, opacity:.8}}>Servicio #1</span>
        <h2 style={{margin:'6px 0'}}>Llenado DS-160</h2>
        <p>Asistente paso a paso. Tus datos llegan al administrador para completar en el portal oficial.</p>
        <p><b>$45 USD</b></p>
        <a href="/checkout?plan=llenado" style={btn}>Seleccionar</a>
      </section>

      <section style={card}>
        <span style={{fontSize:12, opacity:.8}}>Servicio #2</span>
        <h2 style={{margin:'6px 0'}}>Asesoría Entrevista</h2>
        <p>Preparación por Zoom para tu entrevista en la embajada/consulado.</p>
        <p><b>$35 USD</b></p>
        <a href="/checkout?plan=asesoria" style={btn}>Seleccionar</a>
      </section>

      <section style={card}>
        <span style={{fontSize:12, opacity:.8}}>Servicio #3</span>
        <h2 style={{margin:'6px 0'}}>Toma de Cita</h2>
        <p>Disponible solo cuando el DS-160 esté completamente lleno.</p>
        <p><b>$15 USD</b></p>
        <a href="/checkout?plan=cita" style={btn}>Seleccionar</a>
      </section>
    </main>
  );
}
