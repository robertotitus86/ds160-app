export default function Page() {
  return (
    <main style={{display:"grid", gap:16, gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))"}}>
      <section style={{background:"#0f172a", padding:18, borderRadius:14}}>
        <span style={{fontSize:12, opacity:.8}}>Servicio #1</span>
        <h2 style={{margin:"6px 0"}}>Llenado DS-160</h2>
        <p>Asistente paso a paso. Tus datos llegan al administrador para completar en el portal oficial.</p>
        <p><b>$45 USD</b></p>
        <a href="/checkout?plan=llenado" style={{padding:"10px 14px", background:"#2563eb", color:"#fff", borderRadius:10, display:"inline-block"}}>Seleccionar</a>
      </section>

      <section style={{background:"#0f172a", padding:18, borderRadius:14}}>
        <span style={{fontSize:12, opacity:.8}}>Servicio #2</span>
        <h2 style={{margin:"6px 0"}}>Asesoría Entrevista</h2>
        <p>Preparación por Zoom para tu entrevista en la embajada/consulado.</p>
        <p><b>$35 USD</b></p>
        <a href="/checkout?plan=asesoria" style={{padding:"10px 14px", background:"#2563eb", color:"#fff", borderRadius:10, display:"inline-block"}}>Seleccionar</a>
      </section>

      <section style={{background:"#0f172a", padding:18, borderRadius:14}}>
        <span style={{fontSize:12, opacity:.8}}>Servicio #3</span>
        <h2 style={{margin:"6px 0"}}>Toma de Cita</h2>
        <p>Disponible solo cuando el DS-160 esté completamente lleno.</p>
        <p><b>$15 USD</b></p>
        <a href="/checkout?plan=cita" style={{padding:"10px 14px", background:"#2563eb", color:"#fff", borderRadius:10, display:"inline-block"}}>Seleccionar</a>
      </section>
    </main>
  );
}
