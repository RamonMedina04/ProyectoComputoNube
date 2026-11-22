import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, CircleAlert, FileText, MapPin, Wallet, ChartColumnIncreasing, Info, Building2 } from "lucide-react";
import { obras } from "../../../data/obras";
import { fecha, pesos } from "../../../lib/format";
import { porcentajeEjercido, brechaAvance, diferenciaFinancieraFisica } from "../../../lib/analisis";
import StatusPill from "../../../components/StatusPill";

export function generateStaticParams() { return obras.map((obra) => ({ id: obra.id })); }

export default async function DetalleObra({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const obra = obras.find((item) => item.id === id);
  if (!obra) notFound();

  const brecha = brechaAvance(obra);
  const porcentajeGasto = porcentajeEjercido(obra);
  const diferencia = diferenciaFinancieraFisica(obra);
  const saldo = obra.presupuesto - obra.ejercido;

  return <div className="page-wrap">
    <header className="topbar"><div className="breadcrumbs">ObraClara <span>/</span> <Link href="/obras">Obras</Link> <span>/</span> {obra.id}</div><span className="demo-label"><span className="demo-dot"/> Registro ficticio</span></header>
    <Link href="/obras" className="back-link"><ArrowLeft size={15}/> Volver al catálogo</Link>
    <div className="detail-heading"><div><span className="eyebrow">FICHA DE SEGUIMIENTO · {obra.id}</span><h1>{obra.nombre}</h1><p><MapPin size={16}/> {obra.municipio}, {obra.entidad} · {obra.categoria}</p></div><StatusPill status={obra.estatus}/></div>
    <div className="notice"><CircleAlert size={17}/><span><strong>Datos de demostración:</strong> esta obra, sus montos, fechas y estatus son ficticios. No representan información de un proyecto gubernamental real.</span></div>
    <div className="detail-metrics detail-metrics-four">
      <div className="detail-metric"><span>Presupuesto aprobado</span><strong>{pesos(obra.presupuesto)}</strong></div>
      <div className="detail-metric"><span>Recursos ejercidos</span><strong>{pesos(obra.ejercido)}</strong></div>
      <div className="detail-metric"><span>Saldo presupuestario*</span><strong>{pesos(saldo)}</strong></div>
      <div className="detail-metric"><span>Porcentaje ejercido</span><strong>{porcentajeGasto.toFixed(1)}%</strong></div>
    </div>
    <div className="detail-grid">
      <section className="panel panel-padding"><h2><ChartColumnIncreasing size={18}/> Seguimiento físico</h2><p className="panel-desc">Comparación entre el avance programado y el informado en esta simulación.</p>
        <div className="progress-detail-row"><div><strong>Avance programado</strong><b>{obra.avanceProgramado}%</b></div><div className="progress-track large"><div className="progress-fill planned" style={{ width: `${obra.avanceProgramado}%` }}/></div></div>
        <div className="progress-detail-row"><div><strong>Avance físico real</strong><b>{obra.avanceReal}%</b></div><div className="progress-track large"><div className="progress-fill" style={{ width: `${obra.avanceReal}%` }}/></div></div>
        <div className={`difference-box ${brecha < -10 ? "difference-warning" : ""}`}><strong>Brecha de avance: {brecha > 0 ? "+" : ""}{brecha} puntos porcentuales</strong><p>{brecha < 0 ? "El avance informado está por debajo del programado." : brecha > 0 ? "El avance informado supera el programado." : "El avance coincide con lo programado."}</p></div>
      </section>
      <section className="panel panel-padding"><h2><Wallet size={18}/> Lectura presupuestaria</h2><p className="panel-desc">Proporción gastada respecto al monto aprobado.</p>
        <div className="finance-big-number">{porcentajeGasto.toFixed(1)}% <span>del presupuesto ejercido</span></div>
        <div className="progress-track large"><div className="progress-fill" style={{ width: `${Math.max(0, Math.min(porcentajeGasto, 100))}%` }}/></div>
        <div className="financial-compare"><div><span>Avance físico</span><strong>{obra.avanceReal}%</strong></div><div><span>Presupuesto ejercido</span><strong>{porcentajeGasto.toFixed(1)}%</strong></div><div><span>Diferencia</span><strong>{diferencia > 0 ? "+" : ""}{diferencia.toFixed(1)} pp</strong></div></div>
        <p className="plain-note">Esta diferencia es únicamente descriptiva: el calendario de pagos no tiene por qué coincidir exactamente con el avance físico. No representa evidencia de sobrecosto ni corrupción.</p>
      </section>
      <section className="panel panel-padding"><h2><Building2 size={18}/> Datos del proyecto</h2><dl className="info-list"><div><dt>Dependencia responsable</dt><dd>{obra.dependencia}</dd></div><div><dt>Tipo de obra</dt><dd>{obra.categoria}</dd></div><div><dt>Inicio previsto</dt><dd>{fecha(obra.fechaInicio)}</dd></div><div><dt>Entrega prevista</dt><dd>{fecha(obra.fechaEntrega)}</dd></div><div><dt>Última actualización ficticia</dt><dd>{fecha(obra.ultimaActualizacion)}</dd></div><div><dt>Ubicación aproximada</dt><dd>{obra.lat.toFixed(3)}, {obra.lng.toFixed(3)}</dd></div></dl></section>
      <section className="panel panel-padding"><h2><CalendarDays size={18}/> Descripción</h2><p className="body-copy">{obra.descripcion}</p><div className="mini-note"><Info size={17}/> El estatus mostrado es un dato de prueba; no proviene de un sistema predictivo ni de un análisis automatizado.</div></section>
      <section className="panel panel-padding"><h2><FileText size={18}/> Documentos y transparencia</h2><p className="body-copy">Aún no se han vinculado contratos, reportes oficiales ni fuentes documentales para esta obra ficticia.</p><div className="documents-placeholder"><FileText size={27}/><strong>Sin documentos de respaldo</strong><span>En una versión con datos reales, aquí aparecerían enlaces verificables a los PDF de origen y su fecha de consulta.</span></div></section>
      <section className="panel panel-padding"><h2><CircleAlert size={18}/> Cómo interpretar los indicadores</h2><p className="body-copy">El porcentaje ejercido se calcula como recursos ejercidos divididos entre presupuesto aprobado, multiplicado por 100. La brecha física es avance real menos avance programado.</p><p className="body-copy">*El saldo se obtiene restando el monto ejercido al presupuesto aprobado; no necesariamente representa dinero disponible ni compromisos pendientes.</p><Link className="link-inline" href="/analisis">Consultar análisis financiero <ArrowRight size={16}/></Link></section>
    </div>
  </div>;
}
