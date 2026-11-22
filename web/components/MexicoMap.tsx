"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";
import type { Obra, EstadoObra } from "../data/obras";

const colores: Record<EstadoObra, string> = {
  "En tiempo": "#119f88",
  "En riesgo": "#e5a23a",
  "Con retraso": "#dc5b64",
  Finalizada: "#5576c7",
};

/** Leaflet se importa en el navegador, nunca durante renderizado en servidor. */
export default function MexicoMap({ obras }: { obras: Obra[] }) {
  const contenedor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let activo = true;
    let mapa: LeafletMap | undefined;

    async function iniciar() {
      const L = await import("leaflet");
      if (!activo || !contenedor.current) return;

      mapa = L.map(contenedor.current, {
        zoomControl: false,
        scrollWheelZoom: false,
        minZoom: 4,
        maxZoom: 12,
        maxBounds: [[11.4, -121.5], [34.1, -84.2]],
        maxBoundsViscosity: 0.85,
      });
      // L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      //   maxZoom: 19,
      //   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      // }).addTo(mapa);
      L.control.zoom({ position: "bottomright" }).addTo(mapa);
      mapa.fitBounds([[14.5, -117.5], [32.7, -86.5]], { padding: [16, 16] });

      // Resaltamos solo el territorio de México con un contorno local.
      // Datos cartográficos de Natural Earth (dominio público).
      try {
        const respuesta = await fetch("/mexico.geojson");
        if (respuesta.ok) {
          const contorno = await respuesta.json();
          if (!activo || !mapa) return;
          L.geoJSON(contorno, {
            style: {
              interactive: false,
              color: "#0c8c7c",
              weight: 2.3,
              fillColor: "#a6d8c1",
              fillOpacity: 1
            },
          }).addTo(mapa);
        }
      } catch {
        // Si no se encuentra el contorno, el mapa y los marcadores siguen funcionando.
      }
      if (!activo || !mapa) return;
      obras.forEach((obra) => {
        if (!mapa) return;
        const marker = L.circleMarker([obra.lat, obra.lng], {
          radius: 9,
          color: "#ffffff", weight: 2.5,
          fillColor: colores[obra.estatus], fillOpacity: 0.95,
        }).addTo(mapa);
        const cont = document.createElement("div");
        cont.className = "map-popup";
        const titulo = document.createElement("strong");
        titulo.textContent = obra.nombre;
        const ubicacion = document.createElement("span");
        ubicacion.textContent = `${obra.municipio}, ${obra.entidad} · ${obra.estatus}`;
        const enlace = document.createElement("a");
        enlace.href = `/obras/${encodeURIComponent(obra.id)}`;
        enlace.textContent = "Consultar obra →";
        cont.append(titulo, ubicacion, enlace);
        marker.bindPopup(cont, { maxWidth: 260 });
        marker.bindTooltip(obra.nombre);
      });
    }
    void iniciar();
    return () => { activo = false; mapa?.remove(); };
  }, [obras]);

  return <div ref={contenedor} className="mexico-map" role="region" aria-label="Mapa interactivo de obras en México" />;
}
