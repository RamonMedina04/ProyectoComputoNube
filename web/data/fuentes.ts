/** Fuentes oficiales de consulta; NO se descargan ni se conectan automáticamente en el MVP. */
export type FuentePublica = {
  id: string;
  nombre: string;
  institucion: string;
  descripcion: string;
  url: string;
  datosPotenciales: string[];
  cobertura: string;
  estado: "Pendiente de integración";
};

export const fuentesPublicas: FuentePublica[] = [
  {
    id: "obra-publica-abierta",
    nombre: "Obra Pública Abierta",
    institucion: "Transparencia Presupuestaria · SHCP",
    descripcion: "Consulta de proyectos federales de inversión y sus fichas de seguimiento. La disponibilidad de avances y montos depende de cada publicación.",
    url: "https://www.transparenciapresupuestaria.gob.mx/Obra-Publica-Abierta",
    datosPotenciales: ["Identificador del proyecto", "Nombre", "Ubicación", "Presupuesto", "Periodo de reporte"],
    cobertura: "Proyectos federales incluidos por el portal",
    estado: "Pendiente de integración",
  },
  {
    id: "contrataciones-abiertas",
    nombre: "Contrataciones Abiertas",
    institucion: "Transparencia Presupuestaria · SHCP",
    descripcion: "Información sobre procedimientos y contratos federales; un contrato no debe enlazarse a una obra sin comprobar su identificador de correspondencia.",
    url: "https://www.transparenciapresupuestaria.gob.mx/Contrataciones-Abiertas",
    datosPotenciales: ["Identificador de contratación", "Contrato", "Monto", "Entidad contratante", "Fechas"],
    cobertura: "Contrataciones del Gobierno Federal publicadas en el portal",
    estado: "Pendiente de integración",
  },
  {
    id: "datos-gob",
    nombre: "Portal de Datos Abiertos",
    institucion: "Gobierno de México",
    descripcion: "Catálogo de conjuntos de datos de distintas instituciones. Los formatos, fechas y licencias varían entre conjuntos.",
    url: "https://www.datos.gob.mx/",
    datosPotenciales: ["Conjuntos CSV o XLSX", "Diccionarios", "Metadatos", "Fechas de actualización"],
    cobertura: "Dependiente del conjunto seleccionado",
    estado: "Pendiente de integración",
  },
];
