export const SERVICES = [
  { id: "fill", label: "Llenado de formulario DS-160", price: 30 },
  { id: "appointment", label: "Toma de cita", price: 10 },
  { id: "advice", label: "Asesoría completa", price: 25 }
];
export function totalFromSelection(s){return SERVICES.reduce((t,x)=>t+(s?.[x.id]?x.price:0),0);}
export function normalizeSelection(s){const o={}; for(const x of SERVICES) o[x.id]=!!s?.[x.id]; return o;}
export function summaryLabel(s){const a=SERVICES.filter(x=>s?.[x.id]).map(x=>x.label); return a.length?a.join(", "):"Sin servicios seleccionados";}
