'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface SearchBarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  languageFilter: string
  onLanguageChange: (value: string) => void
}

export function SearchBar({ 
  searchTerm, 
  onSearchChange, 
  languageFilter, 
  onLanguageChange 
}: SearchBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <Input
          type="text"
          placeholder="Buscar por nombre, ubicación o biografía..."
          className="pl-10 h-12 text-lg"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="w-full md:w-48">
        <Select value={languageFilter} onValueChange={onLanguageChange}>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Idioma" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los idiomas</SelectItem>
            <SelectItem value="es">Español</SelectItem>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="fr">Français</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
