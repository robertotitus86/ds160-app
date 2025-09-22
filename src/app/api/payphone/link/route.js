// src/app/api/payphone/link/route.ts
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'              // Asegura runtime Node en Vercel
export const dynamic = 'force-dynamic'       // Evita cacheo indeseado

const PAYPHONE_ENDPOINT = 'https://pay.payphonetodoesposible.com/api/Links' // Endpoint oficial Links
// Docs: https://docs.payphone.app/links-de-pago

function corsHeaders(origin?: string) {
  return {
    'Access-Control-Allow-Origin': origin ?? '*',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req.headers.get('origin') ?? '*') })
}

function toCents(x: unknown) {
  const n = Number(x ?? 0)
  return Number.isFinite(n) ? Math.round(n * 100) : 0
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin') ?? '*'
  const headers = corsHeaders(origin)

  const token = process.env.PAYPHONE_TOKEN
  const storeId = process.env.PAYPHONE_STORE_ID
  if (!token || !storeId) {
    return NextResponse.json(
      { error: 'Faltan credenciales PAYPHONE_TOKEN / PAYPHONE_STORE_ID en el entorno' },
      { status: 500, headers }
    )
  }

  let bodyIn: any = {}
  try { bodyIn = await req.json() } catch { /* vacío usa defaults */ }

  const {
    // Si pasas amountUSD lo uso tal cual; si no, calculo con los desgloses
    amountUSD,
    withTaxUSD = 0,
    noTaxUSD = 0,
    taxUSD = 0,
    serviceUSD = 0,
    tipUSD = 0,
    description = 'Pago DS-160',
    clientTransactionId,
    editable = false,
    expireIn = 0,
  } = bodyIn

  if (!clientTransactionId || String(clientTransactionId).length > 15) {
    return NextResponse.json(
      { error: 'clientTransactionId requerido y <= 15 caracteres' },
      { status: 400, headers }
    )
  }

  const payload: Record<string, any> = {
    clientTransactionId,
    currency: 'USD',
    storeId,
    reference: description,
    isAmountEditable: !!editable,
    expireIn: Number(expireIn) || 0,
  }

  if (!editable) {
    // Enviar montos en CENTAVOS (enteros), y que sumen amount
    // La doc exige centavos y suma consistente. :contentReference[oaicite:2]{index=2}
    const amountWithTax = toCents(withTaxUSD)
    const amountWithoutTax = toCents(noTaxUSD)
    const tax = toCents(taxUSD)
    const service = toCents(serviceUSD)
    const tip = toCents(tipUSD)

    let amount = toCents(amountUSD)
    if (!amount) amount = amountWithTax + amountWithoutTax + tax + service + tip

    payload.amount = amount
    if (amountWithTax) payload.amountWithTax = amountWithTax
    if (amountWithoutTax) payload.amountWithoutTax = amountWithoutTax
    if (tax) payload.tax = tax
    if (service) payload.service = service
    if (tip) payload.tip = tip
  }

  const apiRes = await fetch(PAYPHONE_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,   // Requisito de la API Links
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  })

  // La API de Links devuelve un STRING (la URL del link de cobro). :contentReference[oaicite:3]{index=3}
  const text = await apiRes.text()
  if (!apiRes.ok) {
    let detail: any = text
    try { detail = JSON.parse(text) } catch {}
    return NextResponse.json(
      { error: 'Error PayPhone', status: apiRes.status, detail },
      { status: 502, headers }
    )
  }

  return NextResponse.json({ link: text }, { status: 200, headers })
}
