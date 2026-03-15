"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeContext.jsx";
import SharedHeader from "./SharedHeader.jsx";

const LANDING_COPY = {
  en: {
    hero_title: "Saving.am",
    hero_tagline: "Financial tools for Armenia",
    hero_sub: "Free calculators for deposits, property affordability, and financial health. Plan with real Armenian bank rates.",
    cta_tools: "See calculators & tools",
    features_title: "Why use Saving.am",
    features_lead: "We built a single place to plan your savings and finances with Armenian market data: bank deposit rates, tax rules, and the deposit guarantee limit.",
    feature_currencies: "AMD, USD, EUR",
    feature_goal: "Goal planner",
    feature_compare: "Compare scenarios",
    feature_tax: "Tax & guarantee aware",
    tools_title: "Calculators & tools",
    tool_compound_title: "Compound Interest Savings Calculator",
    tool_compound_desc: "Estimate how your savings grow with initial deposit, monthly contributions, and Armenian bank rates. Goal planner, compare two scenarios, early withdrawal simulator.",
    tool_compound_cta: "Use calculator",
    tool_property_title: "Property Analyzer",
    tool_property_desc: "See what property price you can afford, safe mortgage payment, and whether rental income can cover the loan. Income, expenses, savings, and loan terms.",
    tool_property_cta: "Open analyzer",
    tool_mortgage_title: "Mortgage Calculator",
    tool_mortgage_desc: "Full cost of ownership: P&I, tax, insurance, PMI (with auto-removal), HOA. Amortization schedule, extra payments, and scenario comparison.",
    tool_mortgage_cta: "Open calculator",
    tool_health_title: "Financial Health Check",
    tool_health_desc: "Get a score and action plan based on income, expenses, savings, and debt. Emergency fund planner and benchmarks for Armenia.",
    tool_health_cta: "Check health",
    tool_blog_title: "Education & News",
    tool_blog_desc: "Articles and guides on deposits, compound interest, and personal finance for Armenia.",
    tool_blog_cta: "Read articles",
    footer_made: "Made with",
    footer_by: "by",
    footer_copyright: "For informational purposes only.",
    lang_hy: "Հայերեն",
    lang_en: "English",
  },
  hy: {
    hero_title: "Saving.am",
    hero_tagline: "Ֆինանսական գործիքներ Հայաստանի համար",
    hero_sub: "Անվճար հաշվիչներ ավանդների, գույքի ձեռքբերելիության և ֆինանսական առողջության համար: Պլանավորեք Հայաստանի բանկերի տոկոսադրույքներով:",
    cta_tools: "Դիտել հաշվիչներն ու գործիքները",
    features_title: "Ինչու Saving.am",
    features_lead: "Մեկ տեղում պլանավորեք խնայողություններն ու ֆինանսները՝ Հայաստանի շուկայի տվյալներով. բանկային ավանդների տոկոսադրույքներ, հարկային կանոններ, ավանդների երաշխիքի սահման:",
    feature_currencies: "AMD, USD, EUR",
    feature_goal: "Նպատակի պլանավորիչ",
    feature_compare: "Համեմատել սցենարներ",
    feature_tax: "Հարկ և երաշխիք",
    tools_title: "Հաշվիչներ և գործիքներ",
    tool_compound_title: "Բարդ տոկոսով խնայողությունների հաշվիչ",
    tool_compound_desc: "Գնահատեք խնայողությունների աճը՝ նախնական ավանդ, ամսական մուծումներ և հայկական բանկերի տոկոսադրույքներ: Նպատակի պլանավորիչ, երկու սցենարի համեմատություն, վաղ դուրսբերման սիմուլյատոր:",
    tool_compound_cta: "Բացել հաշվիչ",
    tool_property_title: "Գույքի վերլուծիչ",
    tool_property_desc: "Պարզեք, ինչ գնով գույք կարող եք ձեռք բերել, անվտանգ hypothec և արդյոք վարձակալության եկամուտը կծածկի վճարը: Եկամուտ, ծախսեր, խնայողություններ, վարկի պայմաններ:",
    tool_property_cta: "Բացել վերլուծիչ",
    tool_mortgage_title: "Հիպոթեկային հաշվիչ",
    tool_mortgage_desc: "Սեփականության ամբողջ արժեքը. P&I, հարկ, ապահովագրություն, PMI (ավտո-դադար), HOA: Ամորտիզացիա, լրացուցիչ մուծումներ, սցենարների համեմատություն:",
    tool_mortgage_cta: "Բացել հաշվիչ",
    tool_health_title: "Ֆինանսական առողջության ստուգում",
    tool_health_desc: "Ստացեք գնահատական և գործողությունների պլան՝ եկամուտ, ծախսեր, խնայողություններ և պարտքերով: Արտակարգ միջոցների պլանավորիչ և Հայաստանի չափանիշներ:",
    tool_health_cta: "Ստուգել",
    tool_blog_title: "Կրթություն և Խորհուրդներ",
    tool_blog_desc: "Հոդվածներ և ձեռնարկներ ավանդների, բարդ տոկոսի և անձնական ֆինանսների վերաբերյալ Հայաստանի համար:",
    tool_blog_cta: "Կարդալ",
    footer_made: "Ստեղծվել է",
    footer_by: "ընկերության կողմից",
    footer_copyright: "Միայն տեղեկատվական նպատակով:",
    lang_hy: "Հայերեն",
    lang_en: "English",
  },
};

const TOOLS = [
  { id: "compound", path: "compound-interest-savings-calculator", titleKey: "tool_compound_title", descKey: "tool_compound_desc", ctaKey: "tool_compound_cta", icon: "📊" },
  { id: "property", path: "property-analyzer", titleKey: "tool_property_title", descKey: "tool_property_desc", ctaKey: "tool_property_cta", icon: "🏠" },
  { id: "mortgage", path: "mortgage-calculator", titleKey: "tool_mortgage_title", descKey: "tool_mortgage_desc", ctaKey: "tool_mortgage_cta", icon: "🏦" },
  { id: "health", path: "financial-health", titleKey: "tool_health_title", descKey: "tool_health_desc", ctaKey: "tool_health_cta", icon: "❤️" },
  { id: "blog", path: "blog", titleKey: "tool_blog_title", descKey: "tool_blog_desc", ctaKey: "tool_blog_cta", icon: "📰" },
];

export default function LandingPage() {
  const pathname = usePathname();
  const isEn = pathname?.startsWith("/en");
  const lang = isEn ? "en" : "hy";
  const base = isEn ? "/en" : "";
  const t = (key) => LANDING_COPY[lang][key] ?? key;
  const { T } = useTheme();

  const maxW = 1200;
  const sectionPad = 80;

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: T.bg, color: T.text, transition: "background .2s, color .2s" }}>
      <SharedHeader />
      <main>
        {/* Hero */}
        <section style={{ padding: `${sectionPad}px 24px`, textAlign: "center", background: `linear-gradient(180deg, ${T.surfaceAlt} 0%, ${T.bg} 50%)` }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: "clamp(2.5rem, 5vw, 3.75rem)", fontWeight: 700, lineHeight: 1.15, marginBottom: 16, letterSpacing: "-0.02em" }}>
              {t("hero_tagline")}
            </h1>
            <p style={{ fontSize: 18, color: T.textSub, lineHeight: 1.6, marginBottom: 32 }}>
              {t("hero_sub")}
            </p>
            <a
              href="#tools"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 24px",
                borderRadius: 12,
                background: T.accent,
                color: "#fff",
                fontWeight: 600,
                fontSize: 15,
                textDecoration: "none",
                boxShadow: T.shadowMd,
                transition: "transform .15s, box-shadow .15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = T.shadowMd;
              }}
            >
              📊 {t("cta_tools")}
            </a>
          </div>
        </section>

        {/* Features */}
        <section style={{ padding: `${sectionPad}px 24px`, background: T.surfaceAlt }}>
          <div style={{ maxWidth: maxW, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.5rem", fontWeight: 600, marginBottom: 12 }}>{t("features_title")}</h2>
            <p style={{ fontSize: 16, color: T.textSub, lineHeight: 1.7, marginBottom: 24, maxWidth: 640 }}>
              {t("features_lead")}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {["feature_currencies", "feature_goal", "feature_compare", "feature_tax"].map((key) => (
                <span
                  key={key}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 10,
                    background: T.surface,
                    border: `1px solid ${T.border}`,
                    fontSize: 13,
                    fontWeight: 500,
                    color: T.textSub,
                  }}
                >
                  {t(key)}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Tools grid */}
        <section id="tools" style={{ padding: `${sectionPad}px 24px`, scrollMarginTop: 72 }}>
          <div style={{ maxWidth: maxW, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.5rem", fontWeight: 600, marginBottom: 32 }}>{t("tools_title")}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
              {TOOLS.map((tool) => (
                <Link
                  key={tool.id}
                  href={`${base}/${tool.path}`}
                  style={{
                    display: "block",
                    padding: 24,
                    borderRadius: 16,
                    background: T.surface,
                    border: `1px solid ${T.border}`,
                    textDecoration: "none",
                    color: "inherit",
                    transition: "border-color .2s, box-shadow .2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = T.accent;
                    e.currentTarget.style.boxShadow = T.shadowMd;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = T.border;
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{ fontSize: 28, marginBottom: 12 }}>{tool.icon}</div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: 8 }}>{t(tool.titleKey)}</h3>
                  <p style={{ fontSize: 14, color: T.textSub, lineHeight: 1.6, marginBottom: 16 }}>{t(tool.descKey)}</p>
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.accent }}>{t(tool.ctaKey)} →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer
          style={{
            marginTop: sectionPad,
            padding: "32px 24px",
            borderTop: `1px solid ${T.border}`,
            background: T.surface,
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 13, color: T.textMuted, marginBottom: 4 }}>
            {t("footer_made")} <span style={{ color: T.red }}>♥</span> {t("footer_by")}{" "}
            <span style={{ fontWeight: 600, color: T.text }}>Codeman Studio</span>
          </p>
          <p style={{ fontSize: 12, color: T.textMuted }}>{t("footer_copyright")}</p>
        </footer>
      </main>
    </div>
  );
}
