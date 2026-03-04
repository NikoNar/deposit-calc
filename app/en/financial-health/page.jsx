import FinancialHealthApp from "../../financial-health/FinancialHealthApp.jsx";

export const metadata = {
  title: "Financial Health Check | Saving.am",
  description:
    "Check your financial health against Armenian benchmarks. Emergency fund, debt, savings rate, and stability — get a score and action plan.",
};

export default function EnFinancialHealthPage() {
  return <FinancialHealthApp lang="en" />;
}
