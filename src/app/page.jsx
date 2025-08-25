
import Link from "next/link";

export default function Home() {
  return (
    <div className="card">
      <h1 style={{fontSize:36, fontWeight:900}}>Asistente DS-160</h1>
      <p className="muted">Completa tu formulario, agenda tu cita y paga con PayPhone, PayPal o transferencia.</p>
      <div className="space" />
      <div style={{display:'flex', gap:12, flexWrap:'wrap'}}>
        <Link href="/checkout" className="btn">Ir al checkout</Link>
        <Link href="/transferencia" className="btn btn-outline">Ver transferencia</Link>
      </div>
    </div>
  );
}
