import type { Metadata } from "next";
import React from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "DS-160 Asistido",
  description: "Asistente en español para completar tu formulario DS-160 con apoyo guiado.",
};

const styles = {
  body: {
    margin: 0,
    background: "#f3f4f6",
    color: "#111827",
  } as React.CSSProperties,
  shell: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  } as React.CSSProperties,
  navbar: {
    background: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    position: "sticky" as const,
    top: 0,
    zIndex: 20,
  },
  navInner: {
    maxWidth: 1120,
    margin: "0 auto",
    padding: "10px 20px",
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
  brandDot: {
    width: 26,
    height: 26,
    borderRadius: "999px",
    background: "radial-gradient(circle at 30% 30%, #60a5fa, #1d4ed8)",
    boxShadow: "0 0 0 2px #e5edff",
  } as React.CSSProperties,
  brandText: {
    display: "flex",
    flexDirection: "column",
    fontSize: 13,
    lineHeight: 1.25,
  } as React.CSSProperties,
  brandTitle: {
    fontWeight: 700,
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
  } as React.CSSProperties,
  navPill: {
    padding: "4px 10px",
    borderRadius: 999,
    border: "1px solid #d1fae5",
    background: "#ecfdf3",
    color: "#047857",
    fontWeight: 500,
  } as React.CSSProperties,
  navLink: {
    color: "#2563eb",
    textDecoration: "underline",
    textUnderlineOffset: 2,
  } as React.CSSProperties,
  main: {
    flex: 1,
    padding: "24px 16px 40px",
  } as React.CSSProperties,
  mainInner: {
    maxWidth: 1120,
    margin: "0 auto",
  } as React.CSSProperties,
  footer: {
    borderTop: "1px solid #e5e7eb",
    background: "#ffffff",
    padding: "14px 16px",
    fontSize: 12,
    color: "#6b7280",
  } as React.CSSProperties,
  footerInner: {
    maxWidth: 1120,
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap" as const,
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
              <div style={styles.brand}>
                <div style={styles.brandDot} />
                <div style={styles.brandText}>
                  <span style={styles.brandTitle}>DS-160 Asistido</span>
                  <span style={styles.brandSub}>
                    Plataforma privada · No es el sitio oficial
                  </span>
                </div>
              </div>
              <div style={styles.navRight}>
                <span style={styles.navPill}>Sitio seguro</span>
                <a
                  href="https://wa.me/593987846751"
                  target="_blank"
                  rel="noreferrer"
                  style={styles.navLink}
                >
                  Soporte por WhatsApp y correo
                </a>
              </div>
            </div>
          </header>

          <main style={styles.main}>
            <div style={styles.mainInner}>{children}</div>
          </main>

          <footer style={styles.footer}>
            <div style={styles.footerInner}>
              <span>© {new Date().getFullYear()} · DS-160 Asistido</span>
              <span>No es asesoría legal. Verifica siempre en CEAC.</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
