"use client";
import { useMemo, useState } from "react";
import { SERVICES, totalFromSelection } from "@/lib/services";
export default function DS160(){
  const [form,setForm]=useState({services:{fill:true,appointment:false,advice:false},paymentMethod:""});
  const total=useMemo(()=>totalFromSelection(form.services),[form.services]);
  async function pay(){
    const sel=Object.fromEntries(Object.entries(form.services).filter(([,v])=>v));
    if(!Object.keys(sel).length){alert('Elige al menos un servicio');return;}
    if(form.paymentMethod==='card'){
      const r=await fetch('/api/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({services:sel})});
      const d=await r.json(); if(d?.url) location.href=d.url; else alert('No se pudo iniciar pago');
    } else if(form.paymentMethod==='paypal'){
      const r=await fetch('/api/paypal/create-order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({services:sel})});
      const d=await r.json(); if(d?.approveUrl) location.href=d.approveUrl; else alert('No se pudo iniciar pago');
    } else { alert('Registra la transferencia por correo.'); }
  }
  return (<main style={{maxWidth:880,margin:'40px auto',padding:24}}>
    <h1>Asistente DS-160</h1>
    <h3>Servicios</h3>
    {SERVICES.map(s=> (<label key={s.id} style={{display:'flex',gap:8,alignItems:'center',border:'1px solid #eee',padding:10,borderRadius:8,marginBottom:8}}>
      <input type="checkbox" checked={!!form.services[s.id]} onChange={e=>setForm(p=>({...p,services:{...p.services,[s.id]:e.target.checked}}))}/>
      <span style={{flex:1}}>{s.label}</span><b>${s.price.toFixed(2)}</b>
    </label>))}
    <div style={{display:'flex',justifyContent:'space-between',margin:'12px 0'}}><span>Total</span><b>${total.toFixed(2)}</b></div>
    <h3>Método de pago</h3>
    {['card','paypal','transfer'].map(m=>(
      <label key={m} style={{display:'inline-flex',alignItems:'center',gap:6,marginRight:12}}>
        <input type="radio" name="pm" value={m} checked={form.paymentMethod===m} onChange={e=>setForm(p=>({...p,paymentMethod:e.target.value}))}/>
        {m==='card'?'Tarjeta (Stripe)':m==='paypal'?'PayPal':'Transferencia'}
      </label>
    ))}
    <div style={{marginTop:16}}><button onClick={pay} style={{padding:'10px 14px',border:'none',borderRadius:8,background:'#16a34a',color:'#fff'}}>Pagar ${total.toFixed(2)}</button></div>
  </main>);
}