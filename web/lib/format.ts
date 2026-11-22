export const pesos = (valor: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(valor);

export const millones = (valor: number) =>
  `${new Intl.NumberFormat("es-MX", { maximumFractionDigits: 1 }).format(valor / 1_000_000)} M`;

export const fecha = (valor: string) =>
  new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${valor}T12:00:00Z`));

export const porcentaje = (valor: number) => `${Math.round(valor)}%`;
