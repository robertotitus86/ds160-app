"use client";

import { useState } from "react";

type Step = 1 | 2 | 3;

export default function SchengenWizardPage() {
  const [step, setStep] = useState<Step>(1);

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
          maxWidth: 880,
          display: "grid",
          gap: 16,
        }}
      >
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
              margin: "0 0 6px",
              fontSize: 22,
              fontWeight: 700,
              color: "#111827",
            }}
          >
            Asistente para preparar tu visa Schengen
          </h1>
          <p
            style={{
              margin: "0 0 10px",
              fontSize: 13,
              color: "#4b5563",
            }}
          >
            Responde unas preguntas en español y obtén una guía más clara para
            organizar tus documentos y preparar tu formulario.
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 11,
              color: "#6b7280",
            }}
          >
            No es asesoría legal ni reemplaza la revisión del consulado. Revisa siempre
            los requisitos oficiales de la embajada o consulado correspondiente.
          </p>
        </section>

        <section
          style={{
            background: "#ffffff",
            borderRadius: 20,
            border: "1px solid #e5e7eb",
            padding: 20,
            boxShadow: "0 8px 18px rgba(15, 23, 42, 0.04)",
          }}
        >
          {/* Indicador simple de pasos */}
          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 16,
            }}
          >
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 999,
                  background:
                    s <= step ? "#0f766e" : "#e5e7eb",
                }}
              />
            ))}
          </div>

          {step === 1 && (
            <div
              style={{
                display: "grid",
                gap: 12,
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#111827",
                }}
              >
                1. Tipo de viaje y país principal
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "#4b5563",
                }}
              >
                Cuéntanos de forma general qué tipo de viaje harás para orientar mejor
                los documentos que vas a necesitar.
              </p>

              <label
                style={{
                  fontSize: 12,
                  color: "#374151",
                  display: "grid",
                  gap: 4,
                }}
              >
                Tipo de viaje (turismo, visita familiar, estudios cortos, etc.)
                <textarea
                  placeholder="Ejemplo: turismo de 15 días, visita a un familiar, viaje combinado por varias ciudades..."
                  style={{
                    marginTop: 2,
                    minHeight: 70,
                    padding: 8,
                    fontSize: 13,
                    borderRadius: 8,
                    border: "1px solid #d1d5db",
                    resize: "vertical",
                  }}
                />
              </label>

              <label
                style={{
                  fontSize: 12,
                  color: "#374151",
                  display: "grid",
                  gap: 4,
                }}
              >
                País principal de estancia dentro del espacio Schengen
                <input
                  placeholder="Ejemplo: España, Francia, Italia..."
                  style={{
                    marginTop: 2,
                    padding: 8,
                    fontSize: 13,
                    borderRadius: 8,
                    border: "1px solid #d1d5db",
                  }}
                />
              </label>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: 8,
                }}
              >
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 999,
                    border: "none",
                    background: "#0f766e",
                    color: "#ffffff",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div
              style={{
                display: "grid",
                gap: 12,
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#111827",
                }}
              >
                2. Fechas, alojamiento y recursos económicos
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "#4b5563",
                }}
              >
                Esta información suele ser clave para demostrar que tu viaje es claro,
                acotado en el tiempo y económicamente sustentado.
              </p>

              <label
                style={{
                  fontSize: 12,
                  color: "#374151",
                  display: "grid",
                  gap: 4,
                }}
              >
                Fechas aproximadas de viaje
                <textarea
                  placeholder="Ejemplo: del 10 al 25 de julio, fechas flexibles dentro de la segunda quincena de agosto..."
                  style={{
                    marginTop: 2,
                    minHeight: 60,
                    padding: 8,
                    fontSize: 13,
                    borderRadius: 8,
                    border: "1px solid #d1d5db",
                    resize: "vertical",
                  }}
                />
              </label>

              <label
                style={{
                  fontSize: 12,
                  color: "#374151",
                  display: "grid",
                  gap: 4,
                }}
              >
                Alojamiento previsto (hotel, familiar, Airbnb, etc.)
                <textarea
                  placeholder="Ejemplo: hotel reservado en Madrid, invitación de familiar en Barcelona..."
                  style={{
                    marginTop: 2,
                    minHeight: 60,
                    padding: 8,
                    fontSize: 13,
                    borderRadius: 8,
                    border: "1px solid #d1d5db",
                    resize: "vertical",
                  }}
                />
              </label>

              <label
                style={{
                  fontSize: 12,
                  color: "#374151",
                  display: "grid",
                  gap: 4,
                }}
              >
                Cómo piensas demostrar recursos económicos
                <textarea
                  placeholder="Ejemplo: estados de cuenta, certificado laboral, ahorro personal, patrocinio de familiar..."
                  style={{
                    marginTop: 2,
                    minHeight: 70,
                    padding: 8,
                    fontSize: 13,
                    borderRadius: 8,
                    border: "1px solid #d1d5db",
                    resize: "vertical",
                  }}
                />
              </label>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 8,
                  gap: 8,
                }}
              >
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 999,
                    border: "1px solid #d1d5db",
                    background: "#ffffff",
                    color: "#374151",
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Volver
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 999,
                    border: "none",
                    background: "#0f766e",
                    color: "#ffffff",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div
              style={{
                display: "grid",
                gap: 12,
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#111827",
                }}
              >
                3. Siguiente paso: checklist y formulario
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "#4b5563",
                }}
              >
                Con la información anterior, el siguiente paso es preparar un checklist
                de documentos y un resumen claro para usar al llenar tu formulario
                Schengen.
              </p>

              <div
                style={{
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  background: "#f9fafb",
                  padding: 12,
                  fontSize: 12,
                  color: "#374151",
                  display: "grid",
                  gap: 6,
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontWeight: 600,
                  }}
                >
                  ¿Qué recibirás si continúas con el acompañamiento?
                </p>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: 18,
                    display: "grid",
                    gap: 2,
                  }}
                >
                  <li>Lista orientativa de documentos habituales según tu tipo de viaje.</li>
                  <li>Resumen estructurado de tu caso para completar el formulario.</li>
                  <li>Orden sugerido para presentar tu información en la carpeta.</li>
                </ul>
              </div>

              <p
                style={{
                  margin: 0,
                  fontSize: 11,
                  color: "#6b7280",
                }}
              >
                Nota: Las decisiones sobre visas dependen siempre de cada consulado.
                Este servicio te ayuda a presentar tu información de forma más clara,
                pero no garantiza resultados.
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 8,
                  gap: 8,
                }}
              >
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 999,
                    border: "1px solid #d1d5db",
                    background: "#ffffff",
                    color: "#374151",
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Volver
                </button>
                <button
                  type="button"
                  style={{
                    padding: "8px 16px",
                    borderRadius: 999,
                    border: "none",
                    background: "#0f766e",
                    color: "#ffffff",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Continuar con el acompañamiento
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
