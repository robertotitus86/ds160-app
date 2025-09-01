export default function Home() {
  return (
    <>
      <section className="panel hero">
        <h1 className="h1">Asistente DS-160</h1>
        <p className="lead">
          Completa tu formulario, agenda tu cita y paga con <b>PayPhone</b>, <b>PayPal</b> o <b>Transferencia</b>.
        </p>
        <div style={{display:"flex", gap:12, marginTop:14, flexWrap:"wrap"}}>
          <a href="/checkout" className="btn btn-primary">Ir al checkout</a>
          <a href="/transferencia" className="btn btn-ghost">Ver transferencia</a>
        </div>
      </section>

      <section className="section" style={{display:"grid", gap:14}}>
        <div className="panel">
          <div className="row">
            <div>
              <div style={{fontWeight:900, marginBottom:4}}>Llenado guiado</div>
              <div className="muted">Validaciones y guardado seguro para evitar rechazos.</div>
            </div>
            <div className="muted">01</div>
          </div>
        </div>

        <div className="panel">
          <div className="row">
            <div>
              <div style={{fontWeight:900, marginBottom:4}}>Citas y recordatorios</div>
              <div className="muted">Te avisamos fechas clave y cambios importantes.</div>
            </div>
            <div className="muted">02</div>
          </div>
        </div>

        <div className="panel">
          <div className="row">
            <div>
              <div style={{fontWeight:900, marginBottom:4}}>Pagos protegidos</div>
              <div className="muted">PayPhone, PayPal o transferencia con validación.</div>
            </div>
            <div className="muted">03</div>
          </div>
        </div>
      </section>
    </>
  );
}
