// src/app/layout.jsx
import "./globals.css";

export const metadata = {
  title: "Asistente DS-160",
  description: "Llenado, citas y pagos seguros",
};

export default function RootLayout({ children }) {
  // Si quieres mostrar una etiqueta (p. ej., "Demo"), ponla en NEXT_PUBLIC_APP_BADGE.
  const badge = process.env.NEXT_PUBLIC_APP_BADGE; // si está vacío, no muestra nada

  return (
    <html lang="es">
      <body>
        <nav className="nav">
          <div className="container nav-row">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <strong>Asistente DS-160</strong>
              {badge ? (
                <span
                  style={{
                    fontSize: 12,
                    opacity: 0.75,
                    border: "1px solid #334155",
                    padding: "2px 6px",
                    borderRadius: 6,
                  }}
                >
                  {badge}
                </span>
              ) : null}
            </div>
            <div className="links">
              <a href="/">Inicio</a>
              <a href="/checkout">Checkout</a>
              <a href="/transferencia">Transferencia</a>
            </div>
          </div>
        </nav>

        <main className="container">{children}</main>

        <footer className="footer">
          <div className="container" style={{ padding: "16px 0", color: "#94a3b8", fontSize: 14 }}>
            © {new Date().getFullYear()} Asistente DS-160
          </div>
        </footer>
      </body>
    </html>
  );
}

