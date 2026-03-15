import MortgageCalculatorApp from "./MortgageCalculatorApp.jsx";
import { MORTGAGE_FAQ_DATA } from "./faqData.js";

const MORTGAGE_FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: MORTGAGE_FAQ_DATA.map((item) => ({
    "@type": "Question",
    name: item.questionHy,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answerHy,
    },
  })),
};

export const metadata = {
  title: "Հիպոթեկային հաշվիչ | Saving.am",
  description:
    "Անվճար հիպոթեկային հաշվիչ. ամսական վճար, ամորտիզացիա, PMI, լրացուցիչ մուծումներ, սցենարների համեմատություն:",
};

export default function MortgageCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(MORTGAGE_FAQ_SCHEMA) }}
      />
      <MortgageCalculatorApp />
    </>
  );
}
