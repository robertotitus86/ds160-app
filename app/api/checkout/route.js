import { NextResponse } from "next/server";
import Stripe from "stripe";
import { SERVICES, normalizeSelection } from "@/lib/services";
export async function POST(req){
  const body=await req.json().catch(()=>({})); const sel=normalizeSelection(body?.services);
  const key=process.env.STRIPE_SECRET_KEY; if(!key) return NextResponse.json({error:'Falta STRIPE_SECRET_KEY'},{status:500});
  const stripe=new Stripe(key);
  const items=SERVICES.filter(s=>sel[s.id]).map(s=>({price_data:{currency:'usd',product_data:{name:s.label},unit_amount:Math.round(s.price*100)},quantity:1}));
  if(!items.length) return NextResponse.json({error:'Sin servicios'},{status:400});
  const origin=req.headers.get('origin')||req.headers.get('referer')||'';
  const session=await stripe.checkout.sessions.create({mode:'payment',line_items:items,success_url:`${origin}/success`,cancel_url:`${origin}/cancel`});
  return NextResponse.json({url:session.url});
}