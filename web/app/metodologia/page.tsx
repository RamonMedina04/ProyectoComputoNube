import Link from "next/link";
import { ArrowLeft, ArrowUpRight, BrainCircuit, Database, FileText, ShieldCheck } from "lucide-react";

export default function Metodologia() {
  return <div className="page-wrap">
    <header className="topbar"><div className="breadcrumbs">ObraClara <span>/</span> Metodología</div><span className="demo-label"><span className="demo-dot"/> MVP académico</span></header>
    <Link href="/" className="back-link"><ArrowLeft size={15}/> Volver al panel</Link>
    <div className="section-heading"><span className="eyebrow">TRANSPARENCIA Y TRAZABILIDAD</span><h1>Cómo funciona ObraClara</h1><p>Conoce qué muestra el prototipo, de dónde podrían provenir sus datos y cómo se conectaría a Google Cloud.</p></div>
    <div className="method-grid">
      <section className="panel panel-padding method-card"><Database className="method-icon" size={26}/><h2>1. Datos públicos</h2><p>El sistema se diseñó para consultar información de obras: presupuesto, ubicación, fechas, avances e informes. En esta versión usamos únicamente registros ficticios.</p></section>
      <section className="panel panel-padding method-card"><FileText className="method-icon" size={26}/><h2>2. Procesamiento</h2><p>Se propone usar Cloud Storage para documentos PDF, Document AI para extraer información y Cloud SQL (MySQL) para organizar los registros de cada obra.</p></section>
      <section className="panel panel-padding method-card"><BrainCircuit className="method-icon" size={26}/><h2>3. Análisis futuro</h2><p>BigQuery permitiría comparar presupuestos y avances. Un modelo de ML podría estimar riesgos si se dispone de datos históricos suficientes y verificados.</p></section>
      <section className="panel panel-padding method-card"><ShieldCheck className="method-icon" size={26}/><h2>4. Consulta responsable</h2><p>La plataforma deberá indicar las fuentes, la fecha de actualización y los datos faltantes, y distinguir entre indicadores de seguimiento y pruebas de irregularidades.</p></section>
    </div>
    <section className="panel panel-padding roadmap"><h2>Alcance por etapas</h2><div className="roadmap-row"><span className="roadmap-number">01</span><div><strong>MVP actual</strong><p>Dashboard, mapa centrado en México, filtros, catálogo y fichas con datos ficticios.</p></div><span className="roadmap-chip ready">Incluido</span></div><div className="roadmap-row"><span className="roadmap-number">02</span><div><strong>Datos oficiales</strong><p>Verificación, transformación e integración de datos publicados por instituciones públicas.</p></div><span className="roadmap-chip">Planeado</span></div><div className="roadmap-row"><span className="roadmap-number">03</span><div><strong>Google Cloud y modelos</strong><p>Conexión a Cloud SQL, BigQuery y documentos; posteriormente análisis de riesgo basado en datos reales.</p></div><span className="roadmap-chip">Propuesto</span></div></section>
    <section className="panel panel-padding"><h2>Fuentes potenciales de información</h2><p className="body-copy">Como punto de partida de investigación se propone revisar el portal oficial mexicano de Transparencia Presupuestaria. El uso de una fuente real siempre requerirá revisar disponibilidad, cobertura, licencias y calidad de sus datos.</p><a className="link-inline" href="https://www.transparenciapresupuestaria.gob.mx/Obra-Publica-Abierta" target="_blank" rel="noreferrer">Consultar Obra Pública Abierta <ArrowUpRight size={16}/></a></section>
  </div>;
}
