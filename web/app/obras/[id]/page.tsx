import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, CircleAlert, FileText, MapPin, Wallet } from "lucide-react";
import { obras } from "../../../data/obras";
import { fecha, pesos } from "../../../lib/format";
import StatusPill from "../../../components/StatusPill";

export function generateStaticParams() { return obras.map(obra => ({ id: obra.id })); }

export default async function DetalleObra({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const obra = obras.find(item => item.id === id);
  if (!obra) notFound();
  const brecha = obra.avanceReal - obra.avanceProgramado;
  const gastoPorcentaje = obra.presupuesto ? obra.ejercido / obra.presupuesto * 100 : 0;
  return <div className="page-wrap">
    <header className="topbar"><div className="breadcrumbs">ObraClara <span>/</span> <Link href="/obras">Obras</Link> <span>/</span> {obra.id}</div><span className="demo-label"><span className="demo-dot"/> Registro ficticio</span></header>
    <Link href="/obras" className="back-link"><ArrowLeft size={15}/> Volver al catálogo</Link>
    <div className="detail-heading"><div><span className="eyebrow">FICHA DE SEGUIMIENTO · {obra.id}</span><h1>{obra.nombre}</h1><p><MapPin size={16}/> {obra.municipio}, {obra.entidad} · {obra.categoria}</p></div><StatusPill status={obra.estatus}/></div>
    <div className="notice"><CircleAlert size={17}/><span>Ficha de ejemplo para demostrar la navegación del MVP. Todos los datos financieros, fechas y avances son ficticios.</span></div>
    <div className="detail-metrics"><div className="detail-metric"><span>Presupuesto planeado</span><strong>{pesos(obra.presupuesto)}</strong></div><div className="detail-metric"><span>Presupuesto ejercido</span><strong>{pesos(obra.ejercido)}</strong></div><div className="detail-metric"><span>Porcentaje ejercido</span><strong>{gastoPorcentaje.toFixed(1)}%</strong></div></div>
    <div className="detail-grid">
      <section className="panel panel-padding"><h2>Seguimiento físico</h2><p className="panel-desc">Comparación entre el avance programado y el avance reportado en el ejemplo.</p>
        <div className="progress-detail-row"><div><strong>Avance programado</strong><b>{obra.avanceProgramado}%</b></div><div className="progress-track large"><div className="progress-fill planned" style={{width:`${obra.avanceProgramado}%`}}/></div></div>
        <div className="progress-detail-row"><div><strong>Avance real reportado</strong><b>{obra.avanceReal}%</b></div><div className="progress-track large"><div className="progress-fill" style={{width:`${obra.avanceReal}%`}}/></div></div>
        <div className={`difference-box ${brecha < -10 ? "difference-warning" : ""}`}><strong>Brecha de avance: {brecha > 0 ? "+" : ""}{brecha} puntos porcentuales</strong><p>{brecha < 0 ? "El avance registrado es menor que el programado." : brecha > 0 ? "El avance registrado supera al programado." : "El avance coincide con lo programado."}</p></div>
      </section>
      <section className="panel panel-padding"><h2>Información del proyecto</h2><dl className="info-list"><div><dt>Dependencia responsable</dt><dd>{obra.dependencia}</dd></div><div><dt>Fecha de inicio</dt><dd>{fecha(obra.fechaInicio)}</dd></div><div><dt>Entrega prevista</dt><dd>{fecha(obra.fechaEntrega)}</dd></div><div><dt>Última actualización ficticia</dt><dd>{fecha(obra.ultimaActualizacion)}</dd></div><div><dt>Ubicación aproximada</dt><dd>{obra.lat.toFixed(3)}, {obra.lng.toFixed(3)}</dd></div></dl></section>
      <section className="panel panel-padding"><h2><CalendarDays size={18}/> Descripción</h2><p className="body-copy">{obra.descripcion}</p><div className="mini-note"><Wallet size={17}/> En una implementación real, las cifras se obtendrían de informes públicos verificables y mostrarían sus fuentes.</div></section>
      <section className="panel panel-padding"><h2><FileText size={18}/> Documentación y análisis</h2><p className="body-copy">Esta demostración no contiene contratos ni informes oficiales. En una etapa posterior, se vincularían archivos PDF y registros de cada obra.</p><div className="mini-note"><CircleAlert size={17}/> Los estados de riesgo son etiquetas de ejemplo; no provienen de un modelo de Machine Learning entrenado.</div></section>
    </div>
  </div>;
}
