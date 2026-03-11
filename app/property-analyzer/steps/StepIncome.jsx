"use client";

export default function StepIncome({ lang, T, sym, form, updateForm, t, totalIncome, Field }) {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: T.text, marginBottom: 16 }}>{t("step1_title")}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
        <Field
          label={t("monthly_salary")}
          value={form.monthlySalary}
          onChange={(v) => updateForm({ monthlySalary: v })}
          T={T}
          placeholder={t("placeholder")}
        />
        <Field
          label={t("additional_income")}
          value={form.additionalIncome}
          onChange={(v) => updateForm({ additionalIncome: v })}
          T={T}
          placeholder={t("placeholder")}
        />
      </div>
      {totalIncome > 0 && (
        <p style={{ fontSize: 13, color: T.textSub, marginTop: 12 }}>
          {t("total_income")}: {totalIncome.toLocaleString("en-US")} {sym}
        </p>
      )}
    </div>
  );
}
