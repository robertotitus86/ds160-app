import { NextResponse } from "next/server";

export async function GET() {
  try {
    const token = process.env.NEXT_PUBLIC_PAYPHONE_TOKEN;
    const storeId = process.env.NEXT_PUBLIC_PAYPHONE_STORE_ID;
    const env = (process.env.PAYPHONE_ENV || "prod").toLowerCase(); // prod | sandbox

    if (!token || !storeId) {
      return NextResponse.json(
        {
          error:
            "Faltan credenciales de PayPhone. Verifica NEXT_PUBLIC_PAYPHONE_TOKEN y NEXT_PUBLIC_PAYPHONE_STORE_ID en Vercel.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ token, storeId, env });
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno al obtener token", detail: String(error) },
      { status: 500 }
    );
  }
}
