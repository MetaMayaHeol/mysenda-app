import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { getPublishedArticles } from '@/app/actions/blog'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ArrowRight, BookOpen, Compass } from 'lucide-react'
import { NewsletterSignup } from '@/components/blog/NewsletterSignup'

// Cache pour la page d'accueil (Revalidate chaque heure)
export const revalidate = 3600

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('blog');
  const tNav = await getTranslations('blogNav');
  
  // Limiter à 6 articles pour la page d'accueil
  const latestArticles = (await getPublishedArticles()).slice(0, 6);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Hero Section - Blog Focus */}
      <div className="relative bg-zinc-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <Image
            src="/hero-yucatan.webp"
            alt="Latin America landscape"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/60 via-zinc-900/80 to-zinc-950" />
        
        <div className="relative container mx-auto px-5 py-32 md:py-48 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm">
            <Compass className="w-4 h-4 text-primary-300" />
            <span className="text-primary-200 text-sm font-medium tracking-wide">{t('heroTagline')}</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight leading-tight max-w-4xl">
            {t('heroTitle')}
          </h1>
          
          <p className="text-xl md:text-2xl text-zinc-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t('heroSubtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${locale}/blog`}>
              <Button className="bg-primary hover:bg-primary/90 text-white font-bold h-14 px-8 text-lg w-full sm:w-auto rounded-full shadow-lg shadow-primary/20 transition-all hover:scale-105">
                <BookOpen className="mr-2" size={20} />
                {t('heroCta')}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Articles Section */}
      <div className="py-24 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-5 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b dark:border-zinc-800 pb-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">{t('latestArticles')}</h2>
              <p className="text-xl text-zinc-600 dark:text-zinc-400">{t('latestArticlesSubtitle')}</p>
            </div>
            <Link href={`/${locale}/blog`} className="hidden md:flex items-center gap-2 text-primary font-bold hover:text-primary/80 transition-colors mt-6 md:mt-0">
              {t('viewAllBlog')} <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestArticles.length === 0 ? (
              <p className="text-center col-span-full text-zinc-500 py-12">
                {t('blogPreparing')}
              </p>
            ) : (
              latestArticles.map((article) => (
                <article key={article.id} className="group flex flex-col bg-zinc-50 dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-zinc-100 dark:border-zinc-800">
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
                      <div className="h-48 w-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                        <span className="text-zinc-400 font-medium tracking-widest uppercase text-sm">MySenda</span>
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-grow">
                      {article.blog_categories?.title && (
                        <span className="text-xs font-bold text-primary tracking-wider uppercase mb-2">
                          {article.blog_categories.title}
                        </span>
                      )}
                      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2 dark:text-white">
                        {article.title}
                      </h3>
                      <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                    </div>
                  </Link>
                </article>
              ))
            )}
          </div>

          <div className="mt-12 text-center md:hidden">
            <Link href={`/${locale}/blog`}>
              <Button variant="outline" className="w-full rounded-full h-12">
                {t('viewAllArticles')}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="py-16 bg-zinc-50 dark:bg-zinc-900">
        <div className="container mx-auto px-5 max-w-2xl">
          <NewsletterSignup locale={locale} />
        </div>
      </div>

      {/* Footer Minimaliste pour le Blog */}
      <footer className="bg-zinc-950 text-zinc-400 py-16 border-t border-zinc-900">
        <div className="container mx-auto px-5 text-center">
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white text-2xl font-bold">M</span>
            </div>
          </div>
          <p className="max-w-md mx-auto text-zinc-500 mb-8">
            {t('footerTagline')}
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm mb-12">
            <Link href={`/${locale}/privacy`} className="hover:text-primary transition-colors">{t('privacy')}</Link>
            <Link href={`/${locale}/terms`} className="hover:text-primary transition-colors">{t('terms')}</Link>
          </div>
          <div className="pt-8 border-t border-zinc-900 text-sm text-zinc-600">
            <p>{t('copyright', { year: new Date().getFullYear() })}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
