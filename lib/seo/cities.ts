export interface City {
  slug: string
  name: string
  state: string
  description: string
  highlights: string[]
  heroImage?: string
  metaDescription: string
}

export const cities: City[] = [
  // Yucatán
  {
    slug: 'merida',
    name: 'Mérida',
    state: 'Yucatán',
    description: 'Capital de Yucatán, la Ciudad Blanca conocida por su arquitectura colonial, cenotes cercanos y rica tradición gastronómica yucateca.',
    highlights: ['Cenotes', 'Zonas Mayas', 'Gastronomía Yucateca', 'Paseo de Montejo'],
    heroImage: '/images/cities/merida.jpg',
    metaDescription: 'Descubre Mérida con guías locales expertos. Tours culturales, gastronómicos y arqueológicos en la capital yucateca.',
  },
  {
    slug: 'valladolid',
    name: 'Valladolid',
    state: 'Yucatán',
    description: 'Pueblo Mágico cercano a Chichén Itzá, con cenotes impresionantes y arquitectura colonial colorida.',
    highlights: ['Cenote Zací', 'Chichén Itzá', 'Arquitectura Colonial', 'Calzada de los Frailes'],
    heroImage: '/images/cities/valladolid.jpg',
    metaDescription: 'Guías locales en Valladolid para tours a Chichén Itzá, cenotes y recorridos coloniales.',
  },
  {
    slug: 'izamal',
    name: 'Izamal',
    state: 'Yucatán',
    description: 'La Ciudad Amarilla, Pueblo Mágico famoso por su convento franciscano y pirámides mayas.',
    highlights: ['Convento Franciscano', 'Pirámides Mayas', 'Artesanías', 'Calesas'],
    heroImage: '/images/cities/izamal.jpg',
    metaDescription: 'Tours en Izamal con guías locales. Descubre la magia de la Ciudad Amarilla y sus pirámides.',
  },
  {
    slug: 'rio-lagartos',
    name: 'Río Lagartos',
    state: 'Yucatán',
    description: 'Reserva de la biosfera con miles de flamingos rosados, manglares y biodiversidad única.',
    highlights: ['Flamingos Rosados', 'Manglares', 'Ría', 'Pesca Deportiva'],
    heroImage: '/images/cities/rio-lagartos.jpg',
    metaDescription: 'Tours de avistamiento de flamingos en Río Lagartos con guías especializados en ecoturismo.',
  },
  {
    slug: 'mani',
    name: 'Maní',
    state: 'Yucatán',
    description: 'Pueblo Mágico cuna de la cochinita pibil, con historia maya y colonial fascinante.',
    highlights: ['Gastronomía Típica', 'Convento de San Miguel', 'Historia Maya', 'Cochinita Pibil'],
    heroImage: '/images/cities/mani.jpg',
    metaDescription: 'Tours gastronómicos en Maní, cuna de la cochinita pibil. Guías locales expertos.',
  },
  {
    slug: 'uxmal',
    name: 'Uxmal',
    state: 'Yucatán',
    description: 'Zona arqueológica Patrimonio de la Humanidad, máximo exponente del estilo arquitectónico Puuc.',
    highlights: ['Pirámide del Adivino', 'Arquitectura Puuc', 'Ruinas Mayas', 'Espectáculo de Luz'],
    heroImage: '/images/cities/uxmal.jpg',
    metaDescription: 'Guías arqueológicos especializados en Uxmal. Descubre la majestuosa Pirámide del Adivino.',
  },
  {
    slug: 'celestun',
    name: 'Celestún',
    state: 'Yucatán',
    description: 'Reserva de la biosfera famosa por sus flamingos rosados, manglares y playas vírgenes.',
    highlights: ['Flamingos', 'Manglares', 'Playa Tranquila', 'Ojo de Agua Dulce'],
    heroImage: '/images/cities/celestun.jpg',
    metaDescription: 'Tours de naturaleza en Celestún con guías especializados. Flamingos, manglares y playas.',
  },
  {
    slug: 'sisal',
    name: 'Sisal',
    state: 'Yucatán',
    description: 'Puerto histórico y pueblo de pescadores con playas tranquilas y gastronomía marina auténtica.',
    highlights: ['Puerto Histórico', 'Playa Tranquila', 'Historia del Henequén', 'Gastronomía Marina'],
    heroImage: '/images/cities/sisal.jpg',
    metaDescription: 'Descubre Sisal con guías locales. Historia, playas y la mejor gastronomía marina de Yucatán.',
  },
  
  // Quintana Roo
  {
    slug: 'playa-del-carmen',
    name: 'Playa del Carmen',
    state: 'Quintana Roo',
    description: 'Cosmopolita ciudad en la Riviera Maya, puerta a Cozumel y cenotes impresionantes.',
    highlights: ['Quinta Avenida', 'Ferry a Cozumel', 'Cenotes', 'Vida Nocturna'],
    heroImage: '/images/cities/playa-del-carmen.jpg',
    metaDescription: 'Guías locales en Playa del Carmen para tours a cenotes, Cozumel y Riviera Maya.',
  },
  {
    slug: 'tulum',
    name: 'Tulum',
    state: 'Quintana Roo',
    description: 'Ruinas mayas frente al mar Caribe, playas paradisíacas y cenotes sagrados.',
    highlights: ['Zona Arqueológica Frente al Mar', 'Playas', 'Cenotes', 'Vida Bohemia'],
    heroImage: '/images/cities/tulum.jpg',
    metaDescription: 'Tours arqueológicos y de naturaleza en Tulum con guías expertos. Ruinas, playas y cenotes.',
  },
  {
    slug: 'bacalar',
    name: 'Bacalar',
    state: 'Quintana Roo',
    description: 'La Laguna de los 7 Colores, pueblo mágico con aguas cristalinas y cenotes únicos.',
    highlights: ['Laguna de 7 Colores', 'Cenote Azul', 'Fuerte de San Felipe', 'Kayak'],
    heroImage: '/images/cities/bacalar.jpg',
    metaDescription: 'Tours en la Laguna de Bacalar con guías locales. Kayak, snorkel y naturaleza.',
  },
  {
    slug: 'isla-mujeres',
    name: 'Isla Mujeres',
    state: 'Quintana Roo',
    description: 'Isla paradisíaca con playas de arena blanca, arrecifes de coral y ambiente caribeño.',
    highlights: ['Playas Paradisíacas', 'Snorkel y Buceo', 'Tortugas Marinas', 'Punta Sur'],
    heroImage: '/images/cities/isla-mujeres.jpg',
    metaDescription: 'Guías especializados en Isla Mujeres. Tours de snorkel, playas y cultura caribeña.',
  },
  
  // Campeche
  {
    slug: 'campeche',
    name: 'Campeche',
    state: 'Campeche',
    description: 'Ciudad Patrimonio de la Humanidad con murallas coloniales, fuertes y centro histórico colorido.',
    highlights: ['Centro Histórico', 'Murallas Coloniales', 'Fuertes', 'Malecón'],
    heroImage: '/images/cities/campeche.jpg',
    metaDescription: 'Tours históricos en Campeche con guías certificados. Ciudad Patrimonio de la Humanidad.',
  },
  {
    slug: 'calakmul',
    name: 'Calakmul',
    state: 'Campeche',
    description: 'Zona arqueológica maya en lo profundo de la selva, reserva de biosfera con fauna silvestre.',
    highlights: ['Ruinas Mayas', 'Reserva de Biosfera', 'Fauna Silvestre', 'Selva Virgen'],
    heroImage: '/images/cities/calakmul.jpg',
    metaDescription: 'Expediciones arqueológicas a Calakmul con guías expertos en cultura maya y naturaleza.',
  },
  {
    slug: 'isla-aguada',
    name: 'Isla Aguada',
    state: 'Campeche',
    description: 'Pueblo de pescadores en la costa con flamingos, playas vírgenes y tradición pesquera.',
    highlights: ['Flamingos', 'Pesca Deportiva', 'Playas Vírgenes', 'Laguna de Términos'],
    heroImage: '/images/cities/isla-aguada.jpg',
    metaDescription: 'Tours de pesca y naturaleza en Isla Aguada. Flamingos y tradición pesquera auténtica.',
  },
]

// Helper functions
export function getCityBySlug(slug: string): City | undefined {
  return cities.find(city => city.slug === slug)
}

export function getCitiesByState(state: string): City[] {
  return cities.filter(city => city.state === state)
}

export function getAllStates(): string[] {
  return Array.from(new Set(cities.map(city => city.state)))
}
