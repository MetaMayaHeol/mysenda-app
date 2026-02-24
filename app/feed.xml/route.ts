import { NextResponse } from 'next/server';
import { createStaticClient } from '@/lib/supabase/static';

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    const supabase = createStaticClient();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mysenda.com';
    
    // We fetch the latest 20 published articles
    const { data: articles, error } = await supabase
      .from('blog_articles')
      .select('title, slug, excerpt, published_at, blog_categories(title)')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error("RSS Feed Error:", error);
      return new NextResponse('Error generating feed', { status: 500 });
    }

    const rssItems = (articles || []).map((article) => {
      const category = article.blog_categories?.[0]?.title || 'Blog';
      const articleUrl = `${baseUrl}/fr/blog/${article.slug}`; // Defaulting to French for global RSS feed for now
      
      return `
        <item>
          <title><![CDATA[${article.title}]]></title>
          <link>${articleUrl}</link>
          <guid isPermaLink="true">${articleUrl}</guid>
          <description><![CDATA[${article.excerpt}]]></description>
          <category><![CDATA[${category}]]></category>
          <pubDate>${new Date(article.published_at).toUTCString()}</pubDate>
        </item>
      `;
    }).join('');

    const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
      <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
        <channel>
          <title>MySenda Blog</title>
          <link>${baseUrl}/fr/blog</link>
          <description>Voyage, écologie et culture en Amérique Latine.</description>
          <language>fr</language>
          <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
          <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
          ${rssItems}
        </channel>
      </rss>`;

    return new NextResponse(rssFeed, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate',
      },
    });
  } catch (error) {
    console.error("RSS Feed generation failed:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
