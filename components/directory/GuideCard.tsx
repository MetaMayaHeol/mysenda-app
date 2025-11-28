import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LANGUAGE_NAMES } from '@/lib/utils/constants'

interface GuideCardProps {
  guide: {
    name: string
    bio: string | null
    photo_url: string | null
    languages: string[] | null
    city: string | null
    country: string | null
    slug: string
  }
}

export function GuideCard({ guide }: GuideCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full group">
      <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {guide.photo_url ? (
          <Image
            src={guide.photo_url}
            alt={guide.name || 'Guide'}
            fill
            className="object-contain object-center transition-transform duration-500 group-hover:scale-105"
            quality={90}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-green-100 text-green-600 text-4xl font-bold">
            {guide.name?.[0]}
          </div>
        )}
        
        {/* Location Badge */}
        {guide.city && (
          <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
            <MapPin size={12} />
            {guide.city}, {guide.country || 'MX'}
          </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{guide.name}</h3>
        
        <div className="flex flex-col gap-2 mb-4">
          {guide.languages && guide.languages.length > 0 && (
            <div className="flex items-start gap-2">
              <Globe size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex flex-wrap gap-1.5">
                {guide.languages.map((lang) => (
                  <span 
                    key={lang}
                    className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                  >
                    {LANGUAGE_NAMES[lang as keyof typeof LANGUAGE_NAMES] || lang.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {guide.bio && (
          <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-grow">
            {guide.bio}
          </p>
        )}

        <Link href={`/g/${guide.slug}`} className="mt-auto">
          <Button className="w-full bg-gray-900 text-white hover:bg-gray-800">
            Ver Perfil
          </Button>
        </Link>
      </div>
    </div>
  )
}
