import Link from "next/link";
import { ArrowLeft, Database, ShieldAlert } from "lucide-react";
import ImportadorObrasOficiales from "../../components/ImportadorObrasOficiales";

export default function DatosOficiales() {
  return <div className="page-wrap">
    <header className="topbar"><div className="breadcrumbs">ObraClara <span>/</span> Datos públicos</div><span className="demo-label"><span className="demo-dot"/> Importación local · etapa 4</span></header>
    <Link className="back-link" href="/"><ArrowLeft size={15}/> Volver al panel</Link>
    <div className="section-heading"><span className="eyebrow">OBRACLARA · TRANSPARENCIA</span><h1><Database size={29} className="oficial-heading-icon"/> Incorporación de datos públicos</h1><p>Prepara registros descargados de fuentes mexicanas, revisa su calidad y mantenlos separados de los datos de demostración.</p></div>
    <div className="notice"><ShieldAlert size={18}/><span><strong>Separación de datos:</strong> el panel principal y las fichas OC-001 a OC-012 siguen siendo ficticios. Los archivos cargados aquí no se publican automáticamente ni se envían al servidor. La fuente indicada queda pendiente de validación humana.</span></div>
    <ImportadorObrasOficiales/>
    <footer className="site-footer">ObraClara · Etapa 4 · El importador no descarga información de terceros ni valida su autenticidad.</footer>
  </div>;
}
