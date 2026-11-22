import type { Obra } from "../data/obras";

export function porcentajeEjercido(obra: Obra): number {
  return obra.presupuesto > 0 ? (obra.ejercido / obra.presupuesto) * 100 : 0;
}

export function brechaAvance(obra: Obra): number {
  return obra.avanceReal - obra.avanceProgramado;
}

export function diferenciaFinancieraFisica(obra: Obra): number {
  return porcentajeEjercido(obra) - obra.avanceReal;
}

export function resumenObras(lista: Obra[]) {
  const presupuesto = lista.reduce((suma, obra) => suma + obra.presupuesto, 0);
  const ejercido = lista.reduce((suma, obra) => suma + obra.ejercido, 0);
  return {
    cantidad: lista.length,
    presupuesto,
    ejercido,
    disponible: presupuesto - ejercido,
    porcentajeEjercido: presupuesto > 0 ? (ejercido / presupuesto) * 100 : 0,
    enRiesgo: lista.filter((obra) => obra.estatus === "En riesgo").length,
    conRetraso: lista.filter((obra) => obra.estatus === "Con retraso").length,
  };
}

export function agruparObras(lista: Obra[], por: "categoria" | "entidad") {
  const grupos = new Map<string, Obra[]>();
  for (const obra of lista) {
    const nombre = obra[por];
    grupos.set(nombre, [...(grupos.get(nombre) ?? []), obra]);
  }
  return Array.from(grupos, ([nombre, registros]) => ({
    nombre,
    ...resumenObras(registros),
  })).sort((a, b) => b.presupuesto - a.presupuesto);
}
