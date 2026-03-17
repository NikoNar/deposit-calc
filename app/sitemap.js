import { getArticles } from "../lib/blog.js";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://saving.am";

/** Only include entries whose url is under BASE_URL (avoids "URL not allowed" in Search Console). */
function underBaseUrl(entry) {
  const url = typeof entry === "string" ? entry : entry?.url;
  if (!url) return false;
  try {
    const base = new URL(BASE_URL).origin;
    return new URL(url).origin === base;
  } catch {
    return false;
  }
}

/**
 * Next.js metadata file: generates /sitemap.xml
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default function sitemap() {
  const hyArticles = getArticles("hy");
  const enArticles = getArticles("en");

  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${BASE_URL}/en`, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/en/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/mortgage-calculator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/en/mortgage-calculator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/property-analyzer`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/en/property-analyzer`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/compound-interest-savings-calculator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/en/compound-interest-savings-calculator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/financial-health`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/en/financial-health`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
  ];

  const blogHy = hyArticles.map((a) => ({
    url: `${BASE_URL}/blog/${a.slug}`,
    lastModified: new Date(a.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const blogEn = enArticles.map((a) => ({
    url: `${BASE_URL}/en/blog/${a.slug}`,
    lastModified: new Date(a.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const all = [...staticPages, ...blogHy, ...blogEn];
  return all.filter(underBaseUrl);
}
