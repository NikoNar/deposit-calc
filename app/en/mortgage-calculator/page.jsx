import MortgageCalculatorApp from "../../mortgage-calculator/MortgageCalculatorApp.jsx";
import { MORTGAGE_FAQ_DATA } from "../../mortgage-calculator/faqData.js";

const MORTGAGE_FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: MORTGAGE_FAQ_DATA.map((item) => ({
    "@type": "Question",
    name: item.questionEn,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answerEn,
    },
  })),
};

export const metadata = {
  title: "Mortgage Calculator | Saving.am",
  description:
    "Free mortgage calculator: monthly payment, amortization, PMI with auto-removal, extra payments, and scenario comparison. Full cost of ownership: P&I, tax, insurance, HOA.",
};

export default function EnMortgageCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(MORTGAGE_FAQ_SCHEMA) }}
      />
      <MortgageCalculatorApp lang="en" />
    </>
  );
}
