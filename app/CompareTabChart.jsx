"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

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

export default function CompareTabChart({ yearsA, yearsB, cmpResultA, cmpResultB, T, sym, t, tooltipStyle, card }) {
  const data = Array.from({ length: Math.max(yearsA, yearsB) }, (_, i) => {
    const ya = cmpResultA.yearlyRows[i];
    const yb = cmpResultB.yearlyRows[i];
    return {
      name: `Y${i + 1}`,
      A: ya ? Math.round(ya.balance) : null,
      B: yb ? Math.round(yb.balance) : null,
    };
  });

  return (
    <div style={{ ...card }}>
      <SectionTitle T={T}>{t("compare_by_year")}</SectionTitle>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barGap={4}>
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: T.textMuted }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: T.textMuted }} tickFormatter={fmtShort} axisLine={false} tickLine={false} />
          <Tooltip
            formatter={(v, n, { dataKey }) => [fmt(v, sym), dataKey === "A" ? t("scenario_a") : t("scenario_b")]}
            contentStyle={tooltipStyle}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: T.textSub }} />
          <Bar dataKey="A" fill={T.accent} radius={[4, 4, 0, 0]} name={t("scenario_a")} />
          <Bar dataKey="B" fill={T.yellow} radius={[4, 4, 0, 0]} name={t("scenario_b")} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
