import { estatusDisponibles } from "../data/obras";
import type { EstadoObra, Obra } from "../data/obras";

const colores: Record<EstadoObra, string> = {
  "En tiempo": "#119f88", "En riesgo": "#e5a23a", "Con retraso": "#dc5b64", Finalizada: "#5576c7",
};

export default function StatusDonut({ obras }: { obras: Obra[] }) {
  const total = obras.length;
  const radio = 41;
  const circunferencia = 2 * Math.PI * radio;
  let acumulado = 0;
  return (
    <div className="donut-body">
      <div className="donut-ring">
        <svg viewBox="0 0 120 120" role="img" aria-label="Gráfica de distribución de obras por estatus">
          <circle cx="60" cy="60" r={radio} fill="none" stroke="#ecf0f3" strokeWidth="17" />
          {estatusDisponibles.map((estado) => {
            const cantidad = obras.filter((obra) => obra.estatus === estado).length;
            const largo = total ? cantidad / total * circunferencia : 0;
            const offset = acumulado;
            acumulado += largo;
            return <circle key={estado} cx="60" cy="60" r={radio} fill="none" stroke={colores[estado]} strokeWidth="17"
              strokeDasharray={`${largo} ${circunferencia - largo}`} strokeDashoffset={-offset}
              transform="rotate(-90 60 60)" />;
          })}
        </svg>
        <div className="donut-center"><strong>{total}</strong><span>obras</span></div>
      </div>
      <div className="donut-legend">
        {estatusDisponibles.map((estado) => <div key={estado}><span className="legend-name"><i style={{background: colores[estado]}} />{estado}</span><strong>{obras.filter((obra)=>obra.estatus === estado).length}</strong></div>)}
      </div>
    </div>
  );
}
