"use client";

import { useState } from "react";
import StepIncome from "./steps/StepIncome.jsx";
import StepExpenses from "./steps/StepExpenses.jsx";
import StepSavings from "./steps/StepSavings.jsx";
import StepLoanTerms from "./steps/StepLoanTerms.jsx";
import StepRental from "./steps/StepRental.jsx";

const INTRO_TRANSLATIONS = {
  en: {
    title: "Property Affordability & Rental Investment Analyzer",
    description1:
      "This free tool helps you understand how much property you can afford based on your income, expenses, savings, and loan terms. It calculates your maximum safe mortgage payment, affordable property price range, and—if you plan to rent—whether rental income can cover the loan and costs.",
    description2:
      "Use it whether you already have a property price in mind or are still exploring: enter your finances step by step and get a financial health score plus clear insights and charts.",
    when_to_use_title: "When to use this calculator",
    when_to_use_1: "You are planning to buy a home or investment property and want to know your budget.",
    when_to_use_2: "You want to check if a specific property price is affordable for you.",
    when_to_use_3: "You are considering a mortgage and need the maximum loan and monthly payment you can safely take.",
    when_to_use_4: "You plan to rent the property and want to see if rent will cover the mortgage and costs.",
    when_to_use_5: "You want to see how your savings and down payment affect the property price you can afford.",
    disclaimer: "For informational purposes only. Not financial or legal advice. Conditions and rates vary by bank and market.",
  },
  hy: {
    title: "Գույքի ձեռքբերելիություն և վարձակալության ներդրումների վերլուծիչ",
    description1:
      "Այս անվճար գործիքը օգնում է հասկանալ, թե ինչ գնով գույք կարող եք ձեռք բերել՝ հիմնվելով եկամտի, ծախսերի, խնայողությունների և վարկի պայմանների վրա: Հաշվարկվում են առավելագույն անվտանգ ամսական վճարը, ձեռքբերելի գնային միջակայքը և—եթե պլանավորում եք վարձով տալ—արդյոք վարձակալության եկամուտը կծածկի վարկը և ծախսերը:",
    description2:
      "Կարող եք օգտագործել և՛ արդեն գույքի գին ունենալիս, և՛ դեռ ուսումնասիրելիս. մուտքագրեք ֆինանսները քայլ առ քայլ և ստացեք ֆինանսական առողջության միավոր, մատչելի խորհուրդներ և գրաֆիկներ:",
    when_to_use_title: "Երբ օգտագործել այս հաշվիչը",
    when_to_use_1: "Պլանավորում եք գնել բնակարան կամ ներդրումային գույք և ցանկանում եք իմանալ ձեր բյուջեն:",
    when_to_use_2: "Ցանկանում եք ստուգել, արդյոք կոնկրետ գույքի գինը ձեզ համար ձեռքբերելի է:",
    when_to_use_3: "Դիտարկում եք hypothec և պետք է իմանաք առավելագույն վարկի և ամսական վճարի չափը, որը կարող եք անվտանգ վերցնել:",
    when_to_use_4: "Պլանավորում եք գույքը վարձով տալ և ցանկանում եք տեսնել, արդյոք վարձը կծածկի վարկը և ծախսերը:",
    when_to_use_5: "Ցանկանում եք տեսնել, թե ինչպես խնայողություններն ու առաջին մուծումը ազդում են ձեզ ձեռքբերելի գնի վրա:",
    disclaimer: "Միայն տեղեկատվական նպատակով: Ֆինանսական կամ իրավական խորհուրդ չէ: Կարգերն ու տոկոսադրույքները տարբեր են՝ կախված բանկից և շուկայից:",
  },
};

export const WIZARD_TRANSLATIONS = {
  en: {
    step_of: "Step {current} of 6",
    back: "Back",
    next: "Next",
    start: "Start",
    see_results: "See results",
    step0_title: "Overview",
    step1_title: "Income",
    step2_title: "Expenses",
    step3_title: "Savings",
    step4_title: "Loan terms",
    step5_title: "Rental plan",
    monthly_salary: "Monthly salary ({sym})",
    additional_income: "Additional income ({sym})",
    living_expenses: "Living expenses ({sym})",
    existing_loans: "Existing loans ({sym})",
    other_obligations: "Other obligations ({sym})",
    cash_savings: "Cash savings ({sym})",
    bank_deposits: "Bank deposits ({sym})",
    planned_down_payment: "Planned down payment ({sym})",
    interest_rate: "Interest rate (%)",
    loan_term_years: "Loan term (years)",
    min_down_payment_pct: "Minimum down payment (%)",
    property_price_optional: "Property price (optional, {sym})",
    property_price_placeholder: "Leave empty to see max affordable price",
    plan_to_rent: "Do you plan to rent this property?",
    yes: "Yes",
    no: "No",
    expected_rent: "Expected rent ({sym}/month)",
    maintenance_costs: "Maintenance costs ({sym}/month)",
    property_tax: "Property tax ({sym}/month)",
    vacancy_rate: "Vacancy rate (%)",
    total_income: "Total income",
    total_savings: "Total savings",
    down_payment_warning: "Down payment cannot exceed total savings",
    placeholder: "0",
    validation_income_required: "Enter at least one income (salary or additional).",
    validation_loan_interest: "Enter interest rate greater than 0.",
    validation_loan_term: "Enter loan term of at least 1 year.",
    validation_loan_down_pct: "Enter minimum down payment (10–50%).",
  },
  hy: {
    step_of: "Քայլ {current} 6-ից",
    back: "Հետ",
    next: "Հաջորդ",
    start: "Սկսել",
    see_results: "Տեսնել արդյունքները",
    step0_title: "Ակնարկ",
    step1_title: "Եկամուտ",
    step2_title: "Ծախսեր",
    step3_title: "Խնայողություններ",
    step4_title: "Վարկի պայմաններ",
    step5_title: "Վարձակալության պլան",
    monthly_salary: "Ամսական աշխատավարձ ({sym})",
    additional_income: "Լրացուցիչ եկամուտ ({sym})",
    living_expenses: "Ամսական ծախսեր ({sym})",
    existing_loans: "Գոյություն ունեցող վարկեր ({sym})",
    other_obligations: "Այլ պարտավորություններ ({sym})",
    cash_savings: "Կանխիկ խնայողություններ ({sym})",
    bank_deposits: "Բանկային ավանդներ ({sym})",
    planned_down_payment: "Նախատեսվող առաջին մուծում ({sym})",
    interest_rate: "Տոկոսադրույք (%)",
    loan_term_years: "Վարկի ժամկետ (տարի)",
    min_down_payment_pct: "Նվազագույն առաջին մուծում (%)",
    property_price_optional: "Գույքի գին (ըստ ցանկության, {sym})",
    property_price_placeholder: "Դատարկ թողեք՝ առավելագույն ձեռքբերելի գինը տեսնելու համար",
    plan_to_rent: "Պլանավորու՞մ եք վարձով տալ այս գույքը:",
    yes: "Այո",
    no: "Ոչ",
    expected_rent: "Ակնկալվող վարձ ({sym}/ամիս)",
    maintenance_costs: "Սպասարկման ծախսեր ({sym}/ամիս)",
    property_tax: "Գույքահարկ ({sym}/ամիս)",
    vacancy_rate: "Դատարկության տոկոս (%)",
    total_income: "Ընդամենը եկամուտ",
    total_savings: "Ընդամենը խնայողություն",
    down_payment_warning: "Առաջին մուծումը չի կարող գերազանցել ընդհանուր խնայողությունները",
    placeholder: "0",
    validation_income_required: "Մուտքագրեք առնվազն մեկ եկամուտ (աշխատավարձ կամ լրացուցիչ):",
    validation_loan_interest: "Մուտքագրեք 0-ից մեծ տոկոսադրույք:",
    validation_loan_term: "Մուտքագրեք առնվազն 1 տարվա վարկի ժամկետ:",
    validation_loan_down_pct: "Մուտքագրեք նվազագույն առաջին մուծում (10–50%):",
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

function getStepValidation(step, form, totalIncome, totalSavings, lang, t) {
  if (step === 2) {
    if (!totalIncome || totalIncome <= 0) return { valid: false, message: t("validation_income_required") };
  }
  if (step === 4) {
    const down = Number(form.plannedDownPayment) || 0;
    if (down > 0 && totalSavings > 0 && down > totalSavings) return { valid: false, message: t("down_payment_warning") };
  }
  if (step === 5) {
    const rate = Number(form.interestRate);
    const years = Number(form.loanTermYears);
    const downPct = Number(form.minDownPaymentPct);
    if (rate === undefined || rate === null || rate <= 0) return { valid: false, message: t("validation_loan_interest") };
    if (years === undefined || years === null || years < 1) return { valid: false, message: t("validation_loan_term") };
    if (downPct < 10 || downPct > 50) return { valid: false, message: t("validation_loan_down_pct") };
  }
  return { valid: true };
}

export default function WizardSteps({ lang, T, sym, currency, step, setStep, form, updateForm, onSeeResults, totalIncome, totalSavings }) {
  const goBack = () => setStep((s) => Math.max(1, s - 1));
  const goNext = () => setStep((s) => Math.min(6, s + 1));

  const tWithSym = (key, extra = {}) => t(lang, key, { sym, ...extra });
  const stepValidation = getStepValidation(step, form, totalIncome, totalSavings, lang, tWithSym);
  const canProceed = step === 1 || stepValidation.valid;
  const stepTitles = [
    t(lang, "step0_title"),
    t(lang, "step1_title"),
    t(lang, "step2_title"),
    t(lang, "step3_title"),
    t(lang, "step4_title"),
    t(lang, "step5_title"),
  ];
  const intro = INTRO_TRANSLATIONS[lang] || INTRO_TRANSLATIONS.en;

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
          <header style={{ marginBottom: 0 }} aria-labelledby="property-analyzer-intro-title">
            <img
              src="/property-analyzer-intro.svg"
              alt=""
              style={{ width: "100%", height: "auto", display: "block", borderRadius: 8, marginBottom: 24 }}
              loading="eager"
            />
            <h2 id="property-analyzer-intro-title" style={{ fontSize: 20, fontWeight: 700, color: T.text, letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: 14 }}>
              {intro.title}
            </h2>
            <p style={{ fontSize: 15, color: T.textSub, lineHeight: 1.65, maxWidth: 640, marginBottom: 10 }}>
              {intro.description1}
            </p>
            <p style={{ fontSize: 15, color: T.textSub, lineHeight: 1.65, maxWidth: 640, marginBottom: 18 }}>
              {intro.description2}
            </p>
            <section aria-labelledby="when-to-use-heading" style={{ marginTop: 20 }}>
              <h3 id="when-to-use-heading" style={{ fontSize: 14, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
                {intro.when_to_use_title}
              </h3>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: T.textSub, lineHeight: 1.7 }}>
                <li style={{ marginBottom: 6 }}>{intro.when_to_use_1}</li>
                <li style={{ marginBottom: 6 }}>{intro.when_to_use_2}</li>
                <li style={{ marginBottom: 6 }}>{intro.when_to_use_3}</li>
                <li style={{ marginBottom: 6 }}>{intro.when_to_use_4}</li>
                <li style={{ marginBottom: 6 }}>{intro.when_to_use_5}</li>
              </ul>
            </section>
            <p style={{ fontSize: 12, color: T.textMuted, marginTop: 20, marginBottom: 0 }}>
              {intro.disclaimer}
            </p>
          </header>
        )}
        {step === 2 && (
          <StepIncome lang={lang} T={T} sym={sym} form={form} updateForm={updateForm} t={tWithSym} totalIncome={totalIncome} Field={Field} />
        )}
        {step === 3 && <StepExpenses lang={lang} T={T} sym={sym} form={form} updateForm={updateForm} t={tWithSym} Field={Field} />}
        {step === 4 && (
          <StepSavings
            lang={lang}
            T={T}
            sym={sym}
            form={form}
            updateForm={updateForm}
            t={tWithSym}
            totalSavings={totalSavings}
            Field={Field}
          />
        )}
        {step === 5 && (
          <StepLoanTerms lang={lang} T={T} sym={sym} form={form} updateForm={updateForm} t={tWithSym} Field={Field} FieldPercent={FieldPercent} />
        )}
        {step === 6 && <StepRental lang={lang} T={T} sym={sym} form={form} updateForm={updateForm} t={tWithSym} Field={Field} FieldPercent={FieldPercent} />}
      </section>

      {!canProceed && stepValidation.message && (
        <p
          role="alert"
          style={{ fontSize: 13, color: T.red || "#c53030", marginBottom: 12 }}
        >
          {stepValidation.message}
        </p>
      )}
      <div style={{ display: "flex", gap: 12, justifyContent: step === 1 ? "flex-end" : "space-between" }}>
        {step > 1 && (
          <button
            type="button"
            onClick={goBack}
            aria-label={t(lang, "back")}
            style={{
              padding: "10px 20px",
              borderRadius: 8,
              border: `1px solid ${T.border}`,
              background: T.surface,
              color: T.text,
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            {t(lang, "back")}
          </button>
        )}
        {step === 1 ? (
          <button
            type="button"
            onClick={goNext}
            aria-label={t(lang, "start")}
            style={{
              padding: "12px 28px",
              borderRadius: 8,
              border: `1px solid ${T.green}`,
              background: T.greenBg,
              color: T.greenText,
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {t(lang, "start")}
          </button>
        ) : step < 6 ? (
          <button
            type="button"
            onClick={canProceed ? goNext : undefined}
            disabled={!canProceed}
            aria-label={t(lang, "next")}
            aria-disabled={!canProceed}
            style={{
              padding: "10px 20px",
              borderRadius: 8,
              border: `1px solid ${canProceed ? T.accent : T.border}`,
              background: canProceed ? T.accentBg : T.surfaceAlt,
              color: canProceed ? T.accentText : T.textMuted,
              fontSize: 14,
              fontWeight: 500,
              cursor: canProceed ? "pointer" : "not-allowed",
              opacity: canProceed ? 1 : 0.7,
            }}
          >
            {t(lang, "next")}
          </button>
        ) : (
          <button
            type="button"
            onClick={canProceed ? onSeeResults : undefined}
            disabled={!canProceed}
            aria-label={t(lang, "see_results")}
            aria-disabled={!canProceed}
            style={{
              padding: "10px 20px",
              borderRadius: 8,
              border: `1px solid ${canProceed ? T.green : T.border}`,
              background: canProceed ? T.greenBg : T.surfaceAlt,
              color: canProceed ? T.greenText : T.textMuted,
              fontSize: 14,
              fontWeight: 600,
              cursor: canProceed ? "pointer" : "not-allowed",
              opacity: canProceed ? 1 : 0.7,
            }}
          >
            {t(lang, "see_results")}
          </button>
        )}
      </div>
    </>
  );
}
