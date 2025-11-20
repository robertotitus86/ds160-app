// app/layout.tsx
import type { Metadata } from "next";
import React, { CSSProperties } from "react";

export const metadata: Metadata = {
  title: "DS-160 Asistido · Formulario guiado",
  description:
    "Asistente para completar el formulario DS-160 paso a paso. No es asesoría legal.",
};

type StyleMap = {
  body: CSSProperties;
  shell: CSSProperties;
  navbar: CSSProperties;
  navInner: CSSProperties;
  brand: CSSProperties;
  brandLogo: CSSProperties;
  brandText: CSSProperties;
  brandTitle: CSSProperties;
  brandSub: CSSProperties;
  navRight: CSSProperties;
  badge: CSSProperties;
  main: CSSProperties;
  footer: CSSProperties;
  footerInner: CSSProperties;
};

const styles: StyleMap = {
  body: {
    margin: 0,
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    backgroundColor: "#f3f4f6", // página gris muy clara
    color: "#111827",
  },

  shell: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column", // <- YA tipado correctamente
  },

  navbar: {
    borderBottom: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
  },

  navInner: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "10px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  brandLogo: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    border: "1px solid #e5e7eb",
    background:
      "radial-gradient(circle at 30% 30%, #1d4ed8, #1e293b 60%, #020617)",
  },

  brandText: {
    display: "flex",
    flexDirection: "column",
  },

  brandTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: "#111827",
  },

  brandSub: {
    fontSize: 11,
    color: "#6b7280",
  },

  navRight: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    fontSize: 12,
    color: "#4b5563",
  },

  badge: {
    padding: "3px 8px",
    borderRadius: 999,
    border: "1px solid #e5e7eb",
    backgroundColor: "#f9fafb",
    fontSize: 11,
    color: "#374151",
  },

  main: {
    flex: 1,
    maxWidth: 1100,
    width: "100%",
    margin: "0 auto",
    padding: "20px 16px 40px",
  },

  footer: {
    borderTop: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
    padding: "10px 16px",
    fontSize: 11,
    color: "#6b7280",
    textAlign: "center",
  },

  footerInner: {
    maxWidth: 1100,
    margin: "0 auto",
  },
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
