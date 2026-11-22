import Link from "next/link";
import { ArrowUpRight, Scale } from "lucide-react";
import type { Obra } from "../data/obras";
import { millones } from "../lib/format";
import { brechaAvance, porcentajeEjercido } from "../lib/analisis";
import StatusPill from "./StatusPill";

type Props = { obras: Obra[]; onLimpiar: () => void };

export default function ComparadorObras({ obras, onLimpiar }: Props) {
  if (obras.length === 0) return null;
  return (
    <section className="panel compare-panel" aria-label="Comparación de obras">
      <div className="panel-head">
        <div><h2><Scale size={18}/> Comparar proyectos</h2><p>Selecciona de 1 a 3 obras en la tabla. Los valores corresponden a una demostración.</p></div>
        <button className="text-button" type="button" onClick={onLimpiar}>Quitar selección</button>
      </div>
      <div className="comparison-scroll">
        <table className="comparison-table">
          <thead><tr><th>Indicador</th>{obras.map((obra) => <th key={obra.id}>{obra.nombre}<small>{obra.municipio}, {obra.entidad}</small></th>)}</tr></thead>
          <tbody>
            <tr><th>Situación</th>{obras.map((obra) => <td key={obra.id}><StatusPill status={obra.estatus}/></td>)}</tr>
            <tr><th>Presupuesto aprobado</th>{obras.map((obra) => <td key={obra.id}>${millones(obra.presupuesto)}</td>)}</tr>
            <tr><th>Recursos ejercidos</th>{obras.map((obra) => <td key={obra.id}>${millones(obra.ejercido)}</td>)}</tr>
            <tr><th>Presupuesto ejercido</th>{obras.map((obra) => <td key={obra.id}>{porcentajeEjercido(obra).toFixed(1)}%</td>)}</tr>
            <tr><th>Avance físico real</th>{obras.map((obra) => <td key={obra.id}>{obra.avanceReal}%</td>)}</tr>
            <tr><th>Brecha frente a lo programado</th>{obras.map((obra) => <td key={obra.id}>{brechaAvance(obra) > 0 ? "+" : ""}{brechaAvance(obra)} pp</td>)}</tr>
            <tr><th>Consulta</th>{obras.map((obra) => <td key={obra.id}><Link className="link-inline" href={`/obras/${obra.id}`}>Ver ficha <ArrowUpRight size={14}/></Link></td>)}</tr>
          </tbody>
        </table>
      </div>
      <p className="compare-footnote">La diferencia entre avance físico y gasto no demuestra por sí sola una irregularidad; cada proyecto tiene calendarios de pago y ejecución propios.</p>
    </section>
  );
}
