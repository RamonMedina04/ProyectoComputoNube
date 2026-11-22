"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { AlertTriangle, CheckCircle2, Database, Download, ExternalLink, FileSpreadsheet, Search, ShieldAlert, Upload } from "lucide-react";
import datosPublicados from "../data/obras-oficiales.json";
import {
  CAMPOS, descargarArchivo, leerCsv, procesarFilas, sugerirColumnas, validarFechaISO,
} from "../lib/importarObrasCsv";
import type { Campo, FilaCsv, Incidencia, MapaColumnas, ObraOficial } from "../lib/importarObrasCsv";

const guardadas = datosPublicados as ObraOficial[];
const MapaOficial = dynamic(() => import("./MapaObrasOficiales"), {ssr:false, loading: () => <div className="oficial-map">Cargando contorno de México...</div>});
const mxn = (x: number | null) => x === null ? "No reportado" : new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(x);
const porcentaje = (x: number | null) => x === null ? "No reportado" : `${new Intl.NumberFormat("es-MX", { maximumFractionDigits: 2 }).format(x)}%`;
const mapaVacio = Object.fromEntries(CAMPOS.map(c => [c.id, ""])) as MapaColumnas;

export default function ImportadorObrasOficiales() {
  const [archivo, setArchivo] = useState("");
  const [columnas, setColumnas] = useState<string[]>([]);
  const [filas, setFilas] = useState<FilaCsv[]>([]);
  const [mapa, setMapa] = useState<MapaColumnas>(mapaVacio);
  const [nombre, setNombre] = useState("");
  const [url, setUrl] = useState("");
  const [consulta, setConsulta] = useState("");
  const [unidades, setUnidades] = useState(false);
  const [resultado, setResultado] = useState<{ validas: ObraOficial[]; incidencias: Incidencia[]; omitidas: number } | null>(null);
  const [error, setError] = useState("");
  const [vista, setVista] = useState<"archivo" | "publicadas">("archivo");
  const [busqueda, setBusqueda] = useState("");

  async function recibirArchivo(file?: File) {
    setResultado(null); setError(""); setArchivo(""); setColumnas([]); setFilas([]);
    if (!file) return;
    if (!/\.csv$/i.test(file.name)) { setError("Selecciona un archivo CSV, preferentemente UTF-8."); return; }
    if (file.size > 8 * 1024 * 1024) { setError("El límite es 8 MB por archivo; divide el conjunto en partes."); return; }
    try {
      const texto = await file.text();
      if (texto.includes("\uFFFD")) throw new Error("La codificación parece no ser UTF-8. Guarda el CSV en UTF-8.");
      const datos = leerCsv(texto);
      setArchivo(file.name); setColumnas(datos.columnas); setFilas(datos.filas);
      setMapa(sugerirColumnas(datos.columnas));
    } catch (e) { setError(e instanceof Error ? e.message : "No se pudo interpretar el archivo."); }
  }

  function importar() {
    setError(""); setResultado(null);
    try {
      if (!unidades && [mapa.presupuestoAprobado, mapa.presupuestoModificado, mapa.ejercido].some(Boolean)) {
        throw new Error("Antes de importar montos, confirma en el diccionario que están expresados en pesos mexicanos y no en miles o millones.");
      }
      const res = procesarFilas(filas, mapa, { nombre, url, archivo, consulta });
      setResultado(res);
    } catch (e) { setError(e instanceof Error ? e.message : "No se pudo normalizar el archivo."); }
  }

  const actuales = vista === "archivo" ? (resultado?.validas || []) : guardadas;
  const filtradas = useMemo(() => actuales.filter(o => `${o.nombre} ${o.entidad || ""} ${o.municipio || ""} ${o.idExterno}`.toLowerCase().includes(busqueda.trim().toLowerCase())), [actuales, busqueda]);
  const inc = resultado?.incidencias || [];
  const errores = inc.filter(x => x.nivel === "Error").length;
  const advertencias = inc.filter(x => x.nivel === "Advertencia").length;

  function guardarJson() {
    if (!resultado?.validas.length) return;
    descargarArchivo(JSON.stringify(resultado.validas, null, 2), "obras-oficiales.json", "application/json;charset=utf-8");
  }
  function plantilla() {
    descargarArchivo("id_externo,nombre,entidad,municipio,dependencia,categoria,presupuesto_aprobado_mxn,presupuesto_modificado_mxn,monto_ejercido_mxn,avance_programado_pct,avance_real_pct,fecha_inicio,fecha_entrega,fecha_corte,latitud,longitud\n", "plantilla-obras.csv", "text/csv;charset=utf-8");
  }

  return <div className="oficial-area">
    <div className="oficial-tabs" role="group" aria-label="Secciones de datos públicos">
      <button className={vista === "archivo" ? "oficial-tab active" : "oficial-tab"} onClick={() => { setVista("archivo"); setBusqueda(""); }}><Upload size={16}/> Importar CSV</button>
      <button className={vista === "publicadas" ? "oficial-tab active" : "oficial-tab"} onClick={() => { setVista("publicadas"); setBusqueda(""); }}><Database size={16}/> Registros publicados ({guardadas.length})</button>
    </div>

    {vista === "archivo" && <>
      <section className="panel oficial-section">
        <div className="oficial-section-title"><span className="oficial-step">1</span><div><h2>Seleccionar un conjunto de datos</h2><p>Descarga un CSV desde un portal público, verifica su diccionario y selecciónalo aquí. El archivo se procesa en tu navegador.</p></div></div>
        <div className="oficial-links">
          <a href="https://www.transparenciapresupuestaria.gob.mx/Obra-Publica-Abierta" rel="noopener noreferrer" target="_blank">Obra Pública Abierta <ExternalLink size={13}/></a>
          <a href="https://www.datos.gob.mx/dataset/avance_obras_proceso" rel="noopener noreferrer" target="_blank">Avance de obras en proceso <ExternalLink size={13}/></a>
          <a href="https://www.datos.gob.mx/dataset/programa_nacional_conservacion_carreteras" rel="noopener noreferrer" target="_blank">Conservación de carreteras <ExternalLink size={13}/></a>
        </div>
        <div className="oficial-upload-row">
          <label className="oficial-upload"><FileSpreadsheet size={23}/><span>{archivo || "Seleccionar archivo .csv"}</span><small>CSV UTF-8 · hasta 8 MB · máximo 5,000 registros</small><input type="file" accept=".csv,text/csv" onChange={e => void recibirArchivo(e.target.files?.[0])}/></label>
          <button className="button button-outline oficial-plantilla" type="button" onClick={plantilla}><Download size={15}/> Descargar plantilla</button>
        </div>
        {archivo && <div className="oficial-loaded"><CheckCircle2 size={17}/> {filas.length.toLocaleString("es-MX")} filas y {columnas.length} columnas detectadas en <strong>{archivo}</strong></div>}
      </section>

      {columnas.length > 0 && <section className="panel oficial-section">
        <div className="oficial-section-title"><span className="oficial-step">2</span><div><h2>Relacionar las columnas</h2><p>Selecciona la columna original para cada campo. Los campos que no existan deben permanecer sin asignar.</p></div></div>
        <div className="oficial-map-grid">
          {CAMPOS.map(campo => <label className="oficial-field" key={campo.id}><span>{campo.etiqueta} {campo.necesario && <b>*</b>}</span><select value={mapa[campo.id]} onChange={e => {setMapa(prev => ({ ...prev, [campo.id]: e.target.value })); setResultado(null);}}><option value="">No disponible</option>{columnas.map(c => <option key={c} value={c}>{c}</option>)}</select></label>)}
        </div>
        <div className="oficial-hint"><ShieldAlert size={16}/> No confundas presupuesto aprobado, modificado, contratado y ejercido. Los porcentajes se deben expresar de 0 a 100 y las fechas como AAAA-MM-DD.</div>
      </section>}

      {columnas.length > 0 && <section className="panel oficial-section">
        <div className="oficial-section-title"><span className="oficial-step">3</span><div><h2>Registrar el origen y validar</h2><p>Estos datos identifican la fuente declarada; la aplicación no verifica automáticamente que el archivo sea oficial.</p></div></div>
        <div className="oficial-metadata-grid">
          <label className="oficial-field"><span>Nombre del conjunto o institución *</span><input value={nombre} placeholder="Ej. Obra Pública Abierta / SHCP" onChange={e => setNombre(e.target.value)}/></label>
          <label className="oficial-field"><span>Enlace HTTPS al conjunto original *</span><input type="url" value={url} placeholder="https://..." onChange={e => setUrl(e.target.value)}/></label>
          <label className="oficial-field"><span>Fecha de consulta *</span><input type="date" value={consulta} onChange={e => setConsulta(e.target.value)}/></label>
        </div>
        <label className="oficial-check"><input type="checkbox" checked={unidades} onChange={e => setUnidades(e.target.checked)}/> <span>He comprobado en el diccionario que las columnas monetarias seleccionadas están expresadas en MXN (no miles ni millones).</span></label>
        <div className="oficial-actions"><button type="button" className="button button-primary" disabled={!nombre.trim() || !url.startsWith("https://") || !validarFechaISO(consulta)} onClick={importar}><CheckCircle2 size={16}/> Validar e importar</button><span>Solo se conservan registros con identificador y nombre.</span></div>
      </section>}
      {error && <div className="oficial-error" role="alert"><AlertTriangle size={17}/>{error}</div>}
      {resultado && <section className="panel oficial-section">
        <div className="oficial-section-title"><span className="oficial-step">4</span><div><h2>Resultados de la importación</h2><p>Información cargada localmente y aún pendiente de corroboración con el origen.</p></div></div>
        <div className="oficial-stat-grid"><div><strong>{filas.length}</strong><span>Filas leídas</span></div><div><strong>{resultado.validas.length}</strong><span>Registros aceptados</span></div><div><strong>{resultado.omitidas}</strong><span>Omitidos</span></div><div><strong>{advertencias}</strong><span>Advertencias</span></div></div>
        <div className="oficial-actions"><button className="button button-primary" onClick={guardarJson} disabled={!resultado.validas.length}><Download size={16}/> Descargar JSON normalizado</button><span>Para publicar: copia el JSON descargado a <code>web/data/obras-oficiales.json</code> y compila de nuevo.</span></div>
        {inc.length > 0 && <details className="oficial-incidencias"><summary>Ver incidencias: {errores} errores y {advertencias} advertencias</summary><ul>{inc.slice(0,100).map((v,i) => <li key={`${v.fila}-${i}`}><strong>Fila {v.fila} · {v.nivel}:</strong> {v.detalle}</li>)}</ul>{inc.length > 100 && <p>Se muestran las primeras 100 incidencias.</p>}</details>}
      </section>}
    </>}

    <section className="panel oficial-section">
      <div className="oficial-section-title"><span className="oficial-icon"><Database size={20}/></span><div><h2>{vista === "archivo" ? "Vista previa de registros normalizados" : "Registros oficiales incorporados al proyecto"}</h2><p>{vista === "archivo" ? "Solo se muestran los registros que pasaron la validación de estructura." : "Datos guardados en el repositorio. El origen declarado debe ser revisado antes de publicarse como verificado."}</p></div></div>
      <label className="oficial-search"><Search size={17}/><input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar nombre, identificador, entidad o municipio..." aria-label="Buscar registros públicos"/></label>
      {filtradas.some(o => o.lat !== null && o.lng !== null) && <div className="oficial-map-block"><h3>Ubicaciones con coordenadas proporcionadas</h3><p>Solo se representan proyectos cuyas coordenadas se recibieron en el archivo. No se deducen ubicaciones a partir del nombre del municipio.</p><MapaOficial obras={filtradas}/></div>}
      {filtradas.length ? <div className="oficial-table-wrap"><table className="oficial-table"><thead><tr><th>Obra / ID</th><th>Ubicación</th><th>Aprobado</th><th>Modificado</th><th>Ejercido</th><th>Avance reportado</th><th>Corte</th><th>Origen</th></tr></thead><tbody>{filtradas.slice(0,200).map((o,i) => <tr key={`${o.idExterno}-${i}`}><td><strong>{o.nombre}</strong><small>{o.idExterno}</small></td><td>{[o.municipio,o.entidad].filter(Boolean).join(", ") || "No reportada"}</td><td>{mxn(o.presupuestoAprobado)}</td><td>{mxn(o.presupuestoModificado)}</td><td>{mxn(o.ejercido)}</td><td>{porcentaje(o.avanceReal)}</td><td>{o.fechaCorte || "No reportado"}</td><td><a target="_blank" rel="noopener noreferrer" href={o.fuenteUrl}>Fuente declarada <ExternalLink size={12}/></a></td></tr>)}</tbody></table></div> : <div className="oficial-empty"><Database size={28}/><strong>{vista === "archivo" ? "Aún no hay datos importados" : "Todavía no hay obras oficiales publicadas"}</strong><p>{vista === "archivo" ? "Selecciona un CSV, vincula las columnas y ejecuta la validación." : "Importa un CSV, descarga el JSON y agrégalo a web/data/obras-oficiales.json."}</p></div>}
      {filtradas.length > 200 && <p className="oficial-limit">Se muestran 200 de {filtradas.length} registros filtrados.</p>}
    </section>
  </div>;
}
