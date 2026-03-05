"use client";

export default function StepIncome({ lang, T, form, updateForm, t, totalIncome, Field }) {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: T.text, marginBottom: 16 }}>{t(lang, "step1_title")}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
        <Field
          label={t(lang, "monthly_salary")}
          value={form.monthlySalary}
          onChange={(v) => updateForm({ monthlySalary: v })}
          T={T}
          placeholder={t(lang, "placeholder")}
        />
        <Field
          label={t(lang, "additional_income")}
          value={form.additionalIncome}
          onChange={(v) => updateForm({ additionalIncome: v })}
          T={T}
          placeholder={t(lang, "placeholder")}
        />
      </div>
      {totalIncome > 0 && (
        <p style={{ fontSize: 13, color: T.textSub, marginTop: 12 }}>
          {t(lang, "total_income")}: {totalIncome.toLocaleString("en-US")} AMD
        </p>
      )}
    </div>
  );
}
