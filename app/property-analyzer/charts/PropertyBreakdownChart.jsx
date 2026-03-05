"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const LABELS = { en: { loan: "Loan", downPayment: "Down payment" }, hy: { loan: "Վարկ", downPayment: "Առաջին մուծում" } };

function formatAmd(n) {
  if (n == null || Number.isNaN(n)) return "—";
  const abs = Math.round(Math.abs(n));
  if (abs >= 1e6) return (n / 1e6).toFixed(1) + "M AMD";
  return abs.toLocaleString("en-US") + " AMD";
}

export default function PropertyBreakdownChart({ scenarioResult, form, T, lang }) {
  const data = useMemo(() => {
    const labels = LABELS[lang] || LABELS.en;
    if (scenarioResult.scenario === "A") {
      const loan = scenarioResult.loanAmount || 0;
      const down = scenarioResult.downPayment || 0;
      if (loan <= 0 && down <= 0) return [];
      return [
        { name: labels.loan, value: loan, color: T.accent },
        { name: labels.downPayment, value: down, color: T.green },
      ].filter((d) => d.value > 0);
    }
    const loan = scenarioResult.maxLoanAmount || 0;
    const down = scenarioResult.downPayment || 0;
    if (loan <= 0 && down <= 0) return [];
    return [
      { name: labels.loan, value: loan, color: T.accent },
      { name: labels.downPayment, value: down, color: T.green },
    ].filter((d) => d.value > 0);
  }, [scenarioResult, T, lang]);

  if (data.length === 0) {
    return (
      <div style={{ padding: 24, background: T.surfaceAlt, borderRadius: 8, color: T.textMuted, fontSize: 14 }}>
        {lang === "en" ? "Enter property price or complete steps to see breakdown." : "Մուտքագրեք գույքի գինը կամ ավարտեք քայլերը:"}
      </div>
    );
  }

  const tooltipStyle = { background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8 };

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={2}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} stroke={T.border} />
          ))}
        </Pie>
        <Tooltip formatter={(v) => [formatAmd(v), ""]} contentStyle={tooltipStyle} />
      </PieChart>
    </ResponsiveContainer>
  );
}
