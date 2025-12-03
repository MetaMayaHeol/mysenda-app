/**
 * SEO Structured Data (JSON-LD) Generators
 * These functions generate Schema.org structured data for better SEO
 */

interface LocalBusinessSchema {
  name: string
  description?: string
  image?: string
  telephone?: string
  url: string
  address?: {
    addressLocality?: string
    addressCountry?: string
  }
}

interface ServiceSchema {
  name: string
  description?: string
  image?: string
  provider: {
    name: string
    url: string
  }
  offers?: {
    price: number
    priceCurrency: string
  }
}

/**
 * Generate LocalBusiness schema for guide profiles
 */
export function generateLocalBusinessSchema(data: LocalBusinessSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: data.name,
    description: data.description,
    image: data.image,
    telephone: data.telephone,
    url: data.url,
    address: data.address ? {
      '@type': 'PostalAddress',
      addressLocality: data.address.addressLocality,
      addressCountry: data.address.addressCountry || 'MX',
    } : undefined,
    priceRange: '$$',
  }
}

/**
 * Generate Service schema for tours/activities
 */
export function generateServiceSchema(data: ServiceSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: data.name,
    description: data.description,
    image: data.image,
    provider: {
      '@type': 'LocalBusiness',
      name: data.provider.name,
      url: data.provider.url,
    },
    offers: data.offers ? {
      '@type': 'Offer',
      price: data.offers.price,
      priceCurrency: data.offers.priceCurrency,
    } : undefined,
  }
}

/**
 * Generate Organization schema for RutaLink
 */
export function generateOrganizationSchema(baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'RutaLink',
    description: 'Plataforma para conectar viajeros con guías turísticos locales en México',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    sameAs: [
      // Add social media URLs when available
    ],
  }
}

/**
 * Generate BreadcrumbList schema for navigation
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * Generate WebSite schema with search action
 */
export function generateWebSiteSchema(baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'RutaLink',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/explorar?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

interface TouristDestinationSchema {
  name: string
  description: string
  url: string
  image?: string
  address?: {
    addressLocality?: string
    addressRegion?: string
    addressCountry?: string
  }
  geo?: {
    latitude: number
    longitude: number
  }
}

/**
 * Generate TouristDestination schema for city pages
 */
export function generateTouristDestinationSchema(data: TouristDestinationSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: data.name,
    description: data.description,
    url: data.url,
    image: data.image,
    address: {
      '@type': 'PostalAddress',
      addressLocality: data.address?.addressLocality || data.name,
      addressRegion: data.address?.addressRegion || 'Yucatán',
      addressCountry: data.address?.addressCountry || 'MX',
    },
    ...(data.geo && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: data.geo.latitude,
        longitude: data.geo.longitude,
      }
    }),
    touristType: [
      'CulturalTourism',
      'EcoTourism',
      'HeritageTourism'
    ]
  }
}

interface TouristAttractionSchema {
  name: string
  description: string
  url: string
  image?: string
  city?: string
}

/**
 * Generate TouristAttraction schema for activity pages
 * Note: Using TouristAttraction as a broad category for activities/tours
 */
export function generateTouristAttractionSchema(data: TouristAttractionSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: data.name,
    description: data.description,
    url: data.url,
    image: data.image,
    address: data.city ? {
      '@type': 'PostalAddress',
      addressLocality: data.city,
      addressRegion: 'Yucatán',
      addressCountry: 'MX',
    } : undefined,
  }
}
