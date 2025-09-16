// src/app/checkout/page.jsx
import CheckoutClient from "./CheckoutClient";

export const metadata = {
  title: "Checkout | Asistente DS-160",
  description: "Selecciona servicios y paga con PayPhone o Transferencia.",
};

export default function Page() {
  return <CheckoutClient />;
}
