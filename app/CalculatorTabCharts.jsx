"use client";

import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const fmt = (n, sym = "֏") => {
  const abs = Math.round(Math.abs(n));
  const sign = n < 0 ? "−" : "";
  if (sym === "֏") return sign + new Intl.NumberFormat("hy-AM", { maximumFractionDigits: 0 }).format(abs) + " ֏";
  if (sym === "$") return sign + "$" + new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(abs);
  if (sym === "€") return sign + "€" + new Intl.NumberFormat("de-DE", { maximumFractionDigits: 0 }).format(abs);
  return sign + abs.toLocaleString();
};
const fmtShort = (n) => {
  if (Math.abs(n) >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (Math.abs(n) >= 1000) return (n / 1000).toFixed(0) + "K";
  return Math.round(n).toString();
};

function SectionTitle({ T, children }) {
  return (
    <div style={{ fontSize: 13, fontWeight: 600, color: T.textSub, marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.05em" }}>
      {children}
    </div>
  );
}

export default function CalculatorTabCharts({
  lineData,
  pieData,
  yearlyRows,
  inflationRate,
  T,
  sym,
  t,
  tooltipStyle,
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, marginTop: 20 }}>
      <div style={{ gridColumn: "1 / -1" }}>
        <SectionTitle T={T}>{t("charts_growth_title")}</SectionTitle>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={lineData} margin={{ top: 8, right: 24, bottom: 4, left: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: T.textMuted }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: T.textMuted }} tickFormatter={fmtShort} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(v, n) => [fmt(v, sym), n === "Balance" ? t("line_balance") : n === "Contributed" ? t("line_contributed") : t("line_real_value")]}
              contentStyle={tooltipStyle}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="Balance" name={t("line_balance")} stroke={T.yellow} strokeWidth={2.5} dot={{ fill: T.yellow, r: 4, strokeWidth: 0 }} />
            <Line type="monotone" dataKey="Contributed" name={t("line_contributed")} stroke={T.accent} strokeWidth={2} dot={{ fill: T.accent, r: 4, strokeWidth: 0 }} strokeDasharray="6 4" />
            {inflationRate > 0 && (
              <Line type="monotone" dataKey="Real Value" name={t("line_real_value")} stroke={T.orange} strokeWidth={2} dot={{ fill: T.orange, r: 3, strokeWidth: 0 }} strokeDasharray="3 3" />
            )}
          </LineChart>
        </ResponsiveContainer>
        {inflationRate === 0 && (
          <p style={{ fontSize: 11, color: T.textMuted, marginTop: 8 }}>{t("charts_tip")}</p>
        )}
      </div>

      <div>
        <SectionTitle T={T}>{t("charts_composition")}</SectionTitle>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={36}
              dataKey="value"
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              labelLine={false}
              style={{ fontSize: 11 }}
            >
              {pieData.map((e, i) => (
                <Cell key={i} fill={e.color} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => fmt(v, sym)} contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 8 }}>
          {pieData.map((d) => (
            <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: d.color, display: "inline-block", flexShrink: 0 }} />
              <span style={{ color: T.textSub }}>{t(d.nameT)}:</span>
              <span style={{ fontWeight: 600, color: T.text }}>{fmt(d.value, sym)}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionTitle T={T}>{t("charts_net_per_year")}</SectionTitle>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={yearlyRows.map((r) => ({
              name: `Y${r.year}`,
              netInterest: Math.round(r.yearInterestNet),
              tax: Math.round(r.yearInterestGross - r.yearInterestNet),
            }))}
            barSize={28}
          >
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: T.textMuted }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: T.textMuted }} tickFormatter={fmtShort} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(v, n, { dataKey }) => [fmt(v, sym), dataKey === "netInterest" ? t("pie_net_interest") : t("pie_tax_paid")]}
              contentStyle={tooltipStyle}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="netInterest" stackId="a" fill={T.green} name={t("pie_net_interest")} />
            <Bar dataKey="tax" stackId="a" fill={T.red} radius={[4, 4, 0, 0]} name={t("pie_tax_paid")} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
