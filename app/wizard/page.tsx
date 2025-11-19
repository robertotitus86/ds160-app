'use client';

import { useEffect, useMemo, useState } from 'react';

type StepKey =
  | 'personales'
  | 'pasaporte'
  | 'contacto'
  | 'viaje'
  | 'empleo'
  | 'viajes'
  | 'familia'
  | 'seguridad';

type FormState = {
  // 1) Datos personales
  primerNombre: string;
  segundoNombre: string;
  apellidos: string;
  fechaNacimiento: string; // YYYY-MM-DD
  lugarNacimiento: string;
  nacionalidad: string;
  estadoCivil: string;
  genero: string;

  // 2) Pasaporte
  nroPasaporte: string;
  paisEmision: string;
  fechaEmision: string;
  fechaExpiracion: string;

  // 3) Contacto
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  paisResidencia: string;

  // 4) Viaje
  propositoViaje: string;
  ciudadEmbajada: string;
  fechaTentativa: string;
  direccionEnEEUU: string;
  contactoEnEEUU: string;

  // 5) Empleo y educación
  situacionLaboral: string;       // Empleado, Independiente, Estudiante, Desempleado, Jubilado
  ocupacion: string;
  empresa: string;
  cargo: string;
  empresaDireccion: string;
  empresaCiudad: string;
  empresaPais: string;
  empresaTelefono: string;
  fechaInicioTrabajo: string;     // YYYY-MM-DD
  salarioMensualUSD: string;      // opcional
  nivelEducacion: string;         // Highest Level of Education
  institucion: string;
  anioInicioEstudio: string;      // YYYY
  anioFinEstudio: string;         // YYYY

  // 6) Historial de viajes
  estuvoEnEEUU: string;           // Sí/No
  ultimaFechaEntrada: string;
  ultimaDuracionDias: string;
  tuvoVisaUSA: string;            // Sí/No
  tipoVisaUSA: string;
  numeroVisaUSA: string;
  fueRechazadoVisa: string;       // Sí/No
  detalleRechazoVisa: string;
  otrosViajesUltimos5: string;    // texto libre (paises/fechas)

  // 7) Familia
  tieneConyuge: string;           // Sí/No
  nombreConyuge: string;
  fechaNacConyuge: string;
  nacionalidadConyuge: string;
  viveEnEEUUConyuge: string;

  padreVive: string;              // Sí/No
  madreVive: string;              // Sí/No
  familiaEEUU: string;            // Familia en EE.UU. Sí/No
  detalleFamiliaEEUU: string;

  // 8) Seguridad
  arrestado: string;              // Sí/No
  violacionMigratoria: string;    // Sí/No
  traficoPersonas: string;        // Sí/No
  enfermedadesPublicaSalud: string; // Sí/No
  comentariosSeguridad: string;
};

const ADMIN_WHATSAPP = '00593987846751'; // Tu número
const STORAGE_KEY = 'ds160_wizard_v3_full';

const styles = {
  page: { display: 'grid', gap: 16 as const },
  card: {
    background: '#0f172a',
    padding: 18,
    borderRadius: 14,
    border: '1px solid #111827',
  },
  // Grid flexible, pero sin obligar a que cada campo sea gigantesco
  row: {
    display: 'grid',
    gap: 12,
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    alignItems: 'flex-start',
  } as React.CSSProperties,
  label: { fontSize: 13, opacity: 0.9 },
  input: {
    width: '100%',
    maxWidth: 320,              // 👈 límite de ancho para que no se “alargue” demasiado
    padding: 10,
    borderRadius: 10,
    border: '1px solid #1f2937',
    background: '#0b1220',
    color: '#fff',
  } as React.CSSProperties,
  textarea: {
    width: '100%',
    maxWidth: 700,              // textos largos un poco más anchos, pero controlados
    minHeight: 90,
    padding: 10,
    borderRadius: 10,
    border: '1px solid #1f2937',
    background: '#0b1220',
    color: '#fff',
  } as React.CSSProperties,
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
  } as React.CSSProperties,
  ghost: {
    background: '#334155',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '10px 14px',
    cursor: 'pointer',
    textDecoration: 'none',
  } as React.CSSProperties,
  stepper: {
    display: 'grid',
    gap: 8,
    gridTemplateColumns: 'repeat(8,1fr)',
  },
  pill: (active: boolean) => ({
    background: active ? '#2563eb' : '#0b1220',
    border: `1px solid ${active ? '#2563eb' : '#1f2937'}`,
    color: active ? '#fff' : '#cbd5e1',
    textAlign: 'center' as const,
    padding: '8px 10px',
    borderRadius: 999,
    fontSize: 12,
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
  }),
};

const initialState: FormState = {
  // personales
  primerNombre: '', segundoNombre: '', apellidos: '',
  fechaNacimiento: '', lugarNacimiento: '', nacionalidad: '',
  estadoCivil: '', genero: '',

  // pasaporte
  nroPasaporte: '', paisEmision: '', fechaEmision: '', fechaExpiracion: '',

  // contacto
  email: '', telefono: '', direccion: '', ciudad: '', provincia: '', paisResidencia: '',

  // viaje
  propositoViaje: '', ciudadEmbajada: '', fechaTentativa: '', direccionEnEEUU: '', contactoEnEEUU: '',

  // empleo y educación
  situacionLaboral: '', ocupacion: '', empresa: '', cargo: '',
  empresaDireccion: '', empresaCiudad: '', empresaPais: '', empresaTelefono: '',
  fechaInicioTrabajo: '', salarioMensualUSD: '',
  nivelEducacion: '', institucion: '', anioInicioEstudio: '', anioFinEstudio: '',

  // historial viajes
  estuvoEnEEUU: '', ultimaFechaEntrada: '', ultimaDuracionDias: '',
  tuvoVisaUSA: '', tipoVisaUSA: '', numeroVisaUSA: '',
  fueRechazadoVisa: '', detalleRechazoVisa: '',
  otrosViajesUltimos5: '',

  // familia
  tieneConyuge: '', nombreConyuge: '', fechaNacConyuge: '', nacionalidadConyuge: '', viveEnEEUUConyuge: '',
  padreVive: '', madreVive: '', familiaEEUU: '', detalleFamiliaEEUU: '',

  // seguridad
  arrestado: '', violacionMigratoria: '', traficoPersonas: '',
  enfermedadesPublicaSalud: '', comentariosSeguridad: '',
};

export default function WizardPage() {
  const [data, setData] = useState<FormState>(initialState);
  const [step, setStep] = useState<StepKey>('personales');
  const steps: { key: StepKey; title: string }[] = useMemo(
    () => [
      { key: 'personales', title: 'Personales' },
      { key: 'pasaporte',  title: 'Pasaporte' },
      { key: 'contacto',   title: 'Contacto' },
      { key: 'viaje',      title: 'Viaje' },
      { key: 'empleo',     title: 'Empleo/Educación' },
      { key: 'viajes',     title: 'Hist. viajes' },
      { key: 'familia',    title: 'Familia' },
      { key: 'seguridad',  title: 'Seguridad' },
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
    const e: string[] = [];
    if (step === 'personales') {
      if (!data.primerNombre) e.push('Primer nombre es obligatorio.');
      if (!data.apellidos) e.push('Apellidos son obligatorios.');
      if (!data.fechaNacimiento) e.push('Fecha de nacimiento es obligatoria.');
      if (!data.nacionalidad) e.push('Nacionalidad es obligatoria.');
      if (!data.genero) e.push('Seleccione su género.');
      if (!data.estadoCivil) e.push('Seleccione su estado civil.');
    }
    if (step === 'pasaporte') {
      if (!data.nroPasaporte) e.push('Número de pasaporte es obligatorio.');
      if (!data.paisEmision) e.push('País de emisión es obligatorio.');
      if (!data.fechaEmision) e.push('Fecha de emisión es obligatoria.');
      if (!data.fechaExpiracion) e.push('Fecha de expiración es obligatoria.');
    }
    if (step === 'contacto') {
      if (!data.email) e.push('Email es obligatorio.');
      if (!data.telefono) e.push('Teléfono es obligatorio.');
      if (!data.direccion) e.push('Dirección es obligatoria.');
      if (!data.paisResidencia) e.push('País de residencia es obligatorio.');
    }
    if (step === 'viaje') {
      if (!data.propositoViaje) e.push('Propósito del viaje es obligatorio.');
      if (!data.ciudadEmbajada) e.push('Embajada/Consulado es obligatorio.');
    }
    if (step === 'empleo') {
      if (!data.situacionLaboral) e.push('Situación laboral es obligatoria.');
      const activo = ['Empleado', 'Independiente'].includes(data.situacionLaboral);
      const estudiante = data.situacionLaboral === 'Estudiante';
      if (activo) {
        if (!data.ocupacion) e.push('Ocupación/actividad actual es obligatoria.');
        if (!data.empresa) e.push('Empresa/Negocio es obligatorio.');
        if (!data.fechaInicioTrabajo) e.push('Fecha de inicio es obligatoria.');
      }
      if (estudiante && !data.institucion) e.push('Institución educativa es obligatoria.');
      if (!data.nivelEducacion) e.push('Nivel educativo alcanzado es obligatorio.');
    }
    if (step === 'viajes') {
      if (!data.estuvoEnEEUU) e.push('Indique si ha estado en EE.UU.');
      if (data.estuvoEnEEUU === 'Sí') {
        if (!data.ultimaFechaEntrada) e.push('Ingrese su última fecha de entrada.');
        if (!data.ultimaDuracionDias) e.push('Ingrese la duración de la última estadía.');
      }
      if (!data.tuvoVisaUSA) e.push('Indique si tuvo visa de EE.UU.');
      if (data.tuvoVisaUSA === 'Sí' && !data.tipoVisaUSA) e.push('Especifique el tipo de visa anterior.');
      if (!data.fueRechazadoVisa) e.push('Indique si fue rechazado para una visa.');
      if (data.fueRechazadoVisa === 'Sí' && !data.detalleRechazoVisa) e.push('Explique brevemente el rechazo.');
    }
    if (step === 'familia') {
      if (!data.padreVive) e.push('Indique si su padre vive.');
      if (!data.madreVive) e.push('Indique si su madre vive.');
      if (!data.tieneConyuge) e.push('Indique si tiene cónyuge.');
      if (data.tieneConyuge === 'Sí') {
        if (!data.nombreConyuge) e.push('Nombre del cónyuge es obligatorio.');
        if (!data.fechaNacConyuge) e.push('Fecha de nacimiento del cónyuge es obligatoria.');
      }
      if (!data.familiaEEUU) e.push('Indique si tiene familiares en EE.UU.');
      if (data.familiaEEUU === 'Sí' && !data.detalleFamiliaEEUU) e.push('Detalle sus familiares en EE.UU.');
    }
    if (step === 'seguridad') {
      if (!data.arrestado) e.push('Responda si ha sido arrestado.');
      if (!data.violacionMigratoria) e.push('Responda sobre violaciones migratorias.');
      if (!data.traficoPersonas) e.push('Responda sobre tráfico de personas.');
      if (!data.enfermedadesPublicaSalud) e.push('Responda sobre condiciones de salud pública.');
    }
    return e;
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
      // personales
      primerNombre: 'Primer Nombre', segundoNombre: 'Segundo Nombre', apellidos: 'Apellidos',
      fechaNacimiento: 'Fecha Nacimiento', lugarNacimiento: 'Lugar Nacimiento',
      nacionalidad: 'Nacionalidad', estadoCivil: 'Estado Civil', genero: 'Género',
      // pasaporte
      nroPasaporte: 'Nro Pasaporte', paisEmision: 'País Emisión', fechaEmision: 'Fecha Emisión', fechaExpiracion: 'Fecha Expiración',
      // contacto
      email: 'Email', telefono: 'Teléfono', direccion: 'Dirección', ciudad: 'Ciudad', provincia: 'Provincia/Estado', paisResidencia: 'País Residencia',
      // viaje
      propositoViaje: 'Propósito Viaje', ciudadEmbajada: 'Embajada/Consulado', fechaTentativa: 'Fecha Tentativa', direccionEnEEUU: 'Dirección en EEUU', contactoEnEEUU: 'Contacto en EEUU',
      // empleo
      situacionLaboral: 'Situación Laboral', ocupacion: 'Ocupación',
      empresa: 'Empresa/Negocio', cargo: 'Cargo', empresaDireccion: 'Dirección Empresa', empresaCiudad: 'Ciudad Empresa', empresaPais: 'País Empresa', empresaTelefono: 'Tel Empresa',
      fechaInicioTrabajo: 'Fecha Inicio Trabajo', salarioMensualUSD: 'Salario Mensual USD',
      nivelEducacion: 'Nivel Educativo', institucion: 'Institución', anioInicioEstudio: 'Año Inicio Estudio', anioFinEstudio: 'Año Fin Estudio',
      // historial viajes
      estuvoEnEEUU: 'Ha estado en EEUU', ultimaFechaEntrada: 'Última Fecha Entrada', ultimaDuracionDias: 'Duración Última Estadía (días)',
      tuvoVisaUSA: 'Tuvo Visa USA', tipoVisaUSA: 'Tipo Visa USA', numeroVisaUSA: 'Número Visa USA',
      fueRechazadoVisa: 'Visa Rechazada', detalleRechazoVisa: 'Detalle Rechazo Visa',
      otrosViajesUltimos5: 'Otros viajes últimos 5 años',
      // familia
      tieneConyuge: 'Tiene Cónyuge', nombreConyuge: 'Nombre Cónyuge', fechaNacConyuge: 'Fecha Nac Cónyuge',
      nacionalidadConyuge: 'Nacionalidad Cónyuge', viveEnEEUUConyuge: 'Cónyuge vive en EEUU',
      padreVive: 'Padre vive', madreVive: 'Madre vive',
      familiaEEUU: 'Familiares en EEUU', detalleFamiliaEEUU: 'Detalle Familia EEUU',
      // seguridad
      arrestado: 'Arrestado', violacionMigratoria: 'Violación Migratoria', traficoPersonas: 'Tráfico de Personas',
      enfermedadesPublicaSalud: 'Condición Salud Pública', comentariosSeguridad: 'Comentarios Seguridad',
    };
    Object.entries(map).forEach(([k, label]) => {
      const v = (data as any)[k] ?? '';
      rows.push([label, String(v).replace(/\n/g, ' ')]);
    });
    return rows
      .map((r) =>
        r
          .map((c) => `"${c.replace(/"/g, '""')}"`)
          .join(',')
      )
      .join('\n');
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
    const nombre = `${data.primerNombre} ${data.apellidos}`.trim();
    const texto = encodeURIComponent(
      `Hola, envío mis respuestas para el DS-160.\n\nNombre: ${nombre}\nServicio: Asistente DS-160\n\n(Adjuntaré el archivo CSV con mis datos)\n`
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

  // UI helpers
  const isActiveWorker = ['Empleado', 'Independiente'].includes(data.situacionLaboral);
  const isStudent = data.situacionLaboral === 'Estudiante';

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

        {/* 1) PERSONALES */}
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
                  placeholder="Ciudad y país"
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

        {/* 2) PASAPORTE */}
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

        {/* 3) CONTACTO */}
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

        {/* 4) VIAJE */}
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

        {/* 5) EMPLEO Y EDUCACIÓN */}
        {step === 'empleo' && (
          <div style={{ display: 'grid', gap: 18 }}>
            <div style={styles.row}>
              <div>
                <div style={styles.label}>Situación laboral actual *</div>
                <select
                  style={styles.input}
                  value={data.situacionLaboral}
                  onChange={(e) => set('situacionLaboral', e.target.value)}
                >
                  <option value="">Seleccione…</option>
                  <option>Empleado</option>
                  <option>Independiente</option>
                  <option>Estudiante</option>
                  <option>Desempleado</option>
                  <option>Jubilado</option>
                </select>
                <div style={styles.help}>DS-160: Present Work/Education/Training.</div>
              </div>
              <div>
                <div style={styles.label}>Ocupación / Actividad *</div>
                <input
                  style={styles.input}
                  value={data.ocupacion}
                  onChange={(e) => set('ocupacion', e.target.value)}
                  placeholder="Ej.: Contador, Comerciante, Estudiante"
                />
              </div>
            </div>

            {isActiveWorker && (
              <>
                <h4>Información laboral</h4>
                <div style={styles.row}>
                  <div>
                    <div style={styles.label}>Empresa / Negocio *</div>
                    <input
                      style={styles.input}
                      value={data.empresa}
                      onChange={(e) => set('empresa', e.target.value)}
                      placeholder="Nombre de la empresa o negocio"
                    />
                  </div>
                  <div>
                    <div style={styles.label}>Cargo</div>
                    <input
                      style={styles.input}
                      value={data.cargo}
                      onChange={(e) => set('cargo', e.target.value)}
                      placeholder="Ej.: Analista, Gerente"
                    />
                  </div>
                  <div>
                    <div style={styles.label}>Teléfono empresa</div>
                    <input
                      style={styles.input}
                      value={data.empresaTelefono}
                      onChange={(e) => set('empresaTelefono', e.target.value)}
                      placeholder="Incluye código país"
                    />
                  </div>
                </div>
                <div style={styles.row}>
                  <div>
                    <div style={styles.label}>Dirección empresa</div>
                    <input
                      style={styles.input}
                      value={data.empresaDireccion}
                      onChange={(e) => set('empresaDireccion', e.target.value)}
                      placeholder="Calle y número"
                    />
                  </div>
                  <div>
                    <div style={styles.label}>Ciudad</div>
                    <input
                      style={styles.input}
                      value={data.empresaCiudad}
                      onChange={(e) => set('empresaCiudad', e.target.value)}
                    />
                  </div>
                  <div>
                    <div style={styles.label}>País</div>
                    <input
                      style={styles.input}
                      value={data.empresaPais}
                      onChange={(e) => set('empresaPais', e.target.value)}
                    />
                  </div>
                </div>
                <div style={styles.row}>
                  <div>
                    <div style={styles.label}>Fecha de inicio *</div>
                    <input
                      type="date"
                      style={styles.input}
                      value={data.fechaInicioTrabajo}
                      onChange={(e) => set('fechaInicioTrabajo', e.target.value)}
                    />
                  </div>
                  <div>
                    <div style={styles.label}>Salario mensual (USD) — opcional</div>
                    <input
                      style={styles.input}
                      value={data.salarioMensualUSD}
                      onChange={(e) => set('salarioMensualUSD', e.target.value)}
                      placeholder="Ej.: 900"
                    />
                  </div>
                </div>
              </>
            )}

            {isStudent && (
              <>
                <h4>Información de estudios</h4>
                <div style={styles.row}>
                  <div>
                    <div style={styles.label}>Institución *</div>
                    <input
                      style={styles.input}
                      value={data.institucion}
                      onChange={(e) => set('institucion', e.target.value)}
                      placeholder="Colegio / Universidad"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Educación general */}
            <h4>Educación</h4>
            <div style={styles.row}>
              <div>
                <div style={styles.label}>Nivel educativo alcanzado *</div>
                <select
                  style={styles.input}
                  value={data.nivelEducacion}
                  onChange={(e) => set('nivelEducacion', e.target.value)}
                >
                  <option value="">Seleccione…</option>
                  <option>Secundaria</option>
                  <option>Técnico / Tecnológico</option>
                  <option>Universitario</option>
                  <option>Posgrado</option>
                  <option>Otro</option>
                </select>
              </div>
              <div>
                <div style={styles.label}>Institución</div>
                <input
                  style={styles.input}
                  value={data.institucion}
                  onChange={(e) => set('institucion', e.target.value)}
                  placeholder="Colegio / Universidad"
                />
              </div>
            </div>
            <div style={styles.row}>
              <div>
                <div style={styles.label}>Año de inicio</div>
                <input
                  style={styles.input}
                  value={data.anioInicioEstudio}
                  onChange={(e) => set('anioInicioEstudio', e.target.value)}
                  placeholder="YYYY"
                />
              </div>
              <div>
                <div style={styles.label}>Año de finalización</div>
                <input
                  style={styles.input}
                  value={data.anioFinEstudio}
                  onChange={(e) => set('anioFinEstudio', e.target.value)}
                  placeholder="YYYY"
                />
              </div>
            </div>
          </div>
        )}

        {/* 6) HISTORIAL DE VIAJES */}
        {step === 'viajes' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={styles.row}>
              <div>
                <div style={styles.label}>¿Ha estado antes en EE.UU.? *</div>
                <select
                  style={styles.input}
                  value={data.estuvoEnEEUU}
                  onChange={(e) => set('estuvoEnEEUU', e.target.value)}
                >
                  <option value="">Seleccione…</option>
                  <option>Sí</option>
                  <option>No</option>
                </select>
                <div style={styles.help}>
                  Incluye turismo, estudio, trabajo, tránsito, etc.
                </div>
              </div>
              {data.estuvoEnEEUU === 'Sí' && (
                <>
                  <div>
                    <div style={styles.label}>Última fecha de entrada</div>
                    <input
                      type="date"
                      style={styles.input}
                      value={data.ultimaFechaEntrada}
                      onChange={(e) => set('ultimaFechaEntrada', e.target.value)}
                    />
                  </div>
                  <div>
                    <div style={styles.label}>Duración última estadía (días)</div>
                    <input
                      style={styles.input}
                      value={data.ultimaDuracionDias}
                      onChange={(e) => set('ultimaDuracionDias', e.target.value)}
                      placeholder="Ej.: 14"
                    />
                  </div>
                </>
              )}
            </div>

            <div style={styles.row}>
              <div>
                <div style={styles.label}>¿Tuvo visa de EE.UU.? *</div>
                <select
                  style={styles.input}
                  value={data.tuvoVisaUSA}
                  onChange={(e) => set('tuvoVisaUSA', e.target.value)}
                >
                  <option value="">Seleccione…</option>
                  <option>Sí</option>
                  <option>No</option>
                </select>
              </div>
              {data.tuvoVisaUSA === 'Sí' && (
                <>
                  <div>
                    <div style={styles.label}>Tipo de visa</div>
                    <input
                      style={styles.input}
                      value={data.tipoVisaUSA}
                      onChange={(e) => set('tipoVisaUSA', e.target.value)}
                      placeholder="Ej.: B1/B2, F1, etc."
                    />
                  </div>
                  <div>
                    <div style={styles.label}>Número de visa</div>
                    <input
                      style={styles.input}
                      value={data.numeroVisaUSA}
                      onChange={(e) => set('numeroVisaUSA', e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>

            <div style={styles.row}>
              <div>
                <div style={styles.label}>¿Le han rechazado una visa de EE.UU.? *</div>
                <select
                  style={styles.input}
                  value={data.fueRechazadoVisa}
                  onChange={(e) => set('fueRechazadoVisa', e.target.value)}
                >
                  <option value="">Seleccione…</option>
                  <option>Sí</option>
                  <option>No</option>
                </select>
              </div>
            </div>

            {data.fueRechazadoVisa === 'Sí' && (
              <div>
                <div style={styles.label}>Explique brevemente</div>
                <textarea
                  style={styles.textarea}
                  value={data.detalleRechazoVisa}
                  onChange={(e) => set('detalleRechazoVisa', e.target.value)}
                  placeholder="Año, consulado, motivo si lo recuerda…"
                />
              </div>
            )}

            <div>
              <div style={styles.label}>Otros viajes (últimos 5 años)</div>
              <textarea
                style={styles.textarea}
                value={data.otrosViajesUltimos5}
                onChange={(e) => set('otrosViajesUltimos5', e.target.value)}
                placeholder="País — Fecha (ej.: Perú — 2023-05; Colombia — 2022-10)…"
              />
            </div>
          </div>
        )}

        {/* 7) FAMILIA */}
        {step === 'familia' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={styles.row}>
              <div>
                <div style={styles.label}>¿Tiene cónyuge? *</div>
                <select
                  style={styles.input}
                  value={data.tieneConyuge}
                  onChange={(e) => set('tieneConyuge', e.target.value)}
                >
                  <option value="">Seleccione…</option>
                  <option>Sí</option>
                  <option>No</option>
                </select>
              </div>
              {data.tieneConyuge === 'Sí' && (
                <>
                  <div>
                    <div style={styles.label}>Nombre del cónyuge *</div>
                    <input
                      style={styles.input}
                      value={data.nombreConyuge}
                      onChange={(e) => set('nombreConyuge', e.target.value)}
                    />
                  </div>
                  <div>
                    <div style={styles.label}>Fecha de nacimiento *</div>
                    <input
                      type="date"
                      style={styles.input}
                      value={data.fechaNacConyuge}
                      onChange={(e) => set('fechaNacConyuge', e.target.value)}
                    />
                  </div>
                  <div>
                    <div style={styles.label}>Nacionalidad</div>
                    <input
                      style={styles.input}
                      value={data.nacionalidadConyuge}
                      onChange={(e) => set('nacionalidadConyuge', e.target.value)}
                    />
                  </div>
                  <div>
                    <div style={styles.label}>¿Vive en EE.UU.?</div>
                    <select
                      style={styles.input}
                      value={data.viveEnEEUUConyuge}
                      onChange={(e) => set('viveEnEEUUConyuge', e.target.value)}
                    >
                      <option value="">Seleccione…</option>
                      <option>Sí</option>
                      <option>No</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            <div style={styles.row}>
              <div>
                <div style={styles.label}>¿Su padre vive? *</div>
                <select
                  style={styles.input}
                  value={data.padreVive}
                  onChange={(e) => set('padreVive', e.target.value)}
                >
                  <option value="">Seleccione…</option>
                  <option>Sí</option>
                  <option>No</option>
                </select>
              </div>
              <div>
                <div style={styles.label}>¿Su madre vive? *</div>
                <select
                  style={styles.input}
                  value={data.madreVive}
                  onChange={(e) => set('madreVive', e.target.value)}
                >
                  <option value="">Seleccione…</option>
                  <option>Sí</option>
                  <option>No</option>
                </select>
              </div>
            </div>

            <div>
              <div style={styles.label}>¿Tiene familiares en EE.UU.? *</div>
              <select
                style={styles.input}
                value={data.familiaEEUU}
                onChange={(e) => set('familiaEEUU', e.target.value)}
              >
                <option value="">Seleccione…</option>
                <option>Sí</option>
                <option>No</option>
              </select>
            </div>

            {data.familiaEEUU === 'Sí' && (
              <div>
                <div style={styles.label}>Detalle familiares en EE.UU.</div>
                <textarea
                  style={styles.textarea}
                  value={data.detalleFamiliaEEUU}
                  onChange={(e) => set('detalleFamiliaEEUU', e.target.value)}
                  placeholder="Parentesco, ciudad y estado, estatus migratorio si lo conoce…"
                />
              </div>
            )}
          </div>
        )}

        {/* 8) SEGURIDAD */}
        {step === 'seguridad' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={styles.row}>
              <div>
                <div style={styles.label}>¿Ha sido arrestado o condenado? *</div>
                <select
                  style={styles.input}
                  value={data.arrestado}
                  onChange={(e) => set('arrestado', e.target.value)}
                >
                  <option value="">Seleccione…</option>
                  <option>No</option>
                  <option>Sí</option>
                </select>
              </div>
              <div>
                <div style={styles.label}>¿Ha violado leyes migratorias de EE.UU.? *</div>
                <select
                  style={styles.input}
                  value={data.violacionMigratoria}
                  onChange={(e) => set('violacionMigratoria', e.target.value)}
                >
                  <option value="">Seleccione…</option>
                  <option>No</option>
                  <option>Sí</option>
                </select>
              </div>
            </div>

            <div style={styles.row}>
              <div>
                <div style={styles.label}>¿Ha estado involucrado en tráfico de personas? *</div>
                <select
                  style={styles.input}
                  value={data.traficoPersonas}
                  onChange={(e) => set('traficoPersonas', e.target.value)}
                >
                  <option value="">Seleccione…</option>
                  <option>No</option>
                  <option>Sí</option>
                </select>
              </div>
              <div>
                <div style={styles.label}>¿Padece condiciones de salud pública relevantes? *</div>
                <select
                  style={styles.input}
                  value={data.enfermedadesPublicaSalud}
                  onChange={(e) => set('enfermedadesPublicaSalud', e.target.value)}
                >
                  <option value="">Seleccione…</option>
                  <option>No</option>
                  <option>Sí</option>
                </select>
              </div>
            </div>

            <div>
              <div style={styles.label}>Comentarios (opcional)</div>
              <textarea
                style={styles.textarea}
                value={data.comentariosSeguridad}
                onChange={(e) => set('comentariosSeguridad', e.target.value)}
                placeholder="Explique si marcó alguna respuesta 'Sí'."
              />
            </div>

            <small style={styles.help}>
              Estas preguntas reflejan el bloque de seguridad del DS-160. Responda con honestidad. Esta
              plataforma no es asesoría legal.
            </small>
          </div>
        )}

        {/* Navegación */}
        <div style={{ ...styles.actions, marginTop: 16 }}>
          <button
            onClick={prev}
            style={styles.ghost}
            disabled={step === 'personales'}
          >
            ← Anterior
          </button>
          <button
            onClick={next}
            style={styles.btn}
            disabled={step === 'seguridad'}
          >
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
          <button onClick={openWhatsApp} style={styles.btn}>
            Enviar por WhatsApp
          </button>
          <button onClick={openMailto} style={styles.ghost}>
            Enviar por Email
          </button>
          <button onClick={downloadCSV} style={styles.ghost}>
            Descargar CSV
          </button>
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
