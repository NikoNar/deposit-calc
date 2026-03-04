import { notFound } from "next/navigation";
import BlogLayout from "../BlogLayout.jsx";
import ArticleContent from "../ArticleContent.jsx";
import ArticleSchema from "../ArticleSchema.jsx";
import { getArticles, getArticleBySlug } from "../../../lib/blog.js";

export async function generateStaticParams() {
  const articles = getArticles("hy");
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug, "hy");
  if (!article) return { title: "Հոդված | Saving.am" };
  return {
    title: `${article.title} | Saving.am`,
    description: article.excerpt,
    openGraph: {
      title: `${article.title} | Saving.am`,
      description: article.excerpt,
    },
  };
}

export default async function BlogArticlePage({ params }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug, "hy");
  if (!article) notFound();

  const articles = getArticles("hy");
  const relatedArticles = (article.relatedSlugs || [])
    .map((slug) => articles.find((a) => a.slug === slug))
    .filter(Boolean)
    .slice(0, 3);

  return (
    <BlogLayout>
      <ArticleSchema article={article} lang="hy" />
      <ArticleContent article={article} relatedArticles={relatedArticles} />
    </BlogLayout>
  );
}
