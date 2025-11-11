export default function WhatsAppFloat() {
  const phone = "00593987846751"; // ✅ tu número actualizado
  return (
    <a
      href={`https://wa.me/${phone}?text=Hola%20necesito%20ayuda%20con%20mi%20DS-160`}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
    >
      WhatsApp
    </a>
  );
}
