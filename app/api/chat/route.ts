import OpenAI from "openai";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const system = `Eres un asistente que explica preguntas del formulario DS-160 en español, con ejemplos breves y sin asesoría legal.`;

    const resp = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: message || "" }
      ],
      temperature: 0.2
    });

    const reply = resp.choices[0]?.message?.content || "Sin respuesta";
    return Response.json({ reply });
  } catch (e:any) {
    return Response.json({ reply: `Error: ${e?.message ?? "revisa tu configuración"}` }, { status: 200 });
  }
}
