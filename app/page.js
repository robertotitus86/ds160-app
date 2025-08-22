import { BRAND } from "@/lib/brand";

export default function Home() {
  return (
    <main style={{maxWidth:820, margin:'60px auto', padding:24}}>
      <h1 style={{color: BRAND.primary}}>Bienvenido al asistente DS-160</h1>
      <p>Comienza tu trámite con nuestro asistente guiado y paga de forma segura.</p>
      <p><a href="/ds160" style={{color:BRAND.primary, fontWeight:600}}>Ir al formulario DS-160 →</a></p>
    </main>
  );
}
