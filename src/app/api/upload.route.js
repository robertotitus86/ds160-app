import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No se recibió ningún archivo" }, { status: 400 });
    }

    // Archivo a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Transporte SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT || 465),
      secure: true, // true para 465; false si usas 587 con STARTTLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Enviar
    await transporter.sendMail({
      from: `"Asistente DS-160" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: "Nuevo comprobante de transferencia",
      text: "Se adjunta el comprobante enviado por un usuario.",
      attachments: [{ filename: file.name || "comprobante", content: buffer }],
    });

    return NextResponse.json({ success: true, message: "Comprobante enviado correctamente" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error al enviar el correo" }, { status: 500 });
  }
}
