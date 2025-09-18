export async function GET() {
  try {
    const res = await fetch("https://pay.payphonetodoesposible.com/api/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientId: process.env.PAYPHONE_CLIENT_ID,
        clientSecret: process.env.PAYPHONE_CLIENT_SECRET,
      }),
    });

    if (!res.ok) {
      return new Response(JSON.stringify({ error: "No se pudo obtener token" }), { status: 500 });
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
