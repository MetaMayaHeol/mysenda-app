/**
 * Affiliate Links Utility
 * 
 * Use this utility to manage affiliate links and tracking across the blog.
 * When you join affiliate programs (Booking.com, GetYourGuide, Amazon, etc.),
 * add your tracking IDs here and use the helper functions in your content.
 * 
 * Usage in components:
 *   import { getAffiliateUrl, AFFILIATE_PROGRAMS } from '@/lib/blog/affiliates';
 *   const url = getAffiliateUrl('booking', 'https://www.booking.com/hotel/mx/example.html');
 */

interface AffiliateProgram {
  name: string;
  paramName: string;
  trackingId: string;
  baseUrl?: string;
  enabled: boolean;
}

export const AFFILIATE_PROGRAMS: Record<string, AffiliateProgram> = {
  booking: {
    name: "Booking.com",
    paramName: "aid",
    trackingId: process.env.NEXT_PUBLIC_BOOKING_AFFILIATE_ID || "",
    baseUrl: "https://www.booking.com",
    enabled: !!process.env.NEXT_PUBLIC_BOOKING_AFFILIATE_ID,
  },
  getyourguide: {
    name: "GetYourGuide",
    paramName: "partner_id",
    trackingId: process.env.NEXT_PUBLIC_GYG_AFFILIATE_ID || "",
    baseUrl: "https://www.getyourguide.com",
    enabled: !!process.env.NEXT_PUBLIC_GYG_AFFILIATE_ID,
  },
  amazon: {
    name: "Amazon",
    paramName: "tag",
    trackingId: process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || "",
    baseUrl: "https://www.amazon.com",
    enabled: !!process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG,
  },
  worldnomads: {
    name: "World Nomads",
    paramName: "affiliate_id",
    trackingId: process.env.NEXT_PUBLIC_WORLDNOMADS_ID || "",
    baseUrl: "https://www.worldnomads.com",
    enabled: !!process.env.NEXT_PUBLIC_WORLDNOMADS_ID,
  },
};

/**
 * Generate an affiliate URL by adding tracking parameters.
 * Returns the original URL if the program is not configured.
 */
export function getAffiliateUrl(program: keyof typeof AFFILIATE_PROGRAMS, originalUrl: string): string {
  const affiliate = AFFILIATE_PROGRAMS[program];
  
  if (!affiliate || !affiliate.enabled || !affiliate.trackingId) {
    return originalUrl;
  }

  try {
    const url = new URL(originalUrl);
    url.searchParams.set(affiliate.paramName, affiliate.trackingId);
    return url.toString();
  } catch {
    // If URL parsing fails, return original
    return originalUrl;
  }
}

/**
 * Check if an affiliate program is configured and active.
 */
export function isAffiliateEnabled(program: keyof typeof AFFILIATE_PROGRAMS): boolean {
  return AFFILIATE_PROGRAMS[program]?.enabled ?? false;
}

/**
 * Get all enabled affiliate programs.
 */
export function getEnabledAffiliates(): AffiliateProgram[] {
  return Object.values(AFFILIATE_PROGRAMS).filter(p => p.enabled);
}
