'use client';
import { useState } from "react";

export default function Wizard(){
  const [surname, setSurname] = useState("");
  const [given, setGiven] = useState("");

  return (
    <div style={{background:"#0f172a", padding:18, borderRadius:14}}>
      <h2>Formulario DS-160 (demo)</h2>
      <label style={{display:"block", marginTop:10}}>Apellidos (Surname)</label>
      <input value={surname} onChange={e=>setSurname(e.target.value)} style={{width:"100%", padding:10, borderRadius:8, background:"#0b1220", color:"#fff", border:"1px solid #1f2937"}} />
      <small style={{opacity:.8}}>Como aparece en tu pasaporte.</small>

      <label style={{display:"block", marginTop:10}}>Nombres (Given Name)</label>
      <input value={given} onChange={e=>setGiven(e.target.value)} style={{width:"100%", padding:10, borderRadius:8, background:"#0b1220", color:"#fff", border:"1px solid #1f2937"}} />
      <small style={{opacity:.8}}>Exactos a tu pasaporte.</small>

      <div style={{marginTop:16}}>
        <button onClick={()=>alert("Guardado (demo). Pronto conectamos a BD.")}>Guardar</button>
      </div>
    </div>
  );
}
