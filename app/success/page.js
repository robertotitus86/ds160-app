"use client";
import { useEffect } from "react";

export default function Success() {
  useEffect(()=>{
    try{
      const raw = localStorage.getItem("ds160_order");
      if (raw) {
        const order = JSON.parse(raw);
        fetch("/api/notify", { method:"POST", headers:{ "Content-Type":"application/json" },
          body: JSON.stringify({ ...order, status: "paid-success", subject:"Pago completado (Stripe/PayPal)" })
        });
        localStorage.removeItem("ds160_order");
      }
    }catch(e){}
  },[]);

  return (
    <main style={{maxWidth:720, margin:'60px auto', padding:24, textAlign:'center'}}>
      <h1>✅ Pago completado</h1>
      <p>Gracias. Hemos recibido tu pago. Te contactaremos pronto con los siguientes pasos.</p>
      <p><a href="/ds160" style={{color:'#2563eb', textDecoration:'underline'}}>Volver al asistente</a></p>
    </main>
  );
}