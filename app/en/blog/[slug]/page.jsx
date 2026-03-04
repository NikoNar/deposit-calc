import { notFound } from "next/navigation";
import BlogLayout from "../../../blog/BlogLayout.jsx";
import ArticleContent from "../../../blog/ArticleContent.jsx";
import ArticleSchema from "../../../blog/ArticleSchema.jsx";
import { getArticles, getArticleBySlug } from "../../../../lib/blog.js";

export async function generateStaticParams() {
  const articles = getArticles("en");
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug, "en");
  if (!article) return { title: "Article | Saving.am" };
  return {
    title: `${article.title} | Saving.am`,
    description: article.excerpt,
    openGraph: {
      title: `${article.title} | Saving.am`,
      description: article.excerpt,
    },
  };
}

export default async function EnBlogArticlePage({ params }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug, "en");
  if (!article) notFound();

  const articles = getArticles("en");
  const relatedArticles = (article.relatedSlugs || [])
    .map((slug) => articles.find((a) => a.slug === slug))
    .filter(Boolean)
    .slice(0, 3);

  return (
    <BlogLayout>
      <ArticleSchema article={article} lang="en" />
      <ArticleContent article={article} relatedArticles={relatedArticles} />
    </BlogLayout>
  );
}
