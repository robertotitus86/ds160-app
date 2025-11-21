"use client";

import React from "react";

export default function Page() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <section
        style={{
          background: "#ffffff",
          borderRadius: 16,
          border: "1px solid #e5e7eb",
          padding: 20,
          boxShadow: "0 8px 18px rgba(15, 23, 42, 0.04)",
        }}
      >
        <h1
          style={{
            margin: "0 0 12px",
            fontSize: 22,
            fontWeight: 700,
          }}
        >
          Cómo prepararte para la entrevista de visa de EE.UU.
        </h1>

        <p
          style={{
            margin: "0 0 12px",
            fontSize: 14,
            color: "#4b5563",
          }}
        >
          La entrevista es el momento en el que el oficial consular contrasta lo
          que ve en tu DS-160 con lo que dices y cómo lo dices. No se trata de
          memorizar respuestas, sino de explicar tu situación con claridad.
        </p>

        <p
          style={{
            margin: "0 0 8px",
            fontSize: 14,
            color: "#4b5563",
          }}
        >
          Prepararte significa:
        </p>

        <ul
          style={{
            margin: 0,
            paddingLeft: 18,
            fontSize: 14,
            color: "#374151",
            display: "grid",
            gap: 4,
          }}
        >
          <li>Entender bien lo que declaraste en tu DS-160.</li>
          <li>Saber explicar tu motivo de viaje en 1–2 frases claras.</li>
          <li>Tener coherencia entre tu empleo, ingresos y plan de viaje.</li>
          <li>
            Estar listo para responder sobre tu arraigo y motivos para regresar a
            tu país.
          </li>
        </ul>

        <p
          style={{
            margin: "12px 0 0",
            fontSize: 14,
            color: "#4b5563",
          }}
        >
          Una buena asesoría no te da un libreto, sino que te ayuda a ordenar tu
          propia historia para que puedas explicarla sin contradicciones.
        </p>
      </section>
    </div>
  );
}
