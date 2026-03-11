"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DARK, LIGHT } from "../../lib/theme.js";
import {
  computeScenario,
  computePropertyHealthScore,
  getPropertyInsights,
} from "../../lib/propertyAnalyzer.js";
import WizardSteps from "./WizardSteps.jsx";
import ResultsView from "./ResultsView.jsx";

const THEME_STORAGE_KEY = "deposit-calc-theme";
const INPUTS_STORAGE_KEY = "property-analyzer-last-inputs";
const CURRENCY_SYMBOLS = { AMD: "֏", USD: "$", EUR: "€" };

const defaultFormState = () => ({
  monthlySalary: 0,
  additionalIncome: 0,
  livingExpenses: 0,
  existingLoans: 0,
  otherObligations: 0,
  cashSavings: 0,
  bankDeposits: 0,
  plannedDownPayment: 0,
  interestRate: 0,
  loanTermYears: 0,
  minDownPaymentPct: 0,
  propertyPrice: null,
  planToRent: false,
  expectedRent: 0,
  maintenanceCosts: 0,
  propertyTax: 0,
  vacancyRatePct: 0,
});

export default function PropertyAnalyzerApp({ lang: langProp }) {
  const router = useRouter();
  const lang = langProp || "hy";

  const [mounted, setMounted] = useState(false);
  const [themeMode, setThemeMode] = useState("system");
  const [systemDark, setSystemDark] = useState(false);
  const [step, setStep] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [form, setForm] = useState(defaultFormState);
  const [currency, setCurrency] = useState("AMD");

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") setThemeMode(stored);
  }, [mounted]);
  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(INPUTS_STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data && typeof data === "object") {
          setForm((prev) => ({ ...defaultFormState(), ...data }));
          if (data.currency === "USD" || data.currency === "EUR") setCurrency(data.currency);
        }
      }
    } catch (_) {}
  }, [mounted]);
  useEffect(() => {
    if (!mounted || themeMode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemDark(mq.matches);
    const fn = (e) => setSystemDark(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, [mounted, themeMode]);

  const dark = themeMode === "system" ? systemDark : themeMode === "dark";
  const T = dark ? DARK : LIGHT;
  const sym = CURRENCY_SYMBOLS[currency];

  const setTheme = (mode) => {
    setThemeMode(mode);
    if (typeof window !== "undefined") localStorage.setItem(THEME_STORAGE_KEY, mode);
  };

  const goToLang = (newLang) => {
    if (newLang === "en") router.push("/en/property-analyzer");
    else router.push("/property-analyzer");
  };

  const updateForm = (updates) => setForm((prev) => ({ ...prev, ...updates }));

  const totalIncome = (form.monthlySalary || 0) + (form.additionalIncome || 0);
  const totalExpenses = (form.livingExpenses || 0) + (form.existingLoans || 0) + (form.otherObligations || 0);
  const totalSavings = (form.cashSavings || 0) + (form.bankDeposits || 0);
  const totalDownPayment = Math.min(
    form.plannedDownPayment ?? 0,
    totalSavings,
    form.propertyPrice != null ? form.propertyPrice : Infinity
  );

  const scenarioResult = useMemo(() => {
    try {
      return computeScenario({
        ...form,
        totalIncome,
        totalExpenses,
        totalSavings,
        totalDownPayment,
      });
    } catch (_) {
      return null;
    }
  }, [form, totalIncome, totalExpenses, totalSavings, totalDownPayment]);

  const healthResult = useMemo(() => {
    if (!scenarioResult) return null;
    try {
      return computePropertyHealthScore({
        totalIncome,
        monthlyPayment: scenarioResult.monthlyPayment ?? scenarioResult.maxSafeMonthlyPayment ?? 0,
        downPayment: scenarioResult.downPayment ?? totalDownPayment,
        propertyPrice: scenarioResult.propertyPrice ?? scenarioResult.affordablePrice ?? 0,
        planToRent: form.planToRent,
        monthlyProfit: scenarioResult.monthlyProfit,
        expectedRent: form.expectedRent || 0,
        coverageRatio: scenarioResult.coverageRatio,
      });
    } catch (_) {
      return null;
    }
  }, [scenarioResult, totalIncome, totalDownPayment, form.planToRent, form.expectedRent]);

  const insights = useMemo(() => {
    if (!scenarioResult || !healthResult) return [];
    try {
      return getPropertyInsights({
        scenario: scenarioResult.scenario,
        monthlyPayment: scenarioResult.monthlyPayment ?? scenarioResult.maxSafeMonthlyPayment ?? 0,
        totalIncome,
        effectiveRent: scenarioResult.effectiveRent,
        totalCosts: scenarioResult.totalCosts,
        coverageRatio: scenarioResult.coverageRatio,
        healthBand: healthResult.band,
        planToRent: form.planToRent,
        downPaymentPct: scenarioResult.propertyPrice
          ? (scenarioResult.downPayment / scenarioResult.propertyPrice) * 100
          : totalDownPayment && scenarioResult.affordablePrice
            ? (totalDownPayment / scenarioResult.affordablePrice) * 100
            : 0,
      });
    } catch (_) {
      return [];
    }
  }, [scenarioResult, healthResult, totalIncome, form.planToRent, totalDownPayment]);

  const handleSeeResults = () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(INPUTS_STORAGE_KEY, JSON.stringify({ ...form, currency }));
      } catch (_) {}
    }
    setShowResults(true);
  };

  const handleEditInputs = () => setShowResults(false);

  const calculatorHref = lang === "en" ? "/en" : "/";

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
              style={{ fontSize: 14, color: T.accent, textDecoration: "none", fontWeight: 500 }}
            >
              ← {lang === "en" ? "Calculator" : "Հաշվիչ"}
            </Link>
            <span style={{ color: T.border }}>|</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: T.text }}>
              {lang === "en" ? "Property Affordability & Rental Analyzer" : "Գույքի ձեռքբերելիություն և վարձակալության վերլուծիչ"}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 500, color: T.textMuted, marginRight: 2 }}>{lang === "en" ? "Currency" : "Արժույթ"}</span>
            {["AMD", "USD", "EUR"].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCurrency(c)}
                style={{
                  padding: "6px 10px",
                  borderRadius: 8,
                  border: `1px solid ${currency === c ? T.accent : T.border}`,
                  background: currency === c ? T.accentBg : "transparent",
                  color: currency === c ? T.accentText : T.textSub,
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                {CURRENCY_SYMBOLS[c]} {c}
              </button>
            ))}
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
              <option value="system">{lang === "en" ? "System" : "Համակարգ"}</option>
              <option value="light">{lang === "en" ? "Light" : "Բաց"}</option>
              <option value="dark">{lang === "en" ? "Dark" : "Մութ"}</option>
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
        {showResults ? (
          <ResultsView
            lang={lang}
            T={T}
            sym={sym}
            currency={currency}
            form={form}
            scenarioResult={scenarioResult}
            healthResult={healthResult}
            insights={insights}
            onEditInputs={handleEditInputs}
          />
        ) : (
          <WizardSteps
            lang={lang}
            T={T}
            sym={sym}
            currency={currency}
            step={step}
            setStep={setStep}
            form={form}
            updateForm={updateForm}
            onSeeResults={handleSeeResults}
            totalIncome={totalIncome}
            totalSavings={totalSavings}
          />
        )}
      </main>
    </div>
  );
}
