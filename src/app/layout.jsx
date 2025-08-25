
import "./globals.css";
import Link from "next/link";

export const metadata = { title: "Asistente DS-160" };

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <nav className="navbar">
          <div className="container navbar-inner">
            <div className="brand">
              <div className="brand-badge" />
              <div>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <span>Asistente DS-160</span><span className="badge">Beta</span>
                </div>
                <div className="muted" style={{fontSize:12}}>Llenado, citas y pagos seguros</div>
              </div>
            </div>
            <div className="nav-links">
              <Link href="/" className="nav-link">Inicio</Link>
              <Link href="/checkout" className="nav-link">Checkout</Link>
              <Link href="/transferencia" className="nav-link">Transferencia</Link>
            </div>
          </div>
        </nav>
        <main className="container">
          {children}
          <div className="footer">© {new Date().getFullYear()} Asistente DS-160 · Seguridad y cumplimiento</div>
        </main>
      </body>
    </html>
  );
}
