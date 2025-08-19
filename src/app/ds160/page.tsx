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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  const submit = () => setSubmitted(true);

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Formulario DS-160 - Ecuador</h1>
      {!submitted ? (
        <div>
          {step === 1 && (
            <div>
              <label>Nombre completo:<br />
                <input name="fullName" value={formData.fullName} onChange={handleChange} />
              </label><br />
              <button onClick={nextStep}>Siguiente</button>
            </div>
          )}
          {step === 2 && (
            <div>
              <label>Número de pasaporte:<br />
                <input name="passportNumber" value={formData.passportNumber} onChange={handleChange} />
              </label><br />
              <button onClick={prevStep}>Atrás</button>
              <button onClick={nextStep}>Siguiente</button>
            </div>
          )}
          {step === 3 && (
            <div>
              <label>Motivo del viaje:<br />
                <textarea name="purpose" value={formData.purpose} onChange={handleChange} />
              </label><br />
              <button onClick={prevStep}>Atrás</button>
              <button onClick={submit}>Enviar</button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2>¡Formulario enviado!</h2>
          <p>Gracias, {formData.fullName}. Procesaremos tu solicitud.</p>
        </div>
      )}
    </main>
  );
}