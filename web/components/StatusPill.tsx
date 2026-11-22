import type { EstadoObra } from "../data/obras";

const nombres: Record<EstadoObra, string> = {
  "En tiempo": "status-on-time",
  "En riesgo": "status-risk",
  "Con retraso": "status-delayed",
  Finalizada: "status-finished",
};

export default function StatusPill({ status }: { status: EstadoObra }) {
  return <span className={`status-pill ${nombres[status]}`}><span className="status-dot" />{status}</span>;
}
