"use client";
import { useMemo, useState } from "react";
import { SERVICES } from "@/lib/services";

export default function DS160Wizard() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    // Datos personales
    surnames: "",
    givenNames: "",
    sex: "",
    maritalStatus: "",
    dob: "",
    pob: "",
    nationality: "",
    otherNationality: "no",
    otherNationalityDetail: "",
    nationalId: "",

    // Propósito del viaje
    tripPurpose: "",
    tripPurposeSpecify: "",
    hasSpecificPlans: "no",
    arrivalDate: "",
    arrivalFlight: "",
    arrivalCity: "",
    departureDate: "",
    departureFlight: "",
    departureCity: "",
    location: "",

    // Acompañantes
    travelingWithOthers: "no",
    companionSurname: "",
    companionGivenNames: "",
    companionRelationship: "",

    // Historial EE.UU.
    everBeenInUS: "no",
    usDriversLicense: "no",
    everIssuedUSVisa: "no",
    previousVisas: "",
    lastVisaDate: "",
    lastVisaNumber: "",
    applyingSameType: "",
    applyingSameCountryAsLast: "",
    tenPrinted: "",
    visaLostStolen: "",
    visaCancelledRevoked: "",
    visaRefusedOrAdmissionRefusedOrWithdrawn: "",
    immigrantPetitionFiled: "",

    // Dirección en EE.UU.
    usStreet1: "",
    usStreet2: "",
    usCity: "",
    usStateProvince: "",
    usZip: "",
    usCountry: "United States",

    // Dirección postal
    mailingSameAsHome: "yes",

    // Teléfonos / redes
    primaryPhone: "",
    socialProvider: "",
    socialIdentifier: "",
    provideOtherWebs: "no",

    // Dirección de hogar
    homeStreet1: "",
    homeStreet2: "",
    homeCity: "",
    homeStateProvince: "",
    homeZip: "",
    homeCountry: "",

    // Teléfonos y emails últimos 5 años
    usedOtherPhones5y: "no",
    emailAddress: "",
    usedOtherEmails5y: "no",

    // Pasaporte
    passportType: "",
    passportNumber: "",
    passportIssuingAuthority: "",
    passportIssueCity: "",
    passportIssueState: "",
    passportIssueCountry: "",
    passportIssueDate: "",
    passportExpiryDate: "",
    passportLostStolen: "no",

    // Contacto u organización en EE.UU.
    contactPerson: "",
    contactOrg: "",
    contactRelationship: "",
    contactUSStreet1: "",
    contactUSCity: "",
    contactUSZip: "",
    contactPhone: "",
    contactEmail: "",

    // Padre/Madre
    fatherSurname: "",
    fatherGivenNames: "",
    fatherDOB: "",
    fatherInUS: "no",
    motherSurname: "",
    motherGivenNames: "",
    motherDOB: "",
    immediateRelativesInUS: "no",
    otherRelativesInUS: "no",

    // Ex cónyuge
    formerSpouseSurname: "",
    formerSpouseGivenNames: "",
    formerSpouseNationality: "",
    formerSpouseBirthCity: "",
    formerSpouseBirthCountry: "",
    formerMarriageDate: "",
    formerMarriageEndDate: "",
    formerMarriageEndHow: "",
    formerMarriageTerminationCountry: "",

    // Pago/servicios
    acceptTerms: false,
    paymentMethod: "",
    services: { fill: true, appointment: false, advice: false }, // por defecto
    transferRef: "",
    transferBank: "",
    transferDate: "",
  });

  const steps = [
    { title: "Datos personales", fields: [
      { key: "surnames", label: "🧑‍💼 Apellido(s) (como en pasaporte)", required: true },
      { key: "givenNames", label: "🧑‍💼 Nombre(s) (como en pasaporte)", required: true },
      { key: "sex", label: "⚧️ Sexo", type: "select", options: ["Male", "Female", "Other"], required: true },
      { key: "maritalStatus", label: "💍 Estado civil", type: "select", options: ["Single", "Married", "Divorced", "Widowed", "Separated"], required: true },
      { key: "dob", label: "📅 Fecha de nacimiento", type: "date", required: true },
      { key: "pob", label: "🌍 Lugar de nacimiento (Ciudad, País)", required: true },
      { key: "nationality", label: "🗺️ Nacionalidad", required: true },
      { key: "otherNationality", label: "¿Tienes/tuviste otra nacionalidad?", type: "radio", options: ["yes", "no"], required: true },
      { key: "otherNationalityDetail", label: "Si respondiste ‘sí’, especifica", showIf: (f) => f.otherNationality === "yes" },
      { key: "nationalId", label: "🆔 Número de identificación nacional (si aplica)" },
    ]},
    { title: "Información de viaje", fields: [
      { key: "tripPurpose", label: "✈️ Propósito principal del viaje", type: "select", options: ["Tourism", "Business", "Study", "Medical", "Transit", "Other"], required: true },
      { key: "tripPurposeSpecify", label: "Especifica (si elegiste ‘Other’)", showIf: (f) => f.tripPurpose === "Other" },
      { key: "hasSpecificPlans", label: "¿Tienes planes específicos de viaje?", type: "radio", options: ["yes", "no"], required: true },
      { key: "arrivalDate", label: "Fecha estimada de llegada", type: "date", showIf: (f) => f.hasSpecificPlans === "yes" },
      { key: "arrivalFlight", label: "Vuelo de llegada (si lo sabes)", showIf: (f) => f.hasSpecificPlans === "yes" },
      { key: "arrivalCity", label: "Ciudad de llegada", showIf: (f) => f.hasSpecificPlans === "yes" },
      { key: "departureDate", label: "Fecha estimada de salida", type: "date", showIf: (f) => f.hasSpecificPlans === "yes" },
      { key: "departureFlight", label: "Vuelo de salida (si lo sabes)", showIf: (f) => f.hasSpecificPlans === "yes" },
      { key: "departureCity", label: "Ciudad de salida", showIf: (f) => f.hasSpecificPlans === "yes" },
      { key: "location", label: "Principal ubicación/estado a visitar (si aplica)" },
    ]},
    { title: "Personas que viajan contigo", fields: [
      { key: "travelingWithOthers", label: "¿Viajas con otras personas?", type: "radio", options: ["yes", "no"], required: true },
      { key: "companionSurname", label: "Apellido(s) del acompañante", showIf: (f) => f.travelingWithOthers === "yes" },
      { key: "companionGivenNames", label: "Nombre(s) del acompañante", showIf: (f) => f.travelingWithOthers === "yes" },
      { key: "companionRelationship", label: "Relación con el acompañante", showIf: (f) => f.travelingWithOthers === "yes" },
    ]},
    { title: "Historial en EE.UU.", fields: [
      { key: "everBeenInUS", label: "¿Alguna vez has estado en EE.UU.?", type: "radio", options: ["yes", "no"], required: true },
      { key: "usDriversLicense", label: "¿Tienes o tuviste licencia de conducir de EE.UU.?", type: "radio", options: ["yes", "no"], required: true },
      { key: "everIssuedUSVisa", label: "¿Te han emitido visa de EE.UU. anteriormente?", type: "radio", options: ["yes", "no"], required: true },
      { key: "previousVisas", label: "Visas anteriores (detalla)", showIf: (f) => f.everIssuedUSVisa === "yes" },
      { key: "lastVisaDate", label: "Fecha de la última visa", type: "date", showIf: (f) => f.everIssuedUSVisa === "yes" },
      { key: "lastVisaNumber", label: "Número de visa", showIf: (f) => f.everIssuedUSVisa === "yes" },
      { key: "applyingSameType", label: "¿Solicitas el mismo tipo de visa?", type: "radio", options: ["yes", "no", "n/a"], showIf: (f) => f.everIssuedUSVisa === "yes" },
      { key: "applyingSameCountryAsLast", label: "¿Solicitas en el mismo país donde emitieron la última visa? (y es tu residencia principal)", type: "radio", options: ["yes", "no", "n/a"], showIf: (f) => f.everIssuedUSVisa === "yes" },
      { key: "tenPrinted", label: "¿Fuiste ‘ten-printed’ (huellas de los 10 dedos)?", type: "radio", options: ["yes", "no", "unsure"], showIf: (f) => f.everIssuedUSVisa === "yes" },
      { key: "visaLostStolen", label: "¿Tu visa alguna vez fue perdida o robada?", type: "radio", options: ["yes", "no"] },
      { key: "visaCancelledRevoked", label: "¿Tu visa fue cancelada o revocada?", type: "radio", options: ["yes", "no"] },
      { key: "visaRefusedOrAdmissionRefusedOrWithdrawn", label: "¿Te negaron visa/ingreso o retiraste solicitud en el puerto de entrada?", type: "radio", options: ["yes", "no"] },
      { key: "immigrantPetitionFiled", label: "¿Alguien presentó una petición de inmigrante a tu nombre (USCIS)?", type: "radio", options: ["yes", "no"] },
    ]},
    { title: "Dirección en EE.UU.", fields: [
      { key: "usStreet1", label: "Calle (línea 1)" },
      { key: "usStreet2", label: "Calle (línea 2)" },
      { key: "usCity", label: "Ciudad" },
      { key: "usStateProvince", label: "Estado/Provincia" },
      { key: "usZip", label: "Código ZIP" },
      { key: "usCountry", label: "País/Región", disabled: true },
      { key: "mailingSameAsHome", label: "¿Tu dirección postal es la misma que tu dirección de hogar?", type: "radio", options: ["yes", "no"], required: true },
    ]},
    { title: "Teléfono, email y redes", fields: [
      { key: "primaryPhone", label: "📱 Teléfono principal", required: true },
      { key: "socialProvider", label: "Proveedor/plataforma de red social (opcional)" },
      { key: "socialIdentifier", label: "Usuario/handle (opcional)" },
      { key: "provideOtherWebs", label: "¿Deseas proporcionar otras webs/apps usadas en los últimos 5 años?", type: "radio", options: ["yes", "no"] },
    ]},
    { title: "Dirección de hogar", fields: [
      { key: "homeStreet1", label: "Calle (línea 1)", required: true },
      { key: "homeStreet2", label: "Calle (línea 2)" },
      { key: "homeCity", label: "Ciudad", required: true },
      { key: "homeStateProvince", label: "Estado/Provincia" },
      { key: "homeZip", label: "Código postal" },
      { key: "homeCountry", label: "País/Región", required: true },
      { key: "usedOtherPhones5y", label: "¿Usaste otros teléfonos en los últimos 5 años?", type: "radio", options: ["yes", "no"] },
      { key: "emailAddress", label: "✉️ Correo electrónico", required: true },
      { key: "usedOtherEmails5y", label: "¿Usaste otros correos en los últimos 5 años?", type: "radio", options: ["yes", "no"] },
    ]},
    { title: "Pasaporte", fields: [
      { key: "passportType", label: "Tipo de pasaporte/documento de viaje", type: "select", options: ["Regular", "Official", "Diplomatic", "Other"], required: true },
      { key: "passportNumber", label: "Número de pasaporte", required: true },
      { key: "passportIssuingAuthority", label: "País/autoridad emisora", required: true },
      { key: "passportIssueCity", label: "Ciudad de emisión" },
      { key: "passportIssueState", label: "Estado/Provincia de emisión (si consta)" },
      { key: "passportIssueCountry", label: "País de emisión" },
      { key: "passportIssueDate", label: "Fecha de emisión", type: "date", required: true },
      { key: "passportExpiryDate", label: "Fecha de expiración", type: "date", required: true },
      { key: "passportLostStolen", label: "¿Alguna vez perdiste un pasaporte o te lo robaron?", type: "radio", options: ["yes", "no"] },
    ]},
    { title: "Contacto u organización en EE.UU.", fields: [
      { key: "contactPerson", label: "Persona de contacto en EE.UU. (opcional si pones organización)" },
      { key: "contactOrg", label: "Nombre de la organización (opcional si pones persona)" },
      { key: "contactRelationship", label: "Relación contigo (pariente, amigo, hotel, escuela, empresa)" },
      { key: "contactUSStreet1", label: "Calle (línea 1)" },
      { key: "contactUSCity", label: "Ciudad" },
      { key: "contactUSZip", label: "Código ZIP (si lo conoces)" },
      { key: "contactPhone", label: "Teléfono" },
      { key: "contactEmail", label: "Email" },
    ]},
    { title: "Información familiar", fields: [
      { key: "fatherSurname", label: "Apellido(s) del padre" },
      { key: "fatherGivenNames", label: "Nombre(s) del padre" },
      { key: "fatherDOB", label: "Fecha de nacimiento del padre", type: "date" },
      { key: "fatherInUS", label: "¿Tu padre está en EE.UU.?", type: "radio", options: ["yes", "no"] },
      { key: "motherSurname", label: "Apellido(s) de la madre" },
      { key: "motherGivenNames", label: "Nombre(s) de la madre" },
      { key: "motherDOB", label: "Fecha de nacimiento de la madre", type: "date" },
      { key: "immediateRelativesInUS", label: "¿Tienes familiares inmediatos (no padres) en EE.UU.?", type: "radio", options: ["yes", "no"] },
      { key: "otherRelativesInUS", label: "¿Tienes otros parientes en EE.UU.?", type: "radio", options: ["yes", "no"] },
    ]},
    { title: "Ex cónyuge (si aplica)", fields: [
      { key: "formerSpouseSurname", label: "Apellido(s) del ex cónyuge" },
      { key: "formerSpouseGivenNames", label: "Nombre(s) del ex cónyuge" },
      { key: "formerSpouseNationality", label: "Nacionalidad del ex cónyuge" },
      { key: "formerSpouseBirthCity", label: "Ciudad de nacimiento del ex cónyuge" },
      { key: "formerSpouseBirthCountry", label: "País de nacimiento del ex cónyuge" },
      { key: "formerMarriageDate", label: "Fecha de matrimonio", type: "date" },
      { key: "formerMarriageEndDate", label: "Fecha de término del matrimonio", type: "date" },
      { key: "formerMarriageEndHow", label: "Cómo terminó (divorcio, fallecimiento, anulación)" },
      { key: "formerMarriageTerminationCountry", label: "País donde se terminó el matrimonio" },
    ]},
    { title: "Revisión y pago", fields: []},
  ];

  const total = useMemo(() => {
    return SERVICES.reduce((sum, s) => sum + (form.services?.[s.id] ? s.price : 0), 0);
  }, [form.services]);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function Field({ field }) {
    if (field.showIf && !field.showIf(form)) return null;
    const commonProps = {
      id: field.key,
      name: field.key,
      value: form[field.key] ?? "",
      onChange: (e) => updateField(field.key, e.target.value),
      style: { width: "100%", padding: 10, border: "1px solid #ccc", borderRadius: 8 },
    };

    return (
      <div style={{ marginBottom: 16 }}>
        <label htmlFor={field.key} style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>
          {field.label} {field.required ? <span style={{ color: "#d00" }}>*</span> : null}
        </label>
        {field.type === "select" ? (
          <select {...commonProps}>
            <option value="">Selecciona…</option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : field.type === "radio" ? (
          <div style={{ display: "flex", gap: 16, flexWrap:"wrap" }}>
            {field.options?.map((opt) => (
              <label key={opt} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input
                  type="radio"
                  name={field.key}
                  value={opt}
                  checked={form[field.key] === opt}
                  onChange={(e) => updateField(field.key, e.target.value)}
                />
                {opt}
              </label>
            ))}
          </div>
        ) : (
          <input type={field.type || "text"} placeholder={field.placeholder || ""} {...commonProps} />
        )}
      </div>
    );
  }

  function validateStep() {
    const current = steps[step];
    const missing = (current.fields || [])
      .filter((f) => f.required && (!form[f.key] || String(form[f.key]).trim() === ""))
      .map((f) => f.label);
    if (missing.length) {
      alert("Faltan campos obligatorios en esta sección:\n- " + missing.join("\n- "));
      return false;
    }
    return true;
  }

  async function handlePay() {
    const selected = Object.fromEntries(Object.entries(form.services || {}).filter(([_, v]) => v));
    if (Object.keys(selected).length === 0) {
      alert("Selecciona al menos un servicio.");
      return;
    }
    if (!form.acceptTerms) {
      alert("Debes aceptar términos y condiciones antes de pagar.");
      return;
    }
    if (!form.paymentMethod) {
      alert("Selecciona un método de pago.");
      return;
    }

    if (form.paymentMethod === "card") {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ services: selected }),
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        alert("No se pudo iniciar el pago con tarjeta.");
      }
      return;
    }

    if (form.paymentMethod === "paypal") {
      const res = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ services: selected }),
      });
      const data = await res.json();
      if (data?.approveUrl) {
        window.location.href = data.approveUrl;
      } else {
        alert("No se pudo iniciar el pago con PayPal.");
      }
      return;
    }

    if (form.paymentMethod === "transfer") {
      if (!form.transferRef || !form.transferDate) {
        alert("Ingresa el número de referencia y la fecha de la transferencia.");
        return;
      }
      const res = await fetch("/api/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          services: selected,
          transferRef: form.transferRef,
          transferBank: form.transferBank,
          transferDate: form.transferDate,
          email: form.emailAddress,
          name: form.givenNames + " " + form.surnames,
        }),
      });
      const data = await res.json();
      if (data?.ok) {
        alert("¡Gracias! Recibimos tu constancia. Te contactaremos para confirmar.");
      } else {
        alert("No se pudo registrar la transferencia.");
      }
      return;
    }
  }

  function handleNext() {
    if (step < steps.length - 1) {
      if (!validateStep()) return;
      setStep(step + 1);
    }
  }

  function handlePrev() {
    if (step > 0) setStep(step - 1);
  }

  return (
    <div style={{ maxWidth: 880, margin: "40px auto", padding: 24 }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 28 }}>✨ Asistente DS-160</h1>
        <p style={{ margin: "6px 0 0", color: "#555" }}>
          Completa cada sección. Tus datos son confidenciales y se usan solo para tu trámite.
        </p>
      </header>

      <nav style={{ display: "grid", gridTemplateColumns: `repeat(${steps.length}, 1fr)`, gap: 6, marginBottom: 24 }}>
        {steps.map((s, i) => (
          <div key={s.title} style={{ height: 6, background: i <= step ? "#2563eb" : "#e5e7eb", borderRadius: 999 }} />
        ))}
      </nav>

      <section style={{ background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: 20 }}>
        <h2 style={{ marginTop: 0 }}>{steps[step].title}</h2>

        {steps[step].title !== "Revisión y pago" ? (
          <div>
            {steps[step].fields.map((f) => (<Field key={f.key} field={f} />))}
          </div>
        ) : (
          <div>
            <h3 style={{ marginTop: 0 }}>Revisa tus datos</h3>
            <div style={{ maxHeight: 220, overflow: "auto", border: "1px solid #eee", borderRadius: 8, padding: 12, marginBottom: 16 }}>
              <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{JSON.stringify(form, null, 2)}</pre>
            </div>

            <h3>🧾 Selecciona tus servicios</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              {SERVICES.map((s) => (
                <label key={s.id} style={{ border: "1px solid #eee", borderRadius: 10, padding: 12, display: "flex", gap: 10, alignItems: "center" }}>
                  <input
                    type="checkbox"
                    checked={!!form.services?.[s.id]}
                    onChange={(e) => updateField("services", { ...form.services, [s.id]: e.target.checked })}
                  />
                  <span style={{ flex: 1 }}>{s.label}</span>
                  <strong>${s.price.toFixed(2)}</strong>
                </label>
              ))}
            </div>

            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", margin:"12px 0 6px" }}>
              <span>Total a pagar</span>
              <strong style={{ fontSize: 20 }}>${total.toFixed(2)}</strong>
            </div>

            <h3>💳 Método de pago</h3>
            <div style={{ display: "flex", gap: 16, margin: "8px 0 12px", flexWrap:"wrap" }}>
              {[
                { id: "card", label: "Tarjeta (Stripe)" },
                { id: "paypal", label: "PayPal" },
                { id: "transfer", label: "Transferencia" },
              ].map((m) => (
                <label key={m.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={m.id}
                    checked={form.paymentMethod === m.id}
                    onChange={(e) => updateField("paymentMethod", e.target.value)}
                  />
                  {m.label}
                </label>
              ))}
            </div>

            {form.paymentMethod === "transfer" && (
              <div style={{ border: "1px dashed #ddd", borderRadius: 8, padding: 12, marginBottom: 12 }}>
                <p style={{ marginTop: 0 }}><strong>Datos para transferencia</strong></p>
                <ul style={{ marginTop: 0 }}>
                  <li>Banco: <strong>Banco Ejemplo</strong></li>
                  <li>Cuenta: <strong>1234567890</strong></li>
                  <li>Titular: <strong>Tu Empresa S.A.</strong></li>
                  <li>RUC/ID: <strong>0999999999</strong></li>
                  <li>Correo de confirmación: <strong>pagos@tudominio.com</strong></li>
                </ul>
                <div style={{ display: "grid", gridTemplateColumns:"1fr 1fr", gap: 12 }}>
                  <input placeholder="Banco emisor (opcional)" value={form.transferBank} onChange={(e)=>updateField("transferBank", e.target.value)} style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }} />
                  <input placeholder="N.º de referencia" value={form.transferRef} onChange={(e)=>updateField("transferRef", e.target.value)} style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }} />
                  <input type="date" placeholder="Fecha de la transferencia" value={form.transferDate} onChange={(e)=>updateField("transferDate", e.target.value)} style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }} />
                </div>
                <small>Adjunta el comprobante por correo a <strong>pagos@tudominio.com</strong> con tu nombre y referencia.</small>
              </div>
            )}

            <label style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 16px" }}>
              <input
                type="checkbox"
                checked={form.acceptTerms}
                onChange={(e) => updateField("acceptTerms", e.target.checked)}
              />
              Acepto los términos y condiciones del servicio.
            </label>

            <button onClick={handlePay} style={{ padding: "10px 16px", borderRadius: 8, border: "none", background: "#16a34a", color: "#fff", fontWeight: 600 }}>
              Pagar ${total.toFixed(2)}
            </button>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
          <button onClick={handlePrev} disabled={step === 0} style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #ddd", background: "#fff" }}>
            ← Atrás
          </button>
          {step < steps.length - 1 ? (
            <button onClick={() => {
              if (step < steps.length - 1) {
                if (!validateStep()) return;
                setStep(step + 1);
              }
            }} style={{ padding: "10px 14px", borderRadius: 8, border: "none", background: "#2563eb", color: "#fff" }}>
              Siguiente →
            </button>
          ) : null}
        </div>
      </section>

      <footer style={{ marginTop: 20, color: "#666", fontSize: 12 }}>
        Nota: Este asistente prepara tus respuestas para el DS-160. Verifica que coincidan con tus documentos.
      </footer>
    </div>
  );
}
