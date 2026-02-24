import { getPublishedArticles } from "@/app/actions/blog";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: `/${locale}/blog`,
      languages: {
        'es': '/es/blog',
        'fr': '/fr/blog',
        'en': '/en/blog',
      },
    },
  };
}

export default async function BlogIndexPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const t = await getTranslations('blog');
  const articles = await getPublishedArticles();

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">{t('indexTitle')}</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          {t('indexSubtitle')}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.length === 0 ? (
          <p className="text-center col-span-full text-zinc-500 py-12">
            {t('comingSoon')}
          </p>
        ) : (
          articles.map((article) => (
            <article key={article.id} className="group flex flex-col bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-zinc-100 dark:border-zinc-800">
              <Link href={`/${locale}/blog/${article.slug}`} className="flex-grow flex flex-col">
                {article.cover_image ? (
                  <div className="h-48 w-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden relative">
                    <Image 
                      src={article.cover_image} 
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="h-48 w-full bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden flex items-center justify-center">
                    <span className="text-zinc-400 dark:text-zinc-600 font-medium tracking-widest uppercase text-sm">MySenda</span>
                  </div>
                )}
                <div className="p-6 flex flex-col flex-grow">
                  {article.blog_categories?.title && (
                    <span className="text-xs font-bold text-primary tracking-wider uppercase mb-2">
                      {article.blog_categories.title}
                    </span>
                  )}
                  <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h2>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4 line-clamp-3 flex-grow">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center text-xs text-zinc-500 dark:text-zinc-500 mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <time dateTime={article.published_at}>
                      {new Date(article.published_at).toLocaleDateString(locale, {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </time>
                  </div>
                </div>
              </Link>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
