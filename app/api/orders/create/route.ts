export const runtime = "edge";

import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

type JsonOrder = {
  id: string;
  status: "pending" | "paid" | "rejected";
  createdAt: string;
  receiptUrl?: string;
};

export async function POST(req: Request) {
  try {
    // Recibe: formData con file (comprobante)
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ ok: false, error:
