import { ImageResponse } from 'next/og'
import { createStaticClient } from '@/lib/supabase/static'

// Route segment config
export const runtime = 'edge'
export const alt = 'MySenda Blog Article'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params }: { params: { slug: string; locale: string } }) {
  const { slug, locale } = params;

  // Fetch article
  const supabase = createStaticClient();
  const { data: article } = await supabase
    .from('blog_articles')
    .select('title, categories:blog_categories(title)')
    .eq('slug', slug)
    .single();

  const title = article?.title || 'MySenda Blog';
  const categoryTitle = article?.categories?.[0]?.title?.toUpperCase() || 'ARTICLE';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          backgroundColor: '#09090b', // zinc-950
          backgroundImage: 'radial-gradient(circle at 25px 25px, #27272a 2%, transparent 0%), radial-gradient(circle at 75px 75px, #27272a 2%, transparent 0%)',
          backgroundSize: '100px 100px',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#16a34a', // primary (green-600)
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '20px',
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
            </svg>
          </div>
          <span style={{ color: '#ffffff', fontSize: '32px', fontWeight: 'bold' }}>
            MySenda
          </span>
        </div>

        <div
          style={{
            color: '#16a34a',
            fontSize: '24px',
            letterSpacing: '0.1em',
            fontWeight: 'bold',
            marginBottom: '20px',
            textTransform: 'uppercase',
          }}
        >
          {categoryTitle}
        </div>

        <div
          style={{
            fontSize: '72px',
            fontWeight: '900',
            color: 'white',
            lineHeight: 1.1,
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {title}
        </div>

        <div style={{ display: 'flex', marginTop: 'auto', alignItems: 'center' }}>
          <span style={{ color: '#a1a1aa', fontSize: '24px' }}>
            mysenda.com
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
