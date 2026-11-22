import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Database, FileText, ShieldCheck, Info } from "lucide-react";
import { fuentesPublicas } from "../../data/fuentes";

export default function FuentesOficiales() {
  return <div className="page-wrap">
    <header className="topbar"><div className="breadcrumbs">ObraClara <span>/</span> Fuentes de información</div><span className="demo-label"><span className="demo-dot"/> Integración pendiente</span></header>
    <Link className="back-link" href="/"><ArrowLeft size={15}/> Volver al panel</Link>
    <div className="section-heading"><span className="eyebrow">PLAN DE DATOS ABIERTOS</span><h1>Fuentes públicas de información</h1><p>Portales oficiales que podrían alimentar ObraClara en una etapa posterior, una vez seleccionados los conjuntos de datos y revisada su calidad.</p></div>
    <div className="notice"><Info size={18}/><span><strong>Estado actual:</strong> no existe ninguna conexión automática con estas plataformas. Los indicadores del MVP siguen utilizando exclusivamente datos ficticios.</span></div>
    <div className="source-grid">
      {fuentesPublicas.map((fuente) => <article className="panel source-card" key={fuente.id}>
        <div className="source-top"><span className="source-icon"><Database size={22}/></span><span className="source-state">{fuente.estado}</span></div>
        <h2>{fuente.nombre}</h2><span className="source-institution">{fuente.institucion}</span><p>{fuente.descripcion}</p>
        <div className="source-box"><strong>Información a investigar</strong><ul>{fuente.datosPotenciales.map((d) => <li key={d}>{d}</li>)}</ul></div>
        <div className="source-coverage"><strong>Cobertura:</strong> {fuente.cobertura}</div>
        <a href={fuente.url} target="_blank" rel="noopener noreferrer" className="button button-outline"><ArrowUpRight size={16}/> Consultar portal oficial</a>
      </article>)}
    </div>
    <section className="panel panel-padding sources-flow"><h2>¿Cómo pasaríamos de archivos oficiales al dashboard?</h2><p className="panel-desc">Este flujo representa una propuesta para el sistema completo; aún no se ha implementado.</p>
      <div className="source-steps">
        <div><FileText size={22}/><strong>1. Seleccionar</strong><p>Identificar conjuntos y documentos públicos, con sus fechas y licencias.</p></div>
        <div><ShieldCheck size={22}/><strong>2. Revisar</strong><p>Validar formatos, identificadores, montos, unidades y correspondencia entre registros.</p></div>
        <div><Database size={22}/><strong>3. Organizar</strong><p>Guardar PDF en Cloud Storage y registros revisados en Cloud SQL; usar BigQuery para análisis.</p></div>
        <div><Database size={22}/><strong>4. Publicar</strong><p>Mostrar indicadores con enlace al origen y fecha de última verificación.</p></div>
      </div>
    </section>
    <section className="panel panel-padding"><h2>Reglas antes de utilizar datos reales</h2><p className="body-copy">Una obra debe conservar el identificador de la fuente. Los montos faltantes no se rellenan con cero; las fechas se interpretan según el periodo oficial; y no se mezclan presupuestos aprobados, modificados y ejercidos. Un contrato solo se asocia con una obra si existe una clave que respalde la relación.</p><p className="body-copy">El archivo <code>web/lib/normalizarFuente.ts</code> contiene una función inicial de validación para preparar esta futura importación. No realiza descargas ni escribe en ninguna base de datos.</p></section>
  </div>;
}
