import { Star } from 'lucide-react'
import Image from 'next/image'

interface Testimonial {
  name: string
  location: string
  rating: number
  quote: string
  tourReference: string
  avatarUrl?: string
}

const testimonials: Testimonial[] = [
  {
    name: 'Constanza García',
    location: 'CDMX',
    rating: 5,
    quote: '¡Experiencia inolvidable! Ana nos mostró rincones de Mérida que jamás habríamos encontrado solos. Totalmente recomendado.',
    tourReference: 'Tour Cultural en Mérida',
  },
  {
    name: 'John Smith',
    location: 'USA',
    rating: 5,
    quote: 'Amazing cenotes tour in Valladolid! Alejandro knows every hidden spot. Best experience in the Yucatan.',
    tourReference: 'Cenotes Tour en Valladolid',
  },
  {
    name: 'Roberto Silva',
    location: 'Brasil',
    rating: 5,
    quote: 'Excelente plataforma para encontrar guías en Playa del Carmen. La comunicación directa por WhatsApp hace todo más fácil y personal.',
    tourReference: 'Tour de Snorkel en Cozumel',
  },
  {
    name: 'Sophie Dubois',
    location: 'Francia',
    rating: 5,
    quote: 'J\'ai adoré Bacalar! Le guide était passionné et très professionnel. Une expérience authentique dans la lagune.',
    tourReference: 'Tour en la Laguna de Bacalar',
  },
]

export function TestimonialsSection() {
  // Generate avatar initials
  const getInitials = (name: string) => {
    const parts = name.split(' ')
    return parts.map(p => p[0]).join('').toUpperCase()
  }

  // Generate consistent colors based on name
  const getAvatarColor = (name: string) => {
    const colors = [
      'from-blue-400 to-blue-600',
      'from-purple-400 to-purple-600',
      'from-pink-400 to-pink-600',
      'from-green-400 to-green-600',
      'from-orange-400 to-orange-600',
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  return (
    <div className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-5">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Lo que dicen nuestros viajeros
          </h2>
          <p className="text-xl text-gray-600">
            Miles de experiencias auténticas compartidas por viajeros como tú
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    className={
                      star <= testimonial.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-gray-700 text-sm leading-relaxed mb-6 flex-grow">
                &quot;{testimonial.quote}&quot;
              </blockquote>

              {/* Tour Reference */}
              <p className="text-xs text-gray-500 mb-4 italic border-l-2 border-green-500 pl-3">
                {testimonial.tourReference}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAvatarColor(
                    testimonial.name
                  )} flex items-center justify-center text-white font-bold text-sm shadow-sm`}
                >
                  {getInitials(testimonial.name)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
                  <p className="text-xs text-gray-500">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional testimonials count */}
        <div className="text-center mt-12">
          <p className="text-gray-600">
            <strong className="text-green-600 text-2xl font-bold">100%</strong> de viajeros satisfechos con nuestros guías
          </p>
        </div>
      </div>
    </div>
  )
}
