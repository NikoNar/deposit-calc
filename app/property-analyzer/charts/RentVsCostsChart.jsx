"use client";

import { useMemo } from "react";
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const LABELS = {
  en: { rent: "Effective rent", loan: "Loan", maintenance: "Maintenance", tax: "Tax" },
  hy: { rent: "Էֆեկտիվ վարձ", loan: "Վարկ", maintenance: "Սպասարկում", tax: "Հարկ" },
};

function formatAmd(n) {
  if (n == null || Number.isNaN(n)) return "—";
  const abs = Math.round(Math.abs(n));
  if (abs >= 1e6) return (n / 1e6).toFixed(1) + "M";
  return abs.toLocaleString("en-US");
}

export default function RentVsCostsChart({ scenarioResult, form, T, lang }) {
  const data = useMemo(() => {
    const labels = LABELS[lang] || LABELS.en;
    const loan =
      scenarioResult.scenario === "A"
        ? scenarioResult.monthlyPayment || 0
        : scenarioResult.monthlyPaymentAtMax ?? 0;
    const maintenance = form.maintenanceCosts || 0;
    const tax = form.propertyTax || 0;
    const rent = scenarioResult.effectiveRent || 0;
    return [
      { name: labels.rent, value: rent, fill: T.green },
      { name: labels.loan, value: loan, fill: T.accent },
      { name: labels.maintenance, value: maintenance, fill: T.orange },
      { name: labels.tax, value: tax, fill: T.yellow },
    ].filter((d) => d.value > 0 || d.name === labels.rent);
  }, [scenarioResult, form, T, lang]);

  if (data.length === 0) {
    return (
      <div style={{ padding: 24, background: T.surfaceAlt, borderRadius: 8, color: T.textMuted, fontSize: 14 }}>
        {lang === "en" ? "No rental data." : "Վարձակալության տվյալներ չկան:"}
      </div>
    );
  }

  const tooltipStyle = { background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8 };

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: T.textMuted }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10, fill: T.textMuted }} tickFormatter={formatAmd} axisLine={false} tickLine={false} />
        <Tooltip formatter={(v) => [formatAmd(v) + " AMD", ""]} contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
        {data.map((entry, i) => (
          <Cell key={i} fill={entry.fill} />
        ))}
      </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
