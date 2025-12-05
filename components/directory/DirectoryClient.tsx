'use client'

import { useState, useMemo } from 'react'
import { GuideCard } from '@/components/directory/GuideCard'
import { SearchBar } from '@/components/directory/SearchBar'
import { useTranslations } from 'next-intl'

interface Guide {
  name: string
  bio: string | null
  photo_url: string | null
  languages: string[] | null
  city: string | null
  country: string | null
  slug: string
  is_verified?: boolean
  averageRating?: number
  reviewCount?: number
}

interface DirectoryClientProps {
  initialGuides: Guide[]
}

export function DirectoryClient({ initialGuides }: DirectoryClientProps) {
  const t = useTranslations('explorar')
  const [searchTerm, setSearchTerm] = useState('')
  const [languageFilter, setLanguageFilter] = useState('all')
  const [cityFilter, setCityFilter] = useState('all')

  // Extract unique cities from guides
  const cities = useMemo(() => {
    const uniqueCities = new Set(initialGuides.map(g => g.city).filter(Boolean))
    return Array.from(uniqueCities).sort()
  }, [initialGuides])

  const filteredGuides = useMemo(() => {
    return initialGuides.filter(guide => {
      // Filter by language
      if (languageFilter !== 'all' && guide.languages && !guide.languages.includes(languageFilter)) {
        return false
      }

      // Filter by city
      if (cityFilter !== 'all' && guide.city !== cityFilter) {
        return false
      }

      // Filter by search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        const nameMatch = guide.name?.toLowerCase().includes(term)
        const bioMatch = guide.bio?.toLowerCase().includes(term)
        const cityMatch = guide.city?.toLowerCase().includes(term)
        
        return nameMatch || bioMatch || cityMatch
      }

      return true
    })
  }, [initialGuides, searchTerm, languageFilter, cityFilter])

  return (
    <div className="container mx-auto px-5 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('title')}</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {t('metaDescription')}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-4xl mx-auto">
        <div className="flex-grow">
           <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            languageFilter={languageFilter}
            onLanguageChange={setLanguageFilter}
          />
        </div>
        
        {/* City Filter */}
        <div className="w-full md:w-48">
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">{t('allCities')}</option>
            {cities.map(city => (
              <option key={city} value={city as string}>{city}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredGuides.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGuides.map((guide) => (
            <GuideCard key={guide.slug} guide={guide} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-xl">
          <p className="text-xl text-gray-500">{t('noResults')}</p>
          <button 
            onClick={() => { setSearchTerm(''); setLanguageFilter('all'); setCityFilter('all'); }}
            className="mt-4 text-green-600 font-semibold hover:underline"
          >
            {t('noResultsDesc')}
          </button>
        </div>
      )}
    </div>
  )
}
