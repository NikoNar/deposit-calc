import BlogLayout from "../../blog/BlogLayout.jsx";
import BlogListContent from "../../blog/BlogListContent.jsx";
import { getArticles, getCategories } from "../../../lib/blog.js";

export const metadata = {
  title: "Education & News | Saving.am",
  description: "Guides and updates on deposits and savings in Armenia.",
};

export default function EnBlogPage() {
  const articles = getArticles("en");
  const categories = getCategories();
  return (
    <BlogLayout>
      <BlogListContent articles={articles} categories={categories} />
    </BlogLayout>
  );
}
