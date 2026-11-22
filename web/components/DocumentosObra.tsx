import Link from "next/link";
import { ArrowUpRight, FileText, Info } from "lucide-react";
import { documentosDeObra } from "../data/documentos";
import { fecha } from "../lib/format";

export default function DocumentosObra({ obraId }: { obraId: string }) {
  const documentos = documentosDeObra(obraId);
  return <section className="panel panel-padding doc-detail-section">
    <h2><FileText size={18}/> Documentos y transparencia</h2>
    <p className="panel-desc">Documentos descargables generados a partir de los datos de prueba de esta obra.</p>
    <div className="doc-alert"><Info size={18}/><span><strong>No oficiales.</strong> Estos PDF son ejemplos académicos: no contienen contratos ni reportes reales.</span></div>
    <div className="doc-detail-list">
      {documentos.map((documento) => <div className="doc-detail-item" key={documento.id}>
        <span className="doc-file-icon"><FileText size={19}/></span>
        <div className="doc-detail-copy"><strong>{documento.titulo}</strong><small>{documento.tipo} · {fecha(documento.fechaDocumento)} · Demostración</small></div>
        <a className="doc-action" href={documento.archivo} target="_blank" rel="noopener noreferrer" aria-label={`Abrir ${documento.titulo}`}><ArrowUpRight size={16}/> Abrir PDF</a>
      </div>)}
    </div>
    <Link className="link-inline" href="/documentos">Consultar biblioteca documental <ArrowUpRight size={16}/></Link>
  </section>;
}
