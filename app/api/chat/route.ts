import { NextResponse } from "next/server";

export const runtime = "edge";

// Esta ruta de chat está deshabilitada intencionalmente para evitar la
// dependencia de 'openai'. Si deseas reactivar el chat, podemos volver
// a implementarlo y añadir la librería 'openai' en package.json.
export async function POST() {
  return NextResponse.json(
    { ok: false, error: "Chat IA deshabilitado en este proyecto." },
    { status: 501 }
  );
}

