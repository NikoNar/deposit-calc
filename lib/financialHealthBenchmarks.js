/**
 * Armenian benchmarks for Financial Health Check.
 * Single source of truth for contextual scoring and comparisons.
 * Values in AMD unless noted.
 */
export const BENCHMARKS = {
  /** Average monthly net salary in Armenia (AMD) */
  averageMonthlySalary: 350000,
  /** Average monthly rent — Yerevan (AMD) */
  averageRentYerevan: 250000,
  /** Average monthly rent — regions (AMD) */
  averageRentRegions: 120000,
  /** National average rent (simplified single value) */
  averageRentNational: 200000,
  /** Typical mortgage rate p.a. (percent) */
  averageMortgageRatePct: 14,
  /** Safe debt-to-income ratio (e.g. keep DTI below this) */
  safeDtiRatio: 0.35,
  /** Recommended emergency fund: min months of expenses */
  emergencyFundMonthsMin: 3,
  /** Recommended emergency fund: strong target months */
  emergencyFundMonthsStrong: 6,
  /** Typical savings rate considered "average" in context (e.g. 10%) */
  averageSavingsRatePct: 10,
};

export default BENCHMARKS;
