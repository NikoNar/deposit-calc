import { BENCHMARKS } from "./financialHealthBenchmarks.js";
import {
  PILLAR_POINTS,
  getBand,
  getStatusBand,
  SAVINGS_RATE_BANDS,
  EMERGENCY_FUND_BANDS,
  DTI_BANDS,
  LIQUIDITY_BANDS,
  STABILITY_BUFFER_BANDS,
} from "./financialHealthRules.js";

/**
 * @typedef {Object} HealthInputs
 * @property {number} monthlyIncome - Monthly net income (AMD)
 * @property {number} essentialExpenses - Monthly essential expenses (AMD)
 * @property {number} optionalExpenses - Monthly optional expenses (AMD)
 * @property {number} totalSavings - Current total savings (cash + deposits) (AMD)
 * @property {number} monthlySavings - Monthly savings amount (AMD)
 * @property {number} totalLoans - Total outstanding loans (AMD)
 * @property {number} monthlyLoanPayment - Monthly loan payment (AMD)
 */

/**
 * Computes the full health score and pillar breakdown.
 * @param {HealthInputs} inputs
 * @param {typeof BENCHMARKS} [benchmarks]
 * @returns {{ totalScore: number, breakdown: Object, metrics: Object, statusBand: Object }}
 */
export function computeHealthScore(inputs, benchmarks = BENCHMARKS) {
  const {
    monthlyIncome,
    essentialExpenses,
    optionalExpenses,
    totalSavings,
    monthlySavings,
    monthlyLoanPayment,
  } = inputs;

  const essential = essentialExpenses || 0;
  const income = monthlyIncome || 0;

  // Emergency fund: months of essential expenses covered by savings
  const emergencyMonths = essential > 0 ? totalSavings / essential : 0;
  const emergencyBand = getBand(emergencyMonths, EMERGENCY_FUND_BANDS);
  const emergencyPoints = Math.round(PILLAR_POINTS.emergencyFund * emergencyBand.scoreRatio);

  // Debt-to-income
  const dti = income > 0 ? monthlyLoanPayment / income : 0;
  const dtiBand = getBand(dti, DTI_BANDS);
  const debtPoints = Math.round(PILLAR_POINTS.debtBurden * dtiBand.scoreRatio);

  // Savings rate (percent)
  const savingsRatePct = income > 0 ? (monthlySavings / income) * 100 : 0;
  const savingsBand = getBand(savingsRatePct, SAVINGS_RATE_BANDS);
  const savingsPoints = Math.round(PILLAR_POINTS.savingsRate * savingsBand.scoreRatio);

  // Liquidity: same as emergency months (liquid assets / essential expenses)
  const liquidityMonths = emergencyMonths;
  const liquidityBand = getBand(liquidityMonths, LIQUIDITY_BANDS);
  const liquidityPoints = Math.round(PILLAR_POINTS.liquidity * liquidityBand.scoreRatio);

  // Stability buffer: (income - essential - loanPayment) / essential
  const discretionaryAfterDebt = income - essential - (monthlyLoanPayment || 0);
  const stabilityRatio = essential > 0 ? discretionaryAfterDebt / essential : 0;
  const stabilityBand = getBand(Math.max(0, stabilityRatio), STABILITY_BUFFER_BANDS);
  const stabilityPoints = Math.round(PILLAR_POINTS.stability * stabilityBand.scoreRatio);

  const totalScore = Math.min(100, emergencyPoints + debtPoints + savingsPoints + liquidityPoints + stabilityPoints);

  const breakdown = {
    emergencyFund: { points: emergencyPoints, max: PILLAR_POINTS.emergencyFund, band: emergencyBand },
    debtBurden: { points: debtPoints, max: PILLAR_POINTS.debtBurden, band: dtiBand },
    savingsRate: { points: savingsPoints, max: PILLAR_POINTS.savingsRate, band: savingsBand },
    liquidity: { points: liquidityPoints, max: PILLAR_POINTS.liquidity, band: liquidityBand },
    stability: { points: stabilityPoints, max: PILLAR_POINTS.stability, band: stabilityBand },
  };

  const metrics = {
    emergencyMonths,
    dti: dti * 100,
    savingsRatePct,
    liquidityMonths,
    stabilityRatio,
    essentialExpenses: essential,
  };

  const statusBand = getStatusBand(totalScore);

  return {
    totalScore,
    breakdown,
    metrics,
    statusBand,
    benchmarks,
  };
}

/**
 * Generates a short ordered list of action items from the score result.
 * @param {{ breakdown: Object, metrics: Object }} result - Return value from computeHealthScore
 * @param {typeof BENCHMARKS} benchmarks
 * @returns {Array<{ actionKey: string, priority: number }>}
 */
export function getActionPlan(result, benchmarks = BENCHMARKS) {
  const actions = [];
  const { breakdown, metrics } = result;
  const essential = metrics.essentialExpenses || 0;

  // Emergency fund weak or critical
  if (breakdown.emergencyFund.band.scoreRatio < 0.85 && metrics.emergencyMonths < benchmarks.emergencyFundMonthsStrong) {
    const targetMonths = benchmarks.emergencyFundMonthsStrong;
    const targetAmount = Math.ceil(targetMonths * (essential || 0));
    actions.push({ actionKey: "action_emergency_fund", priority: 1, params: { targetMonths, targetAmount } });
  }

  // Debt high risk or dangerous
  if (breakdown.debtBurden.band.scoreRatio <= 0.6) {
    actions.push({ actionKey: "action_avoid_new_loans", priority: 2 });
  }

  // Savings rate low
  if (breakdown.savingsRate.band.scoreRatio < 0.75) {
    actions.push({ actionKey: "action_increase_savings", priority: 3 });
  }

  // General tip: high-yield deposits
  if (metrics.savingsRatePct > 0) {
    actions.push({ actionKey: "action_high_yield_deposits", priority: 4 });
  }

  return actions.sort((a, b) => a.priority - b.priority).slice(0, 4);
}
