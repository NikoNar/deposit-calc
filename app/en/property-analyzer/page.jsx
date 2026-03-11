import PropertyAnalyzerApp from "../../property-analyzer/PropertyAnalyzerApp.jsx";

export const metadata = {
  title: "Property Affordability & Rental Investment Analyzer | Saving.am",
  description:
    "Free calculator: find out what property price you can afford in Armenia, what mortgage you can safely take, whether rental income will cover your monthly payment, and get a financial health score. Uses your income, expenses, savings, and loan terms. Works with or without a specific property price.",
};

export default function EnPropertyAnalyzerPage() {
  return <PropertyAnalyzerApp lang="en" />;
}
