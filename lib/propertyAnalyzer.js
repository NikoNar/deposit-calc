/**
 * Property Affordability & Rental Investment Analyzer — calculation logic.
 * Pure functions; no React.
 */

/**
 * Monthly payment (annuity) for a loan.
 * @param {number} loanAmount - Principal (AMD)
 * @param {number} annualRatePct - Annual interest rate (e.g. 10)
 * @param {number} termYears - Loan term in years
 * @returns {number} Monthly payment (AMD)
 */
export function calcMonthlyPayment(loanAmount, annualRatePct, termYears) {
  if (loanAmount <= 0) return 0;
  const months = Math.max(1, Math.round(termYears * 12));
  const monthlyRate = annualRatePct / 100 / 12;
  if (monthlyRate <= 0) return loanAmount / months;
  const factor = Math.pow(1 + monthlyRate, months);
  return (loanAmount * monthlyRate * factor) / (factor - 1);
}

/**
 * Maximum loan amount that can be serviced with a given monthly payment.
 * @param {number} maxMonthlyPayment - Max payment (AMD)
 * @param {number} annualRatePct - Annual interest rate (e.g. 10)
 * @param {number} termYears - Loan term in years
 * @returns {number} Max loan amount (AMD)
 */
export function calcMaxLoanFromPayment(maxMonthlyPayment, annualRatePct, termYears) {
  if (maxMonthlyPayment <= 0) return 0;
  const months = Math.max(1, Math.round(termYears * 12));
  const monthlyRate = annualRatePct / 100 / 12;
  if (monthlyRate <= 0) return maxMonthlyPayment * months;
  const factor = Math.pow(1 + monthlyRate, months);
  return (maxMonthlyPayment * (factor - 1)) / (monthlyRate * factor);
}

const SAFE_DEBT_RATIO = 0.35;

/**
 * Compute scenario A (known property price) or B (unknown — max affordable).
 * @param {Object} inputs - Form + totalIncome, totalExpenses, totalSavings, totalDownPayment
 * @returns {Object|null} Scenario result with scenario 'A'|'B', monthlyPayment, downPayment, rental metrics, etc.
 */
export function computeScenario(inputs) {
  const {
    totalIncome,
    totalSavings,
    totalDownPayment,
    interestRate = 10,
    loanTermYears = 20,
    minDownPaymentPct = 20,
    propertyPrice = null,
    planToRent = false,
    expectedRent = 0,
    maintenanceCosts = 0,
    propertyTax = 0,
    vacancyRatePct = 0,
  } = inputs;

  const rate = Number(interestRate) || 0;
  const term = Math.max(1, Math.min(30, Math.round(Number(loanTermYears) || 20)));
  const minPct = Math.max(10, Math.min(50, Number(minDownPaymentPct) || 20)) / 100;
  const income = Number(totalIncome) || 0;
  const downPayment = Number(totalDownPayment) || 0;

  const maxSafeMonthlyPayment = income * SAFE_DEBT_RATIO;

  if (propertyPrice != null && propertyPrice > 0) {
    // Scenario A: known property price
    const price = Number(propertyPrice);
    const minDown = price * minPct;
    const actualDown = Math.min(Math.max(minDown, downPayment), price, totalSavings);
    const loanAmount = Math.max(0, price - actualDown);
    const monthlyPayment = calcMonthlyPayment(loanAmount, rate, term);

    let effectiveRent = 0;
    let totalCosts = monthlyPayment + (Number(maintenanceCosts) || 0) + (Number(propertyTax) || 0);
    let monthlyProfit = 0;
    let coverageRatio = 0;
    let annualYieldPct = 0;

    if (planToRent && expectedRent > 0) {
      const vac = (Number(vacancyRatePct) || 0) / 100;
      effectiveRent = expectedRent * (1 - vac);
      monthlyProfit = effectiveRent - totalCosts;
      coverageRatio = totalCosts > 0 ? effectiveRent / totalCosts : 0;
      annualYieldPct = price > 0 ? (monthlyProfit * 12 / price) * 100 : 0;
    }

    return {
      scenario: "A",
      propertyPrice: price,
      downPayment: actualDown,
      loanAmount,
      monthlyPayment,
      maxSafeMonthlyPayment,
      debtRatioPct: income > 0 ? (monthlyPayment / income) * 100 : 0,
      planToRent,
      effectiveRent,
      totalCosts,
      monthlyProfit,
      coverageRatio,
      annualYieldPct,
    };
  }

  // Scenario B: unknown property price — max affordable
  const maxLoan = calcMaxLoanFromPayment(maxSafeMonthlyPayment, rate, term);
  const affordablePrice = maxLoan + downPayment;
  const recommendedMin = affordablePrice * 0.9;
  const recommendedMax = affordablePrice;

  // Required rent to cover costs if they took max loan at affordable price
  const monthlyPaymentAtMax = calcMonthlyPayment(maxLoan, rate, term);
  const totalCostsAtMax = monthlyPaymentAtMax + (Number(maintenanceCosts) || 0) + (Number(propertyTax) || 0);
  const requiredRentToCover = totalCostsAtMax;

  let effectiveRent = 0;
  let totalCosts = totalCostsAtMax;
  let monthlyProfit = 0;
  let coverageRatio = 0;
  let annualYieldPct = 0;

  if (planToRent && expectedRent > 0) {
    const vac = (Number(vacancyRatePct) || 0) / 100;
    effectiveRent = expectedRent * (1 - vac);
    monthlyProfit = effectiveRent - totalCosts;
    coverageRatio = totalCosts > 0 ? effectiveRent / totalCosts : 0;
    annualYieldPct = affordablePrice > 0 ? (monthlyProfit * 12 / affordablePrice) * 100 : 0;
  }

  return {
    scenario: "B",
    propertyPrice: null,
    affordablePrice,
    recommendedPriceRange: { min: recommendedMin, max: recommendedMax },
    maxLoanAmount: maxLoan,
    downPayment,
    monthlyPayment: null,
    maxSafeMonthlyPayment,
    loanAmountAtMax: maxLoan,
    monthlyPaymentAtMax,
    requiredRentToCover,
    debtRatioPct: income > 0 ? (monthlyPaymentAtMax / income) * 100 : 0,
    planToRent,
    effectiveRent,
    totalCosts,
    monthlyProfit,
    coverageRatio,
    annualYieldPct,
  };
}

const HEALTH_BANDS = [
  { min: 80, max: 100, band: "Excellent" },
  { min: 60, max: 79, band: "Good" },
  { min: 40, max: 59, band: "Risky" },
  { min: 0, max: 39, band: "Dangerous" },
];

function getHealthBand(score) {
  const s = Math.max(0, Math.min(100, score));
  for (const b of HEALTH_BANDS) {
    if (s >= b.min && s <= b.max) return b.band;
  }
  return "Dangerous";
}

/**
 * Compute property investment health score (0–100) and band.
 * @param {Object} params - totalIncome, monthlyPayment, downPayment, propertyPrice, planToRent, monthlyProfit, expectedRent, coverageRatio
 * @returns {{ score: number, band: string, breakdown: Object }}
 */
export function computePropertyHealthScore(params) {
  const {
    totalIncome = 0,
    monthlyPayment = 0,
    downPayment = 0,
    propertyPrice = 0,
    planToRent = false,
    monthlyProfit = 0,
    expectedRent = 0,
    coverageRatio = 0,
  } = params;

  let debtPoints = 25;
  const dti = totalIncome > 0 ? monthlyPayment / totalIncome : 0;
  if (dti <= 0.35) debtPoints = 25;
  else if (dti <= 0.45) debtPoints = 18;
  else if (dti <= 0.5) debtPoints = 10;
  else debtPoints = 2;

  let savingsPoints = 25;
  const downPct = propertyPrice > 0 ? downPayment / propertyPrice : 0;
  if (downPct >= 0.3) savingsPoints = 25;
  else if (downPct >= 0.2) savingsPoints = 20;
  else if (downPct >= 0.1) savingsPoints = 12;
  else savingsPoints = 5;

  let rentalPoints = 50;
  if (planToRent && expectedRent > 0) {
    if (coverageRatio >= 1 && monthlyProfit > 0) rentalPoints = 50;
    else if (coverageRatio >= 0.8) rentalPoints = 35;
    else if (coverageRatio >= 0.5) rentalPoints = 20;
    else rentalPoints = 5;
  } else {
    // Not renting — weight debt + savings more (scale to 100)
    rentalPoints = 50; // neutral
  }

  const totalScore = Math.min(100, Math.round(debtPoints + savingsPoints + rentalPoints));
  const band = getHealthBand(totalScore);

  return {
    score: totalScore,
    band,
    breakdown: {
      debt: { points: debtPoints, max: 25, dtiPct: dti * 100 },
      savings: { points: savingsPoints, max: 25, downPct: downPct * 100 },
      rental: { points: rentalPoints, max: 50, coverageRatio },
    },
  };
}

/**
 * Generate insight message keys and params for display.
 * @param {Object} params - scenario, monthlyPayment, totalIncome, effectiveRent, totalCosts, coverageRatio, healthBand, planToRent, downPaymentPct
 * @returns {Array<{ key: string, params?: Object }>}
 */
export function getPropertyInsights(params) {
  const {
    scenario,
    monthlyPayment = 0,
    totalIncome = 0,
    effectiveRent = 0,
    totalCosts = 0,
    coverageRatio = 0,
    healthBand = "",
    planToRent = false,
    downPaymentPct = 0,
  } = params;

  const insights = [];
  const dti = totalIncome > 0 ? (monthlyPayment / totalIncome) * 100 : 0;

  if (totalIncome > 0 && dti > 35) {
    insights.push({ key: "debt_exceeds_recommended", params: { pct: Math.round(dti) } });
  }

  if (planToRent && totalCosts > 0 && effectiveRent < totalCosts) {
    insights.push({ key: "rental_will_not_cover" });
  }

  if (planToRent && coverageRatio >= 1 && effectiveRent >= totalCosts) {
    insights.push({ key: "investment_sustainable" });
  }

  if (downPaymentPct < 20 && downPaymentPct > 0) {
    insights.push({ key: "consider_higher_downpayment" });
  }

  if (healthBand === "Risky") {
    insights.push({ key: "health_risky" });
  } else if (healthBand === "Dangerous") {
    insights.push({ key: "health_dangerous" });
  } else if (healthBand === "Excellent") {
    insights.push({ key: "health_excellent" });
  } else if (healthBand === "Good") {
    insights.push({ key: "health_good" });
  }

  if (scenario === "B" && planToRent && totalCosts > 0) {
    insights.push({ key: "required_rent_to_cover", params: { amount: Math.ceil(totalCosts) } });
  }

  return insights;
}
