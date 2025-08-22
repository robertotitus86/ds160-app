export const SERVICES = [
  { id: "fill", label: "Llenado de formulario DS-160", price: 30 },
  { id: "appointment", label: "Toma de cita", price: 10 },
  { id: "advice", label: "Asesoría completa", price: 25 },
];

export function totalFromSelection(selection) {
  if (!selection) return 0;
  return SERVICES.reduce((sum, s) => sum + (selection[s.id] ? s.price : 0), 0);
}

export function normalizeSelection(selection) {
  const norm = {};
  for (const s of SERVICES) norm[s.id] = !!selection?.[s.id];
  return norm;
}

export function summaryLabel(selection) {
  const chosen = SERVICES.filter(s => selection?.[s.id]).map(s => s.label);
  return chosen.length ? chosen.join(", ") : "Sin servicios seleccionados";
}
