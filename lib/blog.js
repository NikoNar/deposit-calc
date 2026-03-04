/**
 * Blog data access: getArticles(lang), getArticleBySlug(slug, lang), getCategories().
 * Reading time is computed from body word count (~200 words/min).
 */
import articles from "../content/blog/articles.js";
import { CATEGORIES, CATEGORY_IDS } from "../content/blog/categories.js";

const WORDS_PER_MINUTE = 200;

function wordCount(blocks) {
  if (!Array.isArray(blocks)) return 0;
  return blocks.reduce((n, b) => {
    if (b.text) return n + b.text.split(/\s+/).filter(Boolean).length;
    if (b.items) return n + b.items.join(" ").split(/\s+/).filter(Boolean).length;
    return n;
  }, 0);
}

/**
 * @param {'en'|'hy'} lang
 * @returns {Array<{ slug: string, category: string, date: string, title: string, excerpt: string, body: Array, relatedSlugs: string[], readingTime: number }>}
 */
export function getArticles(lang) {
  const l = lang === "en" ? "en" : "hy";
  return articles.map((a) => {
    const body = l === "en" ? a.bodyEn : a.bodyHy;
    const words = wordCount(body);
    return {
      slug: a.slug,
      category: a.category,
      date: a.date,
      title: l === "en" ? a.titleEn : a.titleHy,
      excerpt: l === "en" ? a.excerptEn : a.excerptHy,
      body,
      relatedSlugs: a.relatedSlugs || [],
      readingTime: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
    };
  });
}

/**
 * @param {string} slug
 * @param {'en'|'hy'} lang
 * @returns {null|{ slug: string, category: string, date: string, title: string, excerpt: string, body: Array, relatedSlugs: string[], readingTime: number }}
 */
export function getArticleBySlug(slug, lang) {
  const a = articles.find((x) => x.slug === slug);
  if (!a) return null;
  const l = lang === "en" ? "en" : "hy";
  const body = l === "en" ? a.bodyEn : a.bodyHy;
  const words = wordCount(body);
  return {
    slug: a.slug,
    category: a.category,
    date: a.date,
    title: l === "en" ? a.titleEn : a.titleHy,
    excerpt: l === "en" ? a.excerptEn : a.excerptHy,
    body,
    relatedSlugs: a.relatedSlugs || [],
    readingTime: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
  };
}

/**
 * @returns {Array<{ id: string, nameEn: string, nameHy: string }>}
 */
export function getCategories() {
  return CATEGORY_IDS.map((id) => ({
    id,
    nameEn: CATEGORIES[id].en,
    nameHy: CATEGORIES[id].hy,
  }));
}

/**
 * Category display name for a given lang
 */
export function getCategoryName(categoryId, lang) {
  const c = CATEGORIES[categoryId];
  if (!c) return categoryId;
  return lang === "en" ? c.en : c.hy;
}

export { CATEGORIES, CATEGORY_IDS };
