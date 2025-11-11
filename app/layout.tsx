export const metadata = { title: "DS-160 Asistido" };
import "./globals.css";
import dynamic from "next/dynamic";
const ChatWidget = dynamic(() => import("../components/ChatWidget").catch(()=>({default:()=>null})), { ssr:false });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div style={{maxWidth:1000, margin:"0 auto", padding:20}}>
          <header style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20}}>
            <h1 style={{margin:0, fontSize:22}}>🛂 DS-160 Asistido</h1>
            <nav style={{display:"flex", gap:12}}>
              <a href="/">Inicio</a>
              <a href="/wizard">Formulario</a>
              <a href="/checkout">Checkout</a>
              <a href="/admin">Admin</a>
            </nav>
          </header>
          {children}
          <footer style={{opacity:.7, marginTop:30, fontSize:14}}>
            <hr style={{borderColor:"#1f2937"}}/>
            © {new Date().getFullYear()} — Demo
          </footer>
        </div>
        <ChatWidget />
      </body>
    </html>
  );
}
