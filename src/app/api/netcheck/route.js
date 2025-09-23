export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function probe(url, opts = {}) {
  try {
    const res = await fetch(url, { method: "GET", ...opts });
    const text = await res.text();
    return { ok: true, status: res.status, snippet: text.slice(0, 200) };
  } catch (e) {
    return { ok: false, error: e?.message || String(e) };
  }
}

export async function GET() {
  const targets = [
    "https://www.google.com",
    "https://api.github.com",
    // dominio correcto de PayPhone
    "https://pay.payphonetodo.com",
    "https://pay.payphonetodo.com/api/token",
  ];

  const results = {};
  for (const t of targets) results[t] = await probe(t);

  return new Response(JSON.stringify({ runtime: "nodejs", results }, null, 2), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
