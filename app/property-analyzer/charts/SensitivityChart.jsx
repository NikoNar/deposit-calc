"use client";

import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { calcMonthlyPayment, calcMaxLoanFromPayment } from "../../../lib/propertyAnalyzer.js";

const LABELS = {
  en: { payment: "Monthly payment", affordablePrice: "Affordable price" },
  hy: { payment: "Ամսական վճար", affordablePrice: "Ձեռքբերելի գին" },
};

function formatAmd(n) {
  if (n == null || Number.isNaN(n)) return "—";
  const abs = Math.round(Math.abs(n));
  if (abs >= 1e6) return (n / 1e6).toFixed(1) + "M";
  return abs.toLocaleString("en-US");
}

export default function SensitivityChart({ scenarioResult, form, T, lang }) {
  const rates = [8, 9, 10, 11, 12, 13];
  const term = Math.max(1, Math.min(30, Math.round(Number(form.loanTermYears) || 20)));
  const totalIncome = (form.monthlySalary || 0) + (form.additionalIncome || 0);
  const maxSafePayment = totalIncome * 0.35;
  const downPayment =
    scenarioResult.scenario === "A"
      ? scenarioResult.downPayment
      : scenarioResult.downPayment ?? 0;
  const loanAmountA =
    scenarioResult.scenario === "A" ? scenarioResult.loanAmount : null;

  const data = useMemo(() => {
    const labels = LABELS[lang] || LABELS.en;
    return rates.map((rate) => {
      let monthlyPayment = 0;
      let affordablePrice = 0;
      if (scenarioResult.scenario === "A" && loanAmountA != null && loanAmountA > 0) {
        monthlyPayment = calcMonthlyPayment(loanAmountA, rate, term);
        affordablePrice = 0;
      } else {
        const maxLoan = calcMaxLoanFromPayment(maxSafePayment, rate, term);
        monthlyPayment = maxSafePayment;
        affordablePrice = maxLoan + downPayment;
      }
      return {
        rate: rate + "%",
        rateNum: rate,
        [labels.payment]: Math.round(monthlyPayment),
        [labels.affordablePrice]: Math.round(affordablePrice),
      };
    });
  }, [scenarioResult.scenario, loanAmountA, downPayment, maxSafePayment, term, lang]);

  const labels = LABELS[lang] || LABELS.en;
  const tooltipStyle = { background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8 };

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 24, bottom: 8, left: 8 }}>
        <XAxis dataKey="rate" tick={{ fontSize: 11, fill: T.textMuted }} axisLine={false} tickLine={false} />
        <YAxis
          yAxisId="left"
          tick={{ fontSize: 10, fill: T.textMuted }}
          tickFormatter={formatAmd}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fontSize: 10, fill: T.textMuted }}
          tickFormatter={formatAmd}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          formatter={(v) => [formatAmd(v) + " AMD", ""]}
          contentStyle={tooltipStyle}
          labelFormatter={(l) => (lang === "en" ? "Interest rate: " + l : "Տոկոսադրույք: " + l)}
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey={labels.payment}
          stroke={T.accent}
          strokeWidth={2}
          dot={{ fill: T.accent, r: 4 }}
        />
        {scenarioResult.scenario === "B" && (
          <Line
            yAxisId="right"
            type="monotone"
            dataKey={labels.affordablePrice}
            stroke={T.green}
            strokeWidth={2}
            dot={{ fill: T.green, r: 4 }}
            strokeDasharray="4 4"
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}
