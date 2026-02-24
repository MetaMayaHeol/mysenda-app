import { getArticleBySlug, getRelatedArticles } from "@/app/actions/blog";
import { notFound } from "next/navigation";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { createStaticClient } from "@/lib/supabase/static";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/blog/Breadcrumbs";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { generateHeadingId } from "@/lib/blog/utils";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { RelatedArticles } from "@/components/blog/RelatedArticles";
import { NewsletterSignup } from "@/components/blog/NewsletterSignup";
import { getTranslations } from "next-intl/server";

// --- SSG + ISR ---
export const revalidate = 3600;

export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data: articles } = await supabase
    .from('blog_articles')
    .select('slug')
    .eq('status', 'published');

  const locales = ['es', 'fr', 'en'];
  return (articles || []).flatMap(article =>
    locales.map(locale => ({ locale, slug: article.slug }))
  );
}

// --- Metadata with hreflang + canonical ---
export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
  const { slug, locale } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mysenda.com';

  return {
    title: article.meta_title || article.title,
    description: article.meta_description || article.excerpt,
    keywords: article.keywords,
    alternates: {
      canonical: `${baseUrl}/${locale}/blog/${slug}`,
      languages: {
        'es': `${baseUrl}/es/blog/${slug}`,
        'fr': `${baseUrl}/fr/blog/${slug}`,
        'en': `${baseUrl}/en/blog/${slug}`,
      },
    },
    openGraph: {
      title: article.meta_title || article.title,
      description: article.meta_description || article.excerpt,
      images: article.cover_image ? [article.cover_image] : [],
      type: "article",
      publishedTime: article.published_at,
      modifiedTime: article.updated_at,
      locale: locale,
      url: `${baseUrl}/${locale}/blog/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.meta_title || article.title,
      description: article.meta_description || article.excerpt,
      images: article.cover_image ? [article.cover_image] : [],
    },
  };
}

// --- Helpers ---
function getReadingTime(markdown: string): number {
  const words = markdown.trim().split(/\s+/).length;
  return Math.ceil(words / 200);
}

export default async function BlogPostPage({
  params
}: {
  params: Promise<{ slug: string, locale: string }>
}) {
  const { slug, locale } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || article.status !== 'published') {
    notFound();
  }

  const t = await getTranslations('blog');
  const readingTime = getReadingTime(article.content_markdown || '');
  const wordCount = (article.content_markdown || '').trim().split(/\s+/).length;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mysenda.com';

  // Fetch related articles
  const relatedArticles = await getRelatedArticles(
    article.id,
    article.blog_categories?.slug
  );

  // --- Enriched JSON-LD ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.meta_title || article.title,
    "description": article.meta_description || article.excerpt,
    "image": article.cover_image ? [article.cover_image] : [],
    "datePublished": article.published_at,
    "dateModified": article.updated_at,
    "wordCount": wordCount,
    "inLanguage": locale,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/${locale}/blog/${slug}`
    },
    "author": [{
      "@type": "Person",
      "name": article.users?.full_name || "Équipe MySenda"
    }],
    "publisher": {
      "@type": "Organization",
      "name": "MySenda",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/icon-512.png`
      }
    },
    "articleSection": article.blog_categories?.title || "Blog",
    "keywords": article.keywords || "",
  };

  // Breadcrumb items
  const breadcrumbItems = [
    { label: t('breadcrumbBlog'), href: `/${locale}/blog` },
    ...(article.blog_categories?.title
      ? [{ label: article.blog_categories.title, href: `/${locale}/blog/category/${article.blog_categories.slug}` }]
      : []),
    { label: article.title },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} locale={locale} />

        <header className="mb-10">
          {article.blog_categories?.title && (
            <div className="mb-4">
              <a
                href={`/${locale}/blog/category/${article.blog_categories.slug}`}
                className="text-sm font-bold text-primary tracking-wider uppercase hover:underline"
              >
                {article.blog_categories.title}
              </a>
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            {article.title}
          </h1>
          <div className="flex items-center flex-wrap text-zinc-500 dark:text-zinc-400 gap-x-4 gap-y-1 text-sm">
            <time dateTime={article.published_at}>
              {new Date(article.published_at).toLocaleDateString(locale, {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </time>
            <span>•</span>
            <span>{article.users?.full_name || "MySenda"}</span>
            <span>•</span>
            <span>{t('readingTime', { minutes: readingTime })}</span>
          </div>
        </header>

        {article.cover_image && (
          <figure className="mb-10 rounded-2xl overflow-hidden shadow-lg mx-auto relative aspect-[16/9]">
            <Image 
              src={article.cover_image} 
              alt={article.structured_data?.cover_image_alt || article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
            {article.structured_data?.cover_image_alt && article.structured_data.cover_image_alt !== article.title && (
              <figcaption className="absolute bottom-0 left-0 right-0 p-3 bg-zinc-900/70 text-center text-sm text-zinc-200 italic">
                {article.structured_data.cover_image_alt}
              </figcaption>
            )}
          </figure>
        )}

        {/* Table of Contents */}
        <TableOfContents markdown={article.content_markdown || ''} />

        <div className="prose prose-lg dark:prose-invert prose-primary max-w-none">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]} 
            rehypePlugins={[rehypeRaw]}
            components={{
              h2: ({node, children, ...props}) => {
                const text = typeof children === 'string' ? children : 
                  Array.isArray(children) ? children.map(c => typeof c === 'string' ? c : '').join('') : '';
                const id = generateHeadingId(String(text || ''));
                return <h2 id={id} {...props}>{children}</h2>;
              },
              h3: ({node, children, ...props}) => {
                const text = typeof children === 'string' ? children : 
                  Array.isArray(children) ? children.map(c => typeof c === 'string' ? c : '').join('') : '';
                const id = generateHeadingId(String(text || ''));
                return <h3 id={id} {...props}>{children}</h3>;
              },
              img: ({node, ...props}) => {
                if (props.alt) {
                  return (
                    <span className="block my-8 w-full">
                      <img {...props} className="w-full h-auto object-cover rounded-xl shadow-md mx-auto" loading="lazy" />
                      <span className="block mt-2 text-center text-sm text-zinc-500 italic">{props.alt}</span>
                    </span>
                  );
                }
                return <img {...props} className="rounded-xl w-full h-auto object-cover shadow-md mx-auto my-8" loading="lazy" />;
              }
            }}
          >
            {article.content_markdown}
          </ReactMarkdown>
        </div>

        {/* Share Buttons */}
        <ShareButtons
          url={`${baseUrl}/${locale}/blog/${slug}`}
          title={article.title}
        />

        {/* Newsletter Signup */}
        <div className="mt-12">
          <NewsletterSignup locale={locale} />
        </div>

        {/* Related Articles */}
        <RelatedArticles articles={relatedArticles as any} locale={locale} />
      </article>
    </>
  );
}
