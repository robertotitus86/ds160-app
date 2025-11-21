"use client";

import Link from "next/link";

export default function Page() {
  return (
    <div
      style={{
        display: "grid",
        gap: 24,
      }}
    >
      {/* ===================== HERO ===================== */}
      <section
        style={{
          background: "#ffffff",
          borderRadius: 20,
          border: "1px solid #e5e7eb",
          padding: 20,
          boxShadow: "0 8px 18px rgba(15, 23, 42, 0.04)",
        }}
      >
        <h1
          style={{
            fontSize: 26,
            fontWeight: 700,
            margin: "0 0 8px",
            color: "#111827",
          }}
        >
          Evita errores críticos en tu DS-160 y gana confianza
        </h1>

        <p
          style={{
            fontSize: 14,
            color: "#4b5563",
            margin: "0 0 16px",
            lineHeight: 1.5,
          }}
        >
          Respondes en español, sin tecnicismos ni complicaciones. Nosotros
          transformamos tus respuestas en un DS-160 limpio, coherente y listo
          para enviar, y te acompañamos con la cita y la entrevista.
          <br />
          <span style={{ fontSize: 12, color: "#6b7280" }}>
            Plataforma privada de acompañamiento · No es el sitio oficial de la
            Embajada.
          </span>
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            marginTop: 8,
          }}
        >
          <Link
            href="/wizard"
            style={{
              padding: "10px 16px",
              background: "#2563eb",
              color: "#ffffff",
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Empezar llenado asistido
          </Link>

          <Link
            href="/checkout?plan=asesoria"
            style={{
              padding: "10px 16px",
              background: "#f3f4f6",
              color: "#111827",
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Asesoría para la entrevista
          </Link>
        </div>
      </section>

      {/* ===================== CÓMO FUNCIONA ===================== */}
      <section
        style={{
          background: "#ffffff",
          borderRadius: 20,
          border: "1px solid #e5e7eb",
          padding: 20,
          boxShadow: "0 8px 18px rgba(15, 23, 42, 0.04)",
        }}
      >
        <h2
          style={{
            margin: "0 0 10px",
            fontSize: 20,
            fontWeight: 700,
          }}
        >
          ¿Cómo funciona?
        </h2>

        <p
          style={{
            margin: "0 0 10px",
            fontSize: 13,
            color: "#4b5563",
          }}
        >
          En lugar de pelearte solo con el inglés del formulario, seguimos un
          proceso claro en tres pasos:
        </p>

        <ol
          style={{
            margin: 0,
            paddingLeft: 18,
            fontSize: 13,
            color: "#374151",
            display: "grid",
            gap: 4,
          }}
        >
          <li>Eliges el plan que necesitas y realizas el pago.</li>
          <li>Respondes nuestro asistente en español, paso a paso.</li>
          <li>
            Trasladamos tus respuestas al DS-160 oficial y te guiamos con los
            siguientes pasos.
          </li>
        </ol>
      </section>

      {/* ===================== ERRORES COMUNES ===================== */}
      <section
        style={{
          background: "#ffffff",
          borderRadius: 20,
          border: "1px solid #e5e7eb",
          padding: 20,
          boxShadow: "0 8px 18px rgba(15, 23, 42, 0.04)",
        }}
      >
        <h2
          style={{
            margin: "0 0 10px",
            fontSize: 20,
            fontWeight: 700,
          }}
        >
          Errores comunes que ayudamos a evitar
        </h2>

        <p
          style={{
            margin: "0 0 10px",
            fontSize: 13,
            color: "#4b5563",
          }}
        >
          Muchos rechazos y demoras vienen de errores simples en el DS-160. Nuestro
          objetivo es ayudarte a evitarlos desde el inicio.
        </p>

        <ul
          style={{
            margin: 0,
            paddingLeft: 18,
            fontSize: 13,
            color: "#374151",
            display: "grid",
            gap: 4,
          }}
        >
          <li>Fechas inconsistentes entre empleo, estudios y viajes.</li>
          <li>Motivo de viaje poco claro o contradictorio.</li>
          <li>Direcciones mal escritas o con formato extraño.</li>
          <li>
            Información laboral que no coincide con lo que se dice en la
            entrevista.
          </li>
          <li>
            Respuestas de seguridad mal interpretadas por no entender bien el
            inglés.
          </li>
        </ul>
      </section>

      {/* ===================== TESTIMONIOS ===================== */}
      <section
        style={{
          background: "#ffffff",
          borderRadius: 20,
          border: "1px solid #e5e7eb",
          padding: 20,
          boxShadow: "0 8px 18px rgba(15, 23, 42, 0.04)",
        }}
      >
        <h2
          style={{
            margin: "0 0 10px",
            fontSize: 20,
            fontWeight: 700,
          }}
        >
          Personas como tú ya han usado este acompañamiento
        </h2>

        <div
          style={{
            borderLeft: "4px solid #3b82f6",
            paddingLeft: 12,
            fontSize: 13,
            color: "#4b5563",
            marginBottom: 12,
          }}
        >
          “Tenía mucho miedo de equivocarme en el DS-160. Responder en español y
          que luego lo pasen al formato oficial me dio mucha tranquilidad.”
          <br />
          <strong>Andrea · 29 años · Quito</strong>
        </div>

        <div
          style={{
            borderLeft: "4px solid #10b981",
            paddingLeft: 12,
            fontSize: 13,
            color: "#4b5563",
            marginBottom: 12,
          }}
        >
          “Me di cuenta de varios detalles que estaba respondiendo mal, sobre todo
          en la parte laboral y de viajes. Sentí que llegué a la entrevista con
          una historia más ordenada.”
          <br />
          <strong>Carlos · 35 años · Guayaquil</strong>
        </div>

        <div
          style={{
            borderLeft: "4px solid #f59e0b",
            paddingLeft: 12,
            fontSize: 13,
            color: "#4b5563",
          }}
        >
          “No es magia ni promesas de aprobación, pero sí una guía clara. Yo solo
          respondí lo que vivo en la realidad y me ayudaron a presentarlo bien.”
          <br />
          <strong>María · 32 años · Cuenca</strong>
        </div>
      </section>

      {/* ===================== PLANES ===================== */}
      <section
        style={{
          background: "#ffffff",
          borderRadius: 20,
          border: "1px solid #e5e7eb",
          padding: 20,
          boxShadow: "0 8px 18px rgba(15, 23, 42, 0.04)",
        }}
      >
        <h2
          style={{
            margin: "0 0 10px",
            fontSize: 20,
            fontWeight: 700,
          }}
        >
          Planes disponibles
        </h2>

        <ul
          style={{
            margin: 0,
            paddingLeft: 18,
            fontSize: 13,
            color: "#374151",
            display: "grid",
            gap: 4,
          }}
        >
          <li>
            <strong>Llenado DS-160:</strong> Respondes en español y nosotros
            trasladamos todo al portal oficial.
          </li>
          <li>
            <strong>Asesoría de entrevista:</strong> Simulación, preguntas clave y
            orden de tu historia.
          </li>
          <li>
            <strong>Toma de cita:</strong> Aplicable solo si ya tienes el DS-160
            listo; te ayudamos a agendar sin errores.
          </li>
        </ul>

        <div style={{ marginTop: 12 }}>
          <Link
            href="/checkout"
            style={{
              padding: "10px 16px",
              background: "#2563eb",
              color: "#ffffff",
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Ver precios y continuar
          </Link>
        </div>
      </section>
    </div>
  );
}
