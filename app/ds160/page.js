"use client";
import { useMemo, useState } from "react";
import { SERVICES, totalFromSelection } from "@/lib/services";
import { BRAND } from "@/lib/brand";

export default function DS160Wizard() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    surnames: "", givenNames: "", sex: "", maritalStatus: "", dob: "", pob: "",
    nationality: "", otherNationality: "no", otherNationalityDetail: "", nationalId: "",
    tripPurpose: "", tripPurposeSpecify: "", hasSpecificPlans: "no",
    arrivalDate: "", arrivalFlight: "", arrivalCity: "", departureDate: "", departureFlight: "", departureCity: "", location: "",
    travelingWithOthers: "no", companionSurname: "", companionGivenNames: "", companionRelationship: "",
    everBeenInUS: "no", usDriversLicense: "no", everIssuedUSVisa: "no", previousVisas: "", lastVisaDate: "", lastVisaNumber: "",
    applyingSameType: "", applyingSameCountryAsLast: "", tenPrinted: "", visaLostStolen: "", visaCancelledRevoked: "",
    visaRefusedOrAdmissionRefusedOrWithdrawn: "", immigrantPetitionFiled: "",
    usStreet1: "", usStreet2: "", usCity: "", usStateProvince: "", usZip: "", usCountry: "United States",
    mailingSameAsHome: "yes",
    primaryPhone: "", socialProvider: "", socialIdentifier: "", provideOtherWebs: "no",
    homeStreet1: "", homeStreet2: "", homeCity: "", homeStateProvince: "", homeZip: "", homeCountry: "",
    usedOtherPhones5y: "no", emailAddress: "", usedOtherEmails5y: "no",
    passportType: "", passportNumber: "", passportIssuingAuthority: "", passportIssueCity: "", passportIssueState: "",
    passportIssueCountry: "", passportIssueDate: "", passportExpiryDate: "", passportLostStolen: "no",
    contactPerson: "", contactOrg: "", contactRelationship: "", contactUSStreet1: "", contactUSCity: "", contactUSZip: "",
    contactPhone: "", contactEmail: "",
    fatherSurname: "", fatherGivenNames: "", fatherDOB: "", fatherInUS: "no",
    motherSurname: "", motherGivenNames: "", motherDOB: "", immediateRelativesInUS: "no", otherRelativesInUS: "no",
    formerSpouseSurname: "", formerSpouseGivenNames: "", formerSpouseNationality: "", formerSpouseBirthCity: "",
    formerSpouseBirthCountry: "", formerMarriageDate: "", formerMarriageEndDate: "", formerMarriageEndHow: "", formerMarriageTerminationCountry: "",
    acceptTerms: false, paymentMethod: "", services: { fill: true, appointment: false, advice: false },
    transferRef: "", transferBank: "", transferDate: "",
  });

  const steps = [
    { title: "Datos personales", fields: [
      { key: "surnames", label: "Apellidos", required: true },
      { key: "givenNames", label: "Nombres", required: true },
      { key: "sex", label: "Sexo", type: "select", options:["Male","Female","Other"], required:true },
      { key: "maritalStatus", label: "Estado civil", type: "select", options:["Single","Married","Divorced","Widowed","Separated"], required:true },
      { key: "dob", label: "Fecha de nacimiento", type:"date", required:true },
      { key: "pob", label: "Lugar de nacimiento", required:true },
      { key: "nationality", label: "Nacionalidad", required:true },
    ]},
    { title: "Información de viaje", fields: [
      { key: "tripPurpose", label: "Propósito principal", type:"select", options:["Tourism","Business","Study","Medical","Transit","Other"], required:true },
      { key: "hasSpecificPlans", label: "¿Tienes planes específicos?", type:"radio", options:["yes","no"], required:true },
    ]},
    { title: "Contacto/US", fields: [
      { key: "contactPerson", label: "Contacto u organización en EE.UU." },
      { key: "contactEmail", label: "Email contacto" },
    ]},
    { title: "Datos de contacto", fields: [
      { key: "primaryPhone", label: "Teléfono principal", required:true },
      { key: "emailAddress", label: "Correo electrónico", required:true },
      { key: "homeCountry", label: "País de residencia", required:true },
    ]},
    { title: "Revisión y pago", fields: []},
  ];

  const total = useMemo(() => totalFromSelection(form.services), [form.services]);

  function updateField(key, value) { setForm((p)=>({...p,[key]:value})); }

  function Field({ field }) {
    const commonProps = { id: field.key, name: field.key, value: form[field.key] ?? "", onChange:(e)=>updateField(field.key, e.target.value),
      style:{ width:"100%", padding:10, border:"1px solid #d1d5db", borderRadius:8 } };
    return (
      <div style={{marginBottom:14}}>
        <label htmlFor={field.key} style={{display:"block", fontWeight:600, marginBottom:6}}>
          {field.label} {field.required ? <span style={{color:"#dc2626"}}>*</span> : null}
        </label>
        {field.type==="select" ? (
          <select {...commonProps}><option value="">Selecciona…</option>{field.options?.map(o=><option key={o}>{o}</option>)}</select>
        ) : field.type==="radio" ? (
          <div style={{display:"flex", gap:12}}>
            {field.options?.map(o=>(
              <label key={o} style={{display:"flex",alignItems:"center",gap:6}}>
                <input type="radio" name={field.key} value={o} checked={form[field.key]===o} onChange={(e)=>updateField(field.key, e.target.value)} /> {o}
              </label>
            ))}
          </div>
        ) : (<input type={field.type||"text"} {...commonProps} />)}
      </div>
    );
  }

  function validateStep() {
    const current = steps[step];
    const missing = (current.fields||[]).filter(f=>f.required && (!form[f.key] || String(form[f.key]).trim()===""));
    if (missing.length) { alert("Completa los campos obligatorios."); return false; }
    return true;
  }

  async function handlePay() {
    const selected = Object.fromEntries(Object.entries(form.services||{}).filter(([_,v])=>v));
    if (!Object.keys(selected).length) { alert("Selecciona al menos un servicio."); return; }
    if (!form.acceptTerms) { alert("Debes aceptar términos y condiciones."); return; }
    if (!form.paymentMethod) { alert("Selecciona un método de pago."); return; }

    // Guarda la selección local para notificación al volver de Stripe/PayPal
    localStorage.setItem("ds160_order", JSON.stringify({
      name: form.givenNames + " " + form.surnames,
      email: form.emailAddress,
      method: form.paymentMethod,
      services: selected
    }));

    if (form.paymentMethod === "card") {
      const r = await fetch("/api/checkout",{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ services: selected }) });
      const d = await r.json(); if (d?.url) { window.location.href = d.url; return; }
      alert("No se pudo iniciar el pago con tarjeta."); return;
    }
    if (form.paymentMethod === "paypal") {
      const r = await fetch("/api/paypal/create-order",{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ services: selected }) });
      const d = await r.json(); if (d?.approveUrl) { window.location.href = d.approveUrl; return; }
      alert("No se pudo iniciar el pago con PayPal."); return;
    }
    if (form.paymentMethod === "transfer") {
      if (!form.transferRef || !form.transferDate) { alert("Ingresa referencia y fecha de transferencia."); return; }
      await fetch("/api/notify", {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          name: form.givenNames + " " + form.surnames,
          email: form.emailAddress,
          method: "transfer",
          services: selected,
          status: "transfer-reported"
        })
      });
      alert("¡Gracias! Registramos tu transferencia. Te contactaremos pronto.");
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 24 }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 28, color: BRAND.primary }}>Asistente DS-160</h1>
        <p style={{ margin: "6px 0 0", color: "#6b7280" }}>
          Completa cada sección. Tus datos son confidenciales y se usan solo para tu trámite.
        </p>
      </header>

      <nav style={{ display: "grid", gridTemplateColumns: `repeat(${steps.length}, 1fr)`, gap: 6, marginBottom: 24 }}>
        {steps.map((s, i) => (
          <div key={s.title} style={{ height: 6, background: i <= step ? BRAND.primary : "#e5e7eb", borderRadius: 999 }} />
        ))}
      </nav>

      <section style={{ background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: 20 }}>
        <h2 style={{ marginTop: 0 }}>{steps[step].title}</h2>

        {steps[step].title !== "Revisión y pago" ? (
          <div>{steps[step].fields.map(f=><Field key={f.key} field={f} />)}</div>
        ) : (
          <div>
            <h3>🧾 Selecciona tus servicios</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              {SERVICES.map((s) => (
                <label key={s.id} style={{ border: "1px solid #eee", borderRadius: 10, padding: 12, display: "flex", gap: 10, alignItems: "center" }}>
                  <input type="checkbox" checked={!!form.services?.[s.id]} onChange={(e)=>updateField("services",{...form.services,[s.id]:e.target.checked})} />
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
            <div style={{ display:"flex", gap:16, margin:"8px 0 12px", flexWrap:"wrap" }}>
              {[
                { id:"card", label:"Tarjeta (Stripe)" },
                { id:"paypal", label:"PayPal" },
                { id:"transfer", label:"Transferencia" },
              ].map(m => (
                <label key={m.id} style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <input type="radio" name="paymentMethod" value={m.id} checked={form.paymentMethod===m.id} onChange={(e)=>updateField("paymentMethod", e.target.value)} /> {m.label}
                </label>
              ))}
            </div>

            {form.paymentMethod === "transfer" && (
              <div style={{ border: "1px dashed #ddd", borderRadius: 8, padding: 12, marginBottom: 12 }}>
                <p style={{ marginTop: 0 }}><strong>Datos para transferencia</strong></p>
                <ul style={{ marginTop: 0 }}>
                  <li>Banco: <strong>{BRAND.bank.bankName}</strong></li>
                  <li>Cuenta: <strong>{BRAND.bank.account}</strong></li>
                  <li>Titular: <strong>{BRAND.bank.holder}</strong></li>
                  <li>RUC/ID: <strong>{BRAND.bank.taxId}</strong></li>
                  <li>Correo de confirmación: <strong>{BRAND.paymentsEmail}</strong></li>
                </ul>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap: 12 }}>
                  <input placeholder="Banco emisor (opcional)" value={form.transferBank} onChange={(e)=>updateField("transferBank", e.target.value)} style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }} />
                  <input placeholder="N.º de referencia" value={form.transferRef} onChange={(e)=>updateField("transferRef", e.target.value)} style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }} />
                  <input type="date" placeholder="Fecha de la transferencia" value={form.transferDate} onChange={(e)=>updateField("transferDate", e.target.value)} style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }} />
                </div>
                <small>Adjunta el comprobante por correo a <strong>{BRAND.paymentsEmail}</strong> con tu nombre y referencia.</small>
              </div>
            )}

            <label style={{ display:"flex", alignItems:"center", gap:8, margin:"8px 0 16px" }}>
              <input type="checkbox" checked={form.acceptTerms} onChange={(e)=>updateField("acceptTerms", e.target.checked)} /> Acepto los términos y condiciones del servicio.
            </label>

            <button onClick={handlePay} style={{ padding: "10px 16px", borderRadius: 8, border: "none", background: BRAND.accent, color: "#fff", fontWeight: 600 }}>
              Pagar ${total.toFixed(2)}
            </button>
          </div>
        )}

        <div style={{ display:"flex", justifyContent:"space-between", marginTop:20 }}>
          <button onClick={()=> step>0 && setStep(step-1)} disabled={step===0} style={{ padding:"10px 14px", borderRadius:8, border:"1px solid #ddd", background:"#fff" }}>← Atrás</button>
          {step < steps.length - 1 ? (
            <button onClick={()=>{ if(!validateStep()) return; setStep(step+1); }} style={{ padding:"10px 14px", borderRadius:8, border:"none", background:BRAND.primary, color:"#fff" }}>Siguiente →</button>
          ) : null}
        </div>
      </section>
      <footer style={{ marginTop: 20, color: "#666", fontSize: 12 }}>
        Nota: Este asistente prepara tus respuestas para el DS-160. Verifica que coincidan con tus documentos.
      </footer>
    </div>
  );
}
