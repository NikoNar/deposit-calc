"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useBlog } from "./BlogLayout.jsx";
import { getCategoryName } from "../../lib/blog.js";

const BLOG_LIST_TRANSLATIONS = {
  en: {
    hero_title: "Education & News",
    hero_subtitle: "Guides and updates on deposits and savings in Armenia.",
    filter_all: "All",
    min_read: "min read",
    back_to_calculator: "Back to Calculator",
  },
  hy: {
    hero_title: "Կրթություն և Խորհուրդներ",
    hero_subtitle: "Ուղեցույցներ և թարմացումներ ավանդների և խնայողությունների մասին Հայաստանում:",
    filter_all: "Բոլորը",
    min_read: "ր կարդալ",
    back_to_calculator: "Վերադառնալ հաշվիչին",
  },
};

const CATEGORY_COLORS = {
  "taxes-regulation": { bg: "#3d1f1f", text: "#ff7b72" },
  "guarantees-safety": { bg: "#1b3224", text: "#56d364" },
  "how-banks-work": { bg: "#1f3352", text: "#79c0ff" },
  "products-terms": { bg: "#2a1f3d", text: "#bc8cff" },
  education: { bg: "#2d2209", text: "#e3b341" },
};

function formatDate(iso, lang) {
  const d = new Date(iso);
  return lang === "en"
    ? d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : d.toLocaleDateString("hy-AM", { day: "numeric", month: "short", year: "numeric" });
}

export default function BlogListContent({ articles, categories }) {
  const { T, lang } = useBlog();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const t = (key) => BLOG_LIST_TRANSLATIONS[lang][key] || key;

  const filtered = useMemo(() => {
    if (!selectedCategory) return articles;
    return articles.filter((a) => a.category === selectedCategory);
  }, [articles, selectedCategory]);

  const base = lang === "en" ? "/en/blog" : "/blog";

  return (
    <>
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: T.text, letterSpacing: "-0.02em", marginBottom: 8 }}>
          {t("hero_title")}
        </h1>
        <p style={{ fontSize: 16, color: T.textSub, lineHeight: 1.6, maxWidth: 560 }}>
          {t("hero_subtitle")}
        </p>
      </header>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24, overflowX: "auto", paddingBottom: 4 }}>
        <button
          type="button"
          onClick={() => setSelectedCategory(null)}
          style={{
            padding: "8px 14px",
            borderRadius: 8,
            border: `1px solid ${selectedCategory === null ? T.accent : T.border}`,
            background: selectedCategory === null ? T.accentBg : T.surfaceAlt,
            color: selectedCategory === null ? T.accentText : T.textSub,
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "inherit",
            whiteSpace: "nowrap",
          }}
        >
          {t("filter_all")}
        </button>
        {categories.map((cat) => {
          const name = lang === "en" ? cat.nameEn : cat.nameHy;
          const active = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: `1px solid ${active ? T.accent : T.border}`,
                background: active ? T.accentBg : T.surfaceAlt,
                color: active ? T.accentText : T.textSub,
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "inherit",
                whiteSpace: "nowrap",
              }}
            >
              {name}
            </button>
          );
        })}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 20,
        }}
      >
        {filtered.map((article) => {
          const catColors = CATEGORY_COLORS[article.category] || { bg: T.surfaceAlt, text: T.textSub };
          const categoryName = getCategoryName(article.category, lang);
          return (
            <Link
              key={article.slug}
              href={`${base}/${article.slug}`}
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "block",
                background: T.surface,
                border: `1px solid ${T.border}`,
                borderRadius: 12,
                padding: 20,
                transition: "border-color .15s, box-shadow .15s",
              }}
              className="blog-card"
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: catColors.text,
                  background: catColors.bg,
                  padding: "4px 8px",
                  borderRadius: 6,
                  display: "inline-block",
                  marginBottom: 12,
                }}
              >
                {categoryName}
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: T.text, marginBottom: 8, lineHeight: 1.3 }}>
                {article.title}
              </h2>
              <p style={{ fontSize: 14, color: T.textSub, lineHeight: 1.5, marginBottom: 12 }}>
                {article.excerpt}
              </p>
              <div style={{ fontSize: 12, color: T.textMuted, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <span>{formatDate(article.date, lang)}</span>
                <span>{article.readingTime} {t("min_read")}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p style={{ fontSize: 15, color: T.textMuted }}>{lang === "en" ? "No articles in this category." : "Այս կատեգորիայում հոդվածներ չկան:"}</p>
      )}
    </>
  );
}
