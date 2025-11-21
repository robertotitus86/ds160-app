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
          Cómo agendar correctamente tu cita en la Embajada de EE.UU.
        </h1>

        <p
          style={{
            margin: "0 0 12px",
            fontSize: 14,
            color: "#4b5563",
          }}
        >
          Después de completar el DS-160, el siguiente paso es crear tu perfil en
          el sistema de citas y seleccionar la fecha disponible que mejor se adapte
          a tu planificación.
        </p>

        <p
          style={{
            margin: "0 0 8px",
            fontSize: 14,
            color: "#4b5563",
          }}
        >
          En términos generales, el flujo implica:
        </p>

        <ol
          style={{
            margin: 0,
            paddingLeft: 18,
            fontSize: 14,
            color: "#374151",
            display: "grid",
            gap: 4,
          }}
        >
          <li>Completar el DS-160 y conservar el código de confirmación.</li>
          <li>Crear una cuenta en el sistema de citas de la Embajada.</li>
          <li>Vincular tu DS-160 a ese perfil.</li>
          <li>Seleccionar tipo de visa, ciudad y fecha disponible.</li>
        </ol>

        <p
          style={{
            margin: "12px 0 0",
            fontSize: 14,
            color: "#4b5563",
          }}
        >
          El acompañamiento en la toma de cita se enfoca en que no cometas errores
          al registrar el código del DS-160, seleccionar categoría de visa o
          confirmar datos sensibles que luego no se puedan corregir fácilmente.
        </p>
      </section>
    </div>
  );
}
