import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

interface RelatedArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  published_at: string;
  blog_categories: { title: string; slug: string } | null;
}

export async function RelatedArticles({
  articles,
  locale,
}: {
  articles: RelatedArticle[];
  locale: string;
}) {
  const t = await getTranslations("blog");

  if (!articles || articles.length === 0) return null;

  return (
    <section className="border-t border-zinc-200 dark:border-zinc-800 pt-12 mt-12">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
          {t("relatedArticles")}
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          {t("relatedArticlesSubtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <article
            key={article.id}
            className="group flex flex-col bg-zinc-50 dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-zinc-100 dark:border-zinc-800"
          >
            <Link href={`/${locale}/blog/${article.slug}`} className="flex-grow flex flex-col">
              {article.cover_image ? (
                <div className="h-36 w-full overflow-hidden relative">
                  <Image
                    src={article.cover_image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              ) : (
                <div className="h-36 w-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                  <span className="text-zinc-400 font-medium tracking-widest uppercase text-xs">
                    MySenda
                  </span>
                </div>
              )}
              <div className="p-4 flex flex-col flex-grow">
                {article.blog_categories?.title && (
                  <span className="text-xs font-bold text-primary tracking-wider uppercase mb-1.5">
                    {article.blog_categories.title}
                  </span>
                )}
                <h3 className="text-base font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2 dark:text-white">
                  {article.title}
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs line-clamp-2 flex-grow">
                  {article.excerpt}
                </p>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
