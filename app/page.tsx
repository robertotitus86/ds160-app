"use client";

import Link from "next/link";
import { useState } from "react";

type VisaType = "usa" | "schengen";

export default function Page() {
  const [selectedVisa, setSelectedVisa] = useState<VisaType>("usa");

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
              {/* Badge superior */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "4px 10px",
                  borderRadius: 999,
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                    background:
                      "linear-gradient(135deg, #2563eb 0%, #0f766e 100%)",
                  }}
                />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: "#1d4ed8",
                  }}
                >
                  Acompañamiento para visas de Estados Unidos y Europa
                </span>
              </div>

              <h1
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  margin: "0 0 8px",
                  color: "#111827",
                }}
              >
                Organiza tu trámite de visa con claridad, orden y acompañamiento
                experto
              </h1>

              <p
                style={{
                  fontSize: 14,
                  color: "#4b5563",
                  margin: "0 0 12px",
                  lineHeight: 1.5,
                }}
              >
                Procesos guiados, sin confusión y adaptados a tu tipo de viaje.
              </p>

              <p
                style={{
                  fontSize: 12,
                  color: "#6b7280",
                  margin: "0 0 16px",
                }}
              >
                Plataforma privada de acompañamiento · No es el sitio oficial de
                ninguna embajada.
              </p>

              <p
                style={{
                  fontSize: 13,
                  color: "#4b5563",
                  margin: "0 0 8px",
                  fontWeight: 500,
                }}
              >
                ¿A dónde vas a viajar?
              </p>

              {/* Selector de tipo de visa */}
              <div
                style={{
                  display: "grid",
                  gap: 10,
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                }}
              >
                <button
                  type="button"
                  onClick={() => setSelectedVisa("usa")}
                  style={{
                    textAlign: "left",
                    borderRadius: 16,
                    border:
                      selectedVisa === "usa"
                        ? "2px solid #2563eb"
                        : "1px solid #e5e7eb",
                    padding: 12,
                    background:
                      selectedVisa === "usa" ? "#eff6ff" : "#f9fafb",
                    cursor: "pointer",
                    display: "grid",
                    gap: 6,
                    transition: "border-color 0.15s, background 0.15s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 999,
                        border: "2px solid #1d4ed8",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#1d4ed8",
                      }}
                    >
                      US
                    </div>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#111827",
                      }}
                    >
                      Viajo a Estados Unidos
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: 12,
                      color: "#4b5563",
                    }}
                  >
                    Formulario DS-160, preparación de entrevista y toma de cita.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedVisa("schengen")}
                  style={{
                    textAlign: "left",
                    borderRadius: 16,
                    border:
                      selectedVisa === "schengen"
                        ? "2px solid #059669"
                        : "1px solid #e5e7eb",
                    padding: 12,
                    background:
                      selectedVisa === "schengen" ? "#ecfdf5" : "#f9fafb",
                    cursor: "pointer",
                    display: "grid",
                    gap: 6,
                    transition: "border-color 0.15s, background 0.15s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 999,
                        border: "2px solid #047857",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#047857",
                      }}
                    >
                      EU
                    </div>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#111827",
                      }}
                    >
                      Viajo a Europa (visa Schengen)
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: 12,
                      color: "#065f46",
                    }}
                  >
                    Checklist de requisitos, organización de documentos y
                    formulario.
                  </span>
                </button>
              </div>
            </div>

            {/* mini tarjetas de proceso general */}
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
                  display: "flex",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 999,
                    background: "#eff6ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#1d4ed8",
                  }}
                >
                  1
                </div>
                <div>
                  <strong style={{ display: "block", marginBottom: 2 }}>
                    Respondes en español
                  </strong>
                  Usamos lenguaje claro, sin tecnicismos legales ni confusión.
                </div>
              </article>

              <article
                style={{
                  borderRadius: 14,
                  border: "1px solid #e5e7eb",
                  padding: 12,
                  background: "#f9fafb",
                  fontSize: 12,
                  color: "#4b5563",
                  display: "flex",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 999,
                    background: "#f3f4f6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#374151",
                  }}
                >
                  2
                </div>
                <div>
                  <strong style={{ display: "block", marginBottom: 2 }}>
                    Ordenamos tu información
                  </strong>
                  Revisamos coherencia entre empleo, ingresos, viajes y motivo.
                </div>
              </article>

              <article
                style={{
                  borderRadius: 14,
                  border: "1px solid #d1fae5",
                  padding: 12,
                  background: "#ecfdf5",
                  fontSize: 12,
                  color: "#065f46",
                  display: "flex",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 999,
                    background: "#bbf7d0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#166534",
                  }}
                >
                  3
                </div>
                <div>
                  <strong style={{ display: "block", marginBottom: 2 }}>
                    Llegas con más seguridad
                  </strong>
                  Obtienes datos claros para llenar el formulario oficial y
                  prepararte mejor para la entrevista.
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ===================== PLANES SEGÚN TIPO DE VISA ===================== */}
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: 20,
                  fontWeight: 700,
                }}
              >
                {selectedVisa === "usa"
                  ? "Planes para visa de Estados Unidos"
                  : "Planes para visa Schengen (Europa)"}
              </h2>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  color: "#4b5563",
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    background:
                      selectedVisa === "usa" ? "#2563eb" : "#059669",
                  }}
                />
                <span>
                  Selección actual:{" "}
                  <strong>
                    {selectedVisa === "usa"
                      ? "Viaje a Estados Unidos"
                      : "Viaje a Europa / Schengen"}
                  </strong>
                </span>
              </div>
            </div>

            <span
              style={{
                fontSize: 11,
                color: "#6b7280",
                padding: "4px 8px",
                borderRadius: 999,
                border: "1px solid #e5e7eb",
              }}
            >
              Puedes cambiar de destino en cualquier momento
            </span>
          </div>

          {selectedVisa === "usa" && (
            <div
              style={{
                display: "grid",
                gap: 12,
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              }}
            >
              {/* Llenado DS-160 */}
              <article
                style={{
                  borderRadius: 16,
                  border: "1px solid #e5e7eb",
                  padding: 16,
                  display: "grid",
                  gap: 8,
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 12,
                    fontSize: 11,
                    padding: "2px 8px",
                    borderRadius: 999,
                    background: "#eff6ff",
                    color: "#1d4ed8",
                    border: "1px solid #bfdbfe",
                  }}
                >
                  Plan más elegido
                </span>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: "#2563eb1a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#1d4ed8",
                    marginBottom: 4,
                  }}
                >
                  DS
                </div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  Llenado DS-160
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: "#4b5563",
                  }}
                >
                  Respondes en español y te ayudamos a estructurar la
                  información en el formulario oficial, evitando errores
                  frecuentes.
                </p>
                <ul
                  style={{
                    margin: "4px 0 0",
                    paddingLeft: 18,
                    fontSize: 12,
                    color: "#4b5563",
                    display: "grid",
                    gap: 2,
                  }}
                >
                  <li>Revisión de coherencia en fechas y datos clave.</li>
                  <li>Apoyo en secciones que suelen generar confusión.</li>
                </ul>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 6,
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

              {/* Asesoría entrevista */}
              <article
                style={{
                  borderRadius: 16,
                  border: "1px solid #e5e7eb",
                  padding: 16,
                  display: "grid",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: "#1118270d",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#111827",
                    marginBottom: 4,
                  }}
                >
                  EN
                </div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  Asesoría de entrevista
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: "#4b5563",
                  }}
                >
                  Practica preguntas, ordena tu historia y revisa que lo que
                  dices coincida con tu DS-160.
                </p>
                <ul
                  style={{
                    margin: "4px 0 0",
                    paddingLeft: 18,
                    fontSize: 12,
                    color: "#4b5563",
                    display: "grid",
                    gap: 2,
                  }}
                >
                  <li>Simulación de entrevista en español.</li>
                  <li>Comentarios sobre claridad y coherencia.</li>
                </ul>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 6,
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

              {/* Toma de cita */}
              <article
                style={{
                  borderRadius: 16,
                  border: "1px solid #e5e7eb",
                  padding: 16,
                  display: "grid",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: "#f9731615",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#c2410c",
                    marginBottom: 4,
                  }}
                >
                  CT
                </div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  Toma de cita (DS-160 ya listo)
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: "#4b5563",
                  }}
                >
                  Usamos tu DS-160 completado y te ayudamos a agendar la cita
                  correctamente.
                </p>
                <ul
                  style={{
                    margin: "4px 0 0",
                    paddingLeft: 18,
                    fontSize: 12,
                    color: "#4b5563",
                    display: "grid",
                    gap: 2,
                  }}
                >
                  <li>Revisión rápida de datos antes de agendar.</li>
                  <li>Apoyo para evitar errores en el sistema.</li>
                </ul>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 6,
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
          )}

          {selectedVisa === "schengen" && (
            <div
              style={{
                display: "grid",
                gap: 12,
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              }}
            >
              {/* Requisitos express */}
              <article
                style={{
                  borderRadius: 16,
                  border: "1px solid #d1fae5",
                  padding: 16,
                  display: "grid",
                  gap: 8,
                  background: "#ecfdf5",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: "#0478571a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#047857",
                    marginBottom: 4,
                  }}
                >
                  RQ
                </div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  Requisitos Schengen Express
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: "#065f46",
                  }}
                >
                  Checklist personalizado de documentos mínimos según tu tipo de
                  viaje turístico.
                </p>
                <ul
                  style={{
                    margin: "4px 0 0",
                    paddingLeft: 18,
                    fontSize: 12,
                    color: "#065f46",
                    display: "grid",
                    gap: 2,
                  }}
                >
                  <li>Resumen de documentos esenciales.</li>
                  <li>Orientación general para organizar tu carpeta.</li>
                </ul>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 6,
                  }}
                >
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: "#047857",
                    }}
                  >
                    $5 USD
                  </span>
                  <Link
                    href="/schengen/wizard?plan=schengen_requisitos"
                    style={{
                      padding: "8px 14px",
                      borderRadius: 999,
                      background: "#059669",
                      color: "#ffffff",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    Empezar
                  </Link>
                </div>
              </article>

              {/* Llenado formulario */}
              <article
                style={{
                  borderRadius: 16,
                  border: "1px solid #e5e7eb",
                  padding: 16,
                  display: "grid",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: "#0f766e15",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#0f766e",
                    marginBottom: 4,
                  }}
                >
                  FR
                </div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  Llenado formulario Schengen
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: "#4b5563",
                  }}
                >
                  Respondes en español; te ayudamos a ordenar la información y
                  completar el formulario según el consulado.
                </p>
                <ul
                  style={{
                    margin: "4px 0 0",
                    paddingLeft: 18,
                    fontSize: 12,
                    color: "#4b5563",
                    display: "grid",
                    gap: 2,
                  }}
                >
                  <li>Apoyo en secciones que generan dudas.</li>
                  <li>Revisión general de consistencia.</li>
                </ul>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 6,
                  }}
                >
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                    }}
                  >
                    $25 USD
                  </span>
                  <Link
                    href="/schengen/wizard?plan=schengen_llenado"
                    style={{
                      padding: "8px 14px",
                      borderRadius: 999,
                      background: "#0f766e",
                      color: "#ffffff",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    Empezar
                  </Link>
                </div>
              </article>

              {/* Acompañamiento completo */}
              <article
                style={{
                  borderRadius: 16,
                  border: "1px solid #e5e7eb",
                  padding: 16,
                  display: "grid",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: "#04785710",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#047857",
                    marginBottom: 4,
                  }}
                >
                  AC
                </div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  Acompañamiento completo Schengen
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: "#4b5563",
                  }}
                >
                  Requisitos, estructura de tu caso y acompañamiento en todo el
                  proceso de solicitud de visa turística.
                </p>
                <ul
                  style={{
                    margin: "4px 0 0",
                    paddingLeft: 18,
                    fontSize: 12,
                    color: "#4b5563",
                    display: "grid",
                    gap: 2,
                  }}
                >
                  <li>Guía integral desde el inicio hasta la entrega.</li>
                  <li>Enfoque en claridad y orden de tu viaje.</li>
                </ul>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 6,
                  }}
                >
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                    }}
                  >
                    $40 USD
                  </span>
                  <Link
                    href="/schengen/wizard?plan=schengen_completo"
                    style={{
                      padding: "8px 14px",
                      borderRadius: 999,
                      background: "#047857",
                      color: "#ffffff",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    Empezar
                  </Link>
                </div>
              </article>
            </div>
          )}
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
            Viajeros que prepararon mejor su trámite de visa
          </h2>
          <p
            style={{
              margin: "0 0 14px",
              fontSize: 13,
              color: "#4b5563",
            }}
          >
            Historias de personas que organizaron su información antes de
            solicitar su visa de turismo a Estados Unidos o Europa.
          </p>

          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            }}
          >
            {/* María */}
            <article
              style={{
                borderRadius: 16,
                border: "1px solid #e5e7eb",
                padding: 14,
                background: "#f9fafb",
                fontSize: 13,
                color: "#4b5563",
                display: "grid",
                gap: 8,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    overflow: "hidden",
                    background: "#e5e7eb",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src="/images/testimonios/maria.png"
                    alt="María, viajera de turismo"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>
                <div>
                  <strong
                    style={{
                      display: "block",
                      fontSize: 13,
                    }}
                  >
                    María S.
                  </strong>
                  <span
                    style={{
                      fontSize: 11,
                      color: "#6b7280",
                    }}
                  >
                    Viaje turístico a Estados Unidos
                  </span>
                </div>
              </div>
              <p style={{ margin: 0 }}>
                “Quería hacer un viaje de turismo pero el formulario me parecía
                demasiado largo. Aquí pude responder todo en español y ver mi
                información ordenada antes de pasarla al DS-160.”
              </p>
            </article>

            {/* Mario */}
            <article
              style={{
                borderRadius: 16,
                border: "1px solid #e5e7eb",
                padding: 14,
                background: "#f9fafb",
                fontSize: 13,
                color: "#4b5563",
                display: "grid",
                gap: 8,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    overflow: "hidden",
                    background: "#e5e7eb",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src="/images/testimonios/mario.png"
                    alt="Mario, viajero con maleta de mano"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>
                <div>
                  <strong
                    style={{
                      display: "block",
                      fontSize: 13,
                    }}
                  >
                    Mario R.
                  </strong>
                  <span
                    style={{
                      fontSize: 11,
                      color: "#6b7280",
                    }}
                  >
                    Turismo y compras en Miami
                  </span>
                </div>
              </div>
              <p style={{ margin: 0 }}>
                “Tenía miedo de mezclar fechas y viajes anteriores. El
                acompañamiento me ayudó a revisar todo con calma y sentir que el
                formulario contaba bien mi historia.”
              </p>
            </article>

            {/* Andrea */}
            <article
              style={{
                borderRadius: 16,
                border: "1px solid #e5e7eb",
                padding: 14,
                background: "#f9fafb",
                fontSize: 13,
                color: "#4b5563",
                display: "grid",
                gap: 8,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    overflow: "hidden",
                    background: "#e5e7eb",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src="/images/testimonios/andrea.png"
                    alt="Andrea, viajera por Europa"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>
                <div>
                  <strong
                    style={{
                      display: "block",
                      fontSize: 13,
                    }}
                  >
                    Andrea M.
                  </strong>
                  <span
                    style={{
                      fontSize: 11,
                      color: "#6b7280",
                    }}
                  >
                    Tour turístico por ciudades de Europa
                  </span>
                </div>
              </div>
              <p style={{ margin: 0 }}>
                “Para la visa Schengen veía demasiados requisitos diferentes. Con
                la lista y el resumen que armamos, por fin sentí que mi carpeta
                tenía un orden lógico.”
              </p>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
