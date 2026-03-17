"use client";

import Link from "next/link";
import { useBlog } from "./BlogLayout.jsx";
import { getCategoryName } from "../../lib/blog.js";

const ARTICLE_TRANSLATIONS = {
  en: {
    home: "Home",
    min_read: "min read",
    related: "Related articles",
    toc_title: "On this page",
    cta_title: "Estimate your savings",
    cta_subtitle: "Use the Saving.am calculator to see how your deposit can grow.",
    cta_button: "Try the calculator",
  },
  hy: {
    home: "Գլխավոր",
    min_read: "ր կարդալ",
    related: "Կապված հոդվածներ",
    toc_title: "Այս էջում",
    cta_title: "Գնահատեք ձեր խնայողությունները",
    cta_subtitle: "Օգտագործեք Saving.am հաշվիչը՝ տեսնելու, թե ինչպես կարող է աճել ավանդը:",
    cta_button: "Բացել հաշվիչը",
  },
};

function slugifyId(text) {
  return text?.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9\u0580-\u058F-]/g, "").toLowerCase() || "";
}

function formatDate(iso, lang) {
  const d = new Date(iso);
  return lang === "en"
    ? d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : d.toLocaleDateString("hy-AM", { day: "numeric", month: "long", year: "numeric" });
}

function ProseBlock({ block, T, lang }) {
  if (block.type === "h2") {
    return (
      <h2
        id={slugifyId(block.text)}
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: T.text,
          marginTop: 28,
          marginBottom: 12,
          lineHeight: 1.3,
        }}
      >
        {block.text}
      </h2>
    );
  }
  if (block.type === "h3") {
    return (
      <h3
        id={slugifyId(block.text)}
        style={{
          fontSize: 17,
          fontWeight: 600,
          color: T.text,
          marginTop: 20,
          marginBottom: 8,
          lineHeight: 1.3,
        }}
      >
        {block.text}
      </h3>
    );
  }
  if (block.type === "p") {
    return (
      <p style={{ fontSize: 16, color: T.textSub, lineHeight: 1.7, marginBottom: 14 }}>
        {block.text}
      </p>
    );
  }
  if (block.type === "ul") {
    return (
      <ul style={{ fontSize: 16, color: T.textSub, lineHeight: 1.7, marginBottom: 14, paddingLeft: 20 }}>
        {block.items?.map((item, i) => (
          <li key={i} style={{ marginBottom: 4 }}>{item}</li>
        ))}
      </ul>
    );
  }
  if (block.type === "callout") {
    const toolHref = block.hrefPath
      ? (lang === "en" ? `/en/${block.hrefPath}` : `/${block.hrefPath}`)
      : null;
    const toolLabel = block.hrefPath && (lang === "en" ? block.linkLabelEn : block.linkLabelHy);
    return (
      <div
        style={{
          background: T.surfaceAlt,
          border: `1px solid ${T.border}`,
          borderRadius: 10,
          padding: "14px 18px",
          marginBottom: 14,
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 6 }}>{block.title}</div>
        <div style={{ fontSize: 14, color: T.textSub, lineHeight: 1.6 }}>{block.text}</div>
        {toolHref && toolLabel && (
          <div style={{ marginTop: 12 }}>
            <Link
              href={toolHref}
              style={{ fontSize: 14, fontWeight: 600, color: T.accent, textDecoration: "none" }}
            >
              {toolLabel}
            </Link>
          </div>
        )}
      </div>
    );
  }
  return null;
}

export default function ArticleContent({ article, relatedArticles }) {
  const { T, lang } = useBlog();
  const t = (key) => ARTICLE_TRANSLATIONS[lang][key] || key;
  const base = lang === "en" ? "/en/blog" : "/blog";
  const homeHref = lang === "en" ? "/en" : "/";
  const categoryName = getCategoryName(article.category, lang);

  const tocEntries = (article.body || [])
    .filter((b) => b.type === "h2" || b.type === "h3")
    .map((b) => ({ type: b.type, text: b.text, id: slugifyId(b.text) }));
  const showToc = tocEntries.length >= 2;

  return (
    <>
      <nav
        style={{ fontSize: 13, color: T.textMuted, marginBottom: 24 }}
        aria-label="Breadcrumb"
      >
        <Link href={homeHref} style={{ color: T.accent, textDecoration: "none" }}>{t("home")}</Link>
        <span style={{ margin: "0 6px" }}>/</span>
        <Link href={base} style={{ color: T.accent, textDecoration: "none" }}>
          {lang === "en" ? "Education & News" : "Կրթություն և Խորհուրդներ"}
        </Link>
        <span style={{ margin: "0 6px" }}>/</span>
        <span style={{ color: T.textMuted }}>{categoryName}</span>
        <span style={{ margin: "0 6px" }}>/</span>
        <span style={{ color: T.text }}>{article.title}</span>
      </nav>

      <header style={{ marginBottom: 28 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: T.accentText,
            marginBottom: 8,
          }}
        >
          {categoryName}
        </div>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: T.text,
            letterSpacing: "-0.02em",
            lineHeight: 1.25,
            marginBottom: 12,
          }}
        >
          {article.title}
        </h1>
        <div style={{ fontSize: 14, color: T.textMuted, display: "flex", gap: 16, flexWrap: "wrap" }}>
          <time dateTime={article.date}>{formatDate(article.date, lang)}</time>
          <span>{article.readingTime} {t("min_read")}</span>
        </div>
      </header>

      {showToc && (
        <nav style={{ marginBottom: 28, padding: "14px 18px", background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 10 }} aria-label="Table of contents">
          <div style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>{t("toc_title")}</div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {tocEntries.map((e) => (
              <li key={e.id} style={{ marginBottom: 6, paddingLeft: e.type === "h3" ? 16 : 0 }}>
                <a href={`#${e.id}`} style={{ fontSize: 14, color: T.accent, textDecoration: "none" }}>
                  {e.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <article
        style={{ maxWidth: 720, lineHeight: 1.7 }}
      >
        {article.body?.map((block, i) => (
          <ProseBlock key={i} block={block} T={T} lang={lang} />
        ))}
      </article>

      {relatedArticles?.length > 0 && (
        <section style={{ marginTop: 40, paddingTop: 28, borderTop: `1px solid ${T.border}` }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: T.text, marginBottom: 16 }}>
            {t("related")}
          </h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {relatedArticles.map((a) => (
              <li key={a.slug} style={{ marginBottom: 10 }}>
                <Link
                  href={`${base}/${a.slug}`}
                  style={{ fontSize: 15, color: T.accent, textDecoration: "none", fontWeight: 500 }}
                >
                  {a.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div
        style={{
          marginTop: 40,
          background: T.accentBg,
          border: `1px solid ${T.accent}`,
          borderRadius: 12,
          padding: 24,
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 600, color: T.accentText, marginBottom: 8 }}>
          {t("cta_title")}
        </h2>
        <p style={{ fontSize: 14, color: T.textSub, marginBottom: 16, maxWidth: 400, margin: "0 auto 16px" }}>
          {t("cta_subtitle")}
        </p>
        <Link
          href={homeHref}
          style={{
            display: "inline-block",
            padding: "10px 20px",
            borderRadius: 8,
            background: T.accent,
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          {t("cta_button")}
        </Link>
      </div>
    </>
  );
}
