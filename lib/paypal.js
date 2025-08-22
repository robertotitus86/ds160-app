export function getBaseUrl(env) {
  return env === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
}

export async function getAccessToken(clientId, secret, env) {
  const base = getBaseUrl(env);
  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(`${clientId}:${secret}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
    // @ts-ignore
    next: { revalidate: 0 }
  });
  if (!res.ok) throw new Error("No token PayPal");
  return res.json();
}
