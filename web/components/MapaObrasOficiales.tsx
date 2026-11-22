"use client";
import { useEffect, useRef } from "react";
import type { Map } from "leaflet";
import type { ObraOficial } from "../lib/importarObrasCsv";

export default function MapaObrasOficiales({ obras }: { obras: ObraOficial[] }) {
  const contenedor = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let activo = true;
    let mapa: Map | undefined;
    async function iniciar() {
      const L = await import("leaflet");
      if (!activo || !contenedor.current) return;
      mapa = L.map(contenedor.current, { minZoom: 4, maxZoom: 12, scrollWheelZoom: false, zoomControl: false });
      L.control.zoom({position:"bottomright"}).addTo(mapa);
      mapa.fitBounds([[14.5,-117.5],[32.7,-86.5]], {padding:[14,14]});
      try {
        const res = await fetch("/mexico.geojson");
        if (res.ok && activo && mapa) {
          const geojson = await res.json();
          if (mapa && activo) L.geoJSON(geojson, {style:{color:"#0c8c7c",weight:2,fillColor:"#b6dfcd",fillOpacity:1,interactive:false}}).addTo(mapa);
        }
      } catch { /* Sin contorno, coordenadas siguen disponibles. */ }
      if (!activo || !mapa) return;
      const puntos: [number,number][] = [];
      for (const obra of obras) {
        if (obra.lat === null || obra.lng === null || obra.lat < 14.5 || obra.lat > 32.8 || obra.lng < -118 || obra.lng > -86) continue;
        puntos.push([obra.lat,obra.lng]);
        const marker = L.circleMarker([obra.lat, obra.lng],{radius:7, color:"#fff",weight:2,fillColor:"#187ea6",fillOpacity:.96}).addTo(mapa);
        const contenido = document.createElement("div"); contenido.className="map-popup";
        const titulo = document.createElement("strong"); titulo.textContent = obra.nombre;
        const lugar = document.createElement("span"); lugar.textContent = `${obra.municipio || "Municipio no reportado"}, ${obra.entidad || "Entidad no reportada"}`;
        const fuente = document.createElement("span"); fuente.textContent = `Fuente indicada: ${obra.fuenteNombre} (sin comprobación automática)`;
        contenido.append(titulo,lugar,fuente); marker.bindPopup(contenido);
      }
      if (puntos.length) mapa.fitBounds(L.latLngBounds(puntos),{padding:[30,30],maxZoom:7});
    }
    void iniciar();
    return () => {activo=false; mapa?.remove();};
  },[obras]);
  return <div ref={contenedor} className="oficial-map" aria-label="Mapa de obras con coordenadas oficiales declaradas" role="region"/>;
}
