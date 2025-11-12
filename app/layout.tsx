export const metadata = {
  title: "DS-160 Asistido",
};

import dynamic from "next/dynamic";
import NavClient from "./NavClient";

const ChatWidget = dynamic(() => import("../components/ChatWidget"), { ssr: false });
const WhatsAppFloat = dynamic(() => import("../components/WhatsAppFloat"), { ssr: false });

const styles = {
  body: {
    margin: 0,
    fontFamily: "ui-sans-serif, system-ui, Segoe UI, Roboto, Inter, Arial",
    background: "#0b1120",
    color: "#e5e7eb",
  } as React.CSSProperties,
  container: { maxWidth: 1100, margin: "0 auto", padding: "0 20px" } as React.CSSProperties,
  navbar: {
    position: "sticky" as const,
    top: 0,
    zIndex: 1000,
    backdropFilter: "blur(10px)",
    background: "linear-gradient(180deg, rgba(2,6,23,0.85), rgba(2,6,23,0.55))",
    borderBottom: "1px solid #0f172a",
  },
  navRow: { display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 } as React.CSSProperties,
  brand: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    color: "#e5e7eb",
    textDecoration: "none",
    fontWeight: 800,
    letterSpacing: 0.2,
  } as React.CSSProperties,
  content: { padding: "28px 20px 80px" } as React.CSSProperties,
  footer: { borderTop: "1px solid #0f172a", background: "#0c1224", padding: "22px 0", marginTop: 60 } as React.CSSProperties,
  footCol: { display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 4, textAlign: "center" as const },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={styles.body}>
        {/* NAV */}
        <header style={styles.navbar}>
          <div style={{ ...styles.container, ...styles.navRow }}>
            <a href="/" style={styles.brand} aria-label="Inicio">
              <span
                style={{
                  display: "inline-grid",
                  placeItems: "center",
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: "#1d4ed8",
                  color: "#fff",
                  boxShadow: "0 8px 24px rgba(37,99,235,.35)",
                  fontSize: 18,
                }}
              >
                🛂
              </span>
              <span>DS-160 Asistido</span>
            </a>

            {/* Menú con contador de carrito */}
            <NavClient />
          </div>
        </header>

        {/* CONTENIDO */}
        <main style={{ ...styles.container, ...styles.content }}>{children}</main>

        {/* FOOTER exacto como solicitaste */}
        <footer style={styles.footer}>
          <div style={{ ...styles.container, ...styles.footCol }}>
            <small>© 2025 · DS-160 Asistido</small>
            <small style={{ opacity: 0.7 }}>No es asesoría legal. Verifica siempre en CEAC.</small>
          </div>
        </footer>

        {/* Widgets flotantes existentes */}
        <ChatWidget />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
