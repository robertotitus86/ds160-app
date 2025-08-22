export function getBaseUrl(env){return env==='live'?'https://api-m.paypal.com':'https://api-m.sandbox.paypal.com';}
export async function getAccessToken(id,sec,env){
  const base=getBaseUrl(env);
  const r=await fetch(`${base}/v1/oauth2/token`,{method:'POST',headers:{
    Authorization:'Basic '+Buffer.from(`${id}:${sec}`).toString('base64'),
    'Content-Type':'application/x-www-form-urlencoded'
  },body:'grant_type=client_credentials', cache:'no-store'});
  if(!r.ok) throw new Error('No token PayPal'); return r.json();
}