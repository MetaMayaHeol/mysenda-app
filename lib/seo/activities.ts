export interface Activity {
  slug: string
  name: string
  description: string
  icon: string
  heroImage?: string
  metaDescription: string
  keywords: string[]
}

export const activities: Activity[] = [
  {
    slug: 'gastronomia',
    name: 'Gastronomía',
    description: 'Descubre sabores auténticos de la cocina yucateca y maya. Tours gastronómicos con guías expertos que te llevarán a mercados locales, restaurantes tradicionales y experiencias culinarias únicas.',
    icon: 'UtensilsCrossed',
    heroImage: '/images/activities/gastronomia.jpg',
    metaDescription: 'Tours gastronómicos en la Península de Yucatán. Cocina maya, yucateca y caribeña con guías locales.', keywords: ['cochinita pibil', 'salbutes', 'panuchos', 'poc chuc', 'mercados'],
  },
  {
    slug: 'cultura-historia',
    name: 'Cultura e Historia',
    description: 'Sumérgete en la rica historia maya y colonial de la península. Visitas guiadas a sitios históricos, museos y centros culturales con narrativas profundas y contextualizadas.',
    icon: 'Landmark',
    heroImage: '/images/activities/cultura-historia.jpg',
    metaDescription: 'Tours culturales e históricos en Yucatán. Historia maya, colonial y contemporánea.',
    keywords: ['historia maya', 'colonial', 'museos', 'patrimonio', 'tradiciones'],
  },
  {
    slug: 'naturaleza-aventura',
    name: 'Naturaleza y Aventura',
    description: 'Explora la biodiversidad única de la península. Cenotes, selvas, reservas de biosfera y aventuras ecoturísticas con guías especializados en naturaleza.',
    icon: 'TreePine',
    heroImage: '/images/activities/naturaleza-aventura.jpg',
    metaDescription: 'Tours de aventura y naturaleza en Yucatán. Cenotes, selva, flamingos y ecoturismo.',
    keywords: ['cenotes', 'flamingos', 'manglares', 'reservas', 'biodiversidad'],
  },
  {
    slug: 'arqueologia',
    name: 'Arqueología Maya',
    description: 'Visita las impresionantes zonas arqueológicas mayas con guías certificados. Chichén Itzá, Uxmal, Calakmul, Ek Balam y más sitios patrimonio de la humanidad.',
    icon: 'Castle',
    heroImage: '/images/activities/arqueologia.jpg',
    metaDescription: 'Tours arqueológicos mayas con guías certificados. Chichén Itzá, Uxmal, Calakmul y más.',
    keywords: ['chichén itzá', 'uxmal', 'calakmul', 'ek balam', 'ruinas mayas'],
  },
  {
    slug: 'fotografia',
    name: 'Fotografía',
    description: 'Tours especializados para fotógrafos amateur y profesionales. Captura la belleza de la península con guías que conocen los mejores ángulos y momentos del día.',
    icon: 'Camera',
    heroImage: '/images/activities/fotografia.jpg',
    metaDescription: 'Photo tours en Yucatán con guías especializados. Captura cenotes, arquitectura y naturaleza.',
    keywords: ['foto tours', 'fotografía', 'instagram', 'sunset', 'golden hour'],
  },
  {
    slug: 'ecoturismo',
    name: 'Ecoturismo',
    description: 'Turismo responsable en contacto con la naturaleza. Observación de aves, flora y fauna, con énfasis en conservación y respeto al medio ambiente.',
    icon: 'Leaf',
    heroImage: '/images/activities/ecoturismo.jpg',
    metaDescription: 'Ecoturismo en la Península de Yucatán. Tours sustentables y conservación.',
    keywords: ['sustentable', 'conservación', 'aves', 'flora', 'fauna'],
  },
  {
    slug: 'arte-artesanias',
    name: 'Arte y Artesanías',
    description: 'Conoce a artesanos locales y aprende sobre técnicas tradicionales. Bordados, hamacas, joyería, cerámica y otras expresiones artísticas de la región.',
    icon: 'Palette',
    heroImage: '/images/activities/arte-artesanias.jpg',
    metaDescription: 'Tours de arte y artesanías en Yucatán. Conoce artesanos y tradiciones locales.',
    keywords: ['artesanías', 'bordados', 'hamacas', 'joyería', 'talleres'],
  },
  {
    slug: 'playas-snorkel',
    name: 'Playas y Snorkel',
    description: 'Disfruta de las mejores playas del Caribe mexicano y Golfo de México. Snorkel en arrecifes de coral, nado con tortugas y deportes acuáticos.',
    icon: 'Waves',
    heroImage: '/images/activities/playas-snorkel.jpg',
    metaDescription: 'Tours de playa y snorkel en Riviera Maya y costa yucateca. Arrecifes y vida marina.',
    keywords: ['snorkel', 'buceo', 'arrecife', 'tortugas', 'caribe'],
  },
]

// Helper functions
export function getActivityBySlug(slug: string): Activity | undefined {
  return activities.find(activity => activity.slug === slug)
}

export function getAllActivitySlugs(): string[] {
  return activities.map(activity => activity.slug)
}
