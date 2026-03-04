/**
 * Rules engine for Financial Health Check.
 * Thresholds and bands for the 5 pillars; used by scoring and action-plan logic.
 */

/** Savings rate bands: [minPct, maxPct, label, scoreWeight 0-1] */
export const SAVINGS_RATE_BANDS = [
  { min: 0, max: 5, labelKey: "risky", scoreRatio: 0 },
  { min: 5, max: 15, labelKey: "average", scoreRatio: 0.4 },
  { min: 15, max: 25, labelKey: "strong", scoreRatio: 0.75 },
  { min: 25, max: 100, labelKey: "excellent", scoreRatio: 1 },
];

/** Emergency fund (months of expenses): [minMonths, maxMonths, labelKey, scoreRatio 0-1] */
export const EMERGENCY_FUND_BANDS = [
  { min: 0, max: 1, labelKey: "critical", scoreRatio: 0 },
  { min: 1, max: 3, labelKey: "weak", scoreRatio: 0.33 },
  { min: 3, max: 6, labelKey: "healthy", scoreRatio: 0.85 },
  { min: 6, max: 999, labelKey: "strong", scoreRatio: 1 },
];

/** Debt-to-income ratio (DTI): [minRatio, maxRatio, labelKey, scoreRatio 0-1] — lower DTI = better */
export const DTI_BANDS = [
  { min: 0.5, max: 1, labelKey: "dangerous", scoreRatio: 0 },
  { min: 0.35, max: 0.5, labelKey: "highRisk", scoreRatio: 0.25 },
  { min: 0.2, max: 0.35, labelKey: "moderate", scoreRatio: 0.6 },
  { min: 0, max: 0.2, labelKey: "healthy", scoreRatio: 1 },
];

/** Liquidity: liquid assets / monthly essential expenses (months equivalent). Same band idea as emergency. */
export const LIQUIDITY_BANDS = [
  { min: 0, max: 1, labelKey: "critical", scoreRatio: 0 },
  { min: 1, max: 3, labelKey: "weak", scoreRatio: 0.4 },
  { min: 3, max: 6, labelKey: "healthy", scoreRatio: 0.85 },
  { min: 6, max: 999, labelKey: "strong", scoreRatio: 1 },
];

/** Stability buffer: (income - essential - loanPayment) / essential. Higher = more buffer. */
export const STABILITY_BUFFER_BANDS = [
  { min: 0, max: 0.1, labelKey: "critical", scoreRatio: 0 },
  { min: 0.1, max: 0.3, labelKey: "weak", scoreRatio: 0.35 },
  { min: 0.3, max: 0.6, labelKey: "moderate", scoreRatio: 0.7 },
  { min: 0.6, max: 999, labelKey: "healthy", scoreRatio: 1 },
];

/** Max points per pillar (total 100) */
export const PILLAR_POINTS = {
  emergencyFund: 30,
  debtBurden: 25,
  savingsRate: 20,
  liquidity: 15,
  stability: 10,
};

/** Emotional status by total score */
export const STATUS_BANDS = [
  { min: 90, max: 100, labelKey: "financialFortress" },
  { min: 70, max: 89, labelKey: "stable" },
  { min: 50, max: 69, labelKey: "vulnerable" },
  { min: 30, max: 49, labelKey: "atRisk" },
  { min: 0, max: 29, labelKey: "critical" },
];

export function getBand(value, bands) {
  for (let i = 0; i < bands.length; i++) {
    const b = bands[i];
    if (value >= b.min && value < b.max) return b;
  }
  return bands[bands.length - 1];
}

export function getStatusBand(totalScore) {
  for (const b of STATUS_BANDS) {
    if (totalScore >= b.min && totalScore <= b.max) return b;
  }
  return STATUS_BANDS[STATUS_BANDS.length - 1];
}
