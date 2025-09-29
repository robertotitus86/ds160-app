# DS160 New (Next.js + PayPhone)

Proyecto listo para Vercel con App Router y endpoint interno para PayPhone:

- API: `POST /api/payphone/link`
- Página de confirmación: `/checkout/confirm`
- Página de transferencia: `/transferencia` (puedes reemplazar su contenido por el tuyo)

## Variables de entorno (Vercel)
- `PAYPHONE_CLIENT_ID`
- `PAYPHONE_CLIENT_SECRET`
- `PAYPHONE_STORE_ID`
- *(Opcional)* `PAYPHONE_BASE_URL` (por defecto `https://pay.payphonetodoesposible.com`)

## Dev
```bash
npm install
npm run dev
```

## Producción
Sube a GitHub y conecta a Vercel.