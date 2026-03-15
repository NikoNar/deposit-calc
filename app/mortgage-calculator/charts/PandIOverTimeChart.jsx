"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const fmt = (n, sym = "֏") => {
  const abs = Math.round(Math.abs(n));
  if (sym === "֏") return new Intl.NumberFormat("hy-AM", { maximumFractionDigits: 0 }).format(abs) + " ֏";
  if (sym === "$") return "$" + new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(abs);
  if (sym === "€") return "€" + new Intl.NumberFormat("de-DE", { maximumFractionDigits: 0 }).format(abs);
  return abs.toLocaleString();
};
const fmtShort = (n) => {
  if (Math.abs(n) >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (Math.abs(n) >= 1000) return (n / 1000).toFixed(0) + "K";
  return Math.round(n).toString();
};

const INTERVAL_YEARS = [1, 5, 10, 15, 20, 25, 30];

export default function PandIOverTimeChart({ schedule, T, sym, t, tooltipStyle }) {
  if (!schedule || schedule.length === 0) return null;

  const termYears = Math.ceil(schedule.length / 12);
  const yearsToShow = INTERVAL_YEARS.filter((y) => y <= termYears);
  if (yearsToShow.length === 0) return null;

  const data = yearsToShow.map((year) => {
    const monthIndex = year * 12 - 1;
    const row = schedule[monthIndex];
    if (!row) return { name: `${t("chart_interval_year")} ${year}`, principal: 0, interest: 0 };
    return {
      name: `${t("chart_interval_year")} ${year}`,
      principal: row.principal,
      interest: row.interest,
    };
  });

  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-sub, #57606a)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {t("chart_pi_over_time_title")}
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 8, right: 24, bottom: 24, left: 0 }} barSize={32}>
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: T.textMuted }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: T.textMuted }} tickFormatter={fmtShort} axisLine={false} tickLine={false} />
          <Tooltip
            formatter={(v, name, props) => {
              const dataKey = props?.dataKey ?? name;
              const label = dataKey === "principal" ? t("principal") : t("interest");
              return [fmt(v, sym), label];
            }}
            contentStyle={tooltipStyle}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="interest" name={t("interest")} stackId="a" fill={T.orange} radius={[0, 0, 0, 0]} />
          <Bar dataKey="principal" name={t("principal")} stackId="a" fill={T.accent} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
