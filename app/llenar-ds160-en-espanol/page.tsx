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
        <h1 style={ margin: "0 0 12px", fontSize: 22, fontWeight: 700 }>
          Cómo llenar el formulario DS-160 en español sin cometer errores
        </h1>
        <p
          style={{ margin: "0 0 12px", fontSize: 14, color: "#4b5563" }}
        >
          Si el inglés del DS-160 te genera dudas, esta guía te ayuda a entender qué está pidiendo cada sección y cómo prepararte antes de sentarte frente al formulario oficial.
        </p>
        <p style={{ margin: "0 0 8px", fontSize: 14, color: "#4b5563" }}>
          Esta página forma parte de la información general sobre el proceso de
          visa y no reemplaza la revisión personalizada de tu caso. Siempre debes
          contrastar esta información con las indicaciones oficiales de la
          Embajada y del formulario DS-160.
        </p>
        <p style={{ margin: "0 0 8px", fontSize: 14, color: "#4b5563" }}>
          Nuestro asistente en español está diseñado para ayudarte a expresar tu
          situación real de forma clara y coherente, y luego trasladar esa
          información al formato oficial del DS-160.
        </p>
      </section>
    </div>
  );
}
