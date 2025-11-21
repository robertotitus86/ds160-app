"use client";

import React from "react";
import Link from "next/link";

const styles = {
  wrapper: {
    display: "grid",
    gap: 24,
  } as React.CSSProperties,

  card: {
    background: "#ffffff",
    borderRadius: 20,
    border: "1px solid #e5e7eb",
    padding: 20,
    boxShadow: "0 8px 18px rgba(15, 23, 42, 0.04)",
  } as React.CSSProperties,

  heroTitle: {
    fontSize: 28,
    fontWeight: 700,
    margin: "0 0 8px",
    color: "#111827",
  } as React.CSSProperties,

  heroSubtitle: {
    fontSize: 15,
    color: "#4b5563",
    margin: "0 0 16px",
    lineHeight: 1.5,
  } as React.CSSProperties,

  heroButtonsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 8,
  } as React.CSSProperties,  // ← AQUÍ ESTABA EL ERROR, COMA AÑADIDA

  bulletsList: {
    margin: 0,
    paddingLeft: 18,
    fontSize: 13,
    color: "#374151",
    display: "grid",
    gap: 4,
  } as React.CSSProperties,

  h2: {
    fontSize: 20,
    fontWeight: 700,
    margin: "0 0 12px",
  } as React.CSSProperties,

  testimonial: {
    borderLeft: "4px solid #3b82f6",
    paddingLeft: 12,
    fontSize: 14,
    color: "#4b5563",
  } as React.CSSProperties,
};

export default function Page() {
  return (
    <div style={styles.wrapper}>
      
      {/* ===================== HERO ===================== */}
      <section style={styles.card}>
        <h1 style={styles.heroTitle}>
          Acompañamiento en español para tu visa de EE.UU.
        </h1>
        <p style={styles.heroSubtitle}>
          Te guiamos paso a paso para llenar el DS-160 correctamente,
          evitar errores comunes y preparar tu cita con confianza.
          *No somos la embajada, somos una plataforma de apoyo.*
        </p>

        <div style={styles.heroButtonsRow}>
          <Link
            href="/wizard?plan=ds160"
            style={{
              padding: "10px 16px",
              background: "#2563eb",
              color: "white",
              borderRadius: 10,
              fontSize: 14,
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
              borderRadius: 10,
              fontSize: 14,
            }}
          >
            Asesoría previa a la entrevista
          </Link>
        </div>
      </section>


      {/* ===================== CÓMO FUNCIONA ===================== */}
      <section style={styles.card}>
        <h2 style={styles.h2}>¿Cómo funciona?</h2>

        <ul style={styles.bulletsList}>
          <li>Llenas el formulario guiado en español paso a paso.</li>
          <li>Validamos la coherencia entre tus datos y tu motivo de viaje.</li>
          <li>Te damos tu resumen listo para registrar en el DS-160 oficial.</li>
          <li>Puedes añadir asesoría para entrevista y toma de cita.</li>
        </ul>
      </section>


      {/* ===================== ERRORES COMUNES ===================== */}
      <section style={styles.card}>
        <h2 style={styles.h2}>Errores comunes que evitamos</h2>

        <ul style={styles.bulletsList}>
          <li>Fechas inconsistentes entre viajes, estudios y trabajo.</li>
          <li>Motivo del viaje mal explicado o incoherente.</li>
          <li>Direcciones y datos personales con formato incorrecto.</li>
          <li>Confusión con preguntas de seguridad en inglés.</li>
        </ul>
      </section>


      {/* ===================== TESTIMONIOS ===================== */}
      <section style={styles.card}>
        <h2 style={styles.h2}>Personas que ya usamos este servicio</h2>

        <div style={styles.testimonial}>
          “No entendía nada del DS-160, pero con la guía pude llenarlo sin miedo.
          En la entrevista me preguntaron justo lo que había practicado.”
          <br />
          <strong>— Andrea P. (Quito)</strong>
        </div>

        <div style={{ ...styles.testimonial, borderLeftColor: "#10b981" }}>
          “Yo ya tenía el formulario listo, solo necesitaba ayuda para la cita.
          Sin errores y me agendaron al día siguiente.”
          <br />
          <strong>— David R. (Guayaquil)</strong>
        </div>
      </section>


      {/* ===================== PLANES ===================== */}
      <section style={styles.card}>
        <h2 style={styles.h2}>Planes disponibles</h2>

        <ul style={styles.bulletsList}>
          <li>Llenado del DS-160 asistido</li>
          <li>Asesoría para la entrevista</li>
          <li>Agendamiento de cita (solo si ya tienes el DS-160 listo)</li>
        </ul>

        <div style={{ marginTop: 12 }}>
          <Link
            href="/checkout"
            style={{
              padding: "10px 16px",
              background: "#2563eb",
              color: "whi
