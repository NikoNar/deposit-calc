"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const fmt = (n, sym = "֏") => {
  const abs = Math.round(Math.abs(n));
  if (sym === "֏") return new Intl.NumberFormat("hy-AM", { maximumFractionDigits: 0 }).format(abs) + " ֏";
  if (sym === "$") return "$" + new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(abs);
  if (sym === "€") return "€" + new Intl.NumberFormat("de-DE", { maximumFractionDigits: 0 }).format(abs);
  return abs.toLocaleString();
};

export default function PaymentBreakdownChart({ pieData, T, sym, t, tooltipStyle }) {
  if (!pieData || pieData.length === 0) return null;
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-sub, #57606a)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {t("chart_payment_breakdown")}
      </div>
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
            <span style={{ color: T.textSub }}>{d.label}</span>
            <span style={{ fontWeight: 600, color: T.text }}>{fmt(d.value, sym)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
