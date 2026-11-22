import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Obra } from "../data/obras";
import { millones } from "../lib/format";
import StatusPill from "./StatusPill";

export default function ProjectsTable({ obras, emptyText = "No se encontraron obras con esos filtros." }: { obras: Obra[]; emptyText?: string }) {
  if (!obras.length) return <div className="empty-state">{emptyText}</div>;
  return (
    <div className="table-scroll"><table className="projects-table">
      <thead><tr><th>OBRA / UBICACIÓN</th><th>PRESUPUESTO</th><th>AVANCE FÍSICO</th><th>ESTATUS</th><th aria-label="Consultar"/></tr></thead>
      <tbody>{obras.map((obra) => <tr key={obra.id}>
        <td><Link className="project-link" href={`/obras/${obra.id}`}>{obra.nombre}</Link><span className="table-location">{obra.municipio}, {obra.entidad}</span></td>
        <td className="table-number">${millones(obra.presupuesto)}</td>
        <td><div className="progress-table"><div className="progress-track"><div className="progress-fill" style={{width: `${obra.avanceReal}%`}}/></div><strong>{obra.avanceReal}%</strong></div></td>
        <td><StatusPill status={obra.estatus}/></td>
        <td><Link className="table-action" href={`/obras/${obra.id}`} aria-label={`Ver ${obra.nombre}`}><ArrowUpRight size={18}/></Link></td>
      </tr>)}</tbody>
    </table></div>
  );
}
