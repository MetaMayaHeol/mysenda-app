import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface GuideCardProps {
  guide: {
    name: string
    bio: string | null
    photo_url: string | null
    language: string | null
    slug: string
  }
}

export function GuideCard({ guide }: GuideCardProps) {
  const languageMap: Record<string, string> = {
    es: 'Español',
    en: 'English',
    fr: 'Français'
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full group">
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {guide.photo_url ? (
          <Image
            src={guide.photo_url}
            alt={guide.name || 'Guide'}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            quality={90}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-green-100 text-green-600 text-4xl font-bold">
            {guide.name?.[0]}
          </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{guide.name}</h3>
        
        <div className="flex flex-col gap-2 mb-4 text-sm text-gray-600">
          {guide.language && (
            <div className="flex items-center gap-2">
              <Globe size={16} className="text-blue-600" />
              <span>{languageMap[guide.language] || guide.language.toUpperCase()}</span>
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
