import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Asistente DS-160",
  description: "Pagos con PayPhone y Transferencia"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <nav>
          <Link href="/" className="active">Inicio</Link>
          <Link href="/checkout">Checkout</Link>
          <Link href="/transferencia">Transferencia</Link>
        </nav>
        {children}
        <footer className="container small" style={{marginTop:24, textAlign:"center"}}>
          © 2025 Asistente DS-160
        </footer>
      </body>
    </html>
  );
}