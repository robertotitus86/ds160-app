export const metadata = { title: "DS-160 Asistido", description: "Plataforma para llenar DS-160" };
import "./globals.css";
import dynamic from "next/dynamic";
const ChatWidget = dynamic(() => import("@/components/ChatWidget"), { ssr: false });

export default function RootLayout({ children }: { children: React.ReactNode }){
  return (<html lang="es"><body><div className="container">{children}</div><ChatWidget /></body></html>)
}
