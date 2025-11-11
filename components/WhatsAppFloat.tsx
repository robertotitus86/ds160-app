'use client';

export default function WhatsAppFloat() {
  const phone = "593999888777"; // <-- tu número sin + ni 0
  const msg = encodeURIComponent("Hola, quiero ayuda con mi DS-160");
  return (
    <a
      href={`https://wa.me/${phone}?text=${msg}`}
      target="_blank"
      rel="noopener"
      style={{
        position:"fixed", right:18, bottom:18, zIndex:9998,
        background:"#25D366", color:"#0b1120", fontWeight:800,
        borderRadius:999, padding:"10px 14px", textDecoration:"none", boxShadow:"0 8px 24px rgba(0,0,0,.25)"
      }}
    >
      WhatsApp
    </a>
  );
}
