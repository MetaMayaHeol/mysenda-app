import Image from 'next/image'
import { icons } from 'lucide-react'
import type { Activity } from '@/lib/seo/activities'

interface ActivityHeroProps {
  activity: Activity
  guideCount?: number
  cityCount?: number
  translations: {
    heroTitle: string
    authenticExperiences: string
    specializedGuides: string
    availableDestinations: string
  }
}

export function ActivityHero({ activity, guideCount = 0, cityCount = 0, translations }: ActivityHeroProps) {
  // Dynamically get the icon component
  const IconComponent = icons[activity.icon as keyof typeof icons]

  return (
    <div className="relative bg-gray-900 text-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-30">
        {activity.heroImage ? (
          <Image
            src={activity.heroImage}
            alt={activity.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <Image
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2000&q=80"
            alt={activity.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 to-gray-900/90" />
      
      <div className="relative container mx-auto px-5 py-20 md:py-32 flex flex-col items-center text-center">
        <div className="max-w-4xl mx-auto">
          {/* Icon Badge */}
          <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-1.5 mb-6 backdrop-blur-sm">
            {IconComponent && <IconComponent className="text-green-300" size={16} />}
            <span className="text-green-300 text-sm font-medium">{translations.authenticExperiences}</span>
          </div>
          
          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
            {translations.heroTitle} <span className="text-green-400">{activity.name}</span>
          </h1>
          
          {/* Description */}
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
            {activity.description}
          </p>

          {/* Keywords/Tags */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {activity.keywords.slice(0, 5).map((keyword, index) => (
              <span
                key={index}
                className="inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium border border-white/20 capitalize"
              >
                {keyword}
              </span>
            ))}
          </div>

          {/* Stats */}
          {(guideCount > 0 || cityCount > 0) && (
            <div className="flex flex-wrap gap-8 text-sm justify-center">
              {guideCount > 0 && (
                <div>
                  <div className="text-3xl font-bold text-green-400">{guideCount}</div>
                  <div className="text-gray-400">{translations.specializedGuides}</div>
                </div>
              )}
              {cityCount > 0 && (
                <div>
                  <div className="text-3xl font-bold text-green-400">{cityCount}</div>
                  <div className="text-gray-400">{translations.availableDestinations}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
