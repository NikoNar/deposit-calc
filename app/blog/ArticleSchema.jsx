const SITE_BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://saving.am";

/**
 * JSON-LD Article and BreadcrumbList schema for article pages.
 * Used in app/blog/[slug]/page.jsx and app/en/blog/[slug]/page.jsx.
 */
export default function ArticleSchema({ article, lang }) {
  const baseUrl = lang === "en" ? `${SITE_BASE}/en/blog` : `${SITE_BASE}/blog`;
  const fullUrl = `${baseUrl}/${article.slug}`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    author: {
      "@type": "Organization",
      name: "Saving.am",
    },
    publisher: {
      "@type": "Organization",
      name: "Saving.am",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": fullUrl,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: lang === "en" ? "Home" : "Գլխավոր", item: baseUrl.replace(/\/blog$/, "") },
      { "@type": "ListItem", position: 2, name: lang === "en" ? "Education & News" : "Կրթություն և Խորհուրդներ", item: baseUrl },
      { "@type": "ListItem", position: 3, name: article.title, item: fullUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
