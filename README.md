
# DS-160 Payments (v2, UI mejorada)

## Variables de entorno (Vercel)
- PAYPHONE_STORE_ID
- PAYPHONE_TOKEN
- PAYPAL_CLIENT_ID
- PAYPAL_CLIENT_SECRET
- PAYPAL_ENV = sandbox | live
- NEXT_PUBLIC_PAYPAL_CLIENT_ID
- NEXT_PUBLIC_PAYPAL_ENV = sandbox | live

## Rutas
- `/` Home
- `/checkout` Carrito/Checkout
- `/transferencia` Instrucciones transferencia
- `/gracias` Página de éxito postpago
- `POST /api/payphone/link` Crea link PayPhone (+6%)
- `POST /api/paypal/orders` Crea orden PayPal
- `POST /api/paypal/capture` Captura pago PayPal

## Notas
- En el **portal PayPhone**, configura la URL de retorno a: `https://TU-DOMINIO.vercel.app/gracias?method=payphone`
- PayPal redirige automáticamente a `/gracias?method=paypal` al aprobar.
- La validación automática de transferencia bancaria requiere acuerdos/SDKs bancarios externos; aquí se ofrece botón a la app y subida de comprobante como validación manual.
