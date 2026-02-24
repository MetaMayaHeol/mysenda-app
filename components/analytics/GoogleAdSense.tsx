"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

/**
 * Google AdSense component.
 * Add your AdSense publisher ID in .env.local as NEXT_PUBLIC_ADSENSE_ID (e.g. ca-pub-XXXXXXXXXX)
 * 
 * This loads the AdSense script globally. Individual ad units use <AdUnit />.
 */
export function GoogleAdSense() {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  if (!adsenseId) return null;

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
      crossOrigin="anonymous"
      strategy="lazyOnload"
    />
  );
}

/**
 * Individual AdSense ad unit.
 * Place this component where you want an ad to appear.
 *
 * Props:
 * - slot: Your ad unit slot ID (from AdSense dashboard)
 * - format: Ad format ('auto', 'rectangle', 'horizontal', 'vertical')
 * - responsive: Whether the ad is responsive (default: true)
 * 
 * Example: <AdUnit slot="1234567890" format="auto" />
 */
export function AdUnit({
  slot,
  format = "auto",
  responsive = true,
  className = "",
}: {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  responsive?: boolean;
  className?: string;
}) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    if (!adsenseId || adLoaded) return;
    
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      setAdLoaded(true);
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, [adsenseId, adLoaded]);

  if (!adsenseId) return null;

  return (
    <div className={`adsense-container my-8 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={adsenseId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}

/**
 * In-article ad unit - specifically designed to blend with article content.
 * Place between paragraphs or after the ToC in blog posts.
 */
export function InArticleAd({ className = "" }: { className?: string }) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    if (!adsenseId || adLoaded) return;
    
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      setAdLoaded(true);
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, [adsenseId, adLoaded]);

  if (!adsenseId) return null;

  return (
    <div className={`adsense-in-article my-6 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client={adsenseId}
        data-ad-slot="" // Add your in-article slot ID here
      />
    </div>
  );
}
