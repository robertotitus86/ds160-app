'use client';

import { useEffect, useMemo, useState } from 'react';

type StepKey = 'personales' | 'pasaporte' | 'contacto' | 'viaje';
type FormState = {
  // Paso 1: Datos personales
  primerNombre: string;
  segundoNombre: string;
  apellidos: string;
  fechaNacimiento: string; // YYYY-MM-DD
  lugarNacimiento: string;
  nacionalidad: string;
  estadoCivil: string;
  genero: string;

  // Paso 2: Pasaporte
  nroPasaporte: string;
  paisEmision: string;
  fechaEmision: string;
  fechaExpiracion: string;

  // Paso 3: Contacto
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  paisResidencia: string;

  // Paso 4: Viaje
  propositoViaje: string;
  ciudadEmbajada: string;
  fechaTentativa: string;
  direccionEnEEUU: string;
  contactoEnEEUU: string;
};

const ADMIN_WHATSAPP = '00593987846751'; // Tu número
const STORAGE_KEY = 'ds160_wizard_v1';

const styles = {
  page: { display: 'grid', gap: 16 as const },
  card: {
    background: '#0f172a',
    padding: 18,
    borderRadius: 14,
    border: '1px solid #111827',
  },
  row: { display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))' },
  label: { fontSize: 13, opacity: 0.9 },
  input: {
    width: '100%',
    padding: 10,
    borderRadius: 10,
    border: '1px solid #1f2937',
    background: '#0b1220',
    color: '#fff',
  },
  help: { fontSize: 12, opacity: 0.75, marginTop: 6 },
  actions: { display: 'flex', gap: 10, flexWrap: 'wrap' as const },
  btn: {
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '10px 14px',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  ghost: {
    background: '#334155',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '10px 14px',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  stepper: {
    display: 'grid',
    gap: 8,
    gridTemplateColumns: 'repeat(4,1fr)',
  },
  pill: (active: boolean) => ({
    background: active ? '#2563eb' : '#0b1220',
    border: `1px solid ${active ? '#2563eb' : '#1f2937'}`,
    color: active ? '#fff' : '#cbd5e1',
    textAlign: 'center' as const,
    padding: '8px 10px',
    borderRadius: 999,
    fontSize: 13,
  }),
};

const initialState: FormState = {
  primerNombre: '',
  segundoNombre: '',
  apellidos: '',
  fechaNacimiento: '',
  lugarNacimiento: '',
  nacionalidad: '',
  estadoCivil: '',
  genero: '',

  nroPasaporte: '',
  paisEmision: '',
  fechaEmision: '',
  fechaExpiracion: '',

  email: '',
  telefono: '',
  direccion: '',
  ciudad: '',
  provincia: '',
  paisResidencia: '',

  propositoViaje: '',
  ciudadEmbajada: '',
  fechaTentativa: '',
  direccionEnEEUU: '',
  contactoEnEEUU: '',
};

export default function WizardPage() {
  const [data, setData] = useState<FormState>(initialState);
  const [step, setStep] = useState<StepKey>('personales');
  const steps: { key: StepKey; title: string }[] = useMemo(
    () => [
      { key: 'personales', title: 'Datos personales' },
      { key: 'pasaporte', title: 'Pasaporte' },
      { key: 'contacto', title: 'Contacto' },
      { key: 'viaje', title: 'Viaje' },
    ],
    []
  );

  // Cargar / Guardar
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }, [data]);

  // Helpers inputs
  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  // Validaciones simples por paso
  function validateCurrentStep(): string[] {
    const errors: string[] = [];
    if (step === 'personales') {
      if (!data.primerNombre) errors.push('Primer nombre es obligatorio.');
      if (!data.apellidos) errors.push('Apellidos son obligatorios.');
      if (!data.fechaNacimiento) errors.push('Fecha de nacimiento es obligatoria.');
      if (!data.nacionalidad) errors.push('Nacionalidad es obligatoria.');
      if (!data.genero) errors.push('Seleccione su género.');
      if (!data.estadoCivil) errors.push('Seleccione su estado civil.');
    }
    if (step === 'pasaporte') {
      if (!data.nroPasaporte) errors.push('Número de pasaporte es obligatorio.');
      if (!data.paisEmision) errors.push('País de emisión es obligatorio.');
      if (!data.fechaEmision) errors.push('Fecha de emisión es obligatoria.');
      if (!data.fechaExpiracion) errors.push('Fecha de expiración es obligatoria.');
    }
    if (step === 'contacto') {
      if (!data.email) errors.push('Email es obligatorio.');
      if (!data.telefono) errors.push('Teléfono es obligatorio.');
      if (!data.direccion) errors.push('Dirección es obligatoria.');
      if (!data.paisResidencia) errors.push('País de residencia es obligatorio.');
    }
    if (step === 'viaje') {
      if (!data.propositoViaje) errors.push('Propósito del viaje es obligatorio.');
      if (!data.ciudadEmbajada) errors.push('Ciudad/Consulado para entrevista es obligatorio.');
    }
    return errors;
  }

  function next() {
    const errors = validateCurrentStep();
    if (errors.length) {
      alert('Revisa:\n\n' + errors.join('\n'));
      return;
    }
    const idx = steps.findIndex((s) => s.key === step);
    if (idx < steps.length - 1) setStep(steps[idx + 1].key);
  }

  function prev() {
    const idx = steps.findIndex((s) => s.key === step);
    if (idx > 0) setStep(steps[idx - 1].key);
  }

  // Exportadores
  function toCSV(): string {
    const rows: string[][] = [];
    const map: Record<string, string> = {
      primerNombre: 'Primer Nombre',
      segundoNombre: 'Segundo Nombre',
      apellidos: 'Apellidos',
      fechaNacimiento: 'Fecha Nacimiento',
      lugarNacimiento: 'Lugar Nacimiento',
      nacionalidad: 'Nacionalidad',
      estadoCivil: 'Estado Civil',
      genero: 'Género',
      nroPasaporte: 'Nro Pasaporte',
      paisEmision: 'País Emisión',
      fechaEmision: 'Fecha Emisión',
      fechaExpiracion: 'Fecha Expiración',
      email: 'Email',
      telefono: 'Teléfono',
      direccion: 'Dirección',
      ciudad: 'Ciudad',
      provincia: 'Provincia/Estado',
      paisResidencia: 'País Residencia',
      propositoViaje: 'Propósito Viaje',
      ciudadEmbajada: 'Embajada/Consulado',
      fechaTentativa: 'Fecha Tentativa',
      direccionEnEEUU: 'Dirección en EEUU',
      contactoEnEEUU: 'Contacto en EEUU',
    };
    Object.entries(map).forEach(([k, label]) => {
      const v = (data as any)[k] ?? '';
      rows.push([label, String(v).replace(/\n/g, ' ')]);
    });
    return rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
  }

  function downloadCSV() {
    const blob = new Blob([toCSV()], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ds160-respuestas.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  function openWhatsApp() {
    const servicios = 'Asistente DS-160';
    const csv = toCSV();
    const firstLine = csv.split('\n')[0]; // cabecera de ejemplo
    const nombre = `${data.primerNombre} ${data.apellidos}`.trim();
    const texto = encodeURIComponent(
      `Hola, envío mis respuestas para el DS-160.\n\nNombre: ${nombre}\nServicio: ${servicios}\n\n(Adjuntaré el archivo CSV con mis datos)\n`
    );
    window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${texto}`, '_blank');
  }

  function openMailto() {
    const nombre = `${data.primerNombre} ${data.apellidos}`.trim();
    const subject = encodeURIComponent(`Respuestas DS-160 - ${nombre}`);
    const body = encodeURIComponent(
      `Hola, envío mis respuestas del asistente DS-160.\n\nNombre: ${nombre}\n\n1) También descargaré y adjuntaré el CSV desde la página.\n2) Pueden responderme a este mismo correo.\n\nGracias.`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }

  return (
    <div style={styles.page}>
      {/* Stepper */}
      <section style={styles.card}>
        <div style={styles.stepper}>
          {steps.map((s) => (
            <div
              key={s.key}
              style={styles.pill(s.key === step)}
              onClick={() => setStep(s.key)}
            >
              {s.title}
            </div>
          ))}
        </div>
      </section>

      {/* Paso activo */}
      <section style={styles.card}>
        <h2 style={{ marginTop: 0 }}>
          {steps.find((s) => s.key === step)?.title}
        </h2>

        {step === 'personales' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={styles.row}>
              <div>
                <div style={styles.label}>Primer nombre *</div>
                <input
                  style={styles.input}
                  value={data.primerNombre}
                  onChange={(e) => set('primerNombre', e.target.value)}
                  placeholder="Como aparece en el pasaporte"
                />
                <div style={styles.help}>En DS-160: Given Name.</div>
              </div>
              <div>
                <div style={styles.label}>Segundo nombre</div>
                <input
                  style={styles.input}
                  value={data.segundoNombre}
                  onChange={(e) => set('segundoNombre', e.target.value)}
                  placeholder="Si no tiene, deje en blanco"
                />
              </div>
              <div>
                <div style={styles.label}>Apellidos *</div>
                <input
                  style={styles.input}
                  value={data.apellidos}
                  onChange={(e) => set('apellidos', e.target.value)}
                  placeholder="Como aparece en el pasaporte"
                />
                <div style={styles.help}>En DS-160: Surname.</div>
              </div>
            </div>

            <div style={styles.row}>
              <div>
                <div style={styles.label}>Fecha de nacimiento *</div>
                <input
                  type="date"
                  style={styles.input}
                  value={data.fechaNacimiento}
                  onChange={(e) => set('fechaNacimiento', e.target.value)}
                />
              </div>
              <div>
                <div style={styles.label}>Lugar de nacimiento</div>
                <input
                  style={styles.input}
                  value={data.lugarNacimiento}
                  onChange={(e) => set('lugarNacimiento', e.target.value)}
                  placeholder="Ciudad y país (p.ej., Quito, Ecuador)"
                />
              </div>
              <div>
                <div style={styles.label}>Nacionalidad *</div>
                <input
                  style={styles.input}
                  value={data.nacionalidad}
                  onChange={(e) => set('nacionalidad', e.target.value)}
                  placeholder="Ej.: Ecuatoriana"
                />
                <div style={styles.help}>
                  DS-160: Country/Region of Origin (Nationality).
                </div>
              </div>
            </div>

            <div style={styles.row}>
              <div>
                <div style={styles.label}>Estado civil *</div>
                <select
                  style={styles.input}
                  value={data.estadoCivil}
                  onChange={(e) => set('estadoCivil', e.target.value)}
                >
                  <option value="">Seleccione…</option>
                  <option>Soltero(a)</option>
                  <option>Casado(a)</option>
                  <option>Divorciado(a)</option>
                  <option>Viudo(a)</option>
                  <option>Unión libre</option>
                </select>
              </div>
              <div>
                <div style={styles.label}>Género *</div>
                <select
                  style={styles.input}
                  value={data.genero}
                  onChange={(e) => set('genero', e.target.value)}
                >
                  <option value="">Seleccione…</option>
                  <option>Masculino</option>
                  <option>Femenino</option>
                  <option>Otro / Prefiero no decir</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 'pasaporte' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={styles.row}>
              <div>
                <div style={styles.label}>Nro. de pasaporte *</div>
                <input
                  style={styles.input}
                  value={data.nroPasaporte}
                  onChange={(e) => set('nroPasaporte', e.target.value.toUpperCase())}
                  placeholder="Ej.: P1234567"
                />
                <div style={styles.help}>Tal como aparece en el documento.</div>
              </div>
              <div>
                <div style={styles.label}>País de emisión *</div>
                <input
                  style={styles.input}
                  value={data.paisEmision}
                  onChange={(e) => set('paisEmision', e.target.value)}
                  placeholder="Ej.: Ecuador"
                />
              </div>
            </div>
            <div style={styles.row}>
              <div>
                <div style={styles.label}>Fecha de emisión *</div>
                <input
                  type="date"
                  style={styles.input}
                  value={data.fechaEmision}
                  onChange={(e) => set('fechaEmision', e.target.value)}
                />
              </div>
              <div>
                <div style={styles.label}>Fecha de expiración *</div>
                <input
                  type="date"
                  style={styles.input}
                  value={data.fechaExpiracion}
                  onChange={(e) => set('fechaExpiracion', e.target.value)}
                />
                <div style={styles.help}>
                  Asegúrese de que tenga más de 6 meses de vigencia.
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'contacto' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={styles.row}>
              <div>
                <div style={styles.label}>Email *</div>
                <input
                  type="email"
                  style={styles.input}
                  value={data.email}
                  onChange={(e) => set('email', e.target.value)}
                  placeholder="nombre@correo.com"
                />
              </div>
              <div>
                <div style={styles.label}>Teléfono (con código país) *</div>
                <input
                  style={styles.input}
                  value={data.telefono}
                  onChange={(e) => set('telefono', e.target.value)}
                  placeholder="Ej.: +593 987 846 751"
                />
              </div>
            </div>

            <div style={styles.row}>
              <div>
                <div style={styles.label}>Dirección *</div>
                <input
                  style={styles.input}
                  value={data.direccion}
                  onChange={(e) => set('direccion', e.target.value)}
                  placeholder="Calle, número, referencia"
                />
              </div>
              <div>
                <div style={styles.label}>Ciudad *</div>
                <input
                  style={styles.input}
                  value={data.ciudad}
                  onChange={(e) => set('ciudad', e.target.value)}
                />
              </div>
              <div>
                <div style={styles.label}>Provincia / Estado</div>
                <input
                  style={styles.input}
                  value={data.provincia}
                  onChange={(e) => set('provincia', e.target.value)}
                />
              </div>
              <div>
                <div style={styles.label}>País de residencia *</div>
                <input
                  style={styles.input}
                  value={data.paisResidencia}
                  onChange={(e) => set('paisResidencia', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {step === 'viaje' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={styles.row}>
              <div>
                <div style={styles.label}>Propósito del viaje *</div>
                <select
                  style={styles.input}
                  value={data.propositoViaje}
                  onChange={(e) => set('propositoViaje', e.target.value)}
                >
                  <option value="">Seleccione…</option>
                  <option>Turismo</option>
                  <option>Negocios</option>
                  <option>Tratamiento médico</option>
                  <option>Otro</option>
                </select>
                <div style={styles.help}>DS-160: Primary Purpose of Travel.</div>
              </div>
              <div>
                <div style={styles.label}>Embajada/Consulado *</div>
                <input
                  style={styles.input}
                  value={data.ciudadEmbajada}
                  onChange={(e) => set('ciudadEmbajada', e.target.value)}
                  placeholder="Ej.: Quito, Guayaquil, Bogotá…"
                />
              </div>
            </div>

            <div style={styles.row}>
              <div>
                <div style={styles.label}>Fecha tentativa de viaje</div>
                <input
                  type="date"
                  style={styles.input}
                  value={data.fechaTentativa}
                  onChange={(e) => set('fechaTentativa', e.target.value)}
                />
              </div>
              <div>
                <div style={styles.label}>Dirección en EE.UU.</div>
                <input
                  style={styles.input}
                  value={data.direccionEnEEUU}
                  onChange={(e) => set('direccionEnEEUU', e.target.value)}
                  placeholder="Hotel o residencia (si aplica)"
                />
              </div>
              <div>
                <div style={styles.label}>Contacto en EE.UU.</div>
                <input
                  style={styles.input}
                  value={data.contactoEnEEUU}
                  onChange={(e) => set('contactoEnEEUU', e.target.value)}
                  placeholder="Persona/empresa, teléfono o email"
                />
              </div>
            </div>
          </div>
        )}

        {/* Navegación */}
        <div style={{ ...styles.actions, marginTop: 16 }}>
          <button onClick={prev} style={styles.ghost} disabled={step === 'personales'}>
            ← Anterior
          </button>
          <button onClick={next} style={styles.btn} disabled={step === 'viaje'}>
            Siguiente →
          </button>
        </div>
      </section>

      {/* Envío al administrador */}
      <section style={styles.card}>
        <h3 style={{ marginTop: 0 }}>Enviar al administrador</h3>
        <p style={{ opacity: 0.8, marginTop: 0 }}>
          Al terminar, puedes enviarnos tus respuestas para que completemos tu DS-160 en el portal oficial.
        </p>
        <div style={styles.actions}>
          <button onClick={openWhatsApp} style={styles.btn}>Enviar por WhatsApp</button>
          <button onClick={openMailto} style={styles.ghost}>Enviar por Email</button>
          <button onClick={downloadCSV} style={styles.ghost}>Descargar CSV</button>
          <button
            onClick={() => {
              localStorage.removeItem(STORAGE_KEY);
              setData(initialState);
              setStep('personales');
              alert('Formulario reiniciado.');
            }}
            style={{ ...styles.ghost, background: '#7c3aed' }}
          >
            Reiniciar formulario
          </button>
        </div>
        <small style={{ opacity: 0.7, display: 'block', marginTop: 8 }}>
          **Aviso:** Este asistente no es asesoría legal. Verifica siempre en CEAC antes de enviar.
        </small>
      </section>
    </div>
  );
}
