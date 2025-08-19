'use client';
import React, { useState } from 'react';

export default function Page() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    passportNumber: '',
    purpose: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);
  const submit = () => setSubmitted(true);

  return (
    <main style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
      <h1>Formulario DS-160 - Ecuador</h1>
      {!submitted ? (
        <div>
          {step === 1 && (
            <div style={{ marginTop: '1rem' }}>
              <label>
                Nombre completo<br />
                <input name="fullName" value={formData.fullName} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
              </label><br /><br />
              <button onClick={nextStep}>Siguiente</button>
            </div>
          )}
          {step === 2 && (
            <div style={{ marginTop: '1rem' }}>
              <label>
                Número de pasaporte<br />
                <input name="passportNumber" value={formData.passportNumber} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
              </label><br /><br />
              <button onClick={prevStep} style={{ marginRight: 8 }}>Atrás</button>
              <button onClick={nextStep}>Siguiente</button>
            </div>
          )}
          {step === 3 && (
            <div style={{ marginTop: '1rem' }}>
              <label>
                Motivo del viaje<br />
                <textarea name="purpose" value={formData.purpose} onChange={handleChange} style={{ width: '100%', minHeight: 100, padding: '8px' }} />
              </label><br /><br />
              <button onClick={prevStep} style={{ marginRight: 8 }}>Atrás</button>
              <button onClick={submit}>Enviar</button>
            </div>
          )}
        </div>
      ) : (
        <div style={{ marginTop: '1rem' }}>
          <h2>¡Formulario enviado!</h2>
          <p>Gracias, {formData.fullName}. Procesaremos tu solicitud.</p>
          <a href="/ds160">Volver a empezar</a>
        </div>
      )}
    </main>
  );
}
