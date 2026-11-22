"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Activity, AlertTriangle, ArrowRight, ArrowUpRight, Building2, CircleCheck, Clock3, Filter, MapPinned, Search, Wallet } from "lucide-react";
import { obras, estatusDisponibles } from "../data/obras";
import type { EstadoObra } from "../data/obras";
import { millones } from "../lib/format";
import MetricCard from "../components/MetricCard";
import ProjectsTable from "../components/ProjectsTable";
import BudgetBars from "../components/BudgetBars";
import StatusDonut from "../components/StatusDonut";

const MexicoMap = dynamic(() => import("../components/MexicoMap"), { ssr: false, loading: () => <div className="map-loading">Cargando mapa de México...</div> });

type FiltroEstado = EstadoObra | "Todos";
export default function Dashboard() {
  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState<FiltroEstado>("Todos");
  const filtradas = useMemo(() => obras.filter((obra) => {
    const texto = `${obra.nombre} ${obra.entidad} ${obra.municipio} ${obra.categoria}`.toLocaleLowerCase("es");
    return texto.includes(busqueda.toLocaleLowerCase("es").trim()) && (estado === "Todos" || obra.estatus === estado);
  }), [busqueda, estado]);
  const presupuesto = filtradas.reduce((acc, obra) => acc + obra.presupuesto, 0);
  const ejercido = filtradas.reduce((acc, obra) => acc + obra.ejercido, 0);
  const riesgo = filtradas.filter(obra => obra.estatus === "En riesgo").length;
  const retraso = filtradas.filter(obra => obra.estatus === "Con retraso").length;

  return <div className="page-wrap">
    <header className="topbar"><div className="breadcrumbs">ObraClara <span>/</span> Panel general</div><div className="topbar-right"><span className="demo-label"><span className="demo-dot"/> Datos simulados</span><span className="topbar-date">Corte de ejemplo: 15 nov 2026</span></div></header>
    <div className="hero-heading"><div><span className="eyebrow">OBSERVATORIO CIUDADANO · MÉXICO</span><h1>Infraestructura pública, <span>a la vista.</span></h1><p>Consulta presupuesto, avance físico y señales de seguimiento de obras públicas en una sola plataforma.</p></div><Link className="button button-primary" href="/obras">Explorar obras <ArrowUpRight size={16}/></Link></div>
    <div className="notice"><CircleCheck size={17}/><span><strong>Prototipo demostrativo:</strong> los nombres de obras, montos y avances son ficticios. No representan reportes gubernamentales.</span></div>

    <section className="metrics-grid" aria-label="Indicadores generales">
      <MetricCard title="Proyectos registrados" value={String(filtradas.length)} subtitle="Obras en la selección" icon={<Building2 size={21}/>} tone="blue"/>
      <MetricCard title="Presupuesto total" value={`$${millones(presupuesto)}`} subtitle="MXN · monto planeado" icon={<Wallet size={21}/>} tone="purple"/>
      <MetricCard title="Recursos ejercidos" value={`$${millones(ejercido)}`} subtitle="MXN · gasto reportado" icon={<Activity size={21}/>} tone="teal"/>
      <MetricCard title="Obras en riesgo" value={String(riesgo)} subtitle="Requieren seguimiento" icon={<AlertTriangle size={21}/>} tone="amber"/>
      <MetricCard title="Con retraso" value={String(retraso)} subtitle="Fuera de fecha prevista" icon={<Clock3 size={21}/>} tone="red"/>
    </section>

    <section className="filter-toolbar" aria-label="Filtros de obras">
      <div className="filter-label"><Filter size={17}/><strong>Filtrar proyectos</strong></div>
      <label className="search-input"><Search size={17}/><input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar obra, estado o municipio..." aria-label="Buscar obras"/></label>
      <label className="select-wrap"><span>Estatus:</span><select value={estado} onChange={e => setEstado(e.target.value as FiltroEstado)} aria-label="Filtrar por estatus"><option>Todos</option>{estatusDisponibles.map(s => <option key={s}>{s}</option>)}</select></label>
      {(busqueda || estado !== "Todos") && <button className="text-button" onClick={() => {setBusqueda("");setEstado("Todos");}}>Limpiar filtros</button>}
    </section>

    <div className="analytics-grid">
      <section className="panel map-panel"><div className="panel-head"><div><h2><MapPinned size={19}/> Ubicación de las obras</h2><p>Explora los proyectos sobre el mapa de México.</p></div><span className="count-chip">{filtradas.length} ubicaciones</span></div><MexicoMap obras={filtradas}/><div className="map-footer"><span><i className="dot-on"/> En tiempo</span><span><i className="dot-risk"/> En riesgo</span><span><i className="dot-delay"/> Con retraso</span><span><i className="dot-done"/> Finalizada</span></div></section>
      <div className="side-panels">
        <section className="panel chart-panel"><div className="panel-head"><div><h2>Estado de los proyectos</h2><p>Distribución del seguimiento</p></div></div><StatusDonut obras={filtradas}/></section>
        <section className="panel chart-panel"><div className="panel-head"><div><h2>Presupuesto vs. ejercido</h2><p>Principales obras por monto</p></div></div><BudgetBars obras={filtradas}/></section>
      </div>
    </div>
    <section className="panel full-table-panel"><div className="panel-head"><div><h2>Seguimiento de proyectos</h2><p>Comparación rápida del avance y el presupuesto registrado.</p></div><Link className="link-inline" href="/obras">Ver todas las obras <ArrowRight size={16}/></Link></div><ProjectsTable obras={filtradas.slice(0, 7)} /></section>
    <footer className="site-footer">ObraClara · Proyecto académico de computación en la nube · México · Datos ficticios para demostración</footer>
  </div>;
}
