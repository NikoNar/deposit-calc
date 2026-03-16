"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "../ThemeContext.jsx";
import SharedHeader from "../SharedHeader.jsx";
import dynamic from "next/dynamic";
import * as XLSX from "xlsx";
import {
  buildAmortizationSchedule,
  compareWithExtras,
  compareScenarios,
} from "../../lib/mortgageCalculator.js";
import { MORTGAGE_FAQ_DATA } from "./faqData.js";

const PaymentBreakdownChart = dynamic(() => import("./charts/PaymentBreakdownChart"), { ssr: false });
const BalanceOverTimeChart = dynamic(() => import("./charts/BalanceOverTimeChart"), { ssr: false });
const PandIOverTimeChart = dynamic(() => import("./charts/PandIOverTimeChart"), { ssr: false });
const CompareScenarioChart = dynamic(() => import("./charts/CompareScenarioChart"), { ssr: false });

const CURRENCY_SYMBOLS = { AMD: "֏", USD: "$", EUR: "€" };
const TABS = ["Calculator", "Extra payments", "Compare"];

const TRANSLATIONS = {
  en: {
    page_title: "Mortgage Calculator",
    page_intro: "Estimate your monthly payment, full cost of ownership (P&I, tax, insurance, PMI, HOA), amortization schedule, and the impact of extra payments. Compare scenarios side by side.",
    disclaimer_title: "Disclaimer",
    disclaimer_text: "Results are estimates for informational purposes only. Consult a lender for actual terms.",
    tab_calculator: "Calculator",
    tab_extra_payments: "Extra payments",
    tab_compare: "Compare",
    bar_currency: "Currency",
    section_loan: "Loan",
    calc_type_annuity: "Annuity (Fixed-Rate)",
    calc_type_classical: "Classical",
    label_calc_type: "Calculation type",
    section_costs: "Monthly costs",
    section_pmi: "PMI",
    section_extras: "Extra payments",
    label_loan_amount: "Loan amount",
    label_home_value: "Home value (for LTV)",
    label_rate: "Interest rate (%)",
    label_term: "Term",
    term_unit_year: "Years",
    term_unit_month: "Months",
    label_property_tax: "Property tax (monthly)",
    label_insurance: "Insurance (monthly)",
    label_hoa: "HOA (monthly)",
    label_pmi_pct: "PMI (% of loan per year)",
    label_pmi_amount: "PMI (monthly amount)",
    label_pmi_ltv: "PMI drops at LTV (%)",
    help_pmi: "Private Mortgage Insurance (PMI): required by lenders when your down payment is below about 20%. It protects the lender if you default. You can usually cancel it once your loan-to-value drops to the threshold (e.g. 78%).",
    help_hoa: "Homeowners Association (HOA) fee: monthly dues for shared amenities, maintenance, or common areas (e.g. condos, gated communities). Enter 0 if not applicable.",
    help_ltv: "Loan-to-Value (LTV): your loan balance ÷ home value. When LTV falls at or below this percentage, PMI is typically removed. Common threshold is 78%.",
    help_home_value_ltv: "Used to compute LTV for PMI removal. Enter your purchase price or current appraised value.",
    label_recurring_extra: "Extra payment (monthly)",
    label_one_time_extra: "One-time lump sum",
    label_one_time_month: "Apply in month #",
    extra_strategy_none: "No restriction",
    extra_strategy_skip: "Skip first X years",
    extra_strategy_penalty: "Pay extra with penalty (first X years)",
    label_extra_first_years: "First X years",
    help_extra_first_years: "Skip: no recurring extra in this period. Penalty: only (100 − penalty)% of extra goes to principal.",
    label_extra_penalty_pct: "Penalty (% of extra)",
    help_extra_penalty_pct: "In the first X years, this percentage of each extra payment does not go to principal.",
    label_compare_term_b: "Scenario B: Term",
    label_compare_extra_b: "Scenario B: Extra (monthly)",
    card_monthly_pi: "Monthly P&I",
    card_total_monthly: "Total monthly",
    card_total_interest: "Total interest",
    card_full_total: "Total amount",
    card_overpayment_pct: "Overpayment (%)",
    card_payoff: "Payoff",
    card_total_payments: "Total payments",
    card_pmi_drops: "PMI drops in month",
    card_interest_saved: "Interest saved",
    card_months_saved: "Months saved",
    chart_payment_breakdown: "Payment breakdown",
    chart_balance_over_time: "Loan balance over time",
    chart_pi_over_time_title: "Principal and interest over the loan term",
    chart_year_label: "Years",
    chart_interval_year: "Year",
    chart_balance: "Balance",
    chart_compare_balance: "Balance comparison",
    compare_scenario_a: "Scenario A",
    compare_scenario_b: "Scenario B",
    compare_winner_intro: "In the winning scenario you save {months} months ({years} years) and avoid paying {interest} in total interest.",
    compare_monthly_pi_diff: "Monthly P&I difference: {diff}.",
    compare_tie: "Both scenarios have the same total interest and payoff length.",
    compare_winner_wins: "{scenario} wins.",
    btn_export_excel: "Export to Excel",
    btn_show_schedule: "Show full schedule",
    btn_hide_schedule: "Hide schedule",
    month: "Month",
    year: "Year",
    principal: "Principal",
    interest: "Interest",
    balance: "Balance",
    total_monthly: "Total",
    excel_sheet: "Amortization",
    excel_title: "Mortgage Amortization Schedule",
    faq_title: "Frequently Asked Questions",
    faq_subtitle: "Mortgage calculator, amortization, PMI, and loan comparison.",
  },
  hy: {
    page_title: "Հիպոթեկային հաշվիչ",
    page_intro: "Գնահատեք ամսական վճարը, սեփականության ամբողջ արժեքը (P&I, հարկ, ապահովագրություն, PMI, HOA), ամորտիզացիայի աղյուսակը և լրացուցիչ մուծումների ազդեցությունը: Համեմատեք սցենարները:",
    disclaimer_title: "Խորհուրդ",
    disclaimer_text: "Արդյունքները տեղեկատվական նպատակով են: Իրական պայմանների համար դիմեք վարկատուին:",
    tab_calculator: "Հաշվիչ",
    tab_extra_payments: "Լրացուցիչ մուծումներ",
    tab_compare: "Համեմատություն",
    bar_currency: "Արժույթ",
    section_loan: "Վարկ",
    calc_type_annuity: "Անուիտետ (ֆիքսված)",
    calc_type_classical: "Դասական",
    label_calc_type: "Հաշվարկի տեսակ",
    section_costs: "Ամսական ծախսեր",
    section_pmi: "PMI",
    section_extras: "Լրացուցիչ մուծումներ",
    label_loan_amount: "Վարկի գումար",
    label_home_value: "Գնված գույքի արժեք (LTV)",
    label_rate: "Տոկոսադրույք (%)",
    label_term: "Ժամկետ",
    term_unit_year: "Տարի",
    term_unit_month: "Ամիս",
    label_property_tax: "Գույքահարկ (ամսական)",
    label_insurance: "Ապահովագրություն (ամսական)",
    label_hoa: "HOA (ամսական)",
    label_pmi_pct: "PMI (տարեկան % վարկից)",
    label_pmi_amount: "PMI (ամսական գումար)",
    label_pmi_ltv: "PMI-ն դադարում է LTV (%)",
    help_pmi: "Մասնավոր հիպոթեկային ապահովագրություն (PMI). Վարկատուները պահանջում են, երբ նախնական վճարը 20%-ից ցածր է: Պաշտպանում է վարկատուին: Սովորաբար կարող եք դադարեցնել, երբ LTV-ն հասնում է սահմանին (օր. 78%):",
    help_hoa: "Գույքի սեփականատերերի ասոցիացիայի (HOA) մուծում. ամսական վճար համատեղ ծառայությունների, պահպանման կամ ընդհանուր տարածքների համար (օր. բազմաբնակարան, փակ համայնք): Մուտքագրեք 0, եթե կիրառելի չէ:",
    help_ltv: "Վարկ-դեպի-արժեք (LTV). վարկի մնացորդ ÷ գույքի արժեք: Երբ LTV-ն հասնում կամ ցածր է այս %-ից, PMI-ն սովորաբար հանվում է: Ընդունված սահման 78%:",
    help_home_value_ltv: "Օգտագործվում է LTV-ն PMI-ի դադարեցման համար հաշվարկելու: Մուտքագրեք գնման գինը կամ գնահատված արժեքը:",
    label_recurring_extra: "Լրացուցիչ ամսական մուծում",
    label_one_time_extra: "Միանվագ գումար",
    label_one_time_month: "Կիրառել ամսում #",
    extra_strategy_none: "Սահմանափակում 없음",
    extra_strategy_skip: "Բաց թողնել առաջին X տարին",
    extra_strategy_penalty: "Լրացուցիչ մուծում տուգանքով (առաջին X տարի)",
    label_extra_first_years: "Առաջին X տարի",
    help_extra_first_years: "Բաց թողնել. այդ ժամկետում պարբերական լրացուցիչ չկա: Տուգանք. լրացուցիչի միայն (100 − տուգանք)% է գնում հիմնական գումարին:",
    label_extra_penalty_pct: "Տուգանք (% լրացուցիչից)",
    help_extra_penalty_pct: "Առաջին X տարվա ընթացքում լրացուցիչ վճարի այս տոկոսը չի գնում հիմնական գումարին:",
    label_compare_term_b: "Սցենար B: Ժամկետ",
    label_compare_extra_b: "Սցենար B: Լրացուցիչ (ամսական)",
    card_monthly_pi: "Ամսական P&I",
    card_total_monthly: "Ընդամենը ամսական",
    card_total_interest: "Ընդամենը տոկոս",
    card_full_total: "Ընդամենը գումար",
    card_overpayment_pct: "Գերավճար (%)",
    card_payoff: "Վճարումը ավարտ",
    card_total_payments: "Ընդամենը վճարումներ",
    card_pmi_drops: "PMI-ն դադարում է ամսում",
    card_interest_saved: "Խնայված տոկոս",
    card_months_saved: "Խնայված ամիսներ",
    chart_payment_breakdown: "Վճարի բաշխում",
    chart_balance_over_time: "Մնացորդ ժամանակի ընթացքում",
    chart_pi_over_time_title: "Հիմնական և տոկոս վճարները վարկի ընթացքում",
    chart_year_label: "Տարի",
    chart_interval_year: "Տարի",
    chart_balance: "Մնացորդ",
    chart_compare_balance: "Մնացորդի համեմատություն",
    compare_scenario_a: "Սցենար A",
    compare_scenario_b: "Սցենար B",
    compare_winner_intro: "Հաղթող սցենարում դուք խնայում եք {months} ամիս ({years} տարի) և չեք վճարում {interest} ընդամենը տոկոս:",
    compare_monthly_pi_diff: "Ամսական P&I տարբերություն՝ {diff}.",
    compare_tie: "Երկու սցենարներն էլ ունեն նույն ընդամենը տոկոսը և մարմանի ժամկետը:",
    compare_winner_wins: "{scenario} հաղթող:",
    btn_export_excel: "Բեռնել Excel",
    btn_show_schedule: "Ցույց տալ աղյուսակ",
    btn_hide_schedule: "Թաքցնել",
    month: "Ամիս",
    year: "Տարի",
    principal: "Հիմնական",
    interest: "Տոկոս",
    balance: "Մնացորդ",
    total_monthly: "Ընդամենը",
    excel_sheet: "Ամորտիզացիա",
    excel_title: "Հիպոթեկային ամորտիզացիա",
    faq_title: "Հաճախ տրվող հարցեր",
    faq_subtitle: "Հիպոթեկային հաշվիչ, ամորտիզացիա, PMI և վարկի համեմատություն:",
  },
};

function Section({ T, title, children }) {
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 16 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>{title}</div>
      {children}
    </div>
  );
}

function HelperText({ T, children }) {
  return (
    <p style={{ fontSize: 11, color: T.textMuted, lineHeight: 1.45, marginTop: 6, marginBottom: 0 }} role="note">
      {children}
    </p>
  );
}

function formatWithThousandSep(val, allowDecimals) {
  if (val === "" || val == null) return "";
  const n = Number(val);
  if (Number.isNaN(n)) return "";
  const fixed = allowDecimals ? String(n) : String(Math.round(n));
  const parts = fixed.split(".");
  const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.length > 1 ? intPart + "." + parts[1] : intPart;
}

function parseNumInput(str, allowDecimals) {
  const cleaned = str.replace(/[,\s]/g, "");
  if (cleaned === "") return "";
  const n = allowDecimals ? parseFloat(cleaned) : parseInt(cleaned, 10);
  return Number.isNaN(n) ? "" : n;
}

function NumIn({ value, onChange, min = 0, step = 1, T, style: styleProp }) {
  const allowDecimals = step < 1;
  const [displayStr, setDisplayStr] = useState(() =>
    value === "" || value == null ? "" : formatWithThousandSep(value, allowDecimals)
  );

  // Sync from parent value when it changes externally (e.g. form reset), but not when we're mid-typing (e.g. "10.")
  useEffect(() => {
    const parsed = parseNumInput(displayStr, allowDecimals);
    const valueNum = value === "" || value == null ? null : Number(value);
    const same =
      (valueNum === null && parsed === "") ||
      (valueNum !== null && parsed !== "" && Math.abs(valueNum - parsed) < 1e-15);
    if (!same) {
      setDisplayStr(value === "" || value == null ? "" : formatWithThousandSep(value, allowDecimals));
    } else if (valueNum !== null && valueNum !== "" && !allowDecimals) {
      // Integer inputs: always show thousand separators (e.g. 50000 → 50,000)
      const formatted = formatWithThousandSep(valueNum, false);
      if (displayStr !== formatted) setDisplayStr(formatted);
    }
  }, [value, allowDecimals]);

  return (
    <input
      type="text"
      inputMode="decimal"
      value={displayStr}
      onChange={(e) => {
        const raw = e.target.value;
        setDisplayStr(raw);
        const parsed = parseNumInput(raw, allowDecimals);
        if (parsed === "") {
          onChange("");
          return;
        }
        const num = typeof parsed === "number" ? parsed : Number(parsed);
        const clamped = min != null && num < min ? min : num;
        onChange(clamped);
      }}
      style={{
        width: "100%",
        padding: "8px 10px",
        borderRadius: 8,
        border: `1px solid ${T.border}`,
        background: T.bg,
        color: T.text,
        fontSize: 16,
        ...styleProp,
      }}
    />
  );
}

function SegBtn({ T, active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "6px 10px",
        borderRadius: 8,
        border: `1px solid ${active ? T.accent : T.border}`,
        background: active ? T.accentBg : "transparent",
        color: active ? T.accentText : T.textSub,
        fontSize: 12,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function fmt(n, sym = "֏") {
  if (n == null || Number.isNaN(n)) return "—";
  const abs = Math.round(Math.abs(n));
  if (sym === "֏") return new Intl.NumberFormat("hy-AM", { maximumFractionDigits: 0 }).format(abs) + " ֏";
  if (sym === "$") return "$" + new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(abs);
  if (sym === "€") return "€" + new Intl.NumberFormat("de-DE", { maximumFractionDigits: 0 }).format(abs);
  return abs.toLocaleString();
}

function getTermYears(form) {
  const unit = form.termUnit || "year";
  const val = Number(form.termValue);
  if (!Number.isFinite(val) || val <= 0) return unit === "month" ? 240 / 12 : 20;
  return unit === "month" ? val / 12 : val;
}

function getCompareTermYears(form) {
  const unit = form.compareTermUnit || "year";
  const val = Number(form.compareTermValue);
  if (!Number.isFinite(val) || val <= 0) return unit === "month" ? 180 / 12 : 15;
  return unit === "month" ? val / 12 : val;
}

function getScheduleParams(form, currency, recurringExtra = 0, oneTimeExtra = 0, oneTimeExtraMonth = 0, termYearsOverride = null) {
  const loanAmount = Number(form.loanAmount) || 0;
  const homeValue = form.homeValue != null && form.homeValue !== "" ? Number(form.homeValue) : loanAmount;
  const termYears = termYearsOverride != null ? termYearsOverride : getTermYears(form);
  return {
    loanAmount,
    homeValue: homeValue || loanAmount,
    annualRatePct: Number(form.rate) || 0,
    termYears,
    propertyTaxMonthly: Number(form.propertyTaxMonthly) || 0,
    insuranceMonthly: Number(form.insuranceMonthly) || 0,
    hoaMonthly: Number(form.hoaMonthly) || 0,
    pmiPct: form.pmiPct != null && form.pmiPct !== "" ? Number(form.pmiPct) : undefined,
    pmiAmount: form.pmiAmount != null && form.pmiAmount !== "" ? Number(form.pmiAmount) : undefined,
    pmiLtvThreshold: (Number(form.pmiLtvThreshold) || 78) / 100,
    recurringExtra,
    oneTimeExtra,
    oneTimeExtraMonth: Number(form.oneTimeExtraMonth) || 0,
    extraStrategy: form.extraStrategy || "none",
    extraFirstYears: Math.max(0, Number(form.extraFirstYears) || 0),
    extraPenaltyPct: Math.max(0, Math.min(100, Number(form.extraPenaltyPct) || 0)),
    startYear: Number(form.startYear) || new Date().getFullYear(),
    startMonth: Number(form.startMonth) || new Date().getMonth() + 1,
    calculationType: form.calculationType || "annuity",
  };
}

function downloadExcel(schedule, summary, form, currency, lang) {
  const L = lang === "hy" ? TRANSLATIONS.hy : TRANSLATIONS.en;
  const sym = CURRENCY_SYMBOLS[currency] || "֏";
  const r = (n) => (n != null && !Number.isNaN(n) ? Math.round(n) : "");
  const headers = [L.month, L.year, L.principal, L.interest, "PMI", L.balance, L.total_monthly];
  const rows = schedule.map((row) => [
    row.monthIndex,
    row.year,
    r(row.principal),
    r(row.interest),
    r(row.pmi),
    r(row.balanceEnd),
    r(row.totalMonthly),
  ]);
  const termYearsForExcel = getTermYears(form);
  const ws = XLSX.utils.aoa_to_sheet([[L.excel_title], [], ["Rate", (form.rate || 0) + "%"], ["Term", termYearsForExcel + "y"], ["Currency", currency], [], headers, ...rows]);
  ws["!cols"] = [8, 8, 14, 14, 10, 14, 14].map((w) => ({ wch: w }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, L.excel_sheet);
  XLSX.writeFile(wb, `mortgage_amortization_${Math.round(termYearsForExcel)}y.xlsx`);
}

export default function MortgageCalculatorApp({ lang: langProp }) {
  const pathname = usePathname();
  const lang = langProp ?? (pathname?.startsWith("/en") ? "en" : "hy");
  const { T } = useTheme();

  const [activeTab, setActiveTab] = useState("Calculator");
  const [currency, setCurrency] = useState("AMD");
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef(null);
  const [showFullSchedule, setShowFullSchedule] = useState(false);

  const [form, setForm] = useState({
    loanAmount: 50000000,
    homeValue: 60000000,
    rate: 10,
    calculationType: "annuity",
    termUnit: "year",
    termValue: 20,
    startYear: new Date().getFullYear(),
    startMonth: new Date().getMonth() + 1,
    propertyTaxMonthly: 0,
    insuranceMonthly: 0,
    hoaMonthly: 0,
    pmiPct: "",
    pmiAmount: "",
    pmiLtvThreshold: 78,
    recurringExtra: 0,
    oneTimeExtra: 0,
    oneTimeExtraMonth: 1,
    extraStrategy: "none",
    extraFirstYears: 0,
    extraPenaltyPct: 0,
    compareTermUnit: "year",
    compareTermValue: 15,
    compareExtraB: 0,
  });

  useEffect(() => {
    const close = (e) => {
      if (exportRef.current && !exportRef.current.contains(e.target)) setExportOpen(false);
    };
    const onKey = (e) => { if (e.key === "Escape") setExportOpen(false); };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", onKey); };
  }, [exportOpen]);

  const updateForm = (updates) => setForm((prev) => ({ ...prev, ...updates }));
  const t = (key) => TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.en[key] ?? key;
  const sym = CURRENCY_SYMBOLS[currency];

  const baseParams = useMemo(() => getScheduleParams(form, currency, 0, 0, 0), [form, currency]);
  const baseResult = useMemo(() => {
    if (baseParams.loanAmount <= 0) return { schedule: [], summary: { totalInterest: 0, payoffMonth: 0, monthlyPI: 0, totalMonthlyWithPMI: 0, totalMonthlyWithoutPMI: 0, pmiDroppedAtMonth: null } };
    return buildAmortizationSchedule(baseParams);
  }, [baseParams]);

  const extraParams = useMemo(() => ({
    recurringExtra: Number(form.recurringExtra) || 0,
    oneTimeExtra: Number(form.oneTimeExtra) || 0,
    oneTimeExtraMonth: Number(form.oneTimeExtraMonth) || 1,
    extraStrategy: form.extraStrategy || "none",
    extraFirstYears: Math.max(0, Number(form.extraFirstYears) || 0),
    extraPenaltyPct: Math.max(0, Math.min(100, Number(form.extraPenaltyPct) || 0)),
  }), [form.recurringExtra, form.oneTimeExtra, form.oneTimeExtraMonth, form.extraStrategy, form.extraFirstYears, form.extraPenaltyPct]);

  const extraComparison = useMemo(() => {
    if (baseParams.loanAmount <= 0) return null;
    const hasExtra = (Number(form.recurringExtra) || 0) > 0 || (Number(form.oneTimeExtra) || 0) > 0;
    if (!hasExtra) return null;
    return compareWithExtras(baseParams, extraParams);
  }, [baseParams, extraParams, form.recurringExtra, form.oneTimeExtra]);

  const compareParamsA = useMemo(() => getScheduleParams(form, currency, 0, 0, 0), [form, currency]);
  const compareParamsB = useMemo(() => getScheduleParams(form, currency, Number(form.compareExtraB) || 0, 0, 0, getCompareTermYears(form)), [form, currency, form.compareTermUnit, form.compareTermValue, form.compareExtraB, form.extraStrategy, form.extraFirstYears, form.extraPenaltyPct]);
  const compareResult = useMemo(() => {
    if (compareParamsA.loanAmount <= 0) return null;
    return compareScenarios(compareParamsA, compareParamsB);
  }, [compareParamsA, compareParamsB]);

  const schedule = baseResult.schedule;
  const summary = baseResult.summary;

  const pieData = useMemo(() => {
    const s = schedule[0];
    if (!s) return [];
    const items = [
      { name: "Principal", label: t("principal"), value: s.principal, color: T.accent },
      { name: "Interest", label: t("interest"), value: s.interest, color: T.orange },
    ];
    if (s.propertyTax > 0) items.push({ name: "Tax", label: t("label_property_tax").replace(" (monthly)", ""), value: s.propertyTax, color: T.purple });
    if (s.insurance > 0) items.push({ name: "Insurance", label: t("label_insurance").replace(" (monthly)", ""), value: s.insurance, color: T.yellow });
    if (s.pmi > 0) items.push({ name: "PMI", label: "PMI", value: s.pmi, color: T.red });
    if (s.hoa > 0) items.push({ name: "HOA", label: "HOA", value: s.hoa, color: T.green });
    return items.filter((i) => i.value > 0);
  }, [schedule, T, lang, t]);

  const lineData = useMemo(() => {
    const step = Math.max(1, Math.floor(schedule.length / 48));
    return schedule.filter((_, i) => i % step === 0 || i === schedule.length - 1).map((row) => ({
      name: `Y${row.year} M${row.month}`,
      balance: row.balanceEnd,
    }));
  }, [schedule]);

  const compareLineData = useMemo(() => {
    if (!compareResult) return [];
    const a = compareResult.scenarioA.schedule;
    const b = compareResult.scenarioB.schedule;
    const maxLen = Math.max(a.length, b.length);
    const step = Math.max(1, Math.floor(maxLen / 48));
    const out = [];
    for (let i = 0; i < maxLen; i += step) {
      out.push({
        name: `M${i + 1}`,
        balanceA: a[i] ? a[i].balanceEnd : null,
        balanceB: b[i] ? b[i].balanceEnd : null,
      });
    }
    if (maxLen > 0 && (out.length === 0 || out[out.length - 1].name !== `M${maxLen}`)) {
      out.push({ name: `M${maxLen}`, balanceA: a[maxLen - 1]?.balanceEnd ?? null, balanceB: b[maxLen - 1]?.balanceEnd ?? null });
    }
    return out;
  }, [compareResult]);

  const tooltipStyle = { background: T.tooltip, border: `1px solid ${T.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 12 };

  const displaySchedule = showFullSchedule ? schedule : schedule.slice(0, 12);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: T.bg, minHeight: "100vh", color: T.text, transition: "background .2s, color .2s" }}>
      <style>{`
        input:focus, select:focus { border-color: ${T.accent} !important; outline: none; }
        input[type=number] { -moz-appearance: textfield; }
        input[type=number]::-webkit-outer-spin-button, input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }

        /* Currency switcher placement */
        .mc-currency-inline { display: flex; }
        .mc-currency-mobile { display: none; }

        @media (max-width: 640px) {
          .mc-currency-inline { display: none !important; }
          .mc-currency-mobile { display: flex !important; }
        }
      `}</style>

      <SharedHeader
        rightContent={
          <div ref={exportRef} style={{ position: "relative" }}>
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={exportOpen}
              onClick={() => setExportOpen((o) => !o)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 500, border: `1px solid ${exportOpen ? T.accent : T.border}`, background: exportOpen ? T.accentBg : T.surfaceAlt, color: exportOpen ? T.accentText : T.textSub }}
            >
              📤 {t("btn_export_excel")} ▾
            </button>
            {exportOpen && (
              <div role="menu" style={{ position: "absolute", right: 0, top: "calc(100% + 6px)", minWidth: 180, padding: "6px 0", borderRadius: 10, background: T.surface, border: `1px solid ${T.border}`, boxShadow: T.shadowMd, zIndex: 200 }}>
                <button type="button" role="menuitem" style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 14px", border: "none", background: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 13, color: T.text, textAlign: "left" }} onClick={() => { downloadExcel(schedule, summary, form, currency, lang); setExportOpen(false); }}>📋 {t("btn_export_excel")}</button>
              </div>
            )}
          </div>
        }
      />

      <main style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
        <header style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: T.text, marginBottom: 12 }}>{t("page_title")}</h1>
          <p style={{ fontSize: 15, color: T.textSub, lineHeight: 1.6, marginBottom: 16 }}>{t("page_intro")}</p>
          <div style={{ background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 10, padding: "14px 18px" }}>
            <h2 style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 8 }}>{t("disclaimer_title")}</h2>
            <p style={{ fontSize: 13, color: T.textSub, lineHeight: 1.6, margin: 0 }}>{t("disclaimer_text")}</p>
          </div>
        </header>

        <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, position: "sticky", top: 56, zIndex: 90, boxShadow: T.shadow, marginBottom: 0 }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "stretch", minWidth: 0 }}>
            <div style={{ display: "flex", overflowX: "auto", flex: 1, minWidth: 0 }}>
              {TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "0 20px",
                    height: 44,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: 13,
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    color: activeTab === tab ? T.accent : T.textSub,
                    borderBottom: `2px solid ${activeTab === tab ? T.accent : "transparent"}`,
                  }}
                >
                  {t("tab_" + tab.toLowerCase().replace(" ", "_"))}
                </button>
              ))}
            </div>
            <div className="mc-currency-inline" style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderLeft: `1px solid ${T.border}` }}>
              <span style={{ fontSize: 11, fontWeight: 500, color: T.textMuted, marginRight: 4 }}>{t("bar_currency")}</span>
              {["AMD", "USD", "EUR"].map((c) => (
                <SegBtn key={c} T={T} active={currency === c} onClick={() => setCurrency(c)}>{CURRENCY_SYMBOLS[c]} {c}</SegBtn>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile currency bar under tabs */}
        <div className="mc-currency-mobile" style={{ alignItems: "center", gap: 6, padding: "10px 0 16px 0" }}>
          <span style={{ fontSize: 11, fontWeight: 500, color: T.textMuted, marginRight: 4 }}>{t("bar_currency")}</span>
          {["AMD", "USD", "EUR"].map((c) => (
            <SegBtn key={c} T={T} active={currency === c} onClick={() => setCurrency(c)}>{CURRENCY_SYMBOLS[c]} {c}</SegBtn>
          ))}
        </div>

        {/* ── Calculator tab ── */}
        {activeTab === "Calculator" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 24 }}>
              <Section T={T} title={t("section_loan")}>
                <label style={{ display: "block", fontSize: 12, color: T.textSub, marginBottom: 6 }}>{t("label_calc_type")}</label>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                  <SegBtn T={T} active={form.calculationType === "annuity"} onClick={() => updateForm({ calculationType: "annuity" })}>{t("calc_type_annuity")}</SegBtn>
                  <SegBtn T={T} active={form.calculationType === "classical"} onClick={() => updateForm({ calculationType: "classical" })}>{t("calc_type_classical")}</SegBtn>
                </div>
                <label style={{ display: "block", fontSize: 12, color: T.textSub, marginBottom: 6 }}>{t("label_loan_amount")} ({sym})</label>
                <NumIn value={form.loanAmount} onChange={(v) => updateForm({ loanAmount: v })} min={0} step={currency === "AMD" ? 100000 : 1000} T={T} />
                <label style={{ display: "block", fontSize: 12, color: T.textSub, marginTop: 10, marginBottom: 6 }}>{t("label_home_value")} ({sym})</label>
                <NumIn value={form.homeValue} onChange={(v) => updateForm({ homeValue: v })} min={0} step={currency === "AMD" ? 100000 : 1000} T={T} />
                <HelperText T={T}>{t("help_home_value_ltv")}</HelperText>
                <label style={{ display: "block", fontSize: 12, color: T.textSub, marginTop: 10, marginBottom: 6 }}>{t("label_rate")}</label>
                <NumIn value={form.rate} onChange={(v) => updateForm({ rate: v })} min={0} step={0.01} T={T} />
                <label style={{ display: "block", fontSize: 12, color: T.textSub, marginTop: 10, marginBottom: 6 }}>{t("label_term")}</label>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <NumIn value={form.termValue} onChange={(v) => updateForm({ termValue: v })} min={1} max={form.termUnit === "month" ? 600 : 40} step={1} T={T} style={{ flex: "1 1 100px", minWidth: 0 }} />
                  <div style={{ display: "flex", gap: 4 }}>
                    <SegBtn T={T} active={form.termUnit === "year"} onClick={() => updateForm({ termUnit: "year" })}>{t("term_unit_year")}</SegBtn>
                    <SegBtn T={T} active={form.termUnit === "month"} onClick={() => updateForm({ termUnit: "month" })}>{t("term_unit_month")}</SegBtn>
                  </div>
                </div>
              </Section>
              <Section T={T} title={t("section_costs")}>
                <label style={{ display: "block", fontSize: 12, color: T.textSub, marginBottom: 6 }}>{t("label_property_tax")} ({sym})</label>
                <NumIn value={form.propertyTaxMonthly} onChange={(v) => updateForm({ propertyTaxMonthly: v })} min={0} T={T} />
                <label style={{ display: "block", fontSize: 12, color: T.textSub, marginTop: 10, marginBottom: 6 }}>{t("label_insurance")} ({sym})</label>
                <NumIn value={form.insuranceMonthly} onChange={(v) => updateForm({ insuranceMonthly: v })} min={0} T={T} />
                <label style={{ display: "block", fontSize: 12, color: T.textSub, marginTop: 10, marginBottom: 6 }}>{t("label_hoa")} ({sym})</label>
                <NumIn value={form.hoaMonthly} onChange={(v) => updateForm({ hoaMonthly: v })} min={0} T={T} />
                <HelperText T={T}>{t("help_hoa")}</HelperText>
              </Section>
              <Section T={T} title={t("section_pmi")}>
                <HelperText T={T}>{t("help_pmi")}</HelperText>
                <label style={{ display: "block", fontSize: 12, color: T.textSub, marginTop: 10, marginBottom: 6 }}>{t("label_pmi_pct")}</label>
                <NumIn value={form.pmiPct} onChange={(v) => updateForm({ pmiPct: v })} min={0} step={0.01} T={T} />
                <label style={{ display: "block", fontSize: 12, color: T.textSub, marginTop: 10, marginBottom: 6 }}>{t("label_pmi_amount")} ({sym})</label>
                <NumIn value={form.pmiAmount} onChange={(v) => updateForm({ pmiAmount: v })} min={0} T={T} />
                <label style={{ display: "block", fontSize: 12, color: T.textSub, marginTop: 10, marginBottom: 6 }}>{t("label_pmi_ltv")}</label>
                <NumIn value={form.pmiLtvThreshold} onChange={(v) => updateForm({ pmiLtvThreshold: v })} min={0} max={100} step={0.1} T={T} />
                <HelperText T={T}>{t("help_ltv")}</HelperText>
              </Section>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 24 }}>
              <div style={{ background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 4 }}>{t("card_monthly_pi")}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: T.text }} suppressHydrationWarning>{fmt(summary.monthlyPI, sym)}</div>
              </div>
              <div style={{ background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 4 }}>{t("card_total_monthly")}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: T.text }} suppressHydrationWarning>{fmt(summary.totalMonthlyWithPMI, sym)}</div>
              </div>
              <div style={{ background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 4 }}>{t("card_total_interest")}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: T.text }} suppressHydrationWarning>{fmt(summary.totalInterest, sym)}</div>
              </div>
              <div style={{ background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 4 }}>{t("card_full_total")}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: T.text }} suppressHydrationWarning>{fmt((Number(form.loanAmount) || 0) + summary.totalInterest + (summary.totalPMI || 0), sym)}</div>
                <div style={{ fontSize: 11, color: T.textMuted, marginTop: 8, marginBottom: 0 }}>{t("card_overpayment_pct")}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.textSub }} suppressHydrationWarning>
                  {(() => {
                    const loan = Number(form.loanAmount) || 0;
                    const overpayment = (summary.totalInterest || 0) + (summary.totalPMI || 0);
                    const pct = loan > 0 ? (overpayment / loan) * 100 : 0;
                    return pct.toFixed(1) + "%";
                  })()}
                </div>
              </div>
              <div style={{ background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 4 }}>{t("card_payoff")}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: T.text }}>
                  {summary.payoffYear != null ? `${summary.payoffYear}-${String(summary.payoffMonthNum).padStart(2, "0")}` : "—"}
                </div>
                <div style={{ fontSize: 11, color: T.textMuted, marginTop: 8, marginBottom: 0 }}>{t("card_total_payments")}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.textSub }}>{summary.payoffMonth || "—"}</div>
              </div>
              {summary.pmiDroppedAtMonth != null && (
                <div style={{ background: T.greenBg, border: `1px solid ${T.green}`, borderRadius: 10, padding: 14 }}>
                  <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 4 }}>{t("card_pmi_drops")}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: T.greenText }}>{summary.pmiDroppedAtMonth}</div>
                </div>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 24 }}>
              {pieData.length > 0 && <PaymentBreakdownChart pieData={pieData} T={T} sym={sym} t={t} tooltipStyle={tooltipStyle} />}
              <PandIOverTimeChart schedule={schedule} T={T} sym={sym} t={t} tooltipStyle={tooltipStyle} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <BalanceOverTimeChart lineData={lineData} T={T} sym={sym} t={t} tooltipStyle={tooltipStyle} />
            </div>

            {schedule.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{t("excel_sheet")}</span>
                  <button type="button" onClick={() => setShowFullSchedule((s) => !s)} style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.surfaceAlt, color: T.textSub, fontSize: 12, cursor: "pointer" }}>
                    {showFullSchedule ? t("btn_hide_schedule") : t("btn_show_schedule")}
                  </button>
                </div>
                <div style={{ overflowX: "auto", border: `1px solid ${T.border}`, borderRadius: 10 }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: T.surfaceAlt }}>
                        <th style={{ padding: "8px 10px", textAlign: "left", borderBottom: `1px solid ${T.border}`, whiteSpace: "nowrap" }}>#</th>
                        <th style={{ padding: "8px 10px", textAlign: "left", borderBottom: `1px solid ${T.border}`, whiteSpace: "nowrap" }}>{t("year")}</th>
                        <th style={{ padding: "8px 10px", textAlign: "right", borderBottom: `1px solid ${T.border}`, whiteSpace: "nowrap" }}>{t("principal")}</th>
                        <th style={{ padding: "8px 10px", textAlign: "right", borderBottom: `1px solid ${T.border}`, whiteSpace: "nowrap" }}>{t("interest")}</th>
                        <th style={{ padding: "8px 10px", textAlign: "right", borderBottom: `1px solid ${T.border}`, whiteSpace: "nowrap" }}>PMI</th>
                        <th style={{ padding: "8px 10px", textAlign: "right", borderBottom: `1px solid ${T.border}`, whiteSpace: "nowrap" }}>{t("total_monthly")}</th>
                        <th style={{ padding: "8px 10px", textAlign: "right", borderBottom: `1px solid ${T.border}`, whiteSpace: "nowrap" }}>{t("balance")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displaySchedule.map((row) => (
                        <tr key={row.monthIndex} style={{ borderBottom: `1px solid ${T.borderSub}` }}>
                          <td style={{ padding: "8px 10px", whiteSpace: "nowrap" }}>{row.monthIndex}</td>
                          <td style={{ padding: "8px 10px", whiteSpace: "nowrap" }}>{row.year}-{String(row.month).padStart(2, "0")}</td>
                          <td style={{ padding: "8px 10px", textAlign: "right", whiteSpace: "nowrap" }} suppressHydrationWarning>{fmt(row.principal, sym)}</td>
                          <td style={{ padding: "8px 10px", textAlign: "right", whiteSpace: "nowrap" }} suppressHydrationWarning>{fmt(row.interest, sym)}</td>
                          <td style={{ padding: "8px 10px", textAlign: "right", whiteSpace: "nowrap" }} suppressHydrationWarning>{fmt(row.pmi, sym)}</td>
                          <td style={{ padding: "8px 10px", textAlign: "right", whiteSpace: "nowrap" }} suppressHydrationWarning>{fmt(row.totalMonthly, sym)}</td>
                          <td style={{ padding: "8px 10px", textAlign: "right", whiteSpace: "nowrap" }} suppressHydrationWarning>{fmt(row.balanceEnd, sym)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── Extra payments tab ── */}
        {activeTab === "Extra payments" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 24 }}>
              <Section T={T} title={t("section_loan")}>
                <label style={{ display: "block", fontSize: 12, color: T.textSub, marginBottom: 6 }}>{t("label_calc_type")}</label>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                  <SegBtn T={T} active={form.calculationType === "annuity"} onClick={() => updateForm({ calculationType: "annuity" })}>{t("calc_type_annuity")}</SegBtn>
                  <SegBtn T={T} active={form.calculationType === "classical"} onClick={() => updateForm({ calculationType: "classical" })}>{t("calc_type_classical")}</SegBtn>
                </div>
                <label style={{ display: "block", fontSize: 12, color: T.textSub, marginBottom: 6 }}>{t("label_loan_amount")} ({sym})</label>
                <NumIn value={form.loanAmount} onChange={(v) => updateForm({ loanAmount: v })} min={0} step={currency === "AMD" ? 100000 : 1000} T={T} />
                <label style={{ display: "block", fontSize: 12, color: T.textSub, marginTop: 10, marginBottom: 6 }}>{t("label_home_value")} ({sym})</label>
                <NumIn value={form.homeValue} onChange={(v) => updateForm({ homeValue: v })} min={0} T={T} />
                <HelperText T={T}>{t("help_home_value_ltv")}</HelperText>
                <label style={{ display: "block", fontSize: 12, color: T.textSub, marginTop: 10, marginBottom: 6 }}>{t("label_rate")}</label>
                <NumIn value={form.rate} onChange={(v) => updateForm({ rate: v })} min={0} step={0.01} T={T} />
                <label style={{ display: "block", fontSize: 12, color: T.textSub, marginTop: 10, marginBottom: 6 }}>{t("label_term")}</label>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <NumIn value={form.termValue} onChange={(v) => updateForm({ termValue: v })} min={1} max={form.termUnit === "month" ? 600 : 40} step={1} T={T} style={{ flex: "1 1 100px", minWidth: 0 }} />
                  <div style={{ display: "flex", gap: 4 }}>
                    <SegBtn T={T} active={form.termUnit === "year"} onClick={() => updateForm({ termUnit: "year" })}>{t("term_unit_year")}</SegBtn>
                    <SegBtn T={T} active={form.termUnit === "month"} onClick={() => updateForm({ termUnit: "month" })}>{t("term_unit_month")}</SegBtn>
                  </div>
                </div>
              </Section>
              <Section T={T} title={t("section_costs")}>
                <label style={{ display: "block", fontSize: 12, color: T.textSub, marginBottom: 6 }}>{t("label_property_tax")} ({sym})</label>
                <NumIn value={form.propertyTaxMonthly} onChange={(v) => updateForm({ propertyTaxMonthly: v })} min={0} T={T} />
                <label style={{ display: "block", fontSize: 12, color: T.textSub, marginTop: 10, marginBottom: 6 }}>{t("label_insurance")} ({sym})</label>
                <NumIn value={form.insuranceMonthly} onChange={(v) => updateForm({ insuranceMonthly: v })} min={0} T={T} />
                <label style={{ display: "block", fontSize: 12, color: T.textSub, marginTop: 10, marginBottom: 6 }}>{t("label_hoa")} ({sym})</label>
                <NumIn value={form.hoaMonthly} onChange={(v) => updateForm({ hoaMonthly: v })} min={0} T={T} />
                <HelperText T={T}>{t("help_hoa")}</HelperText>
              </Section>
              <Section T={T} title={t("section_extras")}>
                <label style={{ display: "block", fontSize: 12, color: T.textSub, marginBottom: 6 }}>{t("label_recurring_extra")} ({sym})</label>
                <NumIn value={form.recurringExtra} onChange={(v) => updateForm({ recurringExtra: v })} min={0} T={T} />
                <label style={{ display: "block", fontSize: 12, color: T.textSub, marginTop: 10, marginBottom: 6 }}>{t("label_one_time_extra")} ({sym})</label>
                <NumIn value={form.oneTimeExtra} onChange={(v) => updateForm({ oneTimeExtra: v })} min={0} T={T} />
                <label style={{ display: "block", fontSize: 12, color: T.textSub, marginTop: 10, marginBottom: 6 }}>{t("label_one_time_month")}</label>
                <NumIn value={form.oneTimeExtraMonth} onChange={(v) => updateForm({ oneTimeExtraMonth: v })} min={1} T={T} />
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 14, marginBottom: 8 }}>
                  <SegBtn T={T} active={form.extraStrategy === "none"} onClick={() => updateForm({ extraStrategy: "none" })}>{t("extra_strategy_none")}</SegBtn>
                  <SegBtn T={T} active={form.extraStrategy === "skip_first_years"} onClick={() => updateForm({ extraStrategy: "skip_first_years" })}>{t("extra_strategy_skip")}</SegBtn>
                  <SegBtn T={T} active={form.extraStrategy === "penalty_first_years"} onClick={() => updateForm({ extraStrategy: "penalty_first_years" })}>{t("extra_strategy_penalty")}</SegBtn>
                </div>
                {(form.extraStrategy === "skip_first_years" || form.extraStrategy === "penalty_first_years") && (
                  <>
                    <label style={{ display: "block", fontSize: 12, color: T.textSub, marginBottom: 6 }}>{t("label_extra_first_years")}</label>
                    <NumIn value={form.extraFirstYears} onChange={(v) => updateForm({ extraFirstYears: v })} min={0} T={T} />
                    <HelperText T={T}>{t("help_extra_first_years")}</HelperText>
                  </>
                )}
                {form.extraStrategy === "penalty_first_years" && (
                  <>
                    <label style={{ display: "block", fontSize: 12, color: T.textSub, marginTop: 10, marginBottom: 6 }}>{t("label_extra_penalty_pct")}</label>
                    <NumIn value={form.extraPenaltyPct} onChange={(v) => updateForm({ extraPenaltyPct: v })} min={0} step={0.01} T={T} />
                    <HelperText T={T}>{t("help_extra_penalty_pct")}</HelperText>
                  </>
                )}
              </Section>
            </div>

            {extraComparison && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
                <div style={{ background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 10, padding: 14 }}>
                  <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 4 }}>{t("card_interest_saved")}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: T.green }} suppressHydrationWarning>{fmt(extraComparison.interestSaved, sym)}</div>
                </div>
                <div style={{ background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 10, padding: 14 }}>
                  <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 4 }}>{t("card_months_saved")}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: T.text }}>{extraComparison.monthsSaved}</div>
                </div>
                <div style={{ background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 10, padding: 14 }}>
                  <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 4 }}>{t("card_payoff")}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: T.text }}>
                    {extraComparison.withExtras.summary.payoffYear != null
                      ? `${extraComparison.withExtras.summary.payoffYear}-${String(extraComparison.withExtras.summary.payoffMonthNum).padStart(2, "0")}`
                      : "—"}
                  </div>
                </div>
              </div>
            )}

            {extraComparison && (
              <BalanceOverTimeChart
                lineData={extraComparison.withExtras.schedule.filter((_, i) => i % Math.max(1, Math.floor(extraComparison.withExtras.schedule.length / 48)) === 0 || i === extraComparison.withExtras.schedule.length - 1).map((row) => ({ name: `Y${row.year} M${row.month}`, balance: row.balanceEnd }))}
                T={T}
                sym={sym}
                t={t}
                tooltipStyle={tooltipStyle}
              />
            )}
          </>
        )}

        {/* ── Compare tab ── */}
        {activeTab === "Compare" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 24 }}>
              <Section T={T} title={t("section_loan")}>
                <label style={{ display: "block", fontSize: 12, color: T.textSub, marginBottom: 6 }}>{t("label_loan_amount")} ({sym})</label>
                <NumIn value={form.loanAmount} onChange={(v) => updateForm({ loanAmount: v })} min={0} step={currency === "AMD" ? 100000 : 1000} T={T} />
                <label style={{ display: "block", fontSize: 12, color: T.textSub, marginTop: 10, marginBottom: 6 }}>{t("label_rate")}</label>
                <NumIn value={form.rate} onChange={(v) => updateForm({ rate: v })} min={0} step={0.01} T={T} />
                <label style={{ display: "block", fontSize: 12, color: T.textSub, marginTop: 10, marginBottom: 6 }}>{t("compare_scenario_a")}</label>
                <span style={{ fontSize: 13, color: T.textSub }}>{form.termValue} {form.termUnit === "month" ? t("term_unit_month") : t("term_unit_year")}, no extra</span>
              </Section>
              <Section T={T} title={t("compare_scenario_b")}>
                <label style={{ display: "block", fontSize: 12, color: T.textSub, marginBottom: 6 }}>{t("label_compare_term_b")}</label>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <NumIn value={form.compareTermValue} onChange={(v) => updateForm({ compareTermValue: v })} min={1} max={form.compareTermUnit === "month" ? 600 : 40} step={1} T={T} style={{ flex: "1 1 100px", minWidth: 0 }} />
                  <div style={{ display: "flex", gap: 4 }}>
                    <SegBtn T={T} active={form.compareTermUnit === "year"} onClick={() => updateForm({ compareTermUnit: "year" })}>{t("term_unit_year")}</SegBtn>
                    <SegBtn T={T} active={form.compareTermUnit === "month"} onClick={() => updateForm({ compareTermUnit: "month" })}>{t("term_unit_month")}</SegBtn>
                  </div>
                </div>
                <label style={{ display: "block", fontSize: 12, color: T.textSub, marginTop: 10, marginBottom: 6 }}>{t("label_compare_extra_b")} ({sym})</label>
                <NumIn value={form.compareExtraB} onChange={(v) => updateForm({ compareExtraB: v })} min={0} T={T} />
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 14, marginBottom: 8 }}>
                  <SegBtn T={T} active={form.extraStrategy === "none"} onClick={() => updateForm({ extraStrategy: "none" })}>{t("extra_strategy_none")}</SegBtn>
                  <SegBtn T={T} active={form.extraStrategy === "skip_first_years"} onClick={() => updateForm({ extraStrategy: "skip_first_years" })}>{t("extra_strategy_skip")}</SegBtn>
                  <SegBtn T={T} active={form.extraStrategy === "penalty_first_years"} onClick={() => updateForm({ extraStrategy: "penalty_first_years" })}>{t("extra_strategy_penalty")}</SegBtn>
                </div>
                {(form.extraStrategy === "skip_first_years" || form.extraStrategy === "penalty_first_years") && (
                  <>
                    <label style={{ display: "block", fontSize: 12, color: T.textSub, marginBottom: 6 }}>{t("label_extra_first_years")}</label>
                    <NumIn value={form.extraFirstYears} onChange={(v) => updateForm({ extraFirstYears: v })} min={0} T={T} />
                    <HelperText T={T}>{t("help_extra_first_years")}</HelperText>
                  </>
                )}
                {form.extraStrategy === "penalty_first_years" && (
                  <>
                    <label style={{ display: "block", fontSize: 12, color: T.textSub, marginTop: 10, marginBottom: 6 }}>{t("label_extra_penalty_pct")}</label>
                    <NumIn value={form.extraPenaltyPct} onChange={(v) => updateForm({ extraPenaltyPct: v })} min={0} step={0.01} T={T} />
                    <HelperText T={T}>{t("help_extra_penalty_pct")}</HelperText>
                  </>
                )}
              </Section>
            </div>

            {compareResult && (() => {
                const a = compareResult.scenarioA.summary;
                const b = compareResult.scenarioB.summary;
                const interestA = a.totalInterest || 0;
                const interestB = b.totalInterest || 0;
                const monthsA = a.payoffMonth || 0;
                const monthsB = b.payoffMonth || 0;
                const interestSaved = Math.abs(interestA - interestB);
                const monthsSaved = Math.abs(monthsA - monthsB);
                const yearsSaved = monthsSaved / 12;
                const yearsDisplay = yearsSaved % 1 === 0 ? String(Math.round(yearsSaved)) : yearsSaved.toFixed(1);
                const monthlyPiDiff = Math.abs((a.monthlyPI || 0) - (b.monthlyPI || 0));
                const tie = monthsSaved === 0 && interestSaved < 0.01;
                const winnerB = interestB < interestA;
                const winnerName = winnerB ? t("compare_scenario_b") : t("compare_scenario_a");
                return (
              <>
                <div style={{ background: T.greenBg, border: `1px solid ${T.green}`, borderRadius: 12, padding: "16px 20px", marginBottom: 24 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 6 }}>
                    {tie ? t("compare_tie") : t("compare_winner_wins").replace("{scenario}", winnerName)}
                  </div>
                  {!tie && (
                    <p style={{ fontSize: 13, color: T.textSub, lineHeight: 1.6, margin: 0 }}>
                      {t("compare_winner_intro")
                        .replace("{months}", String(monthsSaved))
                        .replace("{years}", yearsDisplay)
                        .replace("{interest}", fmt(interestSaved, sym))}
                      <br />
                      {t("compare_monthly_pi_diff").replace("{diff}", fmt(monthlyPiDiff, sym))}
                    </p>
                  )}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                  <div style={{ background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 10, padding: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: T.accent, marginBottom: 12 }}>{t("compare_scenario_a")}</div>
                    <div style={{ fontSize: 12, color: T.textSub, marginBottom: 4 }} suppressHydrationWarning>{t("card_total_interest")}: {fmt(compareResult.scenarioA.summary.totalInterest, sym)}</div>
                    <div style={{ fontSize: 12, color: T.textSub, marginBottom: 4 }}>{t("card_payoff")}: {compareResult.scenarioA.summary.payoffYear != null ? `${compareResult.scenarioA.summary.payoffYear}-${String(compareResult.scenarioA.summary.payoffMonthNum).padStart(2, "0")}` : "—"}</div>
                    <div style={{ fontSize: 12, color: T.textSub }} suppressHydrationWarning>{t("card_monthly_pi")}: {fmt(compareResult.scenarioA.summary.monthlyPI, sym)}</div>
                  </div>
                  <div style={{ background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 10, padding: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: T.green, marginBottom: 12 }}>{t("compare_scenario_b")}</div>
                    <div style={{ fontSize: 12, color: T.textSub, marginBottom: 4 }} suppressHydrationWarning>{t("card_total_interest")}: {fmt(compareResult.scenarioB.summary.totalInterest, sym)}</div>
                    <div style={{ fontSize: 12, color: T.textSub, marginBottom: 4 }}>{t("card_payoff")}: {compareResult.scenarioB.summary.payoffYear != null ? `${compareResult.scenarioB.summary.payoffYear}-${String(compareResult.scenarioB.summary.payoffMonthNum).padStart(2, "0")}` : "—"}</div>
                    <div style={{ fontSize: 12, color: T.textSub }} suppressHydrationWarning>{t("card_monthly_pi")}: {fmt(compareResult.scenarioB.summary.monthlyPI, sym)}</div>
                  </div>
                </div>
                <CompareScenarioChart lineData={compareLineData} T={T} sym={sym} t={t} tooltipStyle={tooltipStyle} />
              </>
                );
              })()}
          </>
        )}

        {/* ── FAQ ───────────────────────────────────────────────────────────── */}
        <section id="faq" aria-label={t("faq_title")} style={{ marginTop: 40, paddingTop: 32, borderTop: `1px solid ${T.border}` }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: T.text, marginBottom: 8 }}>{t("faq_title")}</h2>
          <p style={{ fontSize: 14, color: T.textSub, marginBottom: 20 }}>{t("faq_subtitle")}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {MORTGAGE_FAQ_DATA.map((item) => (
              <details
                key={item.id}
                id={"faq-" + item.id}
                style={{
                  background: T.surface,
                  border: `1px solid ${T.border}`,
                  borderRadius: 12,
                  overflow: "hidden",
                }}
              >
                <summary
                  style={{
                    padding: "14px 16px",
                    fontSize: 14,
                    fontWeight: 600,
                    color: T.text,
                    cursor: "pointer",
                    listStyle: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <span style={{ margin: 0, fontSize: "inherit", fontWeight: "inherit" }}>{lang === "en" ? item.questionEn : item.questionHy}</span>
                  <span style={{ color: T.textMuted, fontSize: 12, flexShrink: 0 }} aria-hidden>▼</span>
                </summary>
                <div style={{ padding: "0 16px 14px 16px", borderTop: `1px solid ${T.borderSub}` }}>
                  <p style={{ fontSize: 13, color: T.textSub, lineHeight: 1.65, margin: 0 }}>
                    {lang === "en" ? item.answerEn : item.answerHy}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
