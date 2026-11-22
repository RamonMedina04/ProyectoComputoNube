/** Etapa 4: normalización local. No hay conexión automática a instituciones. */
export const CAMPOS = [
  { id: "idExterno", etiqueta: "Identificador oficial", necesario: true },
  { id: "nombre", etiqueta: "Nombre de la obra/proyecto", necesario: true },
  { id: "entidad", etiqueta: "Entidad federativa", necesario: false },
  { id: "municipio", etiqueta: "Municipio", necesario: false },
  { id: "dependencia", etiqueta: "Dependencia responsable", necesario: false },
  { id: "categoria", etiqueta: "Tipo de obra", necesario: false },
  { id: "presupuestoAprobado", etiqueta: "Presupuesto aprobado (MXN)", necesario: false },
  { id: "presupuestoModificado", etiqueta: "Presupuesto modificado (MXN)", necesario: false },
  { id: "ejercido", etiqueta: "Monto ejercido (MXN)", necesario: false },
  { id: "avanceProgramado", etiqueta: "Avance físico programado (%)", necesario: false },
  { id: "avanceReal", etiqueta: "Avance físico reportado (%)", necesario: false },
  { id: "fechaInicio", etiqueta: "Fecha de inicio (AAAA-MM-DD)", necesario: false },
  { id: "fechaEntrega", etiqueta: "Fecha prevista de entrega", necesario: false },
  { id: "fechaCorte", etiqueta: "Fecha del reporte", necesario: false },
  { id: "lat", etiqueta: "Latitud", necesario: false },
  { id: "lng", etiqueta: "Longitud", necesario: false },
] as const;

export type Campo = (typeof CAMPOS)[number]["id"];
export type MapaColumnas = Record<Campo, string>;
export type FilaCsv = Record<string, string>;
export type ObraOficial = {
  idExterno: string;
  nombre: string;
  entidad: string | null;
  municipio: string | null;
  dependencia: string | null;
  categoria: string | null;
  presupuestoAprobado: number | null;
  presupuestoModificado: number | null;
  ejercido: number | null;
  avanceProgramado: number | null;
  avanceReal: number | null;
  fechaInicio: string | null;
  fechaEntrega: string | null;
  fechaCorte: string | null;
  lat: number | null;
  lng: number | null;
  fuenteNombre: string;
  fuenteUrl: string;
  archivoOrigen: string;
  fechaConsulta: string;
  numeroFila: number;
  revision: "Pendiente de verificación";
};
export type Incidencia = { fila: number; nivel: "Error" | "Advertencia"; detalle: string };

const limpio = (x: string | undefined) => (x || "").trim();
const normalizaClave = (x: string) => x.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");

/** Maneja comillas dobles, delimitador punto y coma/coma y saltos de línea dentro de campos. */
export function leerCsv(texto: string): { columnas: string[]; filas: FilaCsv[] } {
  const input = texto.replace(/^\uFEFF/, "");
  const inicio = input.split(/\r?\n/, 1)[0];
  const cuenta = (d: string) => {
    let abierto = false, n = 0;
    for (let i = 0; i < inicio.length; i++) {
      if (inicio[i] === '"') {
        if (abierto && inicio[i + 1] === '"') i++;
        else abierto = !abierto;
      } else if (!abierto && inicio[i] === d) n++;
    }
    return n;
  };
  const delimitador = cuenta(";") > cuenta(",") ? ";" : ",";
  const matriz: string[][] = [];
  let actual: string[] = [], campo = "", comillas = false;
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (c === '"') {
      if (comillas && input[i + 1] === '"') { campo += '"'; i++; }
      else comillas = !comillas;
    } else if (!comillas && c === delimitador) { actual.push(campo); campo = ""; }
    else if (!comillas && (c === "\n" || c === "\r")) {
      if (c === "\r" && input[i + 1] === "\n") i++;
      actual.push(campo); campo = "";
      if (actual.some(x => x.trim())) matriz.push(actual);
      actual = [];
    } else campo += c;
  }
  if (comillas) throw new Error("El CSV tiene comillas sin cerrar.");
  actual.push(campo);
  if (actual.some(x => x.trim())) matriz.push(actual);
  if (matriz.length < 2) throw new Error("El archivo debe incluir encabezados y al menos una fila.");
  if (matriz.length > 5001) throw new Error("Importa un máximo de 5,000 filas a la vez.");
  const columnas = matriz[0].map((c) => c.trim());
  if (columnas.some(c => !c)) throw new Error("Existen columnas sin nombre.");
  if (new Set(columnas.map(normalizaClave)).size !== columnas.length) throw new Error("Hay encabezados duplicados.");
  const filas = matriz.slice(1).map((celdas) => Object.fromEntries(columnas.map((col, i) => [col, (celdas[i] || "").trim()])));
  return { columnas, filas };
}

const ALIAS: Record<Campo, string[]> = {
  idExterno: ["id_externo", "id_proyecto", "clave_cartera", "clave", "folio", "id"],
  nombre: ["nombre", "nombre_proyecto", "nombre_del_proyecto", "descripcion_obra", "proyecto", "obra"],
  entidad: ["entidad", "entidad_federativa", "estado"],
  municipio: ["municipio", "alcaldia", "municipio_alcaldia"],
  dependencia: ["dependencia", "institucion", "unidad_responsable", "ejecutor"],
  categoria: ["categoria", "tipo_obra", "tipo_de_obra", "sector"],
  presupuestoAprobado: ["presupuesto_aprobado_mxn", "presupuesto_aprobado", "aprobado_mxn"],
  presupuestoModificado: ["presupuesto_modificado_mxn", "presupuesto_modificado", "modificado_mxn"],
  ejercido: ["monto_ejercido_mxn", "ejercido_mxn", "monto_ejercido", "ejercido"],
  avanceProgramado: ["avance_programado_pct", "avance_programado", "porcentaje_programado"],
  avanceReal: ["avance_real_pct", "avance_fisico", "avance_real", "porcentaje_avance"],
  fechaInicio: ["fecha_inicio", "inicio"],
  fechaEntrega: ["fecha_entrega", "fecha_fin", "fin_programado"],
  fechaCorte: ["fecha_corte", "fecha_reporte", "ultima_actualizacion"],
  lat: ["lat", "latitud"],
  lng: ["lng", "long", "longitud"],
};

export function sugerirColumnas(columnas: string[]): MapaColumnas {
  return Object.fromEntries(CAMPOS.map(({ id }) => {
    const sugerida = columnas.find(c => ALIAS[id].includes(normalizaClave(c)));
    return [id, sugerida || ""];
  })) as MapaColumnas;
}

/** Se admite sólo número inequívoco. Valores vacíos se conservan como null. */
export function leerNumero(valor: string): number | null | "invalido" {
  let s = valor.trim().replace(/[\s\u00a0$]/g, "");
  if (!s) return null;
  if (/^-?\d+(?:\.\d+)?$/.test(s)) return Number(s);
  if (/^-?\d{1,3}(?:,\d{3})+(?:\.\d+)?$/.test(s) && (s.includes(".") || (s.match(/,/g) || []).length >= 2)) return Number(s.replace(/,/g, ""));
  if (/^-?\d+,\d{1,2}$/.test(s)) return Number(s.replace(",", "."));
  if (/^-?\d{1,3}(?:\.\d{3})+,\d{1,2}$/.test(s)) return Number(s.replace(/\./g, "").replace(",", "."));
  if (/^-?\d{1,3}(?:\.\d{3})+$/.test(s)) return Number(s.replace(/\./g, ""));
  // Nunca adivinar si '1,234' significa 1234 o 1.234.
  return "invalido";
}
function fechaISO(x: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(x)) return false;
  const d = new Date(x + "T12:00:00Z");
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0,10) === x;
}
export function validarFechaISO(x: string): boolean { return fechaISO(x); }

export function procesarFilas(
  filas: FilaCsv[], mapa: MapaColumnas,
  fuente: { nombre: string; url: string; archivo: string; consulta: string }
): { validas: ObraOficial[]; incidencias: Incidencia[]; omitidas: number } {
  if (!mapa.idExterno || !mapa.nombre) throw new Error("Asocia las columnas 'identificador' y 'nombre'.");
  if (!fuente.nombre.trim() || !/^https:\/\//i.test(fuente.url) || !fechaISO(fuente.consulta)) {
    throw new Error("Indica nombre de fuente, enlace HTTPS y fecha de consulta válida (AAAA-MM-DD).");
  }
  const usadas = Object.values(mapa).filter(Boolean);
  if (new Set(usadas).size !== usadas.length) throw new Error("No asignes la misma columna a dos campos diferentes.");
  const validas: ObraOficial[] = [], incidencias: Incidencia[] = [];
  const ids = new Set<string>();
  let omitidas = 0;
  const texto = (fila: FilaCsv, campo: Campo): string | null => {
    const v = mapa[campo] ? limpio(fila[mapa[campo]]) : "";
    return v || null;
  };
  filas.forEach((fila, idx) => {
    const numFila = idx + 2;
    const issue = (nivel: Incidencia["nivel"], detalle: string) => incidencias.push({ fila: numFila, nivel, detalle });
    const idExterno = texto(fila, "idExterno") || "";
    const nombre = texto(fila, "nombre") || "";
    if (!idExterno || !nombre) { issue("Error", "Falta identificador o nombre: registro excluido"); omitidas++; return; }
    if (ids.has(idExterno)) { issue("Error", `Identificador repetido: ${idExterno}`); omitidas++; return; }
    ids.add(idExterno);
    const numero = (c: Campo, tipo: "monto" | "porcentaje" | "coordenada"): number | null => {
      const original = texto(fila, c);
      if (!original) return null;
      const n = leerNumero(original);
      if (n === "invalido" || n === null || !Number.isFinite(n)) { issue("Advertencia", `Valor no interpretable de ${c}: se deja vacío`); return null; }
      if (tipo === "monto" && n < 0) { issue("Advertencia", `Monto negativo en ${c}: se deja vacío`); return null; }
      if (tipo === "porcentaje" && (n < 0 || n > 100)) { issue("Advertencia", `Porcentaje fuera de 0 a 100 en ${c}`); return null; }
      if (tipo === "coordenada" && ((c === "lat" && (n < -90 || n > 90)) || (c === "lng" && (n < -180 || n > 180)))) { issue("Advertencia", `Coordenada inválida: ${c}`); return null; }
      return n;
    };
    const fecha = (c: Campo): string | null => {
      const v = texto(fila, c);
      if (!v) return null;
      if (!fechaISO(v)) { issue("Advertencia", `Fecha no válida o no ISO en ${c}, se deja vacía`); return null; }
      return v;
    };
    const presupuestoAprobado = numero("presupuestoAprobado", "monto");
    const presupuestoModificado = numero("presupuestoModificado", "monto");
    const ejercido = numero("ejercido", "monto");
    if (ejercido !== null && presupuestoModificado !== null && ejercido > presupuestoModificado) {
      issue("Advertencia", "Monto ejercido supera presupuesto modificado; verificar periodos y definiciones");
    }
    const lat = numero("lat", "coordenada");
    const lng = numero("lng", "coordenada");
    if ((lat === null) !== (lng === null)) issue("Advertencia", "Coordenadas incompletas; no ubicar en mapa");
    validas.push({
      idExterno, nombre,
      entidad: texto(fila,"entidad"), municipio: texto(fila,"municipio"),
      dependencia: texto(fila,"dependencia"), categoria: texto(fila,"categoria"),
      presupuestoAprobado, presupuestoModificado, ejercido,
      avanceProgramado: numero("avanceProgramado", "porcentaje"),
      avanceReal: numero("avanceReal", "porcentaje"),
      fechaInicio: fecha("fechaInicio"), fechaEntrega: fecha("fechaEntrega"), fechaCorte: fecha("fechaCorte"),
      lat, lng, fuenteNombre: fuente.nombre.trim(), fuenteUrl: fuente.url.trim(),
      archivoOrigen: fuente.archivo, fechaConsulta: fuente.consulta, numeroFila: numFila,
      revision: "Pendiente de verificación",
    });
  });
  return { validas, incidencias, omitidas };
}

export function descargarArchivo(contenido: string, nombre: string, tipo: string) {
  const blob = new Blob([contenido], { type: tipo });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = nombre; document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}
