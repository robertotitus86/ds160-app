'use client';

import { useState } from "react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [log, setLog] = useState<string[]>([]);

  async function send() {
    const q = input.trim();
    if (!q) return;
    setInput(""); setLog(l => [...l, "👤 " + q, "🤖 ..."]);
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q })
      });
      const j = await r.json();
      const reply = j.reply || "No pude responder. Revisa tu API key.";
      setLog(l => { const c=[...l]; c[c.length-1]="🤖 " + reply; return c; });
    } catch (e) {
      setLog(l => { const c=[...l]; c[c.length-1] = "🤖 Error de conexión."; return c; });
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={{ position:"fixed", right:18, bottom:72, zIndex:9999,
                 background:"#2563eb", color:"#fff", border:"none",
                 borderRadius:999, padding:"10px 14px", fontWeight:700, boxShadow:"0 8px 24px rgba(0,0,0,.25)" }}>
        {open ? "Cerrar ayuda" : "Ayuda DS-160"}
      </button>

      {open && (
        <div style={{
          position:"fixed", right:18, bottom:126, width:360, maxHeight:"70vh",
          background:"#0f172a", color:"#e5e7eb", border:"1px solid #1f2937",
          borderRadius:12, padding:12, display:"flex", flexDirection:"column", gap:8, zIndex:9999
        }}>
          <b>Asistente DS-160</b>
          <div style={{ flex:1, overflowY:"auto", background:"#0b1220", padding:8, borderRadius:8 }}>
            {!log.length && <div style={{opacity:.8,fontSize:14}}>Ej: “¿Qué significa Given Name?”</div>}
            {log.map((line,i)=><div key={i} style={{whiteSpace:"pre-wrap",marginBottom:6}}>{line}</div>)}
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <input
              value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter" && send()}
              placeholder="Escribe tu pregunta…"
              style={{ flex:1, padding:10, borderRadius:8, border:"1px solid #1f2937", background:"#0b1220", color:"#fff" }}
            />
            <button onClick={send} style={{ padding:"10px 14px", borderRadius:8, border:"none", background:"#2563eb", color:"#fff" }}>
              Enviar
            </button>
          </div>
          <small style={{opacity:.7}}>No es asesoría legal. Verifica en CEAC.</small>
        </div>
      )}
    </>
  );
}
