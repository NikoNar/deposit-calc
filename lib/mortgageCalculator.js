/**
 * Mortgage Calculator — amortization, PMI removal, extra payments, scenario comparison.
 * Pure functions; no React.
 */

/**
 * Monthly P&I (annuity) for a loan.
 * @param {number} loanAmount - Principal
 * @param {number} annualRatePct - Annual interest rate (e.g. 10)
 * @param {number} termYears - Loan term in years
 * @returns {number} Monthly payment
 */
export function calcMonthlyPayment(loanAmount, annualRatePct, termYears) {
  if (loanAmount <= 0) return 0;
  const months = Math.max(1, Math.round(termYears * 12));
  const monthlyRate = annualRatePct / 100 / 12;
  if (monthlyRate <= 0) return loanAmount / months;
  const factor = Math.pow(1 + monthlyRate, months);
  return (loanAmount * monthlyRate * factor) / (factor - 1);
}

const DEFAULT_PMI_LTV_THRESHOLD = 0.78;

/**
 * Build full amortization schedule with optional PMI, extras, and recurring costs.
 * @param {Object} params
 * @param {number} params.loanAmount - Principal
 * @param {number} params.annualRatePct - Annual interest rate
 * @param {number} params.termYears - Loan term in years
 * @param {number} [params.homeValue] - Used for LTV (PMI removal). If omitted, PMI is not applied.
 * @param {number} [params.pmiAmount=0] - Monthly PMI amount
 * @param {number} [params.pmiPct] - If set, monthly PMI = (loanAmount * pmiPct/100) / 12 (annual PMI %)
 * @param {number} [params.pmiLtvThreshold=0.78] - LTV below which PMI is removed (e.g. 0.78 = 78%)
 * @param {number} [params.propertyTaxMonthly=0]
 * @param {number} [params.insuranceMonthly=0]
 * @param {number} [params.hoaMonthly=0]
 * @param {number} [params.recurringExtra=0] - Extra payment every month
 * @param {number} [params.oneTimeExtra=0] - Lump sum extra
 * @param {number} [params.oneTimeExtraMonth=0] - Month index (1-based) when lump sum is applied; 0 = first month
 * @param {string} [params.extraStrategy='none'] - 'none' | 'skip_first_years' | 'penalty_first_years'
 * @param {number} [params.extraFirstYears=0] - Years for which skip or penalty applies
 * @param {number} [params.extraPenaltyPct=0] - When extraStrategy is penalty_first_years, % of extra that does not go to principal
 * @param {number} [params.startYear] - For display (e.g. 2025)
 * @param {number} [params.startMonth] - 1-12
 * @param {string} [params.calculationType='annuity'] - 'annuity' (fixed monthly payment) or 'classical' (fixed principal per month)
 * @returns {{ schedule: Array<Object>, summary: Object }}
 */
export function buildAmortizationSchedule(params) {
  const {
    loanAmount,
    annualRatePct,
    termYears,
    homeValue = null,
    pmiAmount: pmiAmountParam = 0,
    pmiPct,
    pmiLtvThreshold = DEFAULT_PMI_LTV_THRESHOLD,
    propertyTaxMonthly = 0,
    insuranceMonthly = 0,
    hoaMonthly = 0,
    recurringExtra = 0,
    oneTimeExtra = 0,
    oneTimeExtraMonth = 0,
    extraStrategy = "none",
    extraFirstYears = 0,
    extraPenaltyPct = 0,
    startYear = new Date().getFullYear(),
    startMonth = new Date().getMonth() + 1,
    calculationType = "annuity",
  } = params;

  const loan = Math.max(0, Number(loanAmount) || 0);
  const rate = Number(annualRatePct) || 0;
  const termMonths = Math.max(1, Math.round((Number(termYears) || 20) * 12));
  const monthlyRate = rate / 100 / 12;
  const isClassical = calculationType === "classical";
  const fixedPayment = isClassical ? 0 : calcMonthlyPayment(loan, rate, termYears);
  const fixedPrincipalPerMonth = isClassical ? loan / termMonths : 0;
  const homeVal = homeValue != null && homeValue > 0 ? Number(homeValue) : null;
  let pmiMonthly = 0;
  if (pmiPct != null && Number(pmiPct) > 0) {
    pmiMonthly = (loan * (Number(pmiPct) / 100)) / 12;
  } else if (pmiAmountParam > 0) {
    pmiMonthly = Number(pmiAmountParam);
  }
  const tax = Math.max(0, Number(propertyTaxMonthly) || 0);
  const ins = Math.max(0, Number(insuranceMonthly) || 0);
  const hoa = Math.max(0, Number(hoaMonthly) || 0);
  const extraRecurring = Math.max(0, Number(recurringExtra) || 0);
  const extraOneTime = Math.max(0, Number(oneTimeExtra) || 0);
  const extraOneTimeAtMonth = Math.max(0, Math.round(Number(oneTimeExtraMonth) || 0));
  const strategy = String(extraStrategy || "none");
  const firstYears = Math.max(0, Number(extraFirstYears) || 0);
  const penaltyPct = Math.max(0, Math.min(100, Number(extraPenaltyPct) || 0));
  const thresholdMonths = firstYears * 12;

  const schedule = [];
  let balance = loan;
  let monthIndex = 0;
  let totalInterest = 0;
  let totalPMI = 0;
  let pmiDroppedAtMonth = null;

  while (balance > 0 && monthIndex < termMonths + 600) {
    const interest = balance * monthlyRate;
    let principalFromPayment;
    let paymentThisMonth;
    if (isClassical) {
      principalFromPayment = Math.min(fixedPrincipalPerMonth, balance);
      paymentThisMonth = interest + principalFromPayment;
    } else {
      principalFromPayment = Math.min(fixedPayment - interest, balance);
      paymentThisMonth = fixedPayment;
    }
    const month1Based = monthIndex + 1;
    let extraThisMonth =
      extraRecurring +
      (month1Based === extraOneTimeAtMonth || (extraOneTimeAtMonth === 0 && monthIndex === 0) ? extraOneTime : 0);
    if (strategy === "skip_first_years" && month1Based <= thresholdMonths) {
      extraThisMonth = month1Based === extraOneTimeAtMonth || (extraOneTimeAtMonth === 0 && monthIndex === 0) ? extraOneTime : 0;
    } else if (strategy === "penalty_first_years" && month1Based <= thresholdMonths && extraThisMonth > 0) {
      extraThisMonth = extraThisMonth * Math.max(0, 1 - penaltyPct / 100);
    }
    const totalPrincipal = Math.min(balance, principalFromPayment + extraThisMonth);
    const newBalance = balance - totalPrincipal;
    const actualPaymentPI = interest + totalPrincipal;

    const ltv = homeVal && homeVal > 0 ? balance / homeVal : 1;
    const pmiThisMonth =
      pmiMonthly > 0 && homeVal && homeVal > 0 && ltv > pmiLtvThreshold ? pmiMonthly : 0;
    if (pmiMonthly > 0 && pmiThisMonth === 0 && pmiDroppedAtMonth == null && monthIndex > 0) {
      pmiDroppedAtMonth = monthIndex;
    }
    totalPMI += pmiThisMonth;
    totalInterest += interest;

    const totalMonthly = (isClassical ? actualPaymentPI : paymentThisMonth) + tax + ins + pmiThisMonth + hoa;

    let y = startYear;
    let m = startMonth + monthIndex;
    while (m > 12) {
      m -= 12;
      y += 1;
    }

    schedule.push({
      monthIndex: monthIndex + 1,
      year: y,
      month: m,
      balanceStart: balance,
      principal: totalPrincipal,
      interest,
      pmi: pmiThisMonth,
      extraPayment: extraThisMonth,
      balanceEnd: Math.max(0, newBalance),
      totalMonthly,
      propertyTax: tax,
      insurance: ins,
      hoa,
    });

    balance = newBalance;
    monthIndex += 1;
    if (balance <= 0) break;
  }

  const firstRow = schedule[0];
  const firstMonthPI = firstRow ? firstRow.interest + firstRow.principal : 0;
  const monthlyPI = isClassical ? firstMonthPI : fixedPayment;
  const totalMonthlyWithPMI =
    firstRow ? firstRow.totalMonthly : (monthlyPI + tax + ins + hoa);

  const summary = {
    monthlyPI,
    totalInterest,
    totalPMI,
    payoffMonth: monthIndex,
    payoffYear: schedule.length ? schedule[schedule.length - 1].year : null,
    payoffMonthNum: schedule.length ? schedule[schedule.length - 1].month : null,
    totalMonthlyWithPMI: firstRow ? firstRow.totalMonthly : (monthlyPI + tax + ins + hoa),
    totalMonthlyWithoutPMI: (isClassical ? firstMonthPI : fixedPayment) + tax + ins + hoa,
    pmiDroppedAtMonth: pmiDroppedAtMonth != null ? pmiDroppedAtMonth + 1 : null,
    schedule,
  };

  return { schedule, summary };
}

/**
 * Run base scenario (no extras) and scenario with extras; return both plus diff.
 * @param {Object} baseParams - Same shape as buildAmortizationSchedule
 * @param {Object} extraParams - Override only extra-related fields (recurringExtra, oneTimeExtra, oneTimeExtraMonth)
 * @returns {{ base: { schedule, summary }, withExtras: { schedule, summary }, interestSaved: number, monthsSaved: number }}
 */
export function compareWithExtras(baseParams, extraParams) {
  const base = buildAmortizationSchedule(baseParams);
  const withExtras = buildAmortizationSchedule({ ...baseParams, ...extraParams });
  const interestSaved = base.summary.totalInterest - withExtras.summary.totalInterest;
  const monthsSaved = base.summary.payoffMonth - withExtras.summary.payoffMonth;
  return {
    base,
    withExtras,
    interestSaved: Math.max(0, interestSaved),
    monthsSaved: Math.max(0, monthsSaved),
  };
}

/**
 * Compare two full scenarios (e.g. different term or different loan).
 * @param {Object} paramsA - Full params for scenario A
 * @param {Object} paramsB - Full params for scenario B
 * @returns {{ scenarioA: { schedule, summary }, scenarioB: { schedule, summary } }}
 */
export function compareScenarios(paramsA, paramsB) {
  const scenarioA = buildAmortizationSchedule(paramsA);
  const scenarioB = buildAmortizationSchedule(paramsB);
  return {
    scenarioA,
    scenarioB,
  };
}
