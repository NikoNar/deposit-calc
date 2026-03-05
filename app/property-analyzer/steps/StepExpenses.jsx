"use client";

export default function StepExpenses({ lang, T, form, updateForm, t, Field }) {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: T.text, marginBottom: 16 }}>{t(lang, "step2_title")}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
        <Field
          label={t(lang, "living_expenses")}
          value={form.livingExpenses}
          onChange={(v) => updateForm({ livingExpenses: v })}
          T={T}
          placeholder={t(lang, "placeholder")}
        />
        <Field
          label={t(lang, "existing_loans")}
          value={form.existingLoans}
          onChange={(v) => updateForm({ existingLoans: v })}
          T={T}
          placeholder={t(lang, "placeholder")}
        />
        <Field
          label={t(lang, "other_obligations")}
          value={form.otherObligations}
          onChange={(v) => updateForm({ otherObligations: v })}
          T={T}
          placeholder={t(lang, "placeholder")}
        />
      </div>
    </div>
  );
}
