/**
 * Maps the application locale to the Open Graph locale format (e.g. 'es' -> 'es_MX')
 * Defaults to 'es_MX' if the locale is not recognized.
 */
export function getOpenGraphLocale(locale: string): string {
  switch (locale) {
    case 'es':
      return 'es_MX'
    case 'en':
      return 'en_US'
    case 'fr':
      return 'fr_FR'
    default:
      return 'es_MX'
  }
}
