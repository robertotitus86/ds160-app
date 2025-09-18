import { requestToken } from "@/lib/payphone";

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST() {
  try {
    const token = await requestToken();
    return Response.json({ ok: true, token }, { status: 200 });
  } catch (err) {
    return Response.json(
      { ok: false, message: err.message || String(err) },
      { status: 500 }
    );
  }
}
