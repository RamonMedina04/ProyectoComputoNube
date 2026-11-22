"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, ListFilter, Search, Scale, SlidersHorizontal } from "lucide-react";
import { categorias, estados, obras, estatusDisponibles } from "../../data/obras";
import type { EstadoObra } from "../../data/obras";
import ProjectsTable from "../../components/ProjectsTable";
import ComparadorObras from "../../components/ComparadorObras";
import { exportarObrasCsv } from "../../lib/exportarCsv";

type Orden = "nombre" | "presupuesto-desc" | "presupuesto-asc" | "avance-desc" | "brecha-asc";

export default function Catalogo() {
  const [texto, setTexto] = useState("");
  const [entidad, setEntidad] = useState("Todas");
  const [categoria, setCategoria] = useState("Todas");
  const [estado, setEstado] = useState<EstadoObra | "Todos">("Todos");
  const [orden, setOrden] = useState<Orden>("nombre");
  const [idsComparados, setIdsComparados] = useState<string[]>([]);

  const filtradas = useMemo(() => {
    const resultado = obras.filter((obra) =>
      `${obra.id} ${obra.nombre} ${obra.entidad} ${obra.municipio} ${obra.categoria}`
        .toLocaleLowerCase("es").includes(texto.toLocaleLowerCase("es").trim()) &&
      (entidad === "Todas" || obra.entidad === entidad) &&
      (categoria === "Todas" || obra.categoria === categoria) &&
      (estado === "Todos" || obra.estatus === estado)
    );
    resultado.sort((a, b) => {
      switch (orden) {
        case "presupuesto-desc": return b.presupuesto - a.presupuesto;
        case "presupuesto-asc": return a.presupuesto - b.presupuesto;
        case "avance-desc": return b.avanceReal - a.avanceReal;
        case "brecha-asc": return (a.avanceReal - a.avanceProgramado) - (b.avanceReal - b.avanceProgramado);
        default: return a.nombre.localeCompare(b.nombre, "es");
      }
    });
    return resultado;
  }, [texto, entidad, categoria, estado, orden]);

  const comparadas = idsComparados.map((id) => obras.find((obra) => obra.id === id)).filter((obra): obra is (typeof obras)[number] => Boolean(obra));

  function cambiarComparacion(id: string) {
    setIdsComparados((actual) => actual.includes(id) ? actual.filter((valor) => valor !== id) : actual.length < 3 ? [...actual, id] : actual);
  }

  function reiniciar() {
    setTexto(""); setEntidad("Todas"); setCategoria("Todas"); setEstado("Todos"); setOrden("nombre");
  }

  return <div className="page-wrap">
    <header className="topbar"><div className="breadcrumbs">ObraClara <span>/</span> Catálogo</div><span className="demo-label"><span className="demo-dot"/> Datos simulados</span></header>
    <Link href="/" className="back-link"><ArrowLeft size={15}/> Volver al panel</Link>
    <div className="section-heading"><span className="eyebrow">EXPLORADOR DE PROYECTOS</span><h1>Catálogo de obras</h1><p>Busca, ordena y compara obras en distintas entidades de México. Los datos de esta demostración son ficticios.</p></div>
    <section className="panel filters-panel">
      <div className="panel-head"><h2><ListFilter size={19}/> Buscar y filtrar</h2><span className="count-chip">{filtradas.length} resultados</span></div>
      <div className="catalog-filters catalog-filters-five">
        <label className="field"><span>Buscar proyecto</span><div className="search-input"><Search size={17}/><input placeholder="Obra, ciudad o ID" value={texto} onChange={(e) => setTexto(e.target.value)} /></div></label>
        <label className="field"><span>Entidad federativa</span><select value={entidad} onChange={(e) => setEntidad(e.target.value)}><option>Todas</option>{estados.map((e) => <option key={e}>{e}</option>)}</select></label>
        <label className="field"><span>Tipo de obra</span><select value={categoria} onChange={(e) => setCategoria(e.target.value)}><option>Todas</option>{categorias.map((c) => <option key={c}>{c}</option>)}</select></label>
        <label className="field"><span>Estado</span><select value={estado} onChange={(e) => setEstado(e.target.value as EstadoObra | "Todos")}><option>Todos</option>{estatusDisponibles.map((e) => <option key={e}>{e}</option>)}</select></label>
        <label className="field"><span><SlidersHorizontal size={13}/> Ordenar por</span><select value={orden} onChange={(e) => setOrden(e.target.value as Orden)}><option value="nombre">Nombre A–Z</option><option value="presupuesto-desc">Mayor presupuesto</option><option value="presupuesto-asc">Menor presupuesto</option><option value="avance-desc">Mayor avance físico</option><option value="brecha-asc">Mayor rezago físico</option></select></label>
      </div>
      <div className="catalog-actions"><button type="button" className="text-button" onClick={reiniciar}>Restablecer filtros</button><button type="button" className="button button-outline" disabled={filtradas.length === 0} onClick={() => exportarObrasCsv(filtradas)}><Download size={16}/> Exportar CSV ({filtradas.length})</button></div>
    </section>

    <section className="panel full-table-panel catalog-table-panel"><div className="panel-head"><div><h2>Obras localizadas</h2><p><Scale size={14}/> Marca hasta tres casillas para comparar proyectos. Selecciona el nombre para ver su ficha.</p></div><span className="count-chip">{idsComparados.length}/3 para comparar</span></div>
      <ProjectsTable obras={filtradas} comparacion={{ ids: idsComparados, maximo: 3, cambiar: cambiarComparacion }} />
    </section>
    {comparadas.length > 0 && <ComparadorObras obras={comparadas} onLimpiar={() => setIdsComparados([])}/>}
    <p className="feature-footer-note">Todos los presupuestos, porcentajes y estados son ficticios. La selección de proyectos se conserva al cambiar los filtros hasta que la elimines.</p>
  </div>;
}
