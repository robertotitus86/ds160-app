import PayphoneButton from "./PayphoneButton";

export default function CheckoutPage() {
  return (
    <main className="container">
      <h1>Checkout</h1>
      <div className="card" style={{marginTop:12}}>
        <p>Servicios seleccionados</p>
        <ul>
          <li>Llenado de formulario DS-160 — $30.00</li>
        </ul>
        <div style={{marginTop:12}}>
          <PayphoneButton amountUSD={31.80} />
        </div>
      </div>
    </main>
  );
}