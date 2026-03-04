import BlogLayout from "./BlogLayout.jsx";
import BlogListContent from "./BlogListContent.jsx";
import { getArticles, getCategories } from "../../lib/blog.js";

export const metadata = {
  title: "Կրթություն և Խորհուրդներ | Saving.am",
  description: "Ուղեցույցներ և թարմացումներ ավանդների և խնայողությունների մասին Հայաստանում:",
};

export default function BlogPage() {
  const articles = getArticles("hy");
  const categories = getCategories();
  return (
    <BlogLayout>
      <BlogListContent articles={articles} categories={categories} />
    </BlogLayout>
  );
}
