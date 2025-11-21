"use client";

import Link from "next/link";

export default function Page() {
  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "16px 12px 32px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1120,
          display: "grid",
          gap: 16,
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
          <div
            style={{
              display: "grid",
              gap: 16,
              gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 1fr)",
            }}
          >
            <div>
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
                  margin: "0 0 12px",
                  lineHeight: 1.5,
                }}
              >
                Respondes en español, sin tecnicismos ni complicaciones. Nosotros
                transformamos tus respuestas en un DS-160 limpio, coherente y
                listo para enviar, y te acompañamos con la cita y la entrevista.
              </p>

              <p
                style={{
                  fontSize: 12,
                  color: "#6b7280",
                  margin: "0 0 16px",
                }}
              >
                Plataforma privada de acompañamiento · No es el sitio oficial de
                la Embajada.
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                  marginTop: 4,
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
            </div>

            {/* mini “tarjetas” de interacción */}
            <div
              style={{
                display: "grid",
                gap: 10,
              }}
            >
              <article
                style={{
                  borderRadius: 14,
                  border: "1px solid #e5e7eb",
                  padding: 12,
                  background: "#f9fafb",
                  fontSize: 12,
                  color: "#4b5563",
                }}
              >
                <strong style={{ display: "block", marginBottom: 4 }}>
                  1. Respondes en español
                </strong>
                Te hacemos preguntas claras para entender tu realidad tal como es.
              </article>
              <article
                style={{
                  borderRadius: 14,
                  border: "1px solid #e5e7eb",
                  padding: 12,
                  background: "#f9fafb",
                  fontSize: 12,
                  color: "#4b5563",
                }}
              >
                <strong style={{ display: "block", marginBottom: 4 }}>
                  2. Ordenamos tu información
                </strong>
                Revisamos coherencia entre trabajo, ingresos, viajes y motivo.
              </article>
              <article
                style={{
                  borderRadius: 14,
                  border: "1px solid #e5e7eb",
                  padding: 12,
                  background: "#eff6ff",
                  fontSize: 12,
                  color: "#1d4ed8",
                }}
              >
                <strong style={{ display: "block", marginBottom: 4 }}>
                  3. DS-160 listo para registrar
                </strong>
                Obtienes un resumen claro para registrar en el portal oficial y
                llegar mejor preparado a la entrevista.
              </article>
            </div>
          </div>
        </section>

        {/* ===================== PLANES EN TARJETAS ===================== */}
        <section
          style={{
            background: "#ffffff",
            borderRadius: 20,
            border: "1px solid #e5e7eb",
            padding: 20,
            boxShadow: "0 8px 18px rgba(15, 23, 42, 0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              Elige el tipo de ayuda que necesitas
            </h2>
            <span
              style={{
                fontSize: 12,
                color: "#6b7280",
              }}
            >
              Puedes combinar más de un plan.
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            }}
          >
            {/* Llenado */}
            <article
              style={{
                borderRadius: 16,
                border: "1px solid #e5e7eb",
                padding: 16,
                display: "grid",
                gap: 8,
              }}
            >
              <header>
                <h3
                  style={{
                    margin: "0 0 4px",
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  Llenado DS-160
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    color: "#6b7280",
                  }}
                >
                  Plan más elegido
                </p>
              </header>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "#4b5563",
                }}
              >
                Respondes en español y nosotros trasladamos todo al portal
                oficial, evitando errores frecuentes en el formulario.
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 4,
                }}
              >
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                  }}
                >
                  $45 USD
                </span>
                <Link
                  href="/checkout?plan=llenado"
                  style={{
                    padding: "8px 14px",
                    borderRadius: 999,
                    background: "#2563eb",
                    color: "#ffffff",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Elegir plan
                </Link>
              </div>
            </article>

            {/* Asesoría */}
            <article
              style={{
                borderRadius: 16,
                border: "1px solid #e5e7eb",
                padding: 16,
                display: "grid",
                gap: 8,
              }}
            >
              <header>
                <h3
                  style={{
                    margin: "0 0 4px",
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  Asesoría de entrevista
                </h3>
              </header>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "#4b5563",
                }}
              >
                Practica preguntas, ordena tus ideas y llega con una historia
                coherente con lo que pusiste en el DS-160.
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 4,
                }}
              >
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                  }}
                >
                  $35 USD
                </span>
                <Link
                  href="/checkout?plan=asesoria"
                  style={{
                    padding: "8px 14px",
                    borderRadius: 999,
                    background: "#111827",
                    color: "#ffffff",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Elegir plan
                </Link>
              </div>
            </article>

            {/* Cita */}
            <article
              style={{
                borderRadius: 16,
                border: "1px solid #e5e7eb",
                padding: 16,
                display: "grid",
                gap: 8,
              }}
            >
              <header>
                <h3
                  style={{
                    margin: "0 0 4px",
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  Toma de cita
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    color: "#b45309",
                  }}
                >
                  Requiere DS-160 ya listo
                </p>
              </header>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "#4b5563",
                }}
              >
                Te ayudamos a agendar tu cita correctamente y revisamos los datos
                más importantes antes de confirmarla.
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 4,
                }}
              >
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                  }}
                >
                  $15 USD
                </span>
                <Link
                  href="/checkout?plan=cita"
                  style={{
                    padding: "8px 14px",
                    borderRadius: 999,
                    background: "#f97316",
                    color: "#ffffff",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Elegir plan
                </Link>
              </div>
            </article>
          </div>
        </section>

        {/* ===================== ERRORES / BENEFICIOS ===================== */}
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

          <div
            style={{
              display: "grid",
              gap: 8,
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              fontSize: 13,
              color: "#374151",
            }}
          >
            <div>
              <strong>Coherencia de fechas</strong>
              <p style={{ margin: "4px 0 0" }}>
                Fechas de empleo, estudios y viajes que no coinciden entre sí.
              </p>
            </div>
            <div>
              <strong>Motivo de viaje</strong>
              <p style={{ margin: "4px 0 0" }}>
                Razones poco claras que no se alinean con tu situación económica
                o familiar.
              </p>
            </div>
            <div>
              <strong>Datos de contacto</strong>
              <p style={{ margin: "4px 0 0" }}>
                Direcciones, teléfonos o correos mal escritos o mal formateados.
              </p>
            </div>
            <div>
              <strong>Preguntas de seguridad</strong>
              <p style={{ margin: "4px 0 0" }}>
                Errores por no entender bien el inglés en respuestas sensibles.
              </p>
            </div>
          </div>
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
              display: "grid",
              gap: 12,
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            }}
          >
            <article
              style={{
                borderRadius: 16,
                border: "1px solid #e5e7eb",
                padding: 14,
                background: "#f9fafb",
                fontSize: 13,
                color: "#4b5563",
              }}
            >
              “Tenía mucho miedo de equivocarme en el DS-160. Responder en
              español y que luego lo pasen al formato oficial me dio mucha
              tranquilidad.”
              <p
                style={{
                  margin: "8px 0 0",
                  fontSize: 12,
                  color: "#6b7280",
                }}
              >
                Andrea · 29 años · Quito
              </p>
            </article>

            <article
              style={{
                borderRadius: 16,
                border: "1px solid #e5e7eb",
                padding: 14,
                background: "#f9fafb",
                fontSize: 13,
                color: "#4b5563",
              }}
            >
              “Me di cuenta de varios detalles que estaba respondiendo mal, sobre
              todo en la parte laboral y de viajes. Sentí que llegué a la
              entrevista con una historia más ordenada.”
              <p
                style={{
                  margin: "8px 0 0",
                  fontSize: 12,
                  color: "#6b7280",
                }}
              >
                Carlos · 35 años · Guayaquil
              </p>
            </article>

            <article
              style={{
                borderRadius: 16,
                border: "1px solid #e5e7eb",
                padding: 14,
                background: "#f9fafb",
                fontSize: 13,
                color: "#4b5563",
              }}
            >
              “No es magia ni promesas de aprobación, pero sí una guía clara. Yo
              solo respondí lo que vivo en la realidad y me ayudaron a
              presentarlo bien.”
              <p
                style={{
                  margin: "8px 0 0",
                  fontSize: 12,
                  color: "#6b7280",
                }}
              >
                María · 32 años · Cuenca
              </p>
            </article>
          </div>
        </section>

        {/* ===================== VISA SCHENGEN (INTERACCIÓN EXTRA) ===================== */}
        <section
          style={{
            background: "#ffffff",
            borderRadius: 20,
            border: "1px solid #e5e7eb",
            padding: 20,
            boxShadow: "0 8px 18px rgba(15, 23, 42, 0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h2
                style={{
                  margin: "0 0 6px",
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                ¿También estás pensando en viajar a Europa?
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "#4b5563",
                }}
              >
                Tenemos un asistente similar para organizar tus requisitos y
                datos de visa Schengen (turismo, visitas, etc.).
              </p>
            </div>

            <Link
              href="/schengen"
              style={{
                padding: "9px 16px",
                borderRadius: 999,
                background: "#0f766e",
                color: "#ffffff",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Ver ayuda para visa Schengen
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
