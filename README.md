# DS-160 App (Stripe + PayPal + Transferencia)

Rutas:
- `/` portada
- `/ds160` asistente DS-160
- `/success` y `/cancel` (Stripe)
- `/paypal/success` y `/paypal/cancel`

## Variables de entorno (Vercel → Settings → Environment Variables)
- `STRIPE_SECRET_KEY` → clave secreta de Stripe (modo test o live)
- `PAYPAL_CLIENT_ID` → Client ID (sandbox/live)
- `PAYPAL_CLIENT_SECRET` → Client Secret (sandbox/live)
- `PAYPAL_ENV` → `sandbox` (por defecto) o `live`

## Cómo funciona
- **Tarjeta (Stripe):** el backend crea un Checkout Session con los servicios seleccionados y redirige a Stripe.
- **PayPal:** se crea una orden y se redirige a la URL de aprobación; al volver, se captura el pago.
- **Transferencia:** registra referencia/fecha y muestra instrucciones (puedes conectar email/DB en `app/api/transfer/route.js`).

## Cambiar precios/nombres de servicios
Edita `lib/services.js`.

## Despliegue
1. Sube el repo a GitHub.
2. Configura las variables de entorno en Vercel.
3. Redeploy.
