export const metadata = { title: "DS-160 Asistido" };
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div style={{maxWidth:1000, margin:"0 auto", padding:20}}>
          {/* ...tu header/nav... */}
          {children}
          {/* ...tu footer... */}
        </div>
      </body>
    </html>
  );
}
