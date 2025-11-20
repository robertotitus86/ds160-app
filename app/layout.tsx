import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import NavClient from "./NavClient";

export const metadata: Metadata = {
  title: "DS-160 Asistido",
  description:
    "Asistente guiado para completar tu formulario DS-160 con pasos claros y soporte humano.",
};

const ChatWidget = dynamic(() => import("../components/ChatWidget"), {
  ssr: false,
});

const WhatsAppFloat = dynamic(() => import("../components/WhatsAppFloat"), {
  ssr: false,
});

const styles = {
  body: {
    margin: 0,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, system-ui, -system-ui, sans-serif",
    background: "#f3f4f6",
    color: "#111827",
    WebkitFontSmoothing: "antialiased" as const,
  },
  shell: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  navbar: {
    position: "sticky" as const,
    top: 0,
    zIndex: 40,
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.98))",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid #e5e7eb",
  },
  navInner: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "10px 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  brand: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 2,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: "0.02em",
    color: "#111827",
  },
  brandSubtitle: {
    fontSize: 12,
    color: "#6b7280",
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  main: {
    flex: 1,
    padding: "22px 12px 28px",
  },
  mainInner: {
    maxWidth: 1100,
    margin: "0 auto",
  },
  footer: {
    borderTop: "1px solid #e5e7eb",
    background: "#f9fafb",
  },
  footerInner: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "12px 18px",
    display: "flex",
    flexWrap: "wrap" as const,
    justifyContent: "space-between",
    gap: 12,
    fontSize: 12,
    color: "#6b7280",
  },
  footerLeft: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 2,
  },
  footerRight: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap" as const,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body style={styles.body}>
        <div style={styles.shell}>
          <header style={styles.navbar}>
            <div style={styles.navInner}>
              <div style={styles.brand}>
                <div style={styles.brandTitle}>DS-160 Asistido</div>
                <div style={styles.brandSubtitle}>
                  Plataforma independiente para ayudarte a completar tu formulario.
                </div>
              </div>
              <div style={styles.navRight}>
                <NavClient />
              </div>
            </div>
          </header>

          <main style={styles.main}>
            <div style={styles.mainInner}>{children}</div>
          </main>

          <footer style={styles.footer}>
            <div style={styles.footerInner}>
              <div style={styles.footerLeft}>
                <span>© {new Date().getFullYear()} · DS-160 Asistido</span>
                <span>
                  No es asesoría legal ni reemplaza la información oficial del
                  Departamento de Estado de EE. UU.
                </span>
              </div>
              <div style={styles.footerRight}>
                <span>Verifica siempre en CEAC antes de enviar tu formulario.</span>
              </div>
            </div>
          </footer>

          <ChatWidget />
          <WhatsAppFloat />
        </div>
      </body>
    </html>
  );
}
