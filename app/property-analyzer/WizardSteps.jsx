"use client";

import { useState } from "react";
import StepIncome from "./steps/StepIncome.jsx";
import StepExpenses from "./steps/StepExpenses.jsx";
import StepSavings from "./steps/StepSavings.jsx";
import StepLoanTerms from "./steps/StepLoanTerms.jsx";
import StepRental from "./steps/StepRental.jsx";

export const WIZARD_TRANSLATIONS = {
  en: {
    step_of: "Step {current} of 5",
    back: "Back",
    next: "Next",
    see_results: "See results",
    step1_title: "Income",
    step2_title: "Expenses",
    step3_title: "Savings",
    step4_title: "Loan terms",
    step5_title: "Rental plan",
    monthly_salary: "Monthly salary (AMD)",
    additional_income: "Additional income (AMD)",
    living_expenses: "Living expenses (AMD)",
    existing_loans: "Existing loans (AMD)",
    other_obligations: "Other obligations (AMD)",
    cash_savings: "Cash savings (AMD)",
    bank_deposits: "Bank deposits (AMD)",
    planned_down_payment: "Planned down payment (AMD)",
    interest_rate: "Interest rate (%)",
    loan_term_years: "Loan term (years)",
    min_down_payment_pct: "Minimum down payment (%)",
    property_price_optional: "Property price (optional, AMD)",
    property_price_placeholder: "Leave empty to see max affordable price",
    plan_to_rent: "Do you plan to rent this property?",
    yes: "Yes",
    no: "No",
    expected_rent: "Expected rent (AMD/month)",
    maintenance_costs: "Maintenance costs (AMD/month)",
    property_tax: "Property tax (AMD/month)",
    vacancy_rate: "Vacancy rate (%)",
    total_income: "Total income",
    total_savings: "Total savings",
    down_payment_warning: "Down payment cannot exceed total savings",
    placeholder: "0",
  },
  hy: {
    step_of: "Քայլ {current} 5-ից",
    back: "Հետ",
    next: "Հաջորդ",
    see_results: "Տեսնել արդյունքները",
    step1_title: "Եկամուտ",
    step2_title: "Ծախսեր",
    step3_title: "Խնայողություններ",
    step4_title: "Վարկի պայմաններ",
    step5_title: "Վարձակալության պլան",
    monthly_salary: "Ամսական աշխատավարձ (AMD)",
    additional_income: "Լրացուցիչ եկամուտ (AMD)",
    living_expenses: "Ամսական ծախսեր (AMD)",
    existing_loans: "Գոյություն ունեցող վարկեր (AMD)",
    other_obligations: "Այլ պարտավորություններ (AMD)",
    cash_savings: "Կանխիկ խնայողություններ (AMD)",
    bank_deposits: "Բանկային ավանդներ (AMD)",
    planned_down_payment: "Նախատեսվող առաջին մուծում (AMD)",
    interest_rate: "Տոկոսադրույք (%)",
    loan_term_years: "Վարկի ժամկետ (տարի)",
    min_down_payment_pct: "Նվազագույն առաջին մուծում (%)",
    property_price_optional: "Գույքի գին (ըստ ցանկության, AMD)",
    property_price_placeholder: "Դատարկ թողեք՝ առավելագույն ձեռքբերելի գինը տեսնելու համար",
    plan_to_rent: "Պլանավորու՞մ եք վարձով տալ այս գույքը:",
    yes: "Այո",
    no: "Ոչ",
    expected_rent: "Ակնկալվող վարձ (AMD/ամիս)",
    maintenance_costs: "Սպասարկման ծախսեր (AMD/ամիս)",
    property_tax: "Գույքահարկ (AMD/ամիս)",
    vacancy_rate: "Դատարկության տոկոս (%)",
    total_income: "Ընդամենը եկամուտ",
    total_savings: "Ընդամենը խնայողություն",
    down_payment_warning: "Առաջին մուծումը չի կարող գերազանցել ընդհանուր խնայողությունները",
    placeholder: "0",
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

export function Field({ label, value, onChange, T, placeholder, type = "number" }) {
  const displayValue = value === undefined || value === "" || value === null ? "" : formatWithCommas(value);
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
          if (type === "optional") {
            onChange(parsed === "" ? null : parsed);
          } else {
            onChange(parsed === "" ? 0 : parsed);
          }
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

export function FieldPercent({ label, value, onChange, T, placeholder, min = 0, max = 100, step = 0.5 }) {
  const displayValue = value === undefined || value === "" ? "" : String(value);
  return (
    <div>
      <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: T.textSub, marginBottom: 6 }}>
        {label}
      </label>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        value={displayValue}
        onChange={(e) => {
          const v = e.target.value;
          if (v === "") {
            onChange(0);
            return;
          }
          const n = parseFloat(v);
          if (!Number.isNaN(n)) onChange(Math.max(min, Math.min(max, n)));
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
  const str = (WIZARD_TRANSLATIONS[lang] || WIZARD_TRANSLATIONS.en)[key] || key;
  return Object.keys(params).reduce((s, k) => s.replace(new RegExp(`\\{${k}\\}`, "g"), params[k]), str);
}

export default function WizardSteps({ lang, T, step, setStep, form, updateForm, onSeeResults, totalIncome, totalSavings }) {
  const goBack = () => setStep((s) => Math.max(1, s - 1));
  const goNext = () => setStep((s) => Math.min(5, s + 1));

  const stepTitles = [t(lang, "step1_title"), t(lang, "step2_title"), t(lang, "step3_title"), t(lang, "step4_title"), t(lang, "step5_title")];

  return (
    <>
      <div
        role="status"
        aria-live="polite"
        aria-label={t(lang, "step_of", { current: step })}
        style={{
          fontSize: 12,
          color: T.textMuted,
          marginBottom: 20,
        }}
      >
        {t(lang, "step_of", { current: step })}
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 8,
          flexWrap: "wrap",
        }}
      >
        {stepTitles.map((title, i) => (
          <span
            key={i}
            style={{
              fontSize: 11,
              padding: "4px 8px",
              borderRadius: 6,
              background: step === i + 1 ? T.accentBg : T.surfaceAlt,
              color: step === i + 1 ? T.accentText : T.textMuted,
              border: `1px solid ${step === i + 1 ? T.accent : T.border}`,
            }}
          >
            {i + 1}. {title}
          </span>
        ))}
      </div>

      <section
        style={{
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
        }}
      >
        {step === 1 && (
          <StepIncome lang={lang} T={T} form={form} updateForm={updateForm} t={t} totalIncome={totalIncome} Field={Field} />
        )}
        {step === 2 && <StepExpenses lang={lang} T={T} form={form} updateForm={updateForm} t={t} Field={Field} />}
        {step === 3 && (
          <StepSavings
            lang={lang}
            T={T}
            form={form}
            updateForm={updateForm}
            t={t}
            totalSavings={totalSavings}
            Field={Field}
          />
        )}
        {step === 4 && (
          <StepLoanTerms lang={lang} T={T} form={form} updateForm={updateForm} t={t} Field={Field} FieldPercent={FieldPercent} />
        )}
        {step === 5 && <StepRental lang={lang} T={T} form={form} updateForm={updateForm} t={t} Field={Field} FieldPercent={FieldPercent} />}
      </section>

      <div style={{ display: "flex", gap: 12, justifyContent: "space-between" }}>
        <button
          type="button"
          onClick={goBack}
          disabled={step <= 1}
          aria-label={t(lang, "back")}
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            border: `1px solid ${T.border}`,
            background: step <= 1 ? T.surfaceAlt : T.surface,
            color: step <= 1 ? T.textMuted : T.text,
            fontSize: 14,
            fontWeight: 500,
            cursor: step <= 1 ? "not-allowed" : "pointer",
          }}
        >
          {t(lang, "back")}
        </button>
        {step < 5 ? (
          <button
            type="button"
            onClick={goNext}
            aria-label={t(lang, "next")}
            style={{
              padding: "10px 20px",
              borderRadius: 8,
              border: `1px solid ${T.accent}`,
              background: T.accentBg,
              color: T.accentText,
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            {t(lang, "next")}
          </button>
        ) : (
          <button
            type="button"
            onClick={onSeeResults}
            aria-label={t(lang, "see_results")}
            style={{
              padding: "10px 20px",
              borderRadius: 8,
              border: `1px solid ${T.green}`,
              background: T.greenBg,
              color: T.greenText,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {t(lang, "see_results")}
          </button>
        )}
      </div>
    </>
  );
}
