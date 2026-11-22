import type { Metadata } from "next";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import "./etapa2.css";
import "./etapa3.css";
import Sidebar from "../components/Sidebar";

export const metadata: Metadata = {
  title: "ObraClara | Monitor ciudadano de obra pública",
  description: "MVP académico para visualizar proyectos de infraestructura pública de México.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body><div className="app-shell"><Sidebar/><main className="main-area">{children}</main></div></body></html>;
}
