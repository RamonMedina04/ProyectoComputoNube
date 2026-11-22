import type { Obra } from "../data/obras";
import { porcentajeEjercido, brechaAvance } from "./analisis";

function celdaCsv(valor: string | number): string {
  // Escapa valores que algunas hojas de cálculo interpretarían como fórmulas.
  let texto = String(valor);
  if (/^[\s]*[=+@\-]/.test(texto)) texto = `'${texto}`;
  return `"${texto.replaceAll('"', '""')}"`;
}

export function exportarObrasCsv(lista: Obra[], nombre = "obraclara-obras-demo.csv") {
  const encabezados = [
    "ID", "Obra", "Entidad", "Municipio", "Tipo", "Estado", "Presupuesto MXN",
    "Ejercido MXN", "Porcentaje ejercido", "Avance programado", "Avance real", "Brecha avance pp",
  ];
  const filas = lista.map((obra) => [
    obra.id, obra.nombre, obra.entidad, obra.municipio, obra.categoria, obra.estatus,
    obra.presupuesto, obra.ejercido, porcentajeEjercido(obra).toFixed(1),
    obra.avanceProgramado, obra.avanceReal, brechaAvance(obra),
  ]);
  const cabecera = "DATOS FICTICIOS DE DEMOSTRACION - NO SON REPORTES OFICIALES";
  const contenido = [cabecera, encabezados.map(celdaCsv).join(","), ...filas.map((fila) => fila.map(celdaCsv).join(","))].join("\r\n");
  const archivo = new Blob(["\uFEFF", contenido], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(archivo);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = nombre;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  URL.revokeObjectURL(url);
}
