"use client";

import dynamic from "next/dynamic";

const PropertyBreakdownChart = dynamic(() => import("./charts/PropertyBreakdownChart.jsx"), { ssr: false });
const MonthlyCashflowChart = dynamic(() => import("./charts/MonthlyCashflowChart.jsx"), { ssr: false });
const RentVsCostsChart = dynamic(() => import("./charts/RentVsCostsChart.jsx"), { ssr: false });
const SensitivityChart = dynamic(() => import("./charts/SensitivityChart.jsx"), { ssr: false });

const RESULTS_TRANSLATIONS = {
  en: {
    edit_inputs: "Edit inputs",
    results_summary: "Results summary",
    scenario_a: "Known property",
    scenario_b: "Affordable price",
    monthly_payment: "Monthly payment",
    max_safe_payment: "Max safe payment",
    loan_amount: "Loan amount",
    down_payment: "Down payment",
    property_price: "Property price",
    affordable_price: "Affordable property price",
    recommended_range: "Recommended price range",
    required_rent: "Required rent to cover costs",
    health_score: "Financial health score",
    insights_title: "Insights",
    debt_exceeds_recommended: "Your loan payment exceeds the recommended 35% of income (currently {pct}%).",
    rental_will_not_cover: "Rental income will not fully cover the mortgage and costs.",
    investment_sustainable: "This property investment appears financially sustainable.",
    consider_higher_downpayment: "Consider a higher down payment to reduce loan size and interest.",
    health_risky: "This investment is risky; consider reducing loan or increasing income.",
    health_dangerous: "This investment is financially dangerous. Reduce debt or increase income before buying.",
    health_excellent: "This investment looks financially healthy.",
    health_good: "This investment is in good shape; monitor your budget.",
    required_rent_to_cover: "If you rent, aim for at least {amount} {sym}/month to cover costs.",
    charts_breakdown: "Property breakdown",
    charts_cashflow: "Monthly cashflow",
    charts_rent_vs_costs: "Rent vs costs",
    charts_sensitivity: "Interest rate sensitivity",
    amd_month: "{sym}/month",
    amd: "{sym}",
    effective_rent: "Effective rent",
    monthly_profit: "Monthly profit",
  },
  hy: {
    edit_inputs: "Խմբագրել մուտքերը",
    results_summary: "Արդյունքների ամփոփում",
    scenario_a: "Հայտնի գին",
    scenario_b: "Ձեռքբերելի գին",
    monthly_payment: "Ամսական վճար",
    max_safe_payment: "Առավելագույն անվտանգ վճար",
    loan_amount: "Վարկի գումար",
    down_payment: "Առաջին մուծում",
    property_price: "Գույքի գին",
    affordable_price: "Ձեռքբերելի գույքի գին",
    recommended_range: "Խորհուրդ տրվող գնային միջակայք",
    required_rent: "Ծախսերը ծածկելու համար անհրաժեշտ վարձ",
    health_score: "Ֆինանսական առողջության միավոր",
    insights_title: "Խորհուրդներ",
    debt_exceeds_recommended: "Վարկի ամսական վճարը գերազանցում է խորհուրդ տրվող 35%-ը (ներկայումս {pct}%):",
    rental_will_not_cover: "Վարձակալության եկամուտը ամբողջությամբ չի ծածկի hypothec-ը և ծախսերը:",
    investment_sustainable: "Գույքի այս ներդրումը ֆինանսապես կայուն է:",
    consider_higher_downpayment: "Դիտարկեք ավելի բարձր առաջին մուծում՝ վարկի չափը և տոկոսը նվազեցնելու համար:",
    health_risky: "Այս ներդրումը ռիսկային է; խորհուրդ է տրվում նվազեցնել վարկը կամ ավելացնել եկամուտը:",
    health_dangerous: "Այս ներդրումը ֆինանսապես վտանգավոր է: Նախ նվազեցրեք պարտքը կամ ավելացրեք եկամուտը:",
    health_excellent: "Այս ներդրումը ֆինանսապես առողջ է:",
    health_good: "Այս ներդրումը լավ վիճակում է; վերահսկեք բյուջեն:",
    required_rent_to_cover: "Եթե վարձով եք տալիս, նպատակադրեք ամենաքիչ {amount} {sym}/ամիս՝ ծախսերը ծածկելու համար:",
    charts_breakdown: "Գույքի կազմ",
    charts_cashflow: "Ամսական դրամահոսք",
    charts_rent_vs_costs: "Վարձ vs ծախսեր",
    charts_sensitivity: "Տոկոսադրույքի զգայունություն",
    amd_month: "{sym}/ամիս",
    amd: "{sym}",
    effective_rent: "Էֆեկտիվ վարձ",
    monthly_profit: "Ամսական շահույթ",
  },
};

function t(lang, key, params = {}) {
  const str = (RESULTS_TRANSLATIONS[lang] || RESULTS_TRANSLATIONS.en)[key] || key;
  return Object.keys(params).reduce((s, k) => s.replace(new RegExp(`\\{${k}\\}`, "g"), String(params[k])), str);
}

function formatNum(n) {
  if (n == null || Number.isNaN(n)) return "—";
  return Math.round(n).toLocaleString("en-US");
}

export default function ResultsView({ lang, T, sym, currency, form, scenarioResult, healthResult, insights, onEditInputs }) {
  const tWithSym = (key, params = {}) => t(lang, key, { sym, ...params });

  if (!scenarioResult) {
    return (
      <div style={{ padding: 24, textAlign: "center", color: T.textSub }}>
        <p style={{ marginBottom: 16 }}>
          {lang === "en" ? "Unable to calculate results. Please check your inputs and try again." : "Հնարավոր չէ հաշվարկել արդյունքները: Ստուգեք մուտքագրումները և կրկին փորձեք:"}
        </p>
        <button
          type="button"
          onClick={onEditInputs}
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            border: `1px solid ${T.border}`,
            background: T.surfaceAlt,
            color: T.text,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          {t(lang, "edit_inputs")}
        </button>
      </div>
    );
  }

  const r = scenarioResult;
  const isScenarioB = r.scenario === "B";
  const bandColor =
    healthResult?.band === "Excellent"
      ? T.green
      : healthResult?.band === "Good"
        ? T.accent
        : healthResult?.band === "Risky"
          ? T.yellow
          : T.red;

  return (
    <>
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "flex-end" }}>
        <button
          type="button"
          onClick={onEditInputs}
          aria-label={t(lang, "edit_inputs")}
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            border: `1px solid ${T.border}`,
            background: T.surfaceAlt,
            color: T.text,
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          {t(lang, "edit_inputs")}
        </button>
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
        <h2 style={{ fontSize: 16, fontWeight: 600, color: T.text, marginBottom: 16 }}>{t(lang, "results_summary")}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
          {isScenarioB ? (
            <>
              <Card T={T} label={t(lang, "max_safe_payment")} value={formatNum(r.maxSafeMonthlyPayment)} suffix={tWithSym("amd_month")} />
              <Card T={T} label={t(lang, "loan_amount")} value={formatNum(r.maxLoanAmount)} suffix={tWithSym("amd")} />
              <Card T={T} label={t(lang, "affordable_price")} value={formatNum(r.affordablePrice)} suffix={tWithSym("amd")} />
              {r.recommendedPriceRange && (
                <Card
                  T={T}
                  label={t(lang, "recommended_range")}
                  value={`${formatNum(r.recommendedPriceRange.min)} – ${formatNum(r.recommendedPriceRange.max)}`}
                  suffix={tWithSym("amd")}
                />
              )}
              {form.planToRent && r.requiredRentToCover > 0 && (
                <Card T={T} label={t(lang, "required_rent")} value={formatNum(r.requiredRentToCover)} suffix={tWithSym("amd_month")} />
              )}
            </>
          ) : (
            <>
              <Card T={T} label={t(lang, "property_price")} value={formatNum(r.propertyPrice)} suffix={tWithSym("amd")} />
              <Card T={T} label={t(lang, "down_payment")} value={formatNum(r.downPayment)} suffix={tWithSym("amd")} />
              <Card T={T} label={t(lang, "loan_amount")} value={formatNum(r.loanAmount)} suffix={tWithSym("amd")} />
              <Card T={T} label={t(lang, "monthly_payment")} value={formatNum(r.monthlyPayment)} suffix={tWithSym("amd_month")} />
              {form.planToRent && (
                <>
                  <Card T={T} label={t(lang, "effective_rent")} value={formatNum(r.effectiveRent)} suffix={tWithSym("amd_month")} />
                  <Card T={T} label={t(lang, "monthly_profit")} value={formatNum(r.monthlyProfit)} suffix={tWithSym("amd_month")} />
                </>
              )}
            </>
          )}
        </div>
      </section>

      {healthResult && (
        <section
          style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 12,
            padding: 24,
            marginBottom: 24,
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 600, color: T.text, marginBottom: 12 }}>{t(lang, "health_score")}</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                border: `4px solid ${bandColor}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                fontWeight: 700,
                color: bandColor,
              }}
            >
              {healthResult.score}
            </div>
            <span style={{ fontSize: 18, fontWeight: 600, color: bandColor }}>{healthResult.band}</span>
          </div>
        </section>
      )}

      {insights && insights.length > 0 && (
        <section
          style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 12,
            padding: 24,
            marginBottom: 24,
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 600, color: T.text, marginBottom: 12 }}>{t(lang, "insights_title")}</h2>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: T.textSub, lineHeight: 1.6 }}>
            {insights.map((item, i) => {
              const params = item.params
                ? Object.fromEntries(
                    Object.entries(item.params).map(([k, v]) => [k, typeof v === "number" && v > 1000 ? formatNum(v) : v])
                  )
                : {};
              return (
                <li key={i} style={{ marginBottom: 8 }}>
                  {t(lang, item.key, { ...params, sym })}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: T.text, marginBottom: 16 }}>{t(lang, "charts_breakdown")}</h2>
        <PropertyBreakdownChart scenarioResult={r} form={form} T={T} lang={lang} sym={sym} />
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: T.text, marginBottom: 16 }}>{t(lang, "charts_cashflow")}</h2>
        <MonthlyCashflowChart scenarioResult={r} form={form} T={T} lang={lang} sym={sym} />
      </section>

      {form.planToRent && (
        <section style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: T.text, marginBottom: 16 }}>{t(lang, "charts_rent_vs_costs")}</h2>
          <RentVsCostsChart scenarioResult={r} form={form} T={T} lang={lang} sym={sym} />
        </section>
      )}

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: T.text, marginBottom: 16 }}>{t(lang, "charts_sensitivity")}</h2>
        <SensitivityChart scenarioResult={r} form={form} T={T} lang={lang} sym={sym} />
      </section>
    </>
  );
}

function Card({ T, label, value, suffix }) {
  return (
    <div
      style={{
        background: T.surfaceAlt,
        border: `1px solid ${T.border}`,
        borderRadius: 8,
        padding: 14,
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: T.text }}>
        {value} {suffix && <span style={{ fontSize: 12, fontWeight: 400, color: T.textSub }}>{suffix}</span>}
      </div>
    </div>
  );
}
