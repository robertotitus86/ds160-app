export const metadata = {
  title: "Acompañamiento para visa Schengen de turismo | Europa",
  description:
    "Apoyo en español para entender y organizar los requisitos habituales de la visa Schengen de turismo, checklist y preparación de formulario.",
};

export default function VisaSchengenEuropaPage() {
  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "16px 12px 32px",
      }}
    >
      <article
        style={{
          width: "100%",
          maxWidth: 880,
          background: "#ffffff",
          borderRadius: 20,
          border: "1px solid #e5e7eb",
          padding: 20,
          boxShadow: "0 8px 18px rgba(15, 23, 42, 0.04)",
        }}
      >
        <h1
          style={{
            margin: "0 0 10px",
            fontSize: 24,
            fontWeight: 700,
            color: "#111827",
          }}
        >
          Acompañamiento para visa Schengen de turismo
        </h1>
        <p
          style={{
            margin: "0 0 12px",
            fontSize: 14,
            color: "#4b5563",
          }}
        >
          Viajar a Europa por turismo implica cumplir con una serie de requisitos
          (alojamiento, recursos, seguro, itinerario, etc.). Este acompañamiento te
          ayuda a entender mejor qué suele pedir el consulado y cómo puedes ordenar
          tu información.
        </p>

        <h2
          style={{
            margin: "16px 0 6px",
            fontSize: 18,
            fontWeight: 600,
            color: "#111827",
          }}
        >
          ¿Qué trabajamos contigo?
        </h2>
        <ul
          style={{
            margin: "0 0 10px",
            paddingLeft: 18,
            fontSize: 13,
            color: "#4b5563",
          }}
        >
          <li>
            Tipo de viaje (turismo, visita a familiares, viaje combinado por varias
            ciudades, etc.).
          </li>
          <li>
            País principal de estancia y la lógica del itinerario que presentarás.
          </li>
          <li>
            Formas habituales de demostrar alojamiento, recursos económicos y vínculos
            con tu país de residencia.
          </li>
          <li>
            Revisión general de la información que luego usarás en el formulario.
          </li>
        </ul>

        <h2
          style={{
            margin: "16px 0 6px",
            fontSize: 18,
            fontWeight: 600,
            color: "#111827",
          }}
        >
          Ventajas de preparar tu carpeta con anticipación
        </h2>
        <ul
          style={{
            margin: "0 0 10px",
            paddingLeft: 18,
            fontSize: 13,
            color: "#4b5563",
          }}
        >
          <li>Evitas olvidar documentos importantes el día de la cita.</li>
          <li>
            Comprendes mejor por qué cada documento es relevante para tu caso.
          </li>
          <li>
            Reduces la sensación de improvisación y llegas con más claridad al
            consulado.
          </li>
        </ul>

        <p
          style={{
            margin: "14px 0 0",
            fontSize: 11,
            color: "#6b7280",
          }}
        >
          Revisa siempre la información oficial publicada por el consulado o centro de
          visados donde presentarás tu solicitud. Este servicio es de orientación
          general y no reemplaza la normativa oficial ni constituye asesoría legal.
        </p>
      </article>
    </main>
  );
}
