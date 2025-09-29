export function requiredEnv(name: string): string {
  const v = process.env[name as string];
  if (!v) throw new Error(`Falta variable de entorno: ${name}`);
  return v;
}

export async function fetchJSON(input: RequestInfo, init?: RequestInit) {
  const res = await fetch(input, { cache: "no-store", ...init });
  const text = await res.text();
  let data: any = {};
  try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }
  if (!res.ok) {
    const msg = typeof data === "object" ? JSON.stringify(data) : String(data);
    throw new Error(`HTTP ${res.status} - ${msg}`);
  }
  return data;
}