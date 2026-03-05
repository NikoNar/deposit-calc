"use client";

export default function StepSavings({ lang, T, form, updateForm, t, totalSavings, Field }) {
  const overDown = totalSavings > 0 && form.plannedDownPayment > totalSavings;
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: T.text, marginBottom: 16 }}>{t(lang, "step3_title")}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
        <Field
          label={t(lang, "cash_savings")}
          value={form.cashSavings}
          onChange={(v) => updateForm({ cashSavings: v })}
          T={T}
          placeholder={t(lang, "placeholder")}
        />
        <Field
          label={t(lang, "bank_deposits")}
          value={form.bankDeposits}
          onChange={(v) => updateForm({ bankDeposits: v })}
          T={T}
          placeholder={t(lang, "placeholder")}
        />
        <Field
          label={t(lang, "planned_down_payment")}
          value={form.plannedDownPayment}
          onChange={(v) => updateForm({ plannedDownPayment: v })}
          T={T}
          placeholder={t(lang, "placeholder")}
        />
      </div>
      {totalSavings > 0 && (
        <p style={{ fontSize: 13, color: T.textSub, marginTop: 12 }}>
          {t(lang, "total_savings")}: {totalSavings.toLocaleString("en-US")} AMD
        </p>
      )}
      {overDown && (
        <p style={{ fontSize: 13, color: T.red, marginTop: 8 }}>{t(lang, "down_payment_warning")}</p>
      )}
    </div>
  );
}
