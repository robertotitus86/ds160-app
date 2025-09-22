# PayPhone Fix Patch

This folder contains two API routes (`token/route.js` and `link/route.js`) that
implement a robust PayPhone integration for a Next.js (App Router) project.

These routes address common issues such as:

- **Correct endpoint**: Uses `/api/button/Prepare` rather than the deprecated
  `GeneratePaymentLink`.
- **Automatic token generation**: If `PAYPHONE_TOKEN` is not set, a token is
  requested using your `PAYPHONE_CLIENT_ID` and `PAYPHONE_CLIENT_SECRET`.
- **CORS handling**: Includes proper headers for preflight requests.
- **Centavo conversion**: Converts dollar amounts to integer cents as required
  by PayPhone.
- **Valid payload structure**: Ensures `amountWithoutTax` and other fields are
  populated correctly. Supports passing service fees (`serviceUSD`), tips
  (`tipUSD`) and taxes (`taxUSD`) separately.
- **Configurable `responseUrl`**: Builds a default `responseUrl` using
  `NEXT_PUBLIC_APP_ORIGIN` if not provided in the request.

## Installation

1. Copy the contents of `src/app/api/payphone/token/route.js` and
   `src/app/api/payphone/link/route.js` into the corresponding locations in
   your Next.js project (create directories as needed).

2. Add or update the following environment variables in your Vercel project:

   | Variable                     | Description                                         |
   |------------------------------|-----------------------------------------------------|
   | `PAYPHONE_STORE_ID`         | Your store ID from PayPhone Business               |
   | `PAYPHONE_CLIENT_ID`        | Client ID from PayPhone Developer portal           |
   | `PAYPHONE_CLIENT_SECRET`    | Client Secret from PayPhone Developer portal        |
   | `PAYPHONE_BASE_URL`         | Base PayPhone API URL (`https://pay.payphonetodoesposible.com`) |
   | `PAYPHONE_LINK_ENDPOINT`    | **`/api/button/Prepare`**                           |
   | `PAYPHONE_AUTH_ENDPOINT`    | `/api/auth/token`                                   |
   | `PAYPHONE_TOKEN`            | (optional) Pre-generated Bearer token               |
   | `NEXT_PUBLIC_APP_ORIGIN`    | Your site origin, e.g. `https://yourdomain.vercel.app` |

3. Re-deploy your project after updating the environment variables.

## Usage

Send a POST request to `/api/payphone/link` with a JSON body containing at
least the following properties:

```
{
  "amountUSD": 31.80,
  "noTaxUSD": 30.00,
  "serviceUSD": 1.80,
  "clientTransactionId": "DS123456789012"
}
```

You may also pass `description`, `responseUrl`, `cancellationUrl`, `timeZone`,
`lat` and `lng` if required.

The route responds with JSON containing either the payment links or an error
description. For example:

```
{
  "payWithPayPhone": "https://payphone.page.link/abcd...",
  "payWithCard": "https://payphone.page.link/wxyz..."
}
```

## Notes

- Ensure your PayPhone Business domain matches the domain of your deployed
  project (Vercel preview URLs are usually not whitelisted).
- The `NEXT_PUBLIC_APP_ORIGIN` variable is required so the route can construct
  a valid `responseUrl` automatically; alternatively you may provide
  `responseUrl` in each request body.
