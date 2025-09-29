export async function saveRecord(record) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return { ok: false, reason: "no-supabase" };
  const res = await fetch(`${url}/rest/v1/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": key,
      "Authorization": `Bearer ${key}`,
      "Prefer": "return=representation"
    },
    body: JSON.stringify(record),
    cache: "no-store"
  });
  if (!res.ok) {
    const err = await res.text();
    return { ok: false, reason: err };
  }
  const data = await res.json();
  return { ok: true, data };
}
