"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { DARK, LIGHT } from "../../lib/theme.js";
import { BENCHMARKS } from "../../lib/financialHealthBenchmarks.js";
import { computeHealthScore, getActionPlan } from "../../lib/financialHealthScore.js";
import { projectEmergencyFund } from "./EmergencyFundChart.jsx";

const EmergencyFundChart = dynamic(() => import("./EmergencyFundChart.jsx"), { ssr: false });

const THEME_STORAGE_KEY = "deposit-calc-theme";

const TRANSLATIONS = {
  en: {
    title: "Financial Health Check",
    subtitle: "See how you're doing",
    home: "Calculator",
    income: "Monthly net income (AMD)",
    essential: "Monthly essential expenses (AMD)",
    optional: "Monthly optional expenses (AMD)",
    totalSavings: "Current total savings (AMD)",
    monthlySavings: "Monthly savings amount (AMD)",
    totalLoans: "Total outstanding loans (AMD)",
    monthlyLoan: "Monthly loan payment (AMD)",
    calculate: "See my score",
    score_label: "Financial Health Score",
    status_financialFortress: "Financial Fortress",
    status_stable: "Stable",
    status_vulnerable: "Vulnerable",
    status_atRisk: "At Risk",
    status_critical: "Critical",
    pillar_emergency: "Emergency Fund",
    pillar_debt: "Debt Level",
    pillar_savings: "Savings Rate",
    pillar_liquidity: "Liquidity",
    pillar_stability: "Stability Buffer",
    label_weak: "Weak",
    label_healthy: "Healthy",
    label_strong: "Strong",
    label_critical: "Critical",
    label_moderate: "Moderate",
    label_risky: "Risky",
    label_average: "Average",
    label_excellent: "Excellent",
    label_highRisk: "High risk",
    label_dangerous: "Dangerous",
    emergency_need_more: "You need {months} more months of coverage.",
    emergency_target: "Recommended target: {amount} AMD.",
    debt_monitor: "Debt-to-income ratio: {pct}%. Safe, but monitor growth.",
    debt_high: "Debt-to-income ratio: {pct}%. Consider reducing debt.",
    savings_above_avg: "Above Armenian average.",
    savings_below: "Below average. Try to save more each month.",
    action_plan_title: "Personalized Action Plan",
    action_emergency_fund: "Build emergency fund to {targetMonths} months (target: {targetAmount} AMD).",
    action_avoid_new_loans: "Avoid new consumer loans; focus on paying down existing debt.",
    action_increase_savings: "Increase monthly savings where possible.",
    action_high_yield_deposits: "Keep deposits in high-yield accounts.",
    compare_above: "Above Armenian average.",
    compare_below: "Below Armenian average.",
    emergency_planner_title: "Emergency Fund Planner",
    emergency_planner_intro: "How long to build a safe emergency fund?",
    emergency_current: "Current emergency fund (AMD)",
    emergency_target_months: "Target (months)",
    emergency_monthly_add: "Monthly savings toward goal (AMD)",
    emergency_months_to_goal: "Months to reach goal: {n}",
    emergency_cta: "Use our deposit calculator to plan growth",
    share: "Share",
    invite: "Invite a friend",
    copy_link: "Copy link",
    link_copied: "Link copied!",
    share_text: "Check your financial health on Saving.am",
    invite_text: "I just checked my financial health on Saving.am — try it too!",
    lang_english: "English",
    lang_armenian: "Հայերեն",
    theme_light: "Light",
    theme_dark: "Dark",
    theme_system: "System",
    disclaimer: "For informational purposes only. Not financial advice.",
    chart_tooltip: "Month {month}",
    section_income: "Income",
    section_expenses: "Expenses",
    section_savings: "Savings",
    section_debt: "Debt",
    placeholder_amount: "0",
  },
  hy: {
    title: "Ֆինանսական առողջության ստուգում",
    subtitle: "Տեսեք, թե ինչպես եք — Հայաստանի չափանիշներ",
    home: "Հաշվիչ",
    income: "Ամսական զուտ եկամուտ (AMD)",
    essential: "Ամսական հիմնական ծախսեր (AMD)",
    optional: "Ամսական կողմնակի ծախսեր (AMD)",
    totalSavings: "Ընթացիկ ընդհանուր խնայողություններ (AMD)",
    monthlySavings: "Ամսական խնայողություն (AMD)",
    totalLoans: "Ընդհանուր վարկեր (AMD)",
    monthlyLoan: "Ամսական վարկի վճար (AMD)",
    calculate: "Տեսնել իմ միավորն",
    score_label: "Ֆինանսական առողջության միավոր",
    status_financialFortress: "Ֆինանսական ամրոց",
    status_stable: "Կայուն",
    status_vulnerable: "Խոցելի",
    status_atRisk: "Ռիսկի տակ",
    status_critical: "Կրիտիկական",
    pillar_emergency: "Արտակարգ միջոցներ",
    pillar_debt: "Պարտքի մակարդակ",
    pillar_savings: "Խնայողության տոկոս",
    pillar_liquidity: "Լիկվիդություն",
    pillar_stability: "Կայունության բուֆեր",
    label_weak: "Թույլ",
    label_healthy: "Առողջ",
    label_strong: "Ուժեղ",
    label_critical: "Կրիտիկական",
    label_moderate: "Չափավոր",
    label_risky: "Ռիսկային",
    label_average: "Միջին",
    label_excellent: "Գերազանց",
    label_highRisk: "Բարձր ռիսկ",
    label_dangerous: "Վտանգավոր",
    emergency_need_more: "Ձեզ անհրաժեշտ է {months} ամիս ավելի ծածկույթ:",
    emergency_target: "Խորհուրդ՝ նպատակ {amount} AMD.",
    debt_monitor: "Պարտք/եկամուտ: {pct}%. Անվտանգ, բայց վերահսկեք աճը:",
    debt_high: "Պարտք/եկամուտ: {pct}%. Խորհուրդ՝ նվազեցնել պարտքը:",
    savings_above_avg: "Հայաստանի միջինից բարձր:",
    savings_below: "Միջինից ցածր: Փորձեք ամսական ավելի խնայել:",
    action_plan_title: "Անհատականացված գործ плаն",
    action_emergency_fund: "Արտակարգ միջոցները հասցնել {targetMonths} ամսվա (նպատակ: {targetAmount} AMD):",
    action_avoid_new_loans: "Խուսափել նոր սպառողական վարկերից, կենտրոնանալ առկա պարտքի մարման վրա:",
    action_increase_savings: "Հնարավորության դեպքում ավելացնել ամսական խնայողությունները:",
    action_high_yield_deposits: "Ավանդները պահել բարձր տոկոսով հաշիվներում:",
    compare_above: "Հայաստանի միջինից բարձր:",
    compare_below: "Հայաստանի միջինից ցածր:",
    emergency_planner_title: "Արտակարգ միջոցների պլանավորիչ",
    emergency_planner_intro: "Քանի՞ ամսում կարող եք հավաքել ապահով արտակարգ միջոց:",
    emergency_current: "Ընթացիկ արտակարգ միջոց (AMD)",
    emergency_target_months: "Նպատակ (ամիս)",
    emergency_monthly_add: "Ամսական խնայողություն նպատակի համար (AMD)",
    emergency_months_to_goal: "Նպատակին հասնելու ամիսներ: {n}",
    emergency_cta: "Օգտագործեք ավանդի հաշվիչը աճը պլանավորելու համար",
    share: "Կիսվել",
    invite: "Հրավիրել ընկերոջը",
    copy_link: "Պատճենել հղումը",
    link_copied: "Հղումը պատճենվեց:",
    share_text: "Ստուգեք ձեր ֆինանսական առողջությունը Saving.am-ում",
    invite_text: "Նոր ստուգեցի իմ ֆինանսական առողջությունը Saving.am-ում — փորձեք դ vyք էլ:",
    lang_english: "English",
    lang_armenian: "Հայերեն",
    theme_light: "Բաց",
    theme_dark: "Մութ",
    theme_system: "Համակարգ",
    disclaimer: "Միայն տեղեկատվական: Ֆինանսական խորհուրդ չէ:",
    chart_tooltip: "Ամիս {month}",
    section_income: "Եկամուտ",
    section_expenses: "Ծախսեր",
    section_savings: "Խնայողություններ",
    section_debt: "Պարտք",
    placeholder_amount: "0",
  },
};

function formatWithCommas(num) {
  if (num === "" || num === undefined || num === null) return "";
  const n = Number(num);
  if (Number.isNaN(n)) return "";
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function parseFormattedInput(str) {
  const digits = String(str).replace(/\D/g, "");
  if (digits === "") return "";
  const n = Number(digits);
  return Number.isNaN(n) ? "" : n;
}

function Field({ label, value, onChange, T, placeholder }) {
  const displayValue = value === undefined || value === "" ? "" : formatWithCommas(value);
  return (
    <div>
      <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: T.textSub, marginBottom: 6 }}>
        {label}
      </label>
      <input
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder={placeholder}
        value={displayValue}
        onChange={(e) => {
          const parsed = parseFormattedInput(e.target.value);
          onChange(parsed === "" ? "" : parsed);
        }}
        style={{
          width: "100%",
          background: T.surfaceAlt,
          border: `1px solid ${T.border}`,
          borderRadius: 8,
          padding: "10px 12px",
          fontSize: 14,
          color: T.text,
        }}
      />
    </div>
  );
}

function t(lang, key, params = {}) {
  let s = (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || TRANSLATIONS.en[key] || key;
  if (typeof s === "string" && params) {
    Object.keys(params).forEach((k) => {
      s = s.replace(new RegExp(`\\{${k}\\}`, "g"), String(params[k]));
    });
  }
  return s;
}

function getPillarColor(band, T) {
  const r = band.scoreRatio;
  if (r >= 0.7) return T.green;
  if (r >= 0.35) return T.yellow;
  return T.red;
}

function getStatusLabelKey(statusBand) {
  return `status_${statusBand.labelKey}`;
}

function getBandLabelKey(band) {
  const key = band.labelKey;
  if (key === "healthy" || key === "strong" || key === "excellent") return `label_${key}`;
  if (key === "weak" || key === "critical") return `label_${key}`;
  if (key === "moderate" || key === "average" || key === "risky") return `label_${key}`;
  if (key === "highRisk" || key === "dangerous") return `label_${key}`;
  return `label_${key}`;
}

export default function FinancialHealthApp({ lang: langProp }) {
  const pathname = usePathname();
  const router = useRouter();
  const lang = langProp ?? (pathname?.startsWith("/en") ? "en" : "hy");

  const [themeMode, setThemeMode] = useState("system");
  const [systemDark, setSystemDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const [income, setIncome] = useState("");
  const [essential, setEssential] = useState("");
  const [optional, setOptional] = useState("");
  const [totalSavings, setTotalSavings] = useState("");
  const [monthlySavings, setMonthlySavings] = useState("");
  const [totalLoans, setTotalLoans] = useState("");
  const [monthlyLoan, setMonthlyLoan] = useState("");

  const [efTargetMonths, setEfTargetMonths] = useState(6);
  const [efMonthlyAdd, setEfMonthlyAdd] = useState("");

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!mounted) return;
    const stored = typeof window !== "undefined" ? localStorage.getItem(THEME_STORAGE_KEY) : null;
    if (stored === "light" || stored === "dark" || stored === "system") setThemeMode(stored);
  }, [mounted]);
  useEffect(() => {
    if (!mounted || themeMode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemDark(mq.matches);
    const fn = (e) => setSystemDark(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, [mounted, themeMode]);

  // Auto-calculate potential monthly savings from income − essential − optional; apply if non-negative
  useEffect(() => {
    const inc = Number(income) || 0;
    const ess = Number(essential) || 0;
    const opt = Number(optional) || 0;
    const potential = inc - ess - opt;
    if (potential >= 0) {
      setMonthlySavings(potential);
    }
  }, [income, essential, optional]);

  const dark = themeMode === "system" ? systemDark : themeMode === "dark";
  const T = dark ? DARK : LIGHT;

  const goToLang = (newLang) => {
    if (newLang === "en") router.push("/en/financial-health");
    else router.push("/financial-health");
  };

  const setTheme = (mode) => {
    setThemeMode(mode);
    if (typeof window !== "undefined") localStorage.setItem(THEME_STORAGE_KEY, mode);
  };

  const inputs = useMemo(
    () => ({
      monthlyIncome: Number(income) || 0,
      essentialExpenses: Number(essential) || 0,
      optionalExpenses: Number(optional) || 0,
      totalSavings: Number(totalSavings) || 0,
      monthlySavings: Number(monthlySavings) || 0,
      totalLoans: Number(totalLoans) || 0,
      monthlyLoanPayment: Number(monthlyLoan) || 0,
    }),
    [income, essential, optional, totalSavings, monthlySavings, totalLoans, monthlyLoan]
  );

  const result = useMemo(
    () => computeHealthScore(inputs, BENCHMARKS),
    [inputs]
  );

  const actionPlan = useMemo(() => getActionPlan(result, BENCHMARKS), [result]);

  const efTargetAmount = (Number(essential) || 0) * efTargetMonths;
  const efProjection = useMemo(
    () => projectEmergencyFund(Number(totalSavings) || 0, Number(efMonthlyAdd) || 0, efTargetAmount),
    [totalSavings, efMonthlyAdd, efTargetAmount]
  );

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const baseShareText = t(lang, "share_text");
  const inviteShareText = t(lang, "invite_text");

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Saving.am — Financial Health",
          text: baseShareText,
          url: shareUrl,
        });
      } catch (e) {
        if (e.name !== "AbortError") copyToClipboard(shareUrl);
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const handleInvite = async () => {
    const text = `${inviteShareText} ${shareUrl}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Saving.am — Financial Health",
          text: inviteShareText,
          url: shareUrl,
        });
      } catch (e) {
        if (e.name !== "AbortError") copyToClipboard(text);
      }
    } else {
      copyToClipboard(text);
    }
  };

  function copyToClipboard(text) {
    if (typeof navigator?.clipboard?.writeText === "function") {
      navigator.clipboard.writeText(text).then(() => {
        setCopyFeedback(true);
        setTimeout(() => setCopyFeedback(false), 2000);
      });
    }
  }

  const calculatorHref = lang === "en" ? "/en" : "/";
  const sym = "֏";

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        background: T.bg,
        minHeight: "100vh",
        color: T.text,
        transition: "background .2s, color .2s",
      }}
    >
      <style>{`
        input:focus, select:focus { border-color: ${T.accent} !important; outline: none; }
        input[type=number] { -moz-appearance: textfield; }
        input[type=number]::-webkit-outer-spin-button, input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
      `}</style>

      {/* Header */}
      <header
        style={{
          background: T.surface,
          borderBottom: `1px solid ${T.border}`,
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: T.shadow,
        }}
      >
        <div
          style={{
            maxWidth: 800,
            margin: "0 auto",
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link
              href={calculatorHref}
              style={{
                fontSize: 14,
                color: T.accent,
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              ← {t(lang, "home")}
            </Link>
            <span style={{ color: T.border }}>|</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: T.text }}>{t(lang, "title")}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <select
              value={themeMode}
              onChange={(e) => setTheme(e.target.value)}
              style={{
                background: T.surfaceAlt,
                border: `1px solid ${T.border}`,
                borderRadius: 8,
                padding: "6px 10px",
                fontSize: 12,
                color: T.text,
                cursor: "pointer",
              }}
            >
              <option value="system">{t(lang, "theme_system")}</option>
              <option value="light">{t(lang, "theme_light")}</option>
              <option value="dark">{t(lang, "theme_dark")}</option>
            </select>
            <button
              type="button"
              onClick={() => goToLang("hy")}
              style={{
                padding: "6px 10px",
                borderRadius: 8,
                border: `1px solid ${lang === "hy" ? T.accent : T.border}`,
                background: lang === "hy" ? T.accentBg : "transparent",
                color: lang === "hy" ? T.accentText : T.textSub,
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              HY
            </button>
            <button
              type="button"
              onClick={() => goToLang("en")}
              style={{
                padding: "6px 10px",
                borderRadius: 8,
                border: `1px solid ${lang === "en" ? T.accent : T.border}`,
                background: lang === "en" ? T.accentBg : "transparent",
                color: lang === "en" ? T.accentText : T.textSub,
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              EN
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
        <p style={{ fontSize: 14, color: T.textSub, marginBottom: 24 }}>{t(lang, "subtitle")}</p>

        {/* Form */}
        <section
          style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 12,
            padding: 20,
            marginBottom: 24,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Income */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                {t(lang, "section_income")}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
                <Field label={t(lang, "income")} value={income} onChange={setIncome} T={T} placeholder={t(lang, "placeholder_amount")} />
              </div>
            </div>
            {/* Expenses */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                {t(lang, "section_expenses")}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
                <Field label={t(lang, "essential")} value={essential} onChange={setEssential} T={T} placeholder={t(lang, "placeholder_amount")} />
                <Field label={t(lang, "optional")} value={optional} onChange={setOptional} T={T} placeholder={t(lang, "placeholder_amount")} />
              </div>
            </div>
            {/* Savings */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                {t(lang, "section_savings")}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
                <Field label={t(lang, "totalSavings")} value={totalSavings} onChange={setTotalSavings} T={T} placeholder={t(lang, "placeholder_amount")} />
                <Field label={t(lang, "monthlySavings")} value={monthlySavings} onChange={setMonthlySavings} T={T} placeholder={t(lang, "placeholder_amount")} />
              </div>
            </div>
            {/* Debt */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                {t(lang, "section_debt")}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
                <Field label={t(lang, "totalLoans")} value={totalLoans} onChange={setTotalLoans} T={T} placeholder={t(lang, "placeholder_amount")} />
                <Field label={t(lang, "monthlyLoan")} value={monthlyLoan} onChange={setMonthlyLoan} T={T} placeholder={t(lang, "placeholder_amount")} />
              </div>
            </div>
          </div>
        </section>

        <div style={{ marginBottom: 24 }}>
          <button
            type="button"
            disabled={income === "" || essential === ""}
            onClick={() => setShowResults(true)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "14px 28px",
              borderRadius: 12,
              border: "none",
              background: income === "" || essential === "" ? T.border : T.accent,
              color: income === "" || essential === "" ? T.textMuted : "#fff",
              fontSize: 16,
              fontWeight: 700,
              cursor: income === "" || essential === "" ? "not-allowed" : "pointer",
            }}
          >
            {t(lang, "calculate")}
          </button>
        </div>

        {showResults && (
        <>
        {/* Score block */}
        <section
          style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 16,
            padding: 28,
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, color: T.textSub, marginBottom: 8 }}>
            {t(lang, "score_label")}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
            <ScoreGauge score={result.totalScore} T={T} />
            <div>
              <div style={{ fontSize: 36, fontWeight: 800, color: T.text, letterSpacing: "-0.02em" }}>
                {result.totalScore} / 100
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: getPillarColor({ scoreRatio: result.totalScore / 100 }, T),
                  marginTop: 4,
                }}
              >
                {t(lang, getStatusLabelKey(result.statusBand))}
              </div>
            </div>
          </div>
        </section>

        {/* Pillar breakdown */}
        <section style={{ marginBottom: 24 }}>
          {[
            {
              key: "emergencyFund",
              titleKey: "pillar_emergency",
              metrics: result.metrics,
              breakdown: result.breakdown.emergencyFund,
              context: (m) =>
                m.emergencyMonths < BENCHMARKS.emergencyFundMonthsStrong
                  ? t(lang, "emergency_need_more", {
                      months: (BENCHMARKS.emergencyFundMonthsStrong - m.emergencyMonths).toFixed(1),
                    }) +
                    " " +
                    t(lang, "emergency_target", {
                      amount: Math.round(essential * BENCHMARKS.emergencyFundMonthsStrong).toLocaleString(),
                    })
                  : null,
            },
            {
              key: "debtBurden",
              titleKey: "pillar_debt",
              metrics: result.metrics,
              breakdown: result.breakdown.debtBurden,
              context: (m) =>
                m.dti <= 35 ? t(lang, "debt_monitor", { pct: m.dti.toFixed(0) }) : t(lang, "debt_high", { pct: m.dti.toFixed(0) }),
            },
            {
              key: "savingsRate",
              titleKey: "pillar_savings",
              metrics: result.metrics,
              breakdown: result.breakdown.savingsRate,
              context: (m) =>
                m.savingsRatePct >= BENCHMARKS.averageSavingsRatePct ? t(lang, "savings_above_avg") : t(lang, "savings_below"),
            },
            {
              key: "liquidity",
              titleKey: "pillar_liquidity",
              metrics: result.metrics,
              breakdown: result.breakdown.liquidity,
              context: () => null,
            },
            {
              key: "stability",
              titleKey: "pillar_stability",
              metrics: result.metrics,
              breakdown: result.breakdown.stability,
              context: () => null,
            },
          ].map(({ key, titleKey, breakdown, context }) => {
            const color = getPillarColor(breakdown.band, T);
            const ctx = context(result.metrics);
            return (
              <div
                key={key}
                style={{
                  background: T.surface,
                  border: `1px solid ${T.border}`,
                  borderLeft: `4px solid ${color}`,
                  borderRadius: 10,
                  padding: "14px 16px",
                  marginBottom: 10,
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>
                  {t(lang, titleKey)}: {t(lang, getBandLabelKey(breakdown.band))}
                </div>
                {ctx && <div style={{ fontSize: 12, color: T.textSub, marginTop: 4 }}>{ctx}</div>}
                <div
                  style={{
                    marginTop: 8,
                    height: 6,
                    background: T.surfaceAlt,
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${(breakdown.points / breakdown.max) * 100}%`,
                      height: "100%",
                      background: color,
                      borderRadius: 3,
                      transition: "width .3s",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </section>

        {/* Action plan */}
        <section
          style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 12,
            padding: 20,
            marginBottom: 24,
          }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 12 }}>
            {t(lang, "action_plan_title")}
          </h3>
          <ol style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: T.textSub, lineHeight: 1.7 }}>
            {actionPlan.map((item, i) => (
              <li key={i} style={{ marginBottom: 6 }}>
                {item.actionKey === "action_emergency_fund" && item.params
                  ? t(lang, item.actionKey, {
                      targetMonths: item.params.targetMonths,
                      targetAmount: item.params.targetAmount?.toLocaleString?.() ?? item.params.targetAmount,
                    })
                  : t(lang, item.actionKey)}
              </li>
            ))}
          </ol>
        </section>

        {/* Share / Invite */}
        <section style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 32 }}>
          <button
            type="button"
            onClick={handleShare}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 16px",
              borderRadius: 10,
              border: `1px solid ${T.accent}`,
              background: T.accentBg,
              color: T.accentText,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {t(lang, "share")}
          </button>
          <button
            type="button"
            onClick={handleInvite}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 16px",
              borderRadius: 10,
              border: `1px solid ${T.green}`,
              background: T.greenBg,
              color: T.greenText,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {t(lang, "invite")}
          </button>
          {copyFeedback && (
            <span style={{ fontSize: 13, color: T.green, alignSelf: "center" }}>{t(lang, "link_copied")}</span>
          )}
        </section>

        {/* Emergency Fund Planner */}
        <section
          style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 12,
            padding: 20,
            marginBottom: 24,
          }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 8 }}>
            {t(lang, "emergency_planner_title")}
          </h3>
          <p style={{ fontSize: 13, color: T.textSub, marginBottom: 16 }}>{t(lang, "emergency_planner_intro")}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12, marginBottom: 16 }}>
            <Field label={t(lang, "emergency_current")} value={totalSavings} onChange={setTotalSavings} T={T} placeholder={t(lang, "placeholder_amount")} />
            <div>
              <label style={{ display: "block", fontSize: 11, color: T.textMuted, marginBottom: 4 }}>
                {t(lang, "emergency_target_months")}
              </label>
              <select
                value={efTargetMonths}
                onChange={(e) => setEfTargetMonths(Number(e.target.value))}
                style={{
                  width: "100%",
                  background: T.surfaceAlt,
                  border: `1px solid ${T.border}`,
                  borderRadius: 8,
                  padding: "8px 10px",
                  fontSize: 14,
                  color: T.text,
                  cursor: "pointer",
                }}
              >
                {[3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <Field label={t(lang, "emergency_monthly_add")} value={efMonthlyAdd} onChange={setEfMonthlyAdd} T={T} placeholder={t(lang, "placeholder_amount")} />
          </div>
          <p style={{ fontSize: 14, fontWeight: 600, color: T.accentText, marginBottom: 12 }}>
            {t(lang, "emergency_months_to_goal", { n: efProjection.months })}
          </p>
          <EmergencyFundChart
            data={efProjection.data}
            T={T}
            sym={sym}
            tooltipLabel={t(lang, "chart_tooltip")}
          />
          <p style={{ marginTop: 16 }}>
            <Link
              href={calculatorHref}
              style={{
                fontSize: 14,
                color: T.accent,
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              → {t(lang, "emergency_cta")}
            </Link>
          </p>
        </section>

        <p style={{ fontSize: 11, color: T.textMuted }}>{t(lang, "disclaimer")}</p>
        </>
        )}
      </main>
    </div>
  );
}

function ScoreGauge({ score, T }) {
  const pct = Math.min(100, Math.max(0, score));
  const r = 44;
  const circumference = 2 * Math.PI * r;
  const strokeDashoffset = circumference - (pct / 100) * circumference;
  const color = getPillarColor({ scoreRatio: score / 100 }, T);

  return (
    <div style={{ position: "relative", width: 120, height: 120 }}>
      <svg width={120} height={120} viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke={T.surfaceAlt}
          strokeWidth="10"
        />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset .4s ease" }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          fontWeight: 800,
          color: T.text,
        }}
      >
        {score}
      </div>
    </div>
  );
}
