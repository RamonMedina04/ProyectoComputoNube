"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ListFilter, Search } from "lucide-react";
import { categorias, estados, obras, estatusDisponibles } from "../../data/obras";
import type { EstadoObra } from "../../data/obras";
import ProjectsTable from "../../components/ProjectsTable";

export default function Catalogo() {
  const [texto, setTexto] = useState("");
  const [entidad, setEntidad] = useState("Todas");
  const [categoria, setCategoria] = useState("Todas");
  const [estado, setEstado] = useState<EstadoObra | "Todos">("Todos");
  const filtradas = useMemo(() => obras.filter(obra =>
    `${obra.nombre} ${obra.entidad} ${obra.municipio}`.toLocaleLowerCase("es").includes(texto.toLocaleLowerCase("es").trim())
    && (entidad === "Todas" || obra.entidad === entidad)
    && (categoria === "Todas" || obra.categoria === categoria)
    && (estado === "Todos" || obra.estatus === estado)
  ), [texto, entidad, categoria, estado]);

  return <div className="page-wrap">
    <header className="topbar"><div className="breadcrumbs">ObraClara <span>/</span> Catálogo</div><span className="demo-label"><span className="demo-dot"/> Datos simulados</span></header>
    <Link href="/" className="back-link"><ArrowLeft size={15}/> Volver al panel</Link>
    <div className="section-heading"><span className="eyebrow">EXPLORADOR DE PROYECTOS</span><h1>Catálogo de obras</h1><p>Busca una obra por nombre o ubicación y revisa su estado. Todos los registros son ejemplos ficticios.</p></div>
    <section className="panel filters-panel">
      <div className="panel-head"><h2><ListFilter size={19}/> Filtros</h2><span className="count-chip">{filtradas.length} resultados</span></div>
      <div className="catalog-filters">
        <label className="field"><span>Buscar proyecto</span><div className="search-input"><Search size={17}/><input placeholder="Nombre, estado o municipio" value={texto} onChange={e=>setTexto(e.target.value)}/></div></label>
        <label className="field"><span>Entidad federativa</span><select value={entidad} onChange={e=>setEntidad(e.target.value)}><option>Todas</option>{estados.map(e=><option key={e}>{e}</option>)}</select></label>
        <label className="field"><span>Tipo de obra</span><select value={categoria} onChange={e=>setCategoria(e.target.value)}><option>Todas</option>{categorias.map(c=><option key={c}>{c}</option>)}</select></label>
        <label className="field"><span>Estado del proyecto</span><select value={estado} onChange={e=>setEstado(e.target.value as EstadoObra | "Todos")}><option>Todos</option>{estatusDisponibles.map(e=><option key={e}>{e}</option>)}</select></label>
      </div>
      <button className="text-button" onClick={()=>{setTexto("");setEntidad("Todas");setCategoria("Todas");setEstado("Todos");}}>Restablecer filtros</button>
    </section>
    <section className="panel full-table-panel"><div className="panel-head"><div><h2>Proyectos localizados</h2><p>Selecciona un proyecto para abrir su ficha de seguimiento.</p></div></div><ProjectsTable obras={filtradas}/></section>
  </div>;
}
