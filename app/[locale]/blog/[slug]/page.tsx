import { getArticleBySlug } from "@/app/actions/blog";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug);
  if (!article) return {};

  return {
    title: article.meta_title || article.title,
    description: article.meta_description || article.excerpt,
    keywords: article.keywords,
    openGraph: {
      title: article.meta_title || article.title,
      description: article.meta_description || article.excerpt,
      images: article.cover_image ? [article.cover_image] : [],
      type: "article",
      publishedTime: article.published_at,
    }
  };
}

export default async function BlogPostPage({
  params
}: {
  params: { slug: string, locale: string }
}) {
  const article = await getArticleBySlug(params.slug);

  if (!article || article.status !== 'published') {
    notFound();
  }

  // AI-SEO / Schema.org JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.meta_title || article.title,
    "image": article.cover_image ? [article.cover_image] : [],
    "datePublished": article.published_at,
    "dateModified": article.updated_at,
    "author": [{
      "@type": "Person",
      "name": article.users?.full_name || "Équipe MySenda"
    }]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="container mx-auto px-4 py-12 max-w-3xl">
        <header className="mb-10">
          {article.blog_categories?.title && (
            <div className="mb-4">
              <span className="text-sm font-bold text-primary tracking-wider uppercase">
                {article.blog_categories.title}
              </span>
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            {article.title}
          </h1>
          <div className="flex items-center text-zinc-500 dark:text-zinc-400 space-x-4">
            <time dateTime={article.published_at}>
              {new Date(article.published_at).toLocaleDateString(params.locale, {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </time>
            <span>•</span>
            <span>{article.users?.full_name || "MySenda"}</span>
          </div>
        </header>

        {article.cover_image && (
          <div className="mb-10 rounded-2xl overflow-hidden shadow-lg">
            <img 
              src={article.cover_image} 
              alt={article.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        <div className="prose prose-lg dark:prose-invert prose-primary max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {article.content_markdown}
          </ReactMarkdown>
        </div>
      </article>
    </>
  );
}
