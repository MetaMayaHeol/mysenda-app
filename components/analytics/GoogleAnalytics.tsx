"use client";

import Script from "next/script";

/**
 * Google Analytics 4 component.
 * Add your GA4 Measurement ID in .env.local as NEXT_PUBLIC_GA_MEASUREMENT_ID
 * 
 * Usage: Add <GoogleAnalytics /> to your root layout.
 */
export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (!gaId) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
              anonymize_ip: true,
              cookie_flags: 'SameSite=None;Secure',
            });
          `,
        }}
      />
    </>
  );
}

/**
 * Track custom events in GA4.
 * Call this function from client components.
 * 
 * Example: trackEvent('share_article', { method: 'twitter', article_slug: 'my-article' })
 */
export function trackEvent(eventName: string, parameters?: Record<string, string | number | boolean>) {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", eventName, parameters);
  }
}
