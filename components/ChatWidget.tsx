'use client';

import { useRef, useState } from "react";
import hints from "../data/hints-merged.json";
import ds from "../data/questions.json";

type Hint = { label: string; help: string };

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [log, setLog] = useState<string[]>([]);
  const lock = useRef(false);

  let ds160Hints: Hint[] = (hints as any[])?.length ? (hints as any[]) : [];
  if (!ds160Hints.length) {
    (ds.sections as any[]).forEach((s:any) => {
      (s.fields as any[]).forEach((f:any) => {
        ds160Hints.push({ label: f.label, help: f.help || "" });
      });
    });
  }

  async function send() {
    if (!input.trim() || lock.current) return;
    lock.current = true;
    const userMsg = input.trim();
    setInput("");
    setLog((l) => [...l, `👤 ${userMsg}`, "🤖 "]);

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: [{ role: "user", content: userMsg }], ds160Hints }),
      headers: { "Content-Type": "application/json" },
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let assistant = "";

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistant += decoder.decode(value);
        setLog((l) => { const copy = [...l]; copy[copy.length - 1] = "🤖 " + assistant; return copy; });
      }
    }
    lock.current = false;
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={{ position:"fixed", right:20, bottom:20, borderRadius:999, padding:"12px 16px", background:"#2563eb", color:"#fff", fontWeight:700, zIndex:9999}}
      >
        {open ? "Cerrar ayuda" : "Ayuda DS-160"}
      </button>

      {open && (
        <div className="card" style={{ position:"fixed", right:20, bottom:80, width:380, maxHeight:"70vh", overflow:"hidden", display:"flex", flexDirection:"column", zIndex:9999}}>
          <h3 style={{ marginTop: 0 }}>Asistente DS-160</h3>
          <div style={{ flex:1, overflowY:"auto", background:"#0b1220", padding:12, borderRadius:8, border:"1px solid #1f2937"}}>
            {log.map((line, i) => (<div key={i} style={{ whiteSpace:"pre-wrap", marginBottom:8 }}>{line}</div>))}
            {!log.length && (<div style={{ opacity:.8, fontSize:14 }}>👋 Puedo explicarte cada campo (qué pide, ejemplos, errores comunes). Pregúntame por “Número de pasaporte”, “Propósito del viaje”, “Redes sociales”, etc.</div>)}
          </div>
          <div style={{ display:"flex", gap:8, marginTop:10 }}>
            <input className="input" placeholder="Escribe tu pregunta…" value={input} onChange={(e)=>setInput(e.target.value)} onKeyDown={(e)=> e.key==="Enter" && send()} />
            <button className="btn" onClick={send}>Enviar</button>
          </div>
          <small className="helper" style={{ marginTop: 6 }}>No es asesoría legal. Verifica siempre en CEAC antes de enviar.</small>
        </div>
      )}
    </>
  );
}
