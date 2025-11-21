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
          Errores comunes al llenar el DS-160 que deberías evitar
        </h1>

        <p
          style={{
            margin: "0 0 12px",
            fontSize: 14,
            color: "#4b5563",
          }}
        >
          Muchos rechazos y revisiones adicionales se originan en errores pequeños.
          Aquí describimos los más frecuentes para que puedas detectarlos a tiempo.
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
          <li>Fechas que no coinciden entre estudios, trabajo y viajes.</li>
          <li>
            Motivo del viaje mal explicado o poco coherente con tu situación
            económica.
          </li>
          <li>
            Información laboral que no se sostiene cuando llega el momento de la
            entrevista.
          </li>
          <li>
            Direcciones mal escritas o en un formato que el sistema no reconoce
            bien.
          </li>
          <li>
            Preguntas de seguridad mal interpretadas por confusión con el inglés.
          </li>
        </ul>

        <p
          style={{
            margin: "12px 0 0",
            fontSize: 14,
            color: "#4b5563",
          }}
        >
          La idea de trabajar con un asistente es justamente reducir estos errores
          antes de que lleguen al sistema oficial.
        </p>
      </section>
    </div>
  );
}
