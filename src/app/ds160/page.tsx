import { redirect } from "next/navigation";

export default function Page() {
  // Entra a /checkout (nuevo checkout con PayPhone/PayPal/Transferencia)
  redirect("/checkout");
}
