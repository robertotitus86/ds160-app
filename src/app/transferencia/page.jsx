export default function Transferencia() {
  return (
    <div style={{maxWidth:720, margin:"0 auto", background:"#fff", border:"1px solid #e5e7eb", borderRadius:12, padding:20}}>
      <h1 style={{fontSize:28, fontWeight:800, marginBottom:12}}>Transferencia bancaria</h1>
      <p>Realiza la transferencia a:</p>
      <ul>
        <li><b>Titular:</b> Tu Empresa</li>
        <li><b>Banco:</b> Banco Ejemplo</li>
        <li><b>Cuenta:</b> 0000000000</li>
        <li><b>SWIFT:</b> ABCDXXXX</li>
      </ul>
      <p>Luego envía el comprobante a <b>pagos@tuempresa.com</b>.</p>
    </div>
  );
}
