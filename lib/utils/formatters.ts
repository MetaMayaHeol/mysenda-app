/**
 * Generates a URL-friendly slug from a name and optional city
 * @param name - Guide name
 * @param city - Optional city name
 * @returns URL-friendly slug
 */
export function slugify(name: string, city?: string): string {
  const text = city ? `${name}-${city}` : name
  
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // Normalize accents
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

/**
 * Formats a phone number to international format
 * @param phone - Phone number
 * @returns Formatted phone number
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '')
  
  // If it doesn't start with +, assume it's Mexican and add +52
  if (!phone.startsWith('+')) {
    return `+52${cleaned}`
  }
  
  return `+${cleaned}`
}

/**
 * Formats a price with currency symbol
 * @param price - Price amount
 * @param currency - Currency code (default: USD)
 * @returns Formatted price string
 */
export function formatPrice(price: number, currency: string = 'MXN'): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: currency,
  }).format(price)
}

/**
 * Formats duration in minutes to human-readable string
 * @param minutes - Duration in minutes
 * @returns Formatted duration string
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`
  }
  
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (remainingMinutes === 0) {
    return `${hours}h`
  }
  
  return `${hours}h ${remainingMinutes}min`
}
