"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type SchengenStepKey = "perfil" | "viaje" | "documentos" | "resumen";

type SchengenPlanId = "schengen_requisitos" | "schengen_llenado" | "schengen_completo";

type SchengenFormState = {
  // Perfil
  nombreCompleto: string;
  nacionalidad: string;
  ciudadResidencia: string;
  telefono: string;
  email: string;

  // Viaje
  paisDestino: string;
  motivoViaje: string;
  fechaSalida: string;
  fechaRegreso: string;
  diasEstancia: string;
  tieneInvitante: string; // Sí/No
  quienPagaViaje: string; // Yo / Patrocinador

  // Documentos
  tienePasaporteVigente: string;
  tieneSeguro: string;
  tieneReservasVuelo: string;
  tieneReservasAlojamiento: string;
  comentariosAdicionales: string;
};

const STORAGE_KEY = "schengen_form_v1";

const initialSchengenState: SchengenFormState = {
  nombreCompleto: "",
  nacionalidad: "",
  ciudadResidencia: "",
  telefono: "",
  email: "",
  paisDestino: "",
  motivoViaje: "",
  fechaSalida: "",
  fechaRegreso: "",
  diasEstancia: "",
  tieneInvitante: "",
  quienPagaViaje: "",
  tienePasaporteVigente: "",
  tieneSeguro: "",
  tieneReservasVuelo: "",
  tieneReservasAlojamiento: "",
  comentariosAdicionales: "",
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    padding: "16px 12px 32px",
  },
  shell: {
    width: "100%",
    maxWidth: 1120,
    display: "grid",
    gap: 16,
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  h1: {
    margin: 0,
    fontSize: 22,
    fontWeight: 700,
  },
  pMuted: {
    margin: 0,
    fontSize: 13,
    color: "#4b5563",
  },
  layout: {
    display: "grid",
    gap: 16,
  },
  sidebar: {
    background: "#ffffff",
    borderRadius: 16,
    border: "1px solid #e5e7eb",
    padding: 16,
  },
  stepsList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "grid",
    gap: 6,
  },
  stepItem: {
    padding: "8px 10px",
    borderRadius: 999,
    fontSize: 13,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  stepBullet: {
    width: 18,
    height: 18,
    borderRadius: 999,
    border: "1px solid #d1d5db",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
  },
  stepActive: {
    background: "#eff6ff",
    color: "#1d4ed8",
  },
  card: {
    background: "#ffffff",
    borderRadius: 16,
    border: "1px solid #e5e7eb",
    padding: 16,
  },
  fieldGroup: {
    display: "grid",
    gap: 10,
  },
  field: {
    display: "grid",
    gap: 4,
  },
  labelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: 500,
  },
  input: {
    width: "100%",
    maxWidth: 420,
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid #cbd5e1",
    background: "#f9fafb",
    color: "#111827",
    fontSize: 13,
  },
  textarea: {
    width: "100%",
    maxWidth: 700,
    minHeight: 80,
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid #cbd5e1",
    background: "#f9fafb",
    color: "#111827",
    fontSize: 13,
  },
  help: {
    fontSize: 12,
    opacity: 0.75,
    marginTop: 2,
  },
  stepIntro: {
    marginTop: 4,
    marginBottom: 12,
    fontSize: 13,
    color: "#4b5563",
  },
  actions: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },
  btn: {
    background: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: 10,
    padding: "9px 14px",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
  },
  ghost: {
    background: "#e5e7eb",
    color: "#111827",
    border: "none",
    borderRadius: 10,
    padding: "9px 14px",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
  },
};

const STEP_INTROS: Record<SchengenStepKey, string> = {
  perfil:
    "Empezamos por lo básico: tus datos y cómo te contactamos, además de tu nacionalidad y ciudad de residencia.",
  viaje:
    "Luego aclaramos a dónde vas, por qué viajas, cuánto tiempo y quién cubre los gastos.",
  documentos:
    "Aquí revisamos qué documentos clave ya tienes y cuáles faltan para tu checklist.",
  resumen:
    "Finalmente, verás un resumen para que puedas usarlo al preparar tu solicitud y documentos.",
};

const STEPS: { key: SchengenStepKey; title: string }[] = [
  { key: "perfil", title: "1. Perfil" },
  { key: "viaje", title: "2. Viaje" },
  { key: "documentos", title: "3. Documentos" },
  { key: "resumen", title: "4. Resumen" },
];

function loadInitialState(): SchengenFormState {
  if (typeof window === "undefined") return initialSchengenState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialSchengenState;
    const parsed = JSON.parse(raw) as SchengenFormState;
    return { ...initialSchengenState, ...parsed };
  } catch {
    return initialSchengenState;
  }
}

function SchengenWizardInner() {
  const params = useSearchParams();
  const planParam = (params.get("plan") || "") as SchengenPlanId | "";

  const [step, setStep] = useState<SchengenStepKey>("perfil");
  const [data, setData] = useState<SchengenFormState>(() => loadInitialState());

  // Persistir en localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore
    }
  }, [data]);

  function update<K extends keyof SchengenFormState>(key: K, value: SchengenFormState[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  const currentIndex = useMemo(
    () => STEPS.findIndex((s) => s.key === step),
    [step]
  );

  function goNext() {
    const idx = STEPS.findIndex((s) => s.key === step);
    if (idx < STEPS.length - 1) {
      setStep(STEPS[idx + 1].key);
    }
  }

  function goPrev() {
    const idx = STEPS.findIndex((s) => s.key === step);
    if (idx > 0) {
      setStep(STEPS[idx - 1].key);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <header style={styles.header}>
          <h1 style={styles.h1}>Asistente para visa Schengen</h1>
          <p style={styles.pMuted}>
            Esta guía no es el formulario oficial, sino una forma de ordenar tu
            información en español antes de completar la solicitud del consulado.
          </p>
        </header>

        <div style={styles.layout}>
          <aside style={styles.sidebar}>
            <ul style={styles.stepsList}>
              {STEPS.map((s, index) => {
                const isActive = s.key === step;
                return (
                  <li
                    key={s.key}
                    style={{
                      ...styles.stepItem,
                      ...(isActive ? styles.stepActive : {}),
                    }}
                  >
                    <span style={styles.stepBullet}>{index + 1}</span>
                    <span>{s.title}</span>
                  </li>
                );
              })}
            </ul>
            {planParam && (
              <p style={{ ...styles.pMuted, marginTop: 12 }}>
                Plan seleccionado: <b>{planParam}</b>
              </p>
            )}
          </aside>

          <section style={styles.card}>
            <h2 style={{ marginTop: 0 }}>
              {STEPS.find((s) => s.key === step)?.title}
            </h2>
            <p style={styles.stepIntro}>{STEP_INTROS[step]}</p>

            {step === "perfil" && (
              <div style={styles.fieldGroup}>
                <div style={styles.field}>
                  <div style={styles.labelRow}>
                    <label style={styles.label}>Nombre completo</label>
                  </div>
                  <input
                    style={styles.input}
                    value={data.nombreCompleto}
                    onChange={(e) => update("nombreCompleto", e.target.value)}
                  />
                </div>

                <div style={styles.field}>
                  <div style={styles.labelRow}>
                    <label style={styles.label}>Nacionalidad</label>
                  </div>
                  <input
                    style={styles.input}
                    value={data.nacionalidad}
                    onChange={(e) => update("nacionalidad", e.target.value)}
                  />
                </div>

                <div style={styles.field}>
                  <div style={styles.labelRow}>
                    <label style={styles.label}>Ciudad de residencia</label>
                  </div>
                  <input
                    style={styles.input}
                    value={data.ciudadResidencia}
                    onChange={(e) =>
                      update("ciudadResidencia", e.target.value)
                    }
                  />
                </div>

                <div style={styles.field}>
                  <div style={styles.labelRow}>
                    <label style={styles.label}>Teléfono</label>
                  </div>
                  <input
                    style={styles.input}
                    value={data.telefono}
                    onChange={(e) => update("telefono", e.target.value)}
                  />
                </div>

                <div style={styles.field}>
                  <div style={styles.labelRow}>
                    <label style={styles.label}>Correo electrónico</label>
                  </div>
                  <input
                    style={styles.input}
                    value={data.email}
                    onChange={(e) => update("email", e.target.value)}
                  />
                </div>
              </div>
            )}

            {step === "viaje" && (
              <div style={styles.fieldGroup}>
                <div style={styles.field}>
                  <div style={styles.labelRow}>
                    <label style={styles.label}>País de destino principal</label>
                  </div>
                  <input
                    style={styles.input}
                    value={data.paisDestino}
                    onChange={(e) => update("paisDestino", e.target.value)}
                  />
                  <p style={styles.help}>
                    Por ejemplo: España, Francia, Alemania. Es el país donde pasarás
                    más tiempo.
                  </p>
                </div>

                <div style={styles.field}>
                  <div style={styles.labelRow}>
                    <label style={styles.label}>Motivo principal del viaje</label>
                  </div>
                  <input
                    style={styles.input}
                    placeholder="Turismo, visita familiar, negocios, estudios cortos, etc."
                    value={data.motivoViaje}
                    onChange={(e) => update("motivoViaje", e.target.value)}
                  />
                </div>

                <div style={styles.field}>
                  <div style={styles.labelRow}>
                    <label style={styles.label}>Fecha estimada de salida</label>
                  </div>
                  <input
                    type="date"
                    style={styles.input}
                    value={data.fechaSalida}
                    onChange={(e) => update("fechaSalida", e.target.value)}
                  />
                </div>

                <div style={styles.field}>
                  <div style={styles.labelRow}>
                    <label style={styles.label}>Fecha estimada de regreso</label>
                  </div>
                  <input
                    type="date"
                    style={styles.input}
                    value={data.fechaRegreso}
                    onChange={(e) => update("fechaRegreso", e.target.value)}
                  />
                </div>

                <div style={styles.field}>
                  <div style={styles.labelRow}>
                    <label style={styles.label}>Días aproximados de estancia</label>
                  </div>
                  <input
                    style={styles.input}
                    value={data.diasEstancia}
                    onChange={(e) => update("diasEstancia", e.target.value)}
                  />
                  <p style={styles.help}>
                    Ayuda a estimar medios económicos mínimos según lo que pide el
                    consulado (por ejemplo, cierto monto por día).
                  </p>
                </div>

                <div style={styles.field}>
                  <div style={styles.labelRow}>
                    <label style={styles.label}>
                      ¿Tienes invitante en el país de destino?
                    </label>
                  </div>
                  <input
                    style={styles.input}
                    placeholder="Sí / No. Si la respuesta es sí, indica si es familiar, amigo, empresa, etc."
                    value={data.tieneInvitante}
                    onChange={(e) => update("tieneInvitante", e.target.value)}
                  />
                </div>

                <div style={styles.field}>
                  <div style={styles.labelRow}>
                    <label style={styles.label}>
                      ¿Quién cubre los gastos del viaje?
                    </label>
                  </div>
                  <input
                    style={styles.input}
                    placeholder="Yo mismo, mis padres, patrocinador, empresa, etc."
                    value={data.quienPagaViaje}
                    onChange={(e) => update("quienPagaViaje", e.target.value)}
                  />
                </div>
              </div>
            )}

            {step === "documentos" && (
              <div style={styles.fieldGroup}>
                <div style={styles.field}>
                  <div style={styles.labelRow}>
                    <label style={styles.label}>
                      ¿Tienes pasaporte vigente que cumpla los requisitos?
                    </label>
                  </div>
                  <input
                    style={styles.input}
                    placeholder="Sí / No / No estoy seguro"
                    value={data.tienePasaporteVigente}
                    onChange={(e) =>
                      update("tienePasaporteVigente", e.target.value)
                    }
                  />
                  <p style={styles.help}>
                    Validez mínima, páginas en blanco, antigüedad máxima, etc., según
                    lo que suele pedir el consulado.
                  </p>
                </div>

                <div style={styles.field}>
                  <div style={styles.labelRow}>
                    <label style={styles.label}>¿Ya tienes seguro médico de viaje?</label>
                  </div>
                  <input
                    style={styles.input}
                    placeholder="Sí / No"
                    value={data.tieneSeguro}
                    onChange={(e) => update("tieneSeguro", e.target.value)}
                  />
                </div>

                <div style={styles.field}>
                  <div style={styles.labelRow}>
                    <label style={styles.label}>¿Tienes reservas de vuelo?</label>
                  </div>
                  <input
                    style={styles.input}
                    placeholder="Sí / No / Aún no reservo"
                    value={data.tieneReservasVuelo}
                    onChange={(e) =>
                      update("tieneReservasVuelo", e.target.value)
                    }
                  />
                </div>

                <div style={styles.field}>
                  <div style={styles.labelRow}>
                    <label style={styles.label}>¿Tienes reservas de alojamiento?</label>
                  </div>
                  <input
                    style={styles.input}
                    placeholder="Hotel, Airbnb, casa de familiar, etc."
                    value={data.tieneReservasAlojamiento}
                    onChange={(e) =>
                      update("tieneReservasAlojamiento", e.target.value)
                    }
                  />
                </div>

                <div style={styles.field}>
                  <div style={styles.labelRow}>
                    <label style={styles.label}>
                      Comentarios adicionales sobre tu situación
                    </label>
                  </div>
                  <textarea
                    style={styles.textarea}
                    value={data.comentariosAdicionales}
                    onChange={(e) =>
                      update("comentariosAdicionales", e.target.value)
                    }
                  />
                </div>
              </div>
            )}

            {step === "resumen" && (
              <div style={styles.fieldGroup}>
                <p style={styles.pMuted}>
                  Este es un resumen de lo que has indicado. Puedes usarlo como guía
                  al revisar los requisitos oficiales y preparar tu solicitud.
                </p>
                <pre
                  style={{
                    background: "#f9fafb",
                    borderRadius: 10,
                    padding: 12,
                    fontSize: 12,
                    maxWidth: "100%",
                    overflowX: "auto",
                    border: "1px solid #e5e7eb",
                  }}
                >
{`Perfil:
- Nombre completo: ${"${data.nombreCompleto}"}
- Nacionalidad: ${"${data.nacionalidad}"}
- Ciudad de residencia: ${"${data.ciudadResidencia}"}
- Teléfono: ${"${data.telefono}"}
- Email: ${"${data.email}"}

Viaje:
- País de destino: ${"${data.paisDestino}"}
- Motivo del viaje: ${"${data.motivoViaje}"}
- Fecha salida: ${"${data.fechaSalida}"} / regreso: ${"${data.fechaRegreso}"}
- Días de estancia: ${"${data.diasEstancia}"}
- Invitante: ${"${data.tieneInvitante}"}
- Quién paga: ${"${data.quienPagaViaje}"}

Documentos:
- Pasaporte vigente: ${"${data.tienePasaporteVigente}"}
- Seguro médico de viaje: ${"${data.tieneSeguro}"}
- Reservas de vuelo: ${"${data.tieneReservasVuelo}"}
- Reservas de alojamiento: ${"${data.tieneReservasAlojamiento}"}

Comentarios:
${"${data.comentariosAdicionales}"}
`}
                </pre>
                <p style={styles.pMuted}>
                  Recuerda que esto no reemplaza los requisitos oficiales ni garantiza
                  una aprobación. Sirve como apoyo para que prepares mejor tu caso.
                </p>
              </div>
            )}

            <div style={{ marginTop: 16 }}>
              <div style={styles.actions}>
                <button
                  type="button"
                  style={styles.ghost}
                  onClick={goPrev}
                  disabled={currentIndex === 0}
                >
                  Anterior
                </button>
                {step !== "resumen" && (
                  <button type="button" style={styles.btn} onClick={goNext}>
                    Siguiente
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function SchengenWizardPage() {
  return <SchengenWizardInner />;
}
