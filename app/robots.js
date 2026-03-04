const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://saving.am";

/**
 * Next.js metadata file: generates /robots.txt
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
