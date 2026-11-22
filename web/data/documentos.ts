/**
 * Inventario de documentos generados para el MVP académico.
 * NINGUNO de estos PDF proviene de autoridades públicas.
 */
import { obras } from "./obras";

export type TipoDocumento = "Resumen del proyecto" | "Informe de avance" | "Ficha presupuestaria";
export type DocumentoObra = {
  id: string;
  obraId: string;
  titulo: string;
  tipo: TipoDocumento;
  fechaDocumento: string;
  descripcion: string;
  archivo: string;
  origen: "Demostración";
};

const resumenes: DocumentoObra[] = obras.map((obra) => ({
  id: `${obra.id}-RES`,
  obraId: obra.id,
  titulo: `Resumen informativo · ${obra.nombre}`,
  tipo: "Resumen del proyecto",
  fechaDocumento: obra.ultimaActualizacion,
  descripcion: "Ficha de prueba elaborada con los datos ficticios del catálogo.",
  archivo: `/documentos-demo/${obra.id}-resumen.pdf`,
  origen: "Demostración",
}));

const especiales: DocumentoObra[] = [
  ...["OC-001", "OC-005", "OC-012"].map((id) => ({
    id: `${id}-AVA`,
    obraId: id,
    titulo: "Informe ilustrativo de avance físico",
    tipo: "Informe de avance" as TipoDocumento,
    fechaDocumento: obras.find((obra) => obra.id === id)!.ultimaActualizacion,
    descripcion: "Ejemplo del reporte que podría acompañar la actualización periódica de una obra.",
    archivo: `/documentos-demo/${id}-avance.pdf`,
    origen: "Demostración" as const,
  })),
  ...["OC-001", "OC-005", "OC-012"].map((id) => ({
    id: `${id}-PRE`,
    obraId: id,
    titulo: "Ficha presupuestaria ilustrativa",
    tipo: "Ficha presupuestaria" as TipoDocumento,
    fechaDocumento: obras.find((obra) => obra.id === id)!.ultimaActualizacion,
    descripcion: "Resumen de presupuesto aprobado y gasto ficticio para practicar la consulta documental.",
    archivo: `/documentos-demo/${id}-presupuesto.pdf`,
    origen: "Demostración" as const,
  })),
];

export const documentos: DocumentoObra[] = [...resumenes, ...especiales];
export const tiposDocumento: TipoDocumento[] = ["Resumen del proyecto", "Informe de avance", "Ficha presupuestaria"];
export const documentosDeObra = (id: string): DocumentoObra[] => documentos.filter((documento) => documento.obraId === id);
