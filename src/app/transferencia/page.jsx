// src/app/transferencia/page.jsx
import styles from "./transferencia.module.css";
import TransferenciaClient from "./TransferenciaClient";

export const metadata = {
  title: "Pago por Transferencia | Asistente DS-160",
  description: "Pago con Deuna, datos bancarios y validación de comprobante.",
};

const BANK = {
  titular: "Roberto Acosta",
  banco: "Banco Pichincha",
  cuenta: "2200449871",
  tipo: "Ahorros",
  identificacion: "1719731380",
};

// cache-bust para el QR
const QR_SRC = "/deuna-qr.jpg?v=8";

export default function TransferenciaPage() {
  return (
    <main>
      <div className={`${styles.wrap} ${styles.vars}`}>
        <h1 className={styles.title}>Pago por Transferencia</h1>
        <p className={styles.intro}>
          Escanea el código QR para pagar con Deuna o realiza una transferencia bancaria.
          Al finalizar, sube el comprobante para validar la transacción.
        </p>

        {/* Tarjeta bancaria (arriba derecha) */}
        <div className={styles.bankRow}>
          <div className={`${styles.card} ${styles.bankCard}`}>
            <table className={styles.bankTable}>
              <tbody>
                <tr><td>Titular</td><td>{BANK.titular}</td></tr>
                <tr><td>Banco</td><td>{BANK.banco}</td></tr>
                <tr><td>Cuenta</td><td>{BANK.cuenta}</td></tr>
                <tr><td>Tipo</td><td>{BANK.tipo}</td></tr>
                <tr><td>Identificación</td><td>{BANK.identificacion}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Pago con Deuna (centrado) */}
        <section className={styles.section}>
          <h2>Pago con Deuna!</h2>
          <p>Escanea el siguiente QR o descárgalo para pagar fácilmente:</p>

          <div className={styles.qrCard}>
            <img src={QR_SRC} alt="QR Deuna" width="170" height="170" className={styles.qr} />
          </div>

          <div className={styles.actions}>
            <a href="/deuna-qr.jpg" target="_blank" rel="noopener noreferrer" className={`${styles.btn} ${styles.primary}`}>
              Abrir QR
            </a>
            <a href="/deuna-qr.jpg" download className={`${styles.btn} ${styles.ghost}`}>
              Descargar QR
            </a>
          </div>
        </section>

        {/* Banca web (izquierda) */}
        <div className={styles.left}>
          <a href="https://www.pichincha.com/portal" target="_blank" rel="noopener noreferrer">
            Ir a Banca Web
          </a>
        </div>

        {/* Validación (tarjeta separada) */}
        <section className={`${styles.card} ${styles.uploadCard}`}>
          <TransferenciaClient />
        </section>
      </div>
    </main>
  );
}
