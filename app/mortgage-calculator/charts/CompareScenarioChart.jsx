"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

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

export default function CompareScenarioChart({ lineData, T, sym, t, tooltipStyle }) {
  if (!lineData || lineData.length === 0) return null;
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-sub, #57606a)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {t("chart_compare_balance")}
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={lineData} margin={{ top: 8, right: 24, bottom: 4, left: 0 }}>
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: T.textMuted }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: T.textMuted }} tickFormatter={fmtShort} axisLine={false} tickLine={false} />
          <Tooltip formatter={(v, name) => [fmt(v, sym), name]} contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line type="monotone" dataKey="balanceA" name={t("compare_scenario_a")} stroke={T.accent} strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="balanceB" name={t("compare_scenario_b")} stroke={T.green} strokeWidth={2} dot={false} strokeDasharray="5 5" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
