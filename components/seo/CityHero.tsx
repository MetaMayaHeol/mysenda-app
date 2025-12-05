import Image from 'next/image'
import { MapPin } from 'lucide-react'
import type { City } from '@/lib/seo/cities'

interface CityHeroProps {
  city: City
  guideCount?: number
  activityCount?: number
  translations: {
    heroTitle: string
    localGuidesCount: string
    tourTypesCount: string
  }
}

export function CityHero({ city, guideCount = 0, activityCount = 0, translations }: CityHeroProps) {
  return (
    <div className="relative bg-gray-900 text-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-30">
        {city.heroImage ? (
          <Image
            src={city.heroImage}
            alt={`${city.name}, ${city.state}`}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <Image
            src="https://images.unsplash.com/photo-1512813195074-367b7a0f5ada?auto=format&fit=crop&w=2000&q=80"
            alt={`${city.name}, ${city.state}`}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 to-gray-900/90" />
      
      <div className="relative container mx-auto px-5 py-20 md:py-32">
        <div className="max-w-4xl">
          {/* Location Badge */}
          <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-1.5 mb-6 backdrop-blur-sm">
            <MapPin className="text-green-300" size={16} />
            <span className="text-green-300 text-sm font-medium">{city.state}</span>
          </div>
          
          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
            {translations.heroTitle} <span className="text-green-400">{city.name}</span>
          </h1>
          
          {/* Description */}
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed max-w-3xl">
            {city.description}
          </p>

          {/* Highlights */}
          <div className="flex flex-wrap gap-2 mb-8">
            {city.highlights.map((highlight, index) => (
              <span
                key={index}
                className="inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium border border-white/20"
              >
                {highlight}
              </span>
            ))}
          </div>

          {/* Stats */}
          {(guideCount > 0 || activityCount > 0) && (
            <div className="flex flex-wrap gap-8 text-sm">
              {guideCount > 0 && (
                <div>
                  <div className="text-3xl font-bold text-green-400">{guideCount}</div>
                  <div className="text-gray-400">{translations.localGuidesCount}</div>
                </div>
              )}
              {activityCount > 0 && (
                <div>
                  <div className="text-3xl font-bold text-green-400">{activityCount}</div>
                  <div className="text-gray-400">{translations.tourTypesCount}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
