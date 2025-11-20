// app/layout.tsx
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "DS-160 Asistido · Formulario guiado",
  description:
    "Asistente para completar el formulario DS-160 paso a paso. No es asesoría legal.",
};

const styles = {
  body: {
    margin: 0,
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    backgroundColor: "#f3f4f6", // gris muy claro (página casi blanca)
    color: "#111827",
  } as React.CSSProperties,

  shell: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  } as React.CSSProperties,

  navbar: {
    borderBottom: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
  } as React.CSSProperties,

  navInner: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "10px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  } as React.CSSProperties,

  brand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  } as React.CSSProperties,

  brandLogo: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    border: "1px solid #e5e7eb",
    background:
      "radial-gradient(circle at 30% 30%, #1d4ed8, #1e293b 60%, #020617)",
  } as React.CSSProperties,

  brandText: {
    display: "flex",
    flexDirection: "column",
  } as React.CSSProperties,

  brandTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: "#111827",
  } as React.CSSProperties,

  brandSub: {
    fontSize: 11,
    color: "#6b7280",
  } as React.CSSProperties,

  navRight: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    fontSize: 12,
    color: "#4b5563",
  } as React.CSSProperties,

  badge: {
    padding: "3px 8px",
    borderRadius: 999,
    border: "1px solid #e5e7eb",
    backgroundColor: "#f9fafb",
    fontSize: 11,
    color: "#374151",
  } as React.CSSProperties,

  main: {
    flex: 1,
    maxWidth: 1100,
    width: "100%",
    margin: "0 auto",
    padding: "20px 16px 40px",
  } as React.CSSProperties,

  footer: {
    borderTop: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
    padding: "10px 16px",
    fontSize: 11,
    color: "#6b7280",
    textAlign: "center" as const,
  } as React.CSSProperties,

  footerInner: {
    maxWidth: 1100,
    margin: "0 auto",
  } as React.CSSProperties,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body style={styles.body}>
        <div style={styles.shell}>
          <header style={styles.navbar}>
            <div style={styles.navInner}>
              {/* Marca / “tipo embajada” */}
              <div style={styles.brand}>
                <div style={styles.brandLogo} />
                <div style={styles.brandText}>
                  <span style={styles.brandTitle}>DS-160 Asistido</span>
                  <span style={styles.brandSub}>
                    Plataforma privada · No es el sitio oficial
                  </span>
                </div>
              </div>

              <div style={styles.navRight}>
                <span style={styles.badge}>Sitio seguro</span>
                <span>Soporte por WhatsApp y correo</span>
              </div>
            </div>
          </header>

          <main style={styles.main}>{children}</main>

          <footer style={styles.footer}>
            <div style={styles.footerInner}>
              © 2025 · DS-160 Asistido · Esta plataforma no es asesoría legal ni
              reemplaza la consulta con un abogado de inmigración. Verifica
              siempre en CEAC y en el sitio oficial del Departamento de Estado
              de EE. UU.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
