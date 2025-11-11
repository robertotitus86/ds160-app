'use client';
import { useState } from "react";

export default function Wizard(){
  const [surname, setSurname] = useState("");
  const [given, setGiven] = useState("");

  return (
    <div className="card">
      <h2>Formulario DS-160 (demo)</h2>
      <label className="label">Apellidos (Surname)</label>
      <input value={surname} onChange={e=>setSurname(e.target.value)} className="input" />
      <small style={{opacity:.8}}>Como aparece en tu pasaporte.</small>

      <label className="label">Nombres (Given Name)</label>
      <input value={given} onChange={e=>setGiven(e.target.value)} className="input" />
      <small style={{opacity:.8}}>Exactos a tu pasaporte.</small>

      <div style={{marginTop:16}}>
        <button className="btn" onClick={()=>alert("Guardado (demo).")}>Guardar</button>
      </div>
    </div>
  );
}
