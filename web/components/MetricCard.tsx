import type { ReactNode } from "react";

export default function MetricCard({
  title, value, subtitle, icon, tone = "blue",
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: ReactNode;
  tone?: "blue" | "teal" | "amber" | "red" | "purple";
}) {
  return (
    <article className={`metric-card metric-${tone}`}>
      <div className="metric-top"><span className="metric-title">{title}</span><span className="metric-icon">{icon}</span></div>
      <strong className="metric-value">{value}</strong>
      <span className="metric-subtitle">{subtitle}</span>
    </article>
  );
}
