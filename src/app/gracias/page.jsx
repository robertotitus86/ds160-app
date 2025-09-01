export default function Gracias() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <div className="card" style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
          ¡Gracias! 🎉
        </h1>
        <p className="muted" style={{ marginBottom: 8 }}>
          Tu pago fue recibido correctamente. Enviaremos la confirmación y los
          siguientes pasos a tu correo.
        </p>
      </div>

      <div className="card">
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          ¿Qué sigue?
        </h3>
        <ul style={{ margin: 0, paddingLeft: 18, color: "#cbd5e1" }}>
          <li>Revisaremos tu información y el estado del pago.</li>
          <li>Te contactaremos si necesitamos datos adicionales.</li>
          <li>Te enviaremos la constancia y el resumen de tu solicitud.</li>
        </ul>
      </div>
    </div>
  );
}
