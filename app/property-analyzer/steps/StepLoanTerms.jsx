"use client";

export default function StepLoanTerms({ lang, T, sym, form, updateForm, t, Field, FieldPercent }) {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: T.text, marginBottom: 16 }}>{t("step4_title")}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
        <FieldPercent
          label={t("interest_rate")}
          value={form.interestRate}
          onChange={(v) => updateForm({ interestRate: v })}
          T={T}
          placeholder="10"
          min={1}
          max={30}
          step={0.25}
        />
        <FieldPercent
          label={t("loan_term_years")}
          value={form.loanTermYears}
          onChange={(v) => updateForm({ loanTermYears: v })}
          T={T}
          placeholder="20"
          min={1}
          max={30}
          step={1}
        />
        <FieldPercent
          label={t("min_down_payment_pct")}
          value={form.minDownPaymentPct}
          onChange={(v) => updateForm({ minDownPaymentPct: v })}
          T={T}
          placeholder="20"
          min={10}
          max={50}
          step={1}
        />
        <div style={{ gridColumn: "1 / -1" }}>
          <Field
            label={t("property_price_optional")}
            value={form.propertyPrice}
            onChange={(v) => updateForm({ propertyPrice: v })}
            T={T}
            placeholder={t("property_price_placeholder")}
            type="optional"
          />
        </div>
      </div>
    </div>
  );
}
