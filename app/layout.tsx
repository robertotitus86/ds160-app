export const metadata = { title: "DS-160 Asistido" };

import dynamic from "next/dynamic";

const ChatWidget = dynamic(() => import("../components/ChatWidget"), { ssr:false });
const WhatsAppFloat = dynamic(() => import("../components/WhatsAppFloat"), { ssr:false });

const styles = {
  body: { margin:0, fontFamily:'ui-sans-serif, system-ui, Segoe UI, Roboto, Inter, Arial', background:'#0b1120', color:'#e5e7eb' as const },
  container: { maxWidth:1100, margin:'0 auto', padding:'0 20px' },
  navbar: {
    position:'sticky' as const, top:0, zIndex:1000,
    backdropFilter:'blur(10px)',
    background:'linear-gradient(180deg, rgba(2,6,23,0.85), rgba(2,6,23,0.55))',
    borderBottom:'1px solid #0f172a'
  },
  navRow:{ display:'flex', alignItems:'center', justifyContent:'space-between', height:64 },
  brand:{ display:'inline-flex', alignItems:'center', gap:10, color:'#e5e7eb', textDecoration:'none', fontWeight:800, letterSpacing:.2 },
  nav:{ display:'flex', gap:10, alignItems:'center' },
  link:{ color:'#cbd5e1', textDecoration:'none', padding:'10px 12px', borderRadius:10 },
  cta:{ background:'#2563eb', color:'#fff', fontWeight:700, borderRadius:10, padding:'10px 12px', textDecoration:'none',
        boxShadow:'0 10px 24px rgba(37,99,235,.35)' },
  content:{ padding:'28px 20px 80px' },
  footer:{ borderTop:'1px solid #0f172a', background:'#0c1224', padding:'22px 0', marginTop:60 },
  footCol:{ display:'flex', flexDirection:'column' as const, alignItems:'center', gap:4, textAlign:'center' as const }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={styles.body}>

        {/* NAV */}
        <header style={styles.navbar}>
          <div style={{...styles.container, ...styles.navRow}}>
            <a href="/" style={styles.brand} aria-label="Inicio">
              <span style={{
                display:'inline-grid', placeItems:'center', width:34, height:34, borderRadius:10,
                background:'#1d4ed8', color:'#fff', boxShadow:'0 8px 24px rgba(37,99,235,.35)', fontSize:18
              }}>🛂</span>
              <span>DS-160 Asistido</span>
            </a>

            <nav style={styles.nav}>
              <a href="/" style={styles.link}>Inicio</a>
              <a href="/wizard" style={styles.link}>Formulario</a>
              <a href="/checkout" style={styles.link}>Checkout</a>
              {/* ✅ Contacto y WhatsApp removidos del menú */}
            </nav>
          </div>
        </header>

        {/* CONTENIDO */}
        <main style={{...styles.container, ...styles.content}}>
          {children}
        </main>

        {/* FOOTER */}
        <footer style={styles.footer}>
          <div style={{...styles.container, ...styles.footCol}}>
            <small>© 2025 · DS-160 Asistido</small>
            <small style={{opacity:.7}}>No es asesoría legal. Verifica siempre en CEAC.</small>
          </div>
        </footer>

        {/* ✅ BOTÓN FLOTANTE + CHAT */}
        <ChatWidget />
        <WhatsAppFloat />

      </body>
    </html>
  );
}
