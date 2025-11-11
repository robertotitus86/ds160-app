# DS-160 Asistido — Chat OpenAI + Botón WhatsApp

## Cómo ejecutar
```bash
npm install
npm run dev
```

## Variables en Vercel / .env.local
```
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

## Edita tu número de WhatsApp
- `components/WhatsAppFloat.tsx` (const `phone`)
- `app/layout.tsx` enlace del nav
