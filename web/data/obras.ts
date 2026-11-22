/**
 * DATOS FICTICIOS: creados únicamente para demostrar el MVP.
 * No representan contratos, presupuestos ni avances reales.
 */
export type EstadoObra = "En tiempo" | "En riesgo" | "Con retraso" | "Finalizada";

export type Obra = {
  id: string;
  nombre: string;
  entidad: string;
  municipio: string;
  categoria: string;
  dependencia: string;
  presupuesto: number;
  ejercido: number;
  avanceProgramado: number;
  avanceReal: number;
  fechaInicio: string;
  fechaEntrega: string;
  ultimaActualizacion: string;
  lat: number;
  lng: number;
  estatus: EstadoObra;
  descripcion: string;
};

export const obras: Obra[] = [
  {
    id: "OC-001", nombre: "Hospital Regional del Valle de Toluca", entidad: "Estado de México", municipio: "Toluca", categoria: "Salud", dependencia: "Institución pública (ejemplo)",
    presupuesto: 420000000, ejercido: 278000000, avanceProgramado: 76, avanceReal: 54,
    fechaInicio: "2025-01-15", fechaEntrega: "2026-12-20", ultimaActualizacion: "2026-11-15", lat: 19.2826, lng: -99.6557,
    estatus: "En riesgo", descripcion: "Construcción simulada de una unidad hospitalaria y equipamiento básico."
  },
  {
    id: "OC-002", nombre: "Puente de movilidad metropolitana", entidad: "Nuevo León", municipio: "Monterrey", categoria: "Movilidad", dependencia: "Institución pública (ejemplo)",
    presupuesto: 275000000, ejercido: 173000000, avanceProgramado: 70, avanceReal: 67,
    fechaInicio: "2025-06-10", fechaEntrega: "2027-01-25", ultimaActualizacion: "2026-11-15", lat: 25.6866, lng: -100.3161,
    estatus: "En tiempo", descripcion: "Construcción simulada de un puente para mejorar la conexión entre vialidades."
  },
  {
    id: "OC-003", nombre: "Rehabilitación de escuela pública", entidad: "Jalisco", municipio: "Guadalajara", categoria: "Educación", dependencia: "Institución pública (ejemplo)",
    presupuesto: 125000000, ejercido: 121000000, avanceProgramado: 100, avanceReal: 100,
    fechaInicio: "2025-03-01", fechaEntrega: "2026-10-30", ultimaActualizacion: "2026-11-15", lat: 20.6597, lng: -103.3496,
    estatus: "Finalizada", descripcion: "Remodelación simulada de aulas, biblioteca y espacios deportivos."
  },
  {
    id: "OC-004", nombre: "Ampliación de red de agua potable", entidad: "Yucatán", municipio: "Mérida", categoria: "Agua", dependencia: "Institución pública (ejemplo)",
    presupuesto: 180000000, ejercido: 102000000, avanceProgramado: 48, avanceReal: 31,
    fechaInicio: "2025-09-12", fechaEntrega: "2027-05-12", ultimaActualizacion: "2026-11-15", lat: 20.9674, lng: -89.5926,
    estatus: "En riesgo", descripcion: "Extensión simulada de la red de distribución de agua en áreas urbanas."
  },
  {
    id: "OC-005", nombre: "Centro de salud comunitario", entidad: "Oaxaca", municipio: "Oaxaca de Juárez", categoria: "Salud", dependencia: "Institución pública (ejemplo)",
    presupuesto: 220000000, ejercido: 160000000, avanceProgramado: 78, avanceReal: 46,
    fechaInicio: "2025-02-04", fechaEntrega: "2026-09-30", ultimaActualizacion: "2026-11-15", lat: 17.0732, lng: -96.7266,
    estatus: "Con retraso", descripcion: "Construcción simulada de un centro de atención primaria con consultorios."
  },
  {
    id: "OC-006", nombre: "Renovación de mercado municipal", entidad: "Puebla", municipio: "Puebla", categoria: "Espacios públicos", dependencia: "Institución pública (ejemplo)",
    presupuesto: 85000000, ejercido: 82000000, avanceProgramado: 100, avanceReal: 100,
    fechaInicio: "2025-01-11", fechaEntrega: "2026-08-01", ultimaActualizacion: "2026-11-15", lat: 19.0414, lng: -98.2063,
    estatus: "Finalizada", descripcion: "Mejoramiento simulado de accesos y espacios comerciales municipales."
  },
  {
    id: "OC-007", nombre: "Centro de atención ciudadana", entidad: "Ciudad de México", municipio: "Cuauhtémoc", categoria: "Servicios públicos", dependencia: "Institución pública (ejemplo)",
    presupuesto: 310000000, ejercido: 163000000, avanceProgramado: 58, avanceReal: 56,
    fechaInicio: "2025-09-08", fechaEntrega: "2027-04-15", ultimaActualizacion: "2026-11-15", lat: 19.4326, lng: -99.1332,
    estatus: "En tiempo", descripcion: "Adecuación simulada de instalaciones para trámites y atención al público."
  },
  {
    id: "OC-008", nombre: "Clínica de especialidades del sureste", entidad: "Campeche", municipio: "Campeche", categoria: "Salud", dependencia: "Institución pública (ejemplo)",
    presupuesto: 180000000, ejercido: 89000000, avanceProgramado: 52, avanceReal: 50,
    fechaInicio: "2025-10-05", fechaEntrega: "2027-02-11", ultimaActualizacion: "2026-11-15", lat: 19.8301, lng: -90.5349,
    estatus: "En tiempo", descripcion: "Ampliación simulada de áreas de consulta y diagnóstico clínico."
  },
  {
    id: "OC-009", nombre: "Pavimentación de corredor urbano", entidad: "Sonora", municipio: "Hermosillo", categoria: "Movilidad", dependencia: "Institución pública (ejemplo)",
    presupuesto: 140000000, ejercido: 94000000, avanceProgramado: 73, avanceReal: 59,
    fechaInicio: "2025-05-18", fechaEntrega: "2027-03-22", ultimaActualizacion: "2026-11-15", lat: 29.0729, lng: -110.9559,
    estatus: "En riesgo", descripcion: "Intervención simulada en pavimento, banquetas y señalización."
  },
  {
    id: "OC-010", nombre: "Mejoramiento de plantel escolar", entidad: "Baja California", municipio: "Tijuana", categoria: "Educación", dependencia: "Institución pública (ejemplo)",
    presupuesto: 90000000, ejercido: 47000000, avanceProgramado: 60, avanceReal: 62,
    fechaInicio: "2025-08-23", fechaEntrega: "2027-03-02", ultimaActualizacion: "2026-11-15", lat: 32.5149, lng: -117.0382,
    estatus: "En tiempo", descripcion: "Adecuación simulada de laboratorios, aulas y espacios comunes."
  },
  {
    id: "OC-011", nombre: "Sistema de captación y tratamiento de agua", entidad: "Chiapas", municipio: "Tuxtla Gutiérrez", categoria: "Agua", dependencia: "Institución pública (ejemplo)",
    presupuesto: 240000000, ejercido: 121000000, avanceProgramado: 65, avanceReal: 45,
    fechaInicio: "2025-04-15", fechaEntrega: "2027-01-30", ultimaActualizacion: "2026-11-15", lat: 16.752, lng: -93.116,
    estatus: "En riesgo", descripcion: "Sistema simulado para aumentar la capacidad de potabilización de agua."
  },
  {
    id: "OC-012", nombre: "Rehabilitación de carretera regional", entidad: "Sinaloa", municipio: "Culiacán", categoria: "Movilidad", dependencia: "Institución pública (ejemplo)",
    presupuesto: 175000000, ejercido: 134000000, avanceProgramado: 92, avanceReal: 68,
    fechaInicio: "2025-01-20", fechaEntrega: "2026-10-10", ultimaActualizacion: "2026-11-15", lat: 24.8091, lng: -107.394,
    estatus: "Con retraso", descripcion: "Rehabilitación simulada de superficie de rodamiento, drenaje y señalización."
  },
];

export const estados = Array.from(new Set(obras.map((obra) => obra.entidad))).sort((a, b) => a.localeCompare(b, "es"));
export const categorias = Array.from(new Set(obras.map((obra) => obra.categoria))).sort((a, b) => a.localeCompare(b, "es"));
export const estatusDisponibles: EstadoObra[] = ["En tiempo", "En riesgo", "Con retraso", "Finalizada"];
