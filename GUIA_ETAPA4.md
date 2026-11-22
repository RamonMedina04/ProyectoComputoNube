# ObraClara — Etapa 4: importación de datos públicos

Esta actualización se diseñó específicamente para la estructura actual del repositorio `ProyectoComputoNube`: Next.js con App Router en `web/app` y TypeScript.

## Qué añade

- Ruta `/datos-oficiales`: importación de archivos CSV a través del navegador (sin backend).
- Selección de columnas, porque cada portal utiliza nombres diferentes.
- Validación de identificadores, fechas, porcentajes, montos y coordenadas.
- Vista previa de registros, advertencias y mapa de México **solo si el CSV incluye coordenadas**.
- Descarga de `obras-oficiales.json` y opción para incorporarlo al repositorio.
- Separación total entre los 12 proyectos ficticios (`web/data/obras.ts`) y los datos importados (`web/data/obras-oficiales.json`).

**Importante:** no se incluye ningún registro oficial en el paquete. El CSV de prueba es **FICTICIO**. Esta etapa no declara que una fuente haya sido verificada ni descarga datos automáticamente.

## 1. Instalar en Codespaces

Desde el explorador de VS Code, sube el archivo `ObraClara_Etapa4_Codespaces.zip` a la raíz del repositorio `ProyectoComputoNube`, **no** dentro de `web`.

En la terminal:

```bash
cd /workspaces/ProyectoComputoNube
git status
unzip -o ObraClara_Etapa4_Codespaces.zip
cd web
npm run build
```

Si termina sin errores:

```bash
npm run dev
```

Abre el puerto 3000 desde la pestaña **Puertos** del Codespace. En el menú verás **Datos públicos**. No se requieren nuevas dependencias.

## 2. Prueba rápida con información ficticia

1. Entra a `/datos-oficiales` y pulsa **Importar CSV**.
2. Carga el archivo `ejemplos/csv-prueba-FICTICIO.csv`.
3. Comprueba que el sistema identifique las columnas automáticamente.
4. Indica la fuente `ARCHIVO DE PRUEBA — NO OFICIAL` y el enlace `https://example.org/datos-ficticios` (solo para probar el formulario).
5. En **Fecha de consulta**, usa la fecha de la prueba.
6. Marca la casilla de confirmación de unidades, porque el ejemplo expresa los montos en pesos.
7. Pulsa **Validar e importar**. Deben aparecer **2 registros aceptados**; el segundo no tiene presupuesto modificado ni coordenadas.
8. Verifica la tabla y el mapa: solo aparecerá un punto, porque el otro registro carece de coordenadas.

**No guardes el JSON de esta prueba en `web/data/obras-oficiales.json` para publicación.** Sería presentar datos simulados como si fueran públicos.

## 3. Incorporar datos públicos auténticos

### Identificar la fuente

Fuentes iniciales para explorar:

- [Obra Pública Abierta — Transparencia Presupuestaria](https://www.transparenciapresupuestaria.gob.mx/Obra-Publica-Abierta): proyectos federales, datos abiertos y diccionarios.
- [Avance de obras en proceso — datos.gob.mx](https://www.datos.gob.mx/dataset/avance_obras_proceso): conjunto de datos sobre avance de obras; comprobar año y cobertura antes de usar.
- [Programa Nacional de Conservación de Carreteras — datos.gob.mx](https://www.datos.gob.mx/dataset/programa_nacional_conservacion_carreteras): información sobre avances de infraestructura carretera.

**No presupongas que cualquiera de los archivos contiene todos los campos.** Lee el diccionario o descripción que acompaña al CSV y verifica sus unidades y periodos.

### Descargar y mapear

1. Descarga el CSV desde el portal correspondiente y, si lo abres en Excel, guárdalo como **CSV UTF-8** sin alterar los identificadores.
2. Si el CSV es muy grande, selecciona un subconjunto verificable (máximo 5,000 filas y 8 MB por prueba).
3. En `/datos-oficiales` selecciónalo y relaciona las columnas. **Identificador** y **nombre** son obligatorios.
4. Vincula presupuesto aprobado y presupuesto modificado a campos distintos. Nunca hagas pasar montos de contratos por gastos ejercidos.
5. Comprueba en el diccionario si los montos están en MXN, miles o millones. El importador solo acepta **MXN** tal como se almacenará; convierte antes de importar si hace falta, dejando constancia del cambio.
6. Captura nombre del conjunto, URL HTTPS real y fecha de consulta.
7. Valida las filas y revisa las incidencias. Un campo inválido se queda vacío, no se sustituye por cero.
8. Contrasta una muestra de filas contra la fuente original antes de publicar.
9. Descarga `obras-oficiales.json` y sustitúyelo en `web/data/obras-oficiales.json` cuando estés satisfecho con su revisión.
10. Ejecuta `npm run build` y actualiza el navegador. En la pestaña **Registros publicados** estarán esos proyectos.

**Importante:** los datos importados **no** entran automáticamente en el dashboard original. Este permanece como demostración, y los registros públicos se muestran en una sección separada para evitar mezclar cifras.

## 4. Archivos nuevos y modificados

```text
ProyectoComputoNube/
├── GUIA_ETAPA4.md                    (nuevo)
├── ejemplos/
│   ├── plantilla-importacion.csv     (nuevo: solo encabezados)
│   └── csv-prueba-FICTICIO.csv       (nuevo: registros inventados para pruebas)
└── web/
    ├── app/
    │   ├── datos-oficiales/page.tsx  (nuevo)
    │   ├── etapa4.css                (nuevo)
    │   └── layout.tsx                (modificado: importa etapa4.css)
    ├── components/
    │   ├── ImportadorObrasOficiales.tsx (nuevo)
    │   ├── MapaObrasOficiales.tsx    (nuevo)
    │   └── Sidebar.tsx               (modificado: nuevo enlace)
    ├── data/
    │   └── obras-oficiales.json      (nuevo: inicialmente vacío [])
    └── lib/
        └── importarObrasCsv.ts       (nuevo)
```

El paquete **no sobrescribe** `web/data/obras.ts`, `web/components/MexicoMap.tsx` ni el dashboard original.

## 5. Qué hace y qué no hace la etapa 4

**Sí:** leer un CSV elegido por la persona, detectar columnas, transformar datos, separar campos, generar advertencias, mostrar registros y un mapa con coordenadas recibidas, exportar JSON reutilizable.

**No:** descargar datos directamente de portales, conectar con Cloud SQL/BigQuery, validar la autenticidad de la fuente, inferir estatus de atraso, inventar coordenadas, cruzar contratos con obras sin clave de correspondencia, o conservar archivos automáticamente en la nube.

Una mejora posterior será automatizar la ingestión de un conjunto específico una vez verificado su formato y términos de uso.

## 6. Guardar la etapa en GitHub

Cuando `npm run build` finalice correctamente, desde la raíz del repositorio:

```bash
cd /workspaces/ProyectoComputoNube
git add web/app/datos-oficiales web/app/etapa4.css web/app/layout.tsx web/components/ImportadorObrasOficiales.tsx web/components/MapaObrasOficiales.tsx web/components/Sidebar.tsx web/data/obras-oficiales.json web/lib/importarObrasCsv.ts ejemplos GUIA_ETAPA4.md
git diff --cached --stat
git commit -m "Agregar importacion y validacion de datos publicos - Etapa 4"
git push origin feature/obraclara-mvp
```

No es necesario incluir en Git los ZIP que descargaste de la conversación.

## 7. Problemas frecuentes

- **El CSV no muestra los encabezados adecuados:** confirma que uses CSV UTF-8 y que la primera fila contenga los nombres de las columnas.
- **La columna que necesitas no aparece:** revisa el archivo de origen y verifica si la información está disponible.
- **No aparece el mapa:** el CSV necesita latitud y longitud numéricas. Sin esos datos, la tabla sigue funcionando.
- **'No reportado' en montos:** indica falta de datos o un valor que no pudo validarse; no equivale a cero.
- **Un valor aparece como inválido:** revisa separadores, moneda, porcentaje o fecha con el diccionario original. El valor `1,234` sin más contexto se considera ambiguo.
- **Se descargó JSON, pero no aparece en 'Registros publicados':** debes copiarlo manualmente a `web/data/obras-oficiales.json` y actualizar/compilar la app.

> Este prototipo académico puede incorporar información oficial, pero la procedencia se declara manualmente y necesita revisión humana antes de presentarse como verificada.
