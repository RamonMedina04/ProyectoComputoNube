import type { Obra } from "../data/obras";
import { millones } from "../lib/format";

export default function BudgetBars({ obras }: { obras: Obra[] }) {
  const top = [...obras].sort((a,b) => b.presupuesto - a.presupuesto).slice(0, 5);
  const max = Math.max(...top.map((obra) => obra.presupuesto), 1);
  return <div className="budget-chart">
    <div className="chart-legend"><span><i className="legend-budget"/> Presupuesto</span><span><i className="legend-spent"/> Ejercido</span></div>
    {top.length ? top.map((obra) => <div className="budget-row" key={obra.id}>
      <div className="budget-label"><span title={obra.nombre}>{obra.municipio}</span><small>${millones(obra.presupuesto)}</small></div>
      <div className="budget-bars"><div className="budget-bg" style={{width:`${obra.presupuesto / max * 100}%`}}></div><div className="budget-spent" style={{width:`${obra.ejercido / max * 100}%`}}></div></div>
    </div>) : <div className="empty-state">Sin datos para mostrar.</div>}
  </div>;
}
