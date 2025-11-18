import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { ok: false, error: "no_file" },
        { status: 400 }
      );
    }

    const safeName = file.name.replace(/\s+/g, "-").toLowerCase();
    const blobName = `comprobantes/${Date.now()}-${safeName}`;

    const blob = await put(blobName, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json({
      ok: true,
      url: blob.url,
      pathname: blob.pathname,
    });
  } catch (e) {
    console.error("[UPLOAD_PROOF_ERROR]", e);
    return NextResponse.json(
      { ok: false, error: "upload_failed" },
      { status: 500 }
    );
  }
}
