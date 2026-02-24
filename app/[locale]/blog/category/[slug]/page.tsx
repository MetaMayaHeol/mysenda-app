import { getArticlesByCategory, getCategories } from "@/app/actions/blog";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/blog/Breadcrumbs";
import type { Metadata } from "next";
import { createStaticClient } from "@/lib/supabase/static";

export const revalidate = 3600;

export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data: categories } = await supabase
    .from('blog_categories')
    .select('slug');

  const locales = ['es', 'fr', 'en'];
  return (categories || []).flatMap(cat =>
    locales.map(locale => ({ locale, slug: cat.slug }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
  const { slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });

  // Get category name from the slug
  const supabase = createStaticClient();
  const { data: category } = await supabase
    .from('blog_categories')
    .select('title')
    .eq('slug', slug)
    .single();

  if (!category) return {};

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mysenda.com';

  return {
    title: t('categoryTitle', { category: category.title }),
    description: t('categorySubtitle', { category: category.title }),
    alternates: {
      canonical: `${baseUrl}/${locale}/blog/category/${slug}`,
      languages: {
        'es': `${baseUrl}/es/blog/category/${slug}`,
        'fr': `${baseUrl}/fr/blog/category/${slug}`,
        'en': `${baseUrl}/en/blog/category/${slug}`,
      },
    },
  };
}

export default async function CategoryPage({
  params
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug, locale } = await params;
  const t = await getTranslations('blog');

  // Get category info
  const supabase = createStaticClient();
  const { data: category } = await supabase
    .from('blog_categories')
    .select('title, slug')
    .eq('slug', slug)
    .single();

  if (!category) {
    notFound();
  }

  const articles = await getArticlesByCategory(slug);

  const breadcrumbItems = [
    { label: t('breadcrumbBlog'), href: `/${locale}/blog` },
    { label: category.title },
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <Breadcrumbs items={breadcrumbItems} locale={locale} />

      <header className="mb-12">
        <Link
          href={`/${locale}/blog`}
          className="text-sm text-primary hover:underline mb-4 inline-block"
        >
          {t('backToBlog')}
        </Link>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
          {t('categoryTitle', { category: category.title })}
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
          {t('categorySubtitle', { category: category.title })}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.length === 0 ? (
          <p className="text-center col-span-full text-zinc-500 py-12">
            {t('noArticlesInCategory')}
          </p>
        ) : (
          articles.map((article: any) => (
            <article key={article.id} className="group flex flex-col bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-zinc-100 dark:border-zinc-800">
              <Link href={`/${locale}/blog/${article.slug}`} className="flex-grow flex flex-col">
                {article.cover_image ? (
                  <div className="h-48 w-full overflow-hidden relative">
                    <Image
                      src={article.cover_image}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="h-48 w-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <span className="text-zinc-400 dark:text-zinc-600 font-medium tracking-widest uppercase text-sm">MySenda</span>
                  </div>
                )}
                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-xs font-bold text-primary tracking-wider uppercase mb-2">
                    {category.title}
                  </span>
                  <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h2>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4 line-clamp-3 flex-grow">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center text-xs text-zinc-500 mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800">
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
