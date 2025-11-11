'use client';

export default function WhatsAppFloat() {
  const phone = "00593987846751"; // Tu número real
  const msg = encodeURIComponent("Hola, necesito ayuda con mi DS-160");

  return (
    <div
      style={{
        position: "fixed",
        right: 18,
        bottom: 18,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        zIndex: 9999,
      }}
    >

      {/* Botón Azul - Ayuda DS-160 */}
      <button
        onClick={() => {
          const el = document.getElementById("chat_widget_toggle");
          if (el) el.click(); // Dispara el chat
        }}
        style={{
          background: "#2563eb",
          color: "#fff",
          fontWeight: 700,
          borderRadius: 999,
          padding: "10px 16px",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 10px 24px rgba(37,99,235,.35)",
        }}
      >
        Ayuda DS-160
      </button>

      {/* Botón Verde - WhatsApp */}
      <a
        href={`https://wa.me/${phone}?text=${msg}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          background: "#25D366",
          color: "#0b1120",
          fontWeight: 700,
          borderRadius: 999,
          padding: "10px 16px",
          textDecoration: "none",
          textAlign: "center",
          boxShadow: "0 10px 24px rgba(0,0,0,.35)",
        }}
      >
        WhatsApp
      </a>

    </div>
  );
}
