import { NextResponse } from "next/server";
import { getBaseUrl, getAccessToken } from "@/lib/paypal";
export async function POST(req){
  const body=await req.json().catch(()=>({})); const orderID=body?.orderID;
  if(!orderID) return NextResponse.json({error:'Falta orderID'},{status:400});
  const id=process.env.PAYPAL_CLIENT_ID, sec=process.env.PAYPAL_CLIENT_SECRET, env=process.env.PAYPAL_ENV||'sandbox';
  if(!id||!sec) return NextResponse.json({error:'Faltan credenciales PayPal'},{status:500});
  const base=getBaseUrl(env); const { access_token }=await getAccessToken(id,sec,env);
  const r=await fetch(`${base}/v2/checkout/orders/${orderID}/capture`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${access_token}`}});
  const data=await r.json(); return NextResponse.json(data);
}