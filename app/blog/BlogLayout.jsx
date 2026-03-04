"use client";

import { useState, useEffect, createContext, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DARK, LIGHT } from "../../lib/theme.js";

export const BlogContext = createContext({ T: DARK, lang: "hy" });
export function useBlog() {
  return useContext(BlogContext);
}

const THEME_STORAGE_KEY = "deposit-calc-theme";
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

function SegBtn({ T, active, onClick, children, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      style={{
        padding: "6px 10px",
        borderRadius: 6,
        border: "none",
        background: active ? T.accentBg : T.surfaceAlt,
        color: active ? T.accentText : T.textSub,
        fontSize: 12,
        fontWeight: 500,
        cursor: "pointer",
        fontFamily: "inherit",
      }}
    >
      {children}
    </button>
  );
}

export default function BlogLayout({ children }) {
  const pathname = usePathname();
  const isEn = pathname?.startsWith("/en");
  const lang = isEn ? "en" : "hy";
  const t = (key, params) => {
    let s = BLOG_TRANSLATIONS[lang][key] || key;
    if (params) Object.keys(params).forEach((k) => { s = s.replace(new RegExp(`\\{${k}\\}`, "g"), params[k]); });
    return s;
  };

  const [themeMode, setThemeMode] = useState("system");
  const [systemDark, setSystemDark] = useState(true);
  const dark = themeMode === "system" ? systemDark : themeMode === "dark";
  const T = dark ? DARK : LIGHT;

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(THEME_STORAGE_KEY) : null;
    if (stored === "light" || stored === "dark" || stored === "system") setThemeMode(stored);
  }, []);
  useEffect(() => {
    if (themeMode !== "system") return;
    const mq = typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)");
    if (mq) {
      setSystemDark(mq.matches);
      const fn = (e) => setSystemDark(e.matches);
      mq.addEventListener("change", fn);
      return () => mq.removeEventListener("change", fn);
    }
  }, [themeMode]);

  const setTheme = (mode) => {
    setThemeMode(mode);
    if (typeof window !== "undefined") localStorage.setItem(THEME_STORAGE_KEY, mode);
  };

  const homeHref = isEn ? "/en" : "/";

  return (
    <BlogContext.Provider value={{ T, lang }}>
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text }}>
      <header
        className="no-print"
        style={{
          background: T.surface,
          borderBottom: `1px solid ${T.border}`,
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: T.shadow,
          paddingLeft: "max(24px, env(safe-area-inset-left))",
          paddingRight: "max(24px, env(safe-area-inset-right))",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 56,
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0, minWidth: 0 }}>
            <Link
              href={homeHref}
              style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: `linear-gradient(135deg, ${T.accent}, ${T.purple})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                }}
              >
                🏦
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: T.text, lineHeight: 1 }}>
                {t("calculator_nav")}
              </div>
            </Link>
            <span style={{ color: T.border, fontSize: 14 }} aria-hidden>|</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: T.accent }}>{t("blog_nav")}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Link href="/blog" style={{ textDecoration: "none" }}>
              <SegBtn T={T} active={!isEn} onClick={() => {}} title="Հայերեն">
                HY
              </SegBtn>
            </Link>
            <Link href="/en/blog" style={{ textDecoration: "none" }}>
              <SegBtn T={T} active={isEn} onClick={() => {}} title="English">
                EN
              </SegBtn>
            </Link>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <SegBtn T={T} active={themeMode === "light"} onClick={() => setTheme("light")} title="Light">☀️</SegBtn>
              <SegBtn T={T} active={themeMode === "dark"} onClick={() => setTheme("dark")} title="Dark">🌙</SegBtn>
              <SegBtn T={T} active={themeMode === "system"} onClick={() => setTheme("system")} title="System">◐</SegBtn>
            </div>
          </div>
        </div>
      </header>

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
          <Link href={homeHref} style={{ color: T.accent, textDecoration: "none", fontWeight: 500 }}>
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
