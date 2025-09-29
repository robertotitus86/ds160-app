await fetch("/api/payphone/link", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    amount: Math.round(total * 100),
    reference: `ORD-${Date.now()}`,
    responseUrl: `${window.location.origin}/checkout/confirm?method=payphone`
  })
});

