'use client'

import { useState, useMemo } from 'react'
import { GuideCard } from '@/components/directory/GuideCard'
import { SearchBar } from '@/components/directory/SearchBar'

interface Guide {
  name: string
  bio: string | null
  photo_url: string | null
  location: string | null
  language: string | null
  slug: string
}

interface DirectoryClientProps {
  initialGuides: Guide[]
}

export function DirectoryClient({ initialGuides }: DirectoryClientProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [languageFilter, setLanguageFilter] = useState('all')

  const filteredGuides = useMemo(() => {
    return initialGuides.filter(guide => {
      // Filter by language
      if (languageFilter !== 'all' && guide.language !== languageFilter) {
        return false
      }

      // Filter by search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        const nameMatch = guide.name?.toLowerCase().includes(term)
        const locationMatch = guide.location?.toLowerCase().includes(term)
        const bioMatch = guide.bio?.toLowerCase().includes(term)
        
        return nameMatch || locationMatch || bioMatch
      }

      return true
    })
  }, [initialGuides, searchTerm, languageFilter])

  return (
    <div className="container mx-auto px-5 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Explora nuestros Guías</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Encuentra expertos locales apasionados listos para mostrarte lo mejor de su ciudad.
        </p>
      </div>

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        languageFilter={languageFilter}
        onLanguageChange={setLanguageFilter}
      />

      {filteredGuides.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGuides.map((guide) => (
            <GuideCard key={guide.slug} guide={guide} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-xl">
          <p className="text-xl text-gray-500">No encontramos guías con esos criterios.</p>
          <button 
            onClick={() => { setSearchTerm(''); setLanguageFilter('all'); }}
            className="mt-4 text-green-600 font-semibold hover:underline"
          >
            Ver todos los guías
          </button>
        </div>
      )}
    </div>
  )
}
