"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "./ThemeContext.jsx";

const HEADER_COPY = {
  en: {
    logo_title: "Saving.am",
    menu_calculators_tools: "Calculators & Tools",
    menu_education_news: "Education & News",
    tool_compound: "Compound Interest Calculator",
    tool_property: "Property Analyzer",
    tool_mortgage: "Mortgage Calculator",
    tool_health: "Financial Health Check",
    lang_hy: "Հայերեն",
    lang_en: "English",
    theme_light: "Light",
    theme_dark: "Dark",
    theme_system: "System",
  },
  hy: {
    logo_title: "Saving.am",
    menu_calculators_tools: "Հաշվիչներ և գործիքներ",
    menu_education_news: "Կրթություն և Խորհուրդներ",
    tool_compound: "Բարդ տոկոսի հաշվիչ",
    tool_property: "Գույքի վերլուծիչ",
    tool_mortgage: "Հիպոթեկային հաշվիչ",
    tool_health: "Ֆինանսական առողջություն",
    lang_hy: "Հայերեն",
    lang_en: "English",
    theme_light: "Բաց",
    theme_dark: "Մութ",
    theme_system: "Համակարգ",
  },
};

const CALC_ITEMS = [
  { path: "compound-interest-savings-calculator", titleKey: "tool_compound", icon: "📊" },
  { path: "property-analyzer", titleKey: "tool_property", icon: "🏠" },
  { path: "mortgage-calculator", titleKey: "tool_mortgage", icon: "🏦" },
  { path: "financial-health", titleKey: "tool_health", icon: "❤️" },
];

const MAX_WIDTH = 1200;

export default function SharedHeader({ rightContent = null, className = "" }) {
  const pathname = usePathname();
  const router = useRouter();
  const { themeMode, setThemeMode, dark, T } = useTheme();
  const isEn = pathname?.startsWith("/en");
  const lang = isEn ? "en" : "hy";
  const base = isEn ? "/en" : "";
  const t = (key) => HEADER_COPY[lang][key] ?? key;

  const [toolsOpen, setToolsOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef(null);

  const closeAll = () => {
    setToolsOpen(false);
    setThemeOpen(false);
    setLangOpen(false);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) closeAll();
    };
    const handleKey = (e) => { if (e.key === "Escape") closeAll(); };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const goToLang = (newLang) => {
    const path = pathname ?? "/";
    const newBase = newLang === "en" ? "/en" : "";
    const withoutBase = path.replace(/^\/en/, "") || "/";
    const newPath = newBase + (withoutBase === "/" ? "" : withoutBase);
    router.push(newPath);
    setLangOpen(false);
  };

  const btn = (active) => ({
    padding: "7px 12px",
    borderRadius: 8,
    border: `1px solid ${active ? T.accent : T.border}`,
    background: active ? T.accentBg : T.surfaceAlt,
    color: active ? T.accentText : T.textSub,
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "inherit",
    display: "flex",
    alignItems: "center",
    gap: 6,
  });

  const dropdown = {
    position: "absolute",
    top: "calc(100% + 6px)",
    minWidth: 200,
    padding: "6px 0",
    borderRadius: 10,
    background: T.surface,
    border: `1px solid ${T.border}`,
    boxShadow: T.shadowMd,
    zIndex: 200,
  };

  const itemStyle = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    width: "100%",
    padding: "10px 14px",
    border: "none",
    background: "none",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: 13,
    color: T.text,
    textAlign: "left",
  };

  return (
    <header
      ref={headerRef}
      className={`no-print ${className}`.trim()}
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
          maxWidth: MAX_WIDTH,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 56,
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        {/* Logo */}
        <Link
          href={base || "/"}
          style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: T.text, flexShrink: 0 }}
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
          <span style={{ fontWeight: 700, fontSize: 18 }}>{t("logo_title")}</span>
        </Link>

        {/* Nav: Calculators & Tools (dropdown), Education & News */}
        <nav className="shared-header-nav" style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ position: "relative" }}>
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={toolsOpen}
              onClick={() => { setToolsOpen((o) => !o); setThemeOpen(false); setLangOpen(false); }}
              style={{ ...btn(toolsOpen), whiteSpace: "nowrap" }}
            >
              {t("menu_calculators_tools")}
              <span style={{ fontSize: 10, transform: toolsOpen ? "rotate(180deg)" : "none" }}>▾</span>
            </button>
            {toolsOpen && (
              <div role="menu" style={{ ...dropdown, left: 0 }}>
                {CALC_ITEMS.map((item) => (
                  <Link
                    key={item.path}
                    href={`${base}/${item.path}`}
                    style={{ ...itemStyle, textDecoration: "none" }}
                    onClick={closeAll}
                  >
                    <span>{item.icon}</span>
                    {t(item.titleKey)}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link
            href={`${base}/blog`}
            style={{
              padding: "7px 12px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 500,
              color: T.textSub,
              textDecoration: "none",
              border: `1px solid transparent`,
              background: "transparent",
            }}
          >
            {t("menu_education_news")}
          </Link>
        </nav>

        {/* Right: optional slot (e.g. Export), Language, Theme */}
        <div className="shared-header-right" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {rightContent ? <div className="shared-header-desktop-only" style={{ display: "flex", alignItems: "center" }}>{rightContent}</div> : null}
          <div style={{ position: "relative" }}>
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={langOpen}
              onClick={() => { setLangOpen((o) => !o); setToolsOpen(false); setThemeOpen(false); }}
              style={btn(langOpen)}
            >
              🌐 {lang === "en" ? "EN" : "HY"} ▾
            </button>
            {langOpen && (
              <div role="menu" style={{ ...dropdown, right: 0 }}>
                <button type="button" role="menuitem" style={{ ...itemStyle, fontWeight: lang === "en" ? 600 : 400, background: lang === "en" ? T.accentBg : "none" }} onClick={() => goToLang("en")}>
                  {t("lang_en")}
                </button>
                <button type="button" role="menuitem" style={{ ...itemStyle, fontWeight: lang === "hy" ? 600 : 400, background: lang === "hy" ? T.accentBg : "none" }} onClick={() => goToLang("hy")}>
                  {t("lang_hy")}
                </button>
              </div>
            )}
          </div>
          <div style={{ position: "relative" }}>
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={themeOpen}
              onClick={() => { setThemeOpen((o) => !o); setToolsOpen(false); setLangOpen(false); }}
              style={btn(themeOpen)}
              title={themeMode === "light" ? t("theme_light") : themeMode === "dark" ? t("theme_dark") : t("theme_system")}
            >
              {themeMode === "light" ? "☀️" : themeMode === "dark" ? "🌙" : "◐"} ▾
            </button>
            {themeOpen && (
              <div role="menu" style={{ ...dropdown, right: 0 }}>
                <button type="button" role="menuitem" style={{ ...itemStyle, fontWeight: themeMode === "light" ? 600 : 400, background: themeMode === "light" ? T.accentBg : "none" }} onClick={() => { setThemeMode("light"); setThemeOpen(false); }}>
                  ☀️ {t("theme_light")}
                </button>
                <button type="button" role="menuitem" style={{ ...itemStyle, fontWeight: themeMode === "dark" ? 600 : 400, background: themeMode === "dark" ? T.accentBg : "none" }} onClick={() => { setThemeMode("dark"); setThemeOpen(false); }}>
                  🌙 {t("theme_dark")}
                </button>
                <button type="button" role="menuitem" style={{ ...itemStyle, fontWeight: themeMode === "system" ? 600 : 400, background: themeMode === "system" ? T.accentBg : "none" }} onClick={() => { setThemeMode("system"); setThemeOpen(false); }}>
                  ◐ {t("theme_system")}
                </button>
              </div>
            )}
          </div>
          <button
            type="button"
            className="shared-header-mobile-btn"
            aria-label="Menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((o) => !o)}
            style={{ display: "none", width: 44, height: 44, borderRadius: 8, background: T.surfaceAlt, border: `1px solid ${T.border}`, cursor: "pointer", fontSize: 18, alignItems: "center", justifyContent: "center", color: T.text }}
          >
            ⋮
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div style={{ borderTop: `1px solid ${T.border}`, padding: "12px 0", background: T.surfaceAlt }}>
          <div style={{ maxWidth: MAX_WIDTH, margin: "0 auto", display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ fontWeight: 600, fontSize: 12, color: T.textMuted, padding: "0 12px 4px" }}>{t("menu_calculators_tools")}</div>
            {CALC_ITEMS.map((item) => (
              <Link key={item.path} href={`${base}/${item.path}`} style={{ ...itemStyle, padding: "10px 24px" }} onClick={closeAll}>{item.icon} {t(item.titleKey)}</Link>
            ))}
            <Link href={`${base}/blog`} style={{ ...itemStyle, padding: "10px 24px", textDecoration: "none" }} onClick={closeAll}>📰 {t("menu_education_news")}</Link>
            {rightContent}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .shared-header-nav { display: none !important; }
          .shared-header-right .shared-header-desktop-only { display: none !important; }
          .shared-header-mobile-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
