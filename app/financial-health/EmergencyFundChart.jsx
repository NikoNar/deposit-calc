"use client";

import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

/**
 * Projects emergency fund balance month by month.
 * @param {number} currentFund - Current savings (AMD)
 * @param {number} monthlySavings - Monthly addition (AMD)
 * @param {number} targetAmount - Target amount (AMD)
 * @returns {{ months: number, data: Array<{ month: number, balance: number }> }}
 */
export function projectEmergencyFund(currentFund, monthlySavings, targetAmount) {
  const data = [];
  let balance = currentFund;
  let month = 0;
  const maxMonths = 120;
  while (balance < targetAmount && month <= maxMonths) {
    data.push({ month, balance: Math.round(balance) });
    month += 1;
    balance += monthlySavings;
  }
  data.push({ month, balance: Math.round(Math.min(balance, targetAmount)) });
  return { months: month, data };
}

export default function EmergencyFundChart({ data, T, sym, tooltipLabel }) {
  const chartData = useMemo(
    () => (data || []).map((d) => ({ ...d, name: `${d.month}` })),
    [data]
  );

  if (!chartData.length) return null;

  return (
    <div style={{ width: "100%", height: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: T.textMuted }}
            tickFormatter={(v) => (v % 12 === 0 ? `${v}m` : "")}
          />
          <YAxis
            tick={{ fontSize: 11, fill: T.textMuted }}
            tickFormatter={(v) => (v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : `${(v / 1000).toFixed(0)}k`)}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.[0]) return null;
              const d = payload[0].payload;
              return (
                <div
                  style={{
                    background: T.tooltip,
                    border: `1px solid ${T.border}`,
                    borderRadius: 8,
                    padding: "8px 12px",
                    fontSize: 12,
                    color: T.text,
                  }}
                >
                  {tooltipLabel?.replace("{month}", d.month)} — {sym}{" "}
                  {d.balance >= 1e6 ? `${(d.balance / 1e6).toFixed(2)}M` : d.balance.toLocaleString()}
                </div>
              );
            }}
          />
          <Line
            type="monotone"
            dataKey="balance"
            stroke={T.green}
            strokeWidth={2}
            dot={false}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
