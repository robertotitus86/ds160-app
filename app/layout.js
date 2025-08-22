import { BRAND } from "@/lib/brand";

export const metadata = {
  title: "DS-160 App",
  description: "Asistente DS-160 con pagos (Stripe, PayPal, Transferencia)",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ background: "#f8fafc", fontFamily: "system-ui, Arial", margin:0, color: BRAND.text }}>
        <header style={{padding:'10px 16px', borderBottom:'1px solid #eee', display:'flex', alignItems:'center', gap:12}}>
          <img src={BRAND.logo} alt="logo" style={{height:28}} />
          <strong style={{color: BRAND.primary}}>{BRAND.name}</strong>
          <span style={{marginLeft:'auto', color:'#6b7280', fontSize:13}}>{BRAND.contactEmail}</span>
        </header>
        {children}
      </body>
    </html>
  );
}
