import Link from "next/link";
export default function NotFound() {
  return <div className="page-wrap not-found"><h1>Proyecto no encontrado</h1><p>No existe una obra con ese identificador en los datos de demostración.</p><Link className="button button-primary" href="/obras">Volver al catálogo</Link></div>;
}
