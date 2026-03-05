"use client";

import { useMemo } from "react";
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const LABELS = {
  en: { income: "Income", expenses: "Expenses", loan: "Loan payment", surplus: "Surplus" },
  hy: { income: "Եկամուտ", expenses: "Ծախսեր", loan: "Վարկի վճար", surplus: "Մնացորդ" },
};

function formatAmd(n) {
  if (n == null || Number.isNaN(n)) return "—";
  const abs = Math.round(Math.abs(n));
  if (abs >= 1e6) return (n / 1e6).toFixed(1) + "M";
  return abs.toLocaleString("en-US");
}

export default function MonthlyCashflowChart({ scenarioResult, form, T, lang }) {
  const totalIncome = (form.monthlySalary || 0) + (form.additionalIncome || 0);
  const totalExpenses = (form.livingExpenses || 0) + (form.existingLoans || 0) + (form.otherObligations || 0);
  const loanPayment =
    scenarioResult.scenario === "A"
      ? scenarioResult.monthlyPayment || 0
      : scenarioResult.monthlyPaymentAtMax ?? scenarioResult.maxSafeMonthlyPayment ?? 0;

  const data = useMemo(() => {
    const labels = LABELS[lang] || LABELS.en;
    return [
      { name: labels.income, value: totalIncome, fill: T.green },
      { name: labels.expenses, value: totalExpenses, fill: T.orange },
      { name: labels.loan, value: loanPayment, fill: T.accent },
      { name: labels.surplus, value: totalIncome - totalExpenses - loanPayment, fill: totalIncome - totalExpenses - loanPayment >= 0 ? T.green : T.red },
    ].filter((d) => d.value !== 0 || d.name === labels.surplus);
  }, [totalIncome, totalExpenses, loanPayment, T, lang]);

  const tooltipStyle = { background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8 };

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }} layout="vertical" barCategoryGap="20%">
        <XAxis type="number" tick={{ fontSize: 11, fill: T.textMuted }} tickFormatter={formatAmd} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: T.text }} width={100} axisLine={false} tickLine={false} />
        <Tooltip formatter={(v) => [formatAmd(v) + " AMD", ""]} contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
