
export default function Gracias() {
  // Mensaje simple; si vienes de PayPhone, configura tu URL de respuesta a /gracias?method=payphone
  // En PayPal redirigimos aquí desde el componente en onApprove
  return (
    <div className="card">
      <h1 style={{fontSize:28, fontWeight:900}}>¡Gracias! 🎉</h1>
      <p className="muted">Tu pago fue procesado. Enviaremos la confirmación a tu correo.</p>
    </div>
  );
}
