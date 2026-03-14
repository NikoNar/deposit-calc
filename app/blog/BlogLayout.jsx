"use client";

import { createContext, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DARK } from "../../lib/theme.js";
import { useTheme } from "../ThemeContext.jsx";
import SharedHeader from "../SharedHeader.jsx";

export const BlogContext = createContext({ T: DARK, lang: "hy" });
export function useBlog() {
  return useContext(BlogContext);
}

const COPYRIGHT_YEAR = 2026;

const BLOG_TRANSLATIONS = {
  en: {
    blog_nav: "Education & News",
    calculator_nav: "Calculator",
    back_to_calculator: "Back to Calculator",
    footer_made_by: "Made with",
    footer_by: "by",
    footer_copyright: "For informational purposes only · Armenian Interest Savings Calculator · {year}",
  },
  hy: {
    blog_nav: "Կրթություն և Խորհուրդներ",
    calculator_nav: "Հաշվիչ",
    back_to_calculator: "Վերադառնալ հաշվիչին",
    footer_made_by: "Ստեղծվել է",
    footer_by: "ընկերության կողմից",
    footer_copyright: "Միայն տեղեկատվական նպատակով · Տոկոսով խնայողությունների հաշվիչ · {year}",
  },
};

export default function BlogLayout({ children }) {
  const pathname = usePathname();
  const isEn = pathname?.startsWith("/en");
  const lang = isEn ? "en" : "hy";
  const { T } = useTheme();
  const t = (key, params) => {
    let s = BLOG_TRANSLATIONS[lang][key] || key;
    if (params) Object.keys(params).forEach((k) => { s = s.replace(new RegExp(`\\{${k}\\}`, "g"), params[k]); });
    return s;
  };

  const calculatorHref = isEn ? "/en/compound-interest-savings-calculator" : "/compound-interest-savings-calculator";

  return (
    <BlogContext.Provider value={{ T, lang }}>
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text }}>
      <SharedHeader />
      <main style={{ maxWidth: 1200, margin: "0 auto", paddingTop: 24, paddingBottom: 48, paddingLeft: "max(24px, env(safe-area-inset-left))", paddingRight: "max(24px, env(safe-area-inset-right))" }}>
        {children}
      </main>

      <footer
        className="no-print app-footer"
        style={{
          background: T.surface,
          borderTop: `1px solid ${T.border}`,
          textAlign: "center",
          padding: "20px max(24px, env(safe-area-inset-left)) max(20px, env(safe-area-inset-bottom)) max(24px, env(safe-area-inset-right))",
        }}
      >
        <p style={{ fontSize: 13, color: T.textMuted, marginBottom: 8 }}>
          <Link href={calculatorHref} style={{ color: T.accent, textDecoration: "none", fontWeight: 500 }}>
            {t("back_to_calculator")}
          </Link>
        </p>
        <p style={{ fontSize: 13, color: T.textMuted, marginBottom: 4 }}>
          {t("footer_made_by")} <span style={{ color: T.red }}>♥</span> {t("footer_by")}{" "}
          <span style={{ fontWeight: 600, color: T.text }}>Codeman Studio</span>
        </p>
        <p style={{ fontSize: 12, color: T.textMuted }}>
          {t("footer_copyright", { year: COPYRIGHT_YEAR })}
        </p>
      </footer>
    </div>
    </BlogContext.Provider>
  );
}
