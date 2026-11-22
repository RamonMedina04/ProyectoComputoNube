"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpenText,
  ChartColumnIncreasing,
  GitBranch,
  LayoutDashboard,
  Landmark,
  MapPinned
} from "lucide-react";

const enlaces = [
  { href: "/", label: "Panel general", icon: LayoutDashboard },
  { href: "/obras", label: "Catálogo de obras", icon: Landmark },
  { href: "/metodologia", label: "Metodología", icon: BookOpenText },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <div className="brand"><span className="brand-icon"><MapPinned size={23}/></span><div><strong>ObraClara</strong><small>Monitoreo ciudadano</small></div></div>
      <div className="sidebar-section-label">NAVEGACIÓN</div>
      <nav className="nav-menu" aria-label="Navegación principal">
        {enlaces.map(({ href, label, icon: Icon }) => {
          const activo = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return <Link key={href} href={href} className={`nav-item ${activo ? "active" : ""}`} aria-current={activo ? "page" : undefined}><Icon size={18}/><span>{label}</span></Link>;
        })}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-glow"><ChartColumnIncreasing size={20}/><strong>Datos para entender, no solo observar.</strong><span>Indicadores claros sobre infraestructura pública en México.</span></div>
        <a className="sidebar-github" href="https://github.com" target="_blank" rel="noreferrer"><GitBranch size={16}/> Proyecto colaborativo</a>
        <small>Prototipo académico · Información ficticia</small>
      </div>
    </aside>
  );
}
