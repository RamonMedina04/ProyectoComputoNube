"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowUpRight, FileText, Search, Info } from "lucide-react";
import { documentos, tiposDocumento } from "../../data/documentos";
import type { TipoDocumento } from "../../data/documentos";
import { obras } from "../../data/obras";
import { fecha } from "../../lib/format";

export default function BibliotecaDocumental() {
  const [busqueda, setBusqueda] = useState("");
  const [obraId, setObraId] = useState("Todas");
  const [tipo, setTipo] = useState<TipoDocumento | "Todos">("Todos");

  const filtrados = useMemo(() => documentos.filter((d) => {
    const obra = obras.find((o) => o.id === d.obraId);
    const texto = `${d.id} ${d.titulo} ${d.tipo} ${obra?.nombre ?? ""} ${obra?.municipio ?? ""}`.toLocaleLowerCase("es");
    return texto.includes(busqueda.toLocaleLowerCase("es").trim()) &&
      (obraId === "Todas" || d.obraId === obraId) && (tipo === "Todos" || d.tipo === tipo);
  }), [busqueda, obraId, tipo]);

  return <div className="page-wrap">
    <header className="topbar"><div className="breadcrumbs">ObraClara <span>/</span> Documentos</div><span className="demo-label"><span className="demo-dot"/> Documentos simulados</span></header>
    <Link className="back-link" href="/"><ArrowLeft size={15}/> Volver al panel</Link>
    <div className="section-heading"><span className="eyebrow">RESPALDO DOCUMENTAL · MÉXICO</span><h1>Biblioteca de documentos</h1><p>Explora ejemplos de informes, resúmenes y fichas financieras vinculados con los proyectos del MVP.</p></div>
    <div className="notice"><Info size={18}/><span><strong>Material ficticio:</strong> todos los documentos fueron elaborados para probar la plataforma. No son archivos oficiales ni documentos de gobierno.</span></div>
    <section className="panel panel-padding docs-filter-panel">
      <div className="docs-filter-heading"><h2><Search size={18}/> Buscar documentos</h2><span className="count-chip">{filtrados.length} documentos</span></div>
      <div className="docs-filter-grid">
        <label className="field"><span>Nombre o palabra clave</span><div className="search-input"><Search size={17}/><input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Ej. hospital, presupuesto, avance" /></div></label>
        <label className="field"><span>Obra pública</span><select value={obraId} onChange={(e) => setObraId(e.target.value)}><option value="Todas">Todas las obras</option>{obras.map((o) => <option key={o.id} value={o.id}>{o.id} · {o.nombre}</option>)}</select></label>
        <label className="field"><span>Tipo de documento</span><select value={tipo} onChange={(e) => setTipo(e.target.value as TipoDocumento | "Todos")}><option value="Todos">Todos los tipos</option>{tiposDocumento.map((t) => <option key={t} value={t}>{t}</option>)}</select></label>
      </div>
    </section>
    <section className="docs-list" aria-label="Lista de documentos">
      {filtrados.length === 0 ? <div className="panel docs-empty"><FileText size={32}/><strong>No se encontraron documentos</strong><p>Modifica los filtros para ver otros archivos.</p></div> :
      filtrados.map((doc) => {
        const obra = obras.find((o) => o.id === doc.obraId);
        return <article className="panel docs-card" key={doc.id}>
          <span className="docs-icon"><FileText size={23}/></span>
          <div className="docs-card-body"><div className="docs-meta"><span className="doc-tag">{doc.tipo}</span><span className="doc-tag doc-tag-demo">Demostración</span></div>
            <h2>{doc.titulo}</h2><p>{doc.descripcion}</p>
            <div className="docs-card-meta"><span>{doc.obraId} · {obra?.municipio}, {obra?.entidad}</span><span>Fecha de referencia: {fecha(doc.fechaDocumento)}</span></div>
            <Link href={`/obras/${doc.obraId}`} className="docs-project-link">Ver ficha de obra</Link>
          </div>
          <a className="button button-outline docs-open" href={doc.archivo} target="_blank" rel="noopener noreferrer"><ArrowUpRight size={16}/> Abrir PDF</a>
        </article>;
      })}
    </section>
    <p className="feature-footer-note">En la arquitectura propuesta, los PDF oficiales se guardarían en Cloud Storage y se vincularían con una fuente y fecha verificadas antes de publicarse.</p>
  </div>;
}
