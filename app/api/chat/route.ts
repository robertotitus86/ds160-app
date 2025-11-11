import OpenAI from "openai";
import { NextRequest } from "next/server";

export const runtime = "edge";

const SYSTEM_PROMPT = `
Eres un asistente para guiar el llenado del DS-160.
- Explica cada campo con ejemplos breves y errores comunes.
- Si no estás seguro, dilo y sugiere validar en CEAC.
- No brindas asesoría legal.
`;

type UserMessage = { role: "user"; content: string };

export async function POST(req: NextRequest) {
  try {
    const { messages, ds160Hints } = await req.json() as {
      messages: UserMessage[];
      ds160Hints?: Array<{ label: string; help: string }>;
    };

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
    const context = (ds160Hints ?? []).slice(0, 400).map((f) => `• ${f.label}: ${f.help}`).join("\n");

    const userMerged = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "system", content: `Referencia DS-160 (resumen de campos):\n${context}` },
      ...messages
    ] as any[];

    const resp = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      stream: true,
      messages: userMerged
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of resp) {
          const token = chunk.choices?.[0]?.delta?.content || "";
          if (token) controller.enqueue(encoder.encode(token));
        }
        controller.close();
      },
    });

    return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" } });
  } catch (e: any) {
    return new Response(`Error: ${e?.message || "unknown"}`, { status: 500 });
  }
}
