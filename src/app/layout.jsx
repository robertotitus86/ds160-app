import "./globals.css";
export const metadata = { title: "Asistente DS-160" };

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <nav>
          <div className="container navbar">
            <div className="brand">
              <div className="brand-badge" />
              <div>
                <div style={{fontWeight:900}}>Asistente DS-160 <span style={{opacity:.7}}>Beta</span></div>
                <div style={{color:"var(--muted)", fontSize:12, marginTop:-2}}>Llenado, citas y pagos seguros</div>
              </div>
            </div>
            <div className="navlinks">
              <a href="/">Inicio</a>
              <a href="/checkout">Checkout</a>
              <a href="/transferencia">Transferencia</a>
            </div>
          </div>
        </nav>

        <main className="container">{children}</main>

        <footer>
          <div className="container copy">© {new Date().getFullYear()} Asistente DS-160 · Seguridad y cumplimiento</div>
        </footer>
      </body>
    </html>
  );
}
