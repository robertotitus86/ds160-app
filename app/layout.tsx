export const metadata = { title: "DS-160 Asistido" };
import "./globals.css";
import dynamic from "next/dynamic";

const ChatWidget = dynamic(() => import("../components/ChatWidget"), { ssr: false });
const WhatsAppFloat = dynamic(() => import("../components/WhatsAppFloat"), { ssr: false });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {/* NAVBAR */}
        <header className="navbar">
          <div className="container nav-row">
            <a href="/" className="brand">
              <span className="brand-mark">🛂</span> DS-160 Asistido
            </a>

            <nav className="nav">
              <a href="/" className="nav-link">Inicio</a>
              <a href="/wizard" className="nav-link">Formulario</a>
              <a href="/checkout" className="nav-link">Checkout</a>
              <a href="/contacto" className="nav-link">Contacto</a>
              <a
                href="https://wa.me/593999888777?text=Hola%20quiero%20ayuda%20con%20mi%20DS-160"
                target="_blank" rel="noopener"
                className="nav-link nav-cta"
              >
                WhatsApp
              </a>
            </nav>
          </div>
        </header>

        {/* CONTENIDO */}
        <main className="container content">{children}</main>

        {/* FOOTER */}
        <footer className="footer">
          <div className="container footer-row">
            <small>© {new Date().getFullYear()} · DS-160 Asistido</small>
            <small className="muted">No es asesoría legal. Verifica siempre en CEAC.</small>
          </div>
        </footer>

        {/* Widgets */}
        <ChatWidget />
        <WhatsAppFloat />
      </body>
    </html>
  );
}

