/**
 * Estructura de preparación para una futura importación verificada.
 * No ejecuta solicitudes a portales oficiales ni escribe en una base de datos.
 */
export type FilaFuente = {
  id_externo?: unknown;
  nombre?: unknown;
  entidad?: unknown;
  municipio?: unknown;
  presupuesto_mxn?: unknown;
  monto_ejercido_mxn?: unknown;
  fecha_corte?: unknown;
};

export type FilaNormalizada = {
  idExterno: string | null;
  nombre: string | null;
  entidad: string | null;
  municipio: string | null;
  presupuesto: number | null;
  ejercido: number | null;
  fechaCorte: string | null;
  errores: string[];
};

const texto = (valor: unknown): string | null =>
  typeof valor === "string" && valor.trim() ? valor.trim() : null;

const monto = (valor: unknown): number | null => {
  // No convertir cadenas con separadores ambiguos; deben normalizarse según el diccionario oficial.
  if (typeof valor !== "number" || !Number.isFinite(valor) || valor < 0) return null;
  return valor;
};

export function normalizarFilaFuente(fila: FilaFuente): FilaNormalizada {
  const idExterno = texto(fila.id_externo);
  const nombre = texto(fila.nombre);
  const presupuesto = monto(fila.presupuesto_mxn);
  const ejercido = monto(fila.monto_ejercido_mxn);
  const fechaCorte = texto(fila.fecha_corte);
  const errores: string[] = [];
  if (!idExterno) errores.push("Falta identificador del proyecto");
  if (!nombre) errores.push("Falta nombre del proyecto");
  if (presupuesto === null) errores.push("Presupuesto ausente o inválido");
  if (ejercido !== null && presupuesto !== null && ejercido > presupuesto) {
    errores.push("Ejercido mayor que aprobado: requiere revisión, no eliminación automática");
  }
  if (fechaCorte && !/^\d{4}-\d{2}-\d{2}$/.test(fechaCorte)) errores.push("Fecha de corte debe ser AAAA-MM-DD");
  return {
    idExterno, nombre, entidad: texto(fila.entidad), municipio: texto(fila.municipio),
    presupuesto, ejercido, fechaCorte, errores,
  };
}
