export const metadata = {
  title: "Asistente DS-160",
  description: "Wizard DS-160 con pago (Stripe, PayPal, Transferencia)",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ background: "#f8fafc", fontFamily: "system-ui, Arial" }}>
        {children}
      </body>
    </html>
  );
}
