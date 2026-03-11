"use client";

export default function StepExpenses({ lang, T, sym, form, updateForm, t, Field }) {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: T.text, marginBottom: 16 }}>{t("step2_title")}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
        <Field
          label={t("living_expenses")}
          value={form.livingExpenses}
          onChange={(v) => updateForm({ livingExpenses: v })}
          T={T}
          placeholder={t("placeholder")}
        />
        <Field
          label={t("existing_loans")}
          value={form.existingLoans}
          onChange={(v) => updateForm({ existingLoans: v })}
          T={T}
          placeholder={t("placeholder")}
        />
        <Field
          label={t("other_obligations")}
          value={form.otherObligations}
          onChange={(v) => updateForm({ otherObligations: v })}
          T={T}
          placeholder={t("placeholder")}
        />
      </div>
    </div>
  );
}
