export const metadata = { title: 'DS-160 Asistido | Inicio' };

export default function HomePage() {
  const card: React.CSSProperties = {
    background:'#0f172a', padding:18, borderRadius:14, border:'1px solid #111827'
  };
  const btn: React.CSSProperties = {
    background:'#2563eb', color:'#fff', border:'none', borderRadius:10, padding:'10px 14px',
    textDecoration:'none', display:'inline-block'
  };
  const ghost: React.CSSProperties = {
    background:'#334155', color:'#fff', border:'none', borderRadius:10, padding:'10px 14px',
    textDecoration:'none', display:'inline-block'
  };

  return (
    <div style={{display:'grid', gap:16}}>
      <section style={card}>
        <h1 style={{margin:'0 0 8px'}}>Tu DS-160 guiado, fácil y seguro</h1>
        <p style={{opacity:.9, marginTop:0}}>
          Responde paso a paso con ayudas en español. Al finalizar, nuestro equipo
          <b> completa tu DS-160 en el portal oficial</b> y te acompaña con la cita y la entrevista.
        </p>
        <div style={{display:'flex', gap:10, flexWrap:'wrap'}}>
          <a href="/checkout" style={btn}>Comenzar ahora</a>
          <a href="/wizard" style={ghost} title="Requiere pago">Ver ejemplo del asistente</a>
        </div>
      </section>

      <section style={card}>
        <h2 style={{marginTop:0}}>Planes</h2>
        <div style={{display:'grid', gap:12, gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))'}}>
          <div style={{background:'#0b1220', border:'1px solid #1f2937', borderRadius:12, padding:16}}>
            <h3 style={{marginTop:0}}>Llenado DS-160</h3>
            <p>Te guiamos y nuestro equipo llena el formulario oficial.</p>
            <p><b>$45 USD</b></p>
            <a href="/checkout?plan=llenado" style={btn}>Elegir</a>
          </div>
          <div style={{background:'#0b1220', border:'1px solid #1f2937', borderRadius:12, padding:16}}>
            <h3 style={{marginTop:0}}>Asesoría Entrevista</h3>
            <p>Simulación por Zoom y consejos reales para tu cita.</p>
            <p><b>$35 USD</b></p>
            <a href="/checkout?plan=asesoria" style={btn}>Elegir</a>
          </div>
          <div style={{background:'#0b1220', border:'1px solid #1f2937', borderRadius:12, padding:16}}>
            <h3 style={{marginTop:0}}>Toma de Cita</h3>
            <p>Programamos tu cita (requiere DS-160 listo).</p>
            <p><b>$15 USD</b></p>
            <a href="/checkout?plan=cita" style={btn}>Elegir</a>
          </div>
        </div>
      </section>

      <section style={card}>
        <h2 style={{marginTop:0}}>¿Cómo funciona?</h2>
        <ol style={{marginTop:0}}>
          <li>Elige plan y realiza el pago.</li>
          <li>Acceso inmediato al asistente DS-160 (wizard).</li>
          <li>Respondes en español con ayudas y validaciones.</li>
          <li>Nos envías tus respuestas y <b>nosotros llenamos el DS-160</b>.</li>
        </ol>
      </section>
    </div>
  );
}
