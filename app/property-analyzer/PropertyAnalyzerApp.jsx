"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "../ThemeContext.jsx";
import SharedHeader from "../SharedHeader.jsx";
import {
  computeScenario,
  computePropertyHealthScore,
  getPropertyInsights,
} from "../../lib/propertyAnalyzer.js";
import WizardSteps from "./WizardSteps.jsx";
import ResultsView from "./ResultsView.jsx";

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
  const pathname = usePathname();
  const lang = langProp ?? (pathname?.startsWith("/en") ? "en" : "hy");
  const { T } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [form, setForm] = useState(defaultFormState);
  const [currency, setCurrency] = useState("AMD");
  const sym = CURRENCY_SYMBOLS[currency];

  useEffect(() => setMounted(true), []);
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

      <SharedHeader />
      <div style={{ background: T.surfaceAlt, borderBottom: `1px solid ${T.border}`, padding: "10px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: T.text }}>
            {lang === "en" ? "Property Affordability & Rental Analyzer" : "Գույքի ձեռքբերելիություն և վարձակալության վերլուծիչ"}
          </span>
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
          </div>
        </div>
      </div>

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
