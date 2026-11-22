"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, ChartColumnIncreasing, Info, Wallet, Activity, Building2, AlertTriangle } from "lucide-react";
import { categorias, estados, obras } from "../../data/obras";
import { agruparObras, resumenObras } from "../../lib/analisis";
import { millones } from "../../lib/format";
import { exportarObrasCsv } from "../../lib/exportarCsv";
import MetricCard from "../../components/MetricCard";

type Agrupacion = "categoria" | "entidad";
export default function AnalisisFinanciero() {
  const [entidad, setEntidad] = useState("Todas");
  const [categoria, setCategoria] = useState("Todas");
  const [agrupacion, setAgrupacion] = useState<Agrupacion>("categoria");
  const seleccion = useMemo(() => obras.filter((obra) =>
    (entidad === "Todas" || obra.entidad === entidad) &&
    (categoria === "Todas" || obra.categoria === categoria)
  ), [entidad, categoria]);
  const total = useMemo(() => resumenObras(seleccion), [seleccion]);
  const grupos = useMemo(() => agruparObras(seleccion, agrupacion), [seleccion, agrupacion]);
  const maximo = Math.max(1, ...grupos.map((grupo) => grupo.presupuesto));

  return <div className="page-wrap">
    <header className="topbar"><div className="breadcrumbs">ObraClara <span>/</span> Análisis financiero</div><span className="demo-label"><span className="demo-dot"/> Datos simulados</span></header>
    <Link href="/" className="back-link"><ArrowLeft size={15}/> Volver al panel</Link>
    <div className="section-heading"><span className="eyebrow">ANÁLISIS PRESUPUESTARIO · MÉXICO</span><h1>¿Cómo se distribuye el presupuesto?</h1><p>Explora y compara los presupuestos ficticios por tipo de obra y entidad federativa.</p></div>
    <div className="notice"><Info size={17}/><span>Todos los datos de esta página son de demostración. El gasto ejercido no equivale necesariamente al valor del avance físico.</span></div>
    <section className="panel panel-padding finance-filters"><h2>Seleccionar información</h2><div className="finance-filter-grid">
      <label className="field"><span>Entidad federativa</span><select value={entidad} onChange={(e) => setEntidad(e.target.value)}><option>Todas</option>{estados.map((valor) => <option key={valor}>{valor}</option>)}</select></label>
      <label className="field"><span>Tipo de obra</span><select value={categoria} onChange={(e) => setCategoria(e.target.value)}><option>Todas</option>{categorias.map((valor) => <option key={valor}>{valor}</option>)}</select></label>
      <label className="field"><span>Agrupar resultados por</span><select value={agrupacion} onChange={(e) => setAgrupacion(e.target.value as Agrupacion)}><option value="categoria">Tipo de obra</option><option value="entidad">Entidad federativa</option></select></label>
      <div className="finance-filter-action"><button className="button button-outline" type="button" disabled={seleccion.length === 0} onClick={() => exportarObrasCsv(seleccion, "obraclara-analisis-demo.csv")}><Download size={16}/> Exportar datos</button></div>
    </div></section>
    <section className="metrics-grid finance-metrics" aria-label="Indicadores financieros de la selección">
      <MetricCard title="Obras analizadas" value={String(total.cantidad)} subtitle="Proyectos en la selección" tone="blue" icon={<Building2 size={21}/>} />
      <MetricCard title="Presupuesto aprobado" value={`$${millones(total.presupuesto)}`} subtitle="MXN" tone="purple" icon={<Wallet size={21}/>} />
      <MetricCard title="Monto ejercido" value={`$${millones(total.ejercido)}`} subtitle="MXN" tone="teal" icon={<Activity size={21}/>} />
      <MetricCard title="Proporción ejercida" value={`${total.porcentajeEjercido.toFixed(1)}%`} subtitle="Ejercido / aprobado" tone="amber" icon={<ChartColumnIncreasing size={21}/>} />
      <MetricCard title="Con señales de atención" value={String(total.enRiesgo + total.conRetraso)} subtitle="Riesgo o retraso (simulado)" tone="red" icon={<AlertTriangle size={21}/>} />
    </section>
    <section className="panel finance-chart-panel"><div className="panel-head"><div><h2><ChartColumnIncreasing size={19}/> Presupuesto aprobado frente al ejercido</h2><p>Agrupación: {agrupacion === "categoria" ? "tipo de obra" : "entidad federativa"}</p></div><span className="count-chip">{grupos.length} grupos</span></div>
      {grupos.length === 0 ? <div className="empty-state">No hay obras con esta combinación de filtros.</div> : <div className="finance-chart-content">
        <div className="finance-chart-legend"><span><i className="legend-budget"/> Presupuesto aprobado</span><span><i className="legend-spent"/> Ejercido</span></div>
        {grupos.map((grupo) => <div className="finance-chart-row" key={grupo.nombre}>
          <div className="finance-chart-label"><strong>{grupo.nombre}</strong><span>{grupo.cantidad} {grupo.cantidad === 1 ? "obra" : "obras"} · ${millones(grupo.presupuesto)}</span></div>
          <div className="finance-track"><div className="finance-bar-planned" style={{ width: `${(grupo.presupuesto / maximo) * 100}%` }}/><div className="finance-bar-spent" style={{ width: `${(grupo.ejercido / maximo) * 100}%` }}/></div>
          <span className="finance-percent">{grupo.porcentajeEjercido.toFixed(1)}%</span>
        </div>)}
      </div>}
    </section>
    <section className="panel finance-table-panel"><div className="panel-head"><div><h2>Resumen por {agrupacion === "categoria" ? "tipo de obra" : "entidad"}</h2><p>Los montos agregados corresponden únicamente a los proyectos seleccionados.</p></div></div>
      {grupos.length === 0 ? <div className="empty-state">No hay datos para resumir.</div> : <div className="table-scroll"><table className="projects-table"><thead><tr><th>GRUPO</th><th>OBRAS</th><th>APROBADO</th><th>EJERCIDO</th><th>PORCENTAJE EJERCIDO</th></tr></thead><tbody>{grupos.map((grupo) => <tr key={grupo.nombre}><td><strong>{grupo.nombre}</strong></td><td>{grupo.cantidad}</td><td className="table-number">${millones(grupo.presupuesto)}</td><td className="table-number">${millones(grupo.ejercido)}</td><td>{grupo.porcentajeEjercido.toFixed(1)}%</td></tr>)}</tbody></table></div>}
    </section>
    <p className="feature-footer-note">Metodología: porcentaje ejercido = monto ejercido / presupuesto aprobado × 100. Este valor no indica, por sí solo, atraso, corrupción o sobrecosto.</p>
  </div>;
}
