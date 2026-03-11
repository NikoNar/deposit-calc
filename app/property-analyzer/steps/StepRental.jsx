"use client";

export default function StepRental({ lang, T, sym, form, updateForm, t, Field, FieldPercent }) {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: T.text, marginBottom: 16 }}>{t("step5_title")}</h2>
      <p style={{ fontSize: 14, color: T.textSub, marginBottom: 16 }}>{t("plan_to_rent")}</p>
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <button
          type="button"
          onClick={() => updateForm({ planToRent: true })}
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            border: `2px solid ${form.planToRent ? T.accent : T.border}`,
            background: form.planToRent ? T.accentBg : T.surfaceAlt,
            color: form.planToRent ? T.accentText : T.textSub,
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          {t("yes")}
        </button>
        <button
          type="button"
          onClick={() => updateForm({ planToRent: false })}
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            border: `2px solid ${!form.planToRent ? T.accent : T.border}`,
            background: !form.planToRent ? T.accentBg : T.surfaceAlt,
            color: !form.planToRent ? T.accentText : T.textSub,
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          {t("no")}
        </button>
      </div>
      {form.planToRent && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
          <Field
            label={t("expected_rent")}
            value={form.expectedRent}
            onChange={(v) => updateForm({ expectedRent: v })}
            T={T}
            placeholder={t("placeholder")}
          />
          <Field
            label={t("maintenance_costs")}
            value={form.maintenanceCosts}
            onChange={(v) => updateForm({ maintenanceCosts: v })}
            T={T}
            placeholder={t("placeholder")}
          />
          <Field
            label={t("property_tax")}
            value={form.propertyTax}
            onChange={(v) => updateForm({ propertyTax: v })}
            T={T}
            placeholder={t("placeholder")}
          />
          <FieldPercent
            label={t("vacancy_rate")}
            value={form.vacancyRatePct}
            onChange={(v) => updateForm({ vacancyRatePct: v })}
            T={T}
            placeholder="5"
            min={0}
            max={100}
            step={1}
          />
        </div>
      )}
    </div>
  );
}
