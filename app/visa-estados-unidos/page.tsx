export const metadata = {
  title: "Acompañamiento para visa de Estados Unidos | DS-160 en español",
  description:
    "Guía y acompañamiento en español para organizar tu información y preparar el formulario DS-160, entrevista y cita para visa de Estados Unidos.",
};

export default function VisaEstadosUnidosPage() {
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
          Acompañamiento para visa de Estados Unidos
        </h1>
        <p
          style={{
            margin: "0 0 12px",
            fontSize: 14,
            color: "#4b5563",
          }}
        >
          Si vas a solicitar una visa de no inmigrante (turismo, negocios, estudios
          cortos, etc.), el formulario DS-160 y la entrevista consular son pasos
          claves. Este servicio te ayuda a organizar la información y prepararte
          mejor antes de usar las plataformas oficiales.
        </p>

        <h2
          style={{
            margin: "16px 0 6px",
            fontSize: 18,
            fontWeight: 600,
            color: "#111827",
          }}
        >
          ¿En qué consiste el acompañamiento?
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
            Conversamos en español sobre tu empleo, ingresos, viajes previos y motivo
            del viaje.
          </li>
          <li>
            Organizamos tu información de forma más clara para transcribirla al
            formulario DS-160.
          </li>
          <li>
            Identificamos puntos que podrían generar dudas o contradicciones.
          </li>
          <li>
            Preparamos un resumen que te sirva para recordar lo que declaraste al
            momento de la entrevista.
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
          Beneficios de preparar tu DS-160 con apoyo
        </h2>
        <ul
          style={{
            margin: "0 0 10px",
            paddingLeft: 18,
            fontSize: 13,
            color: "#4b5563",
          }}
        >
          <li>Reduces errores frecuentes de interpretación o traducción.</li>
          <li>
            Tienes una visión más ordenada de tu perfil antes de presentarte al
            consulado.
          </li>
          <li>
            Puedes practicar la forma en que explicas el motivo del viaje y tu
            situación actual.
          </li>
        </ul>

        <p
          style={{
            margin: "14px 0 0",
            fontSize: 11,
            color: "#6b7280",
          }}
        >
          Este sitio no pertenece a ninguna embajada ni consulado. No se ofrecen
          servicios de asesoría legal ni se garantizan resultados. El objetivo es
          ayudarte a comprender mejor el proceso y organizar tu información antes de
          usar las plataformas oficiales.
        </p>
      </article>
    </main>
  );
}
