"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, MapPin, Compass, Globe, Menu, X } from 'lucide-react'
import { cities } from '@/lib/seo/cities'
import { activities } from '@/lib/seo/activities'
import { useTranslations, useLocale } from 'next-intl'
import { locales } from '@/lib/i18n/config'
import { NotificationsBell } from '@/components/dashboard/NotificationsBell'
import { User } from '@supabase/supabase-js'

export function Header({ user }: { user?: User | null }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  
  // Get path without locale prefix for language switching
  const pathWithoutLocale = pathname.replace(/^\/(es|fr)/, '') || '/'
  
  // Group cities by state
  const yucatan = cities.filter(c => c.state === 'Yucatán')
  const quintanaRoo = cities.filter(c => c.state === 'Quintana Roo')
  const campeche = cities.filter(c => c.state === 'Campeche')

  // Language names
  const languageNames: Record<string, string> = {
    es: 'Español',
    fr: 'Français',
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto px-5">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 font-bold text-xl text-gray-900 hover:text-green-600 transition-colors">
            <Compass className="text-green-600" size={28} />
            MySenda
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Destinations Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-1">
                  {t('destinations')}
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel className="text-xs text-gray-500 uppercase">Yucatán</DropdownMenuLabel>
                {yucatan.map((city) => (
                  <DropdownMenuItem key={city.slug} asChild>
                    <Link href={`/${locale}/ciudad/${city.slug}`} className="cursor-pointer">
                      <MapPin size={14} className="mr-2 text-gray-400" />
                      {city.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
                
                {quintanaRoo.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-xs text-gray-500 uppercase">Quintana Roo</DropdownMenuLabel>
                    {quintanaRoo.map((city) => (
                      <DropdownMenuItem key={city.slug} asChild>
                        <Link href={`/${locale}/ciudad/${city.slug}`} className="cursor-pointer">
                          <MapPin size={14} className="mr-2 text-gray-400" />
                          {city.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </>
                )}

                {campeche.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-xs text-gray-500 uppercase">Campeche</DropdownMenuLabel>
                    {campeche.map((city) => (
                      <DropdownMenuItem key={city.slug} asChild>
                        <Link href={`/${locale}/ciudad/${city.slug}`} className="cursor-pointer">
                          <MapPin size={14} className="mr-2 text-gray-400" />
                          {city.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Activities Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-1">
                  {t('activities')}
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {activities.map((activity) => (
                  <DropdownMenuItem key={activity.slug} asChild>
                    <Link href={`/${locale}/actividad/${activity.slug}`} className="cursor-pointer">
                      {activity.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Navigation */ }
            {user ? (
               <div className="flex items-center gap-2 ml-4">
                 <NotificationsBell userId={user.id} />
                 <Link href={`/${locale}/dashboard`}>
                   <Button variant="ghost" size="sm">Dashboard</Button>
                 </Link>
                 <form action="/auth/signout" method="post">
                   <Button type="submit" variant="ghost" size="icon" className="text-gray-500 hover:text-red-600">
                     <span className="sr-only">Cerrar sesión</span>
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                   </Button>
                 </form>
               </div>
            ) : (
               <div className="flex items-center gap-2 ml-4">
                 <Link href={`/${locale}/auth/login`}>
                   <Button variant="ghost" size="sm">
                     Log In
                   </Button>
                 </Link>
                 <Link href={`/${locale}/auth/login?view=signup&role=guide`}>
                   <Button variant="default" className="bg-green-600 hover:bg-green-700">
                     {t('becomeGuide')}
                   </Button>
                 </Link>
               </div>
            )}
          </nav>

      {/* Mobile Menu */}
      <div className="md:hidden flex items-center gap-4">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                <Globe size={18} />
                <span className="sr-only">Language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {locales.map((loc) => (
                <DropdownMenuItem key={loc} asChild>
                  <Link 
                    href={`/${loc}${pathWithoutLocale}`} 
                    className={`cursor-pointer ${loc === locale ? 'font-bold text-green-600' : ''}`}
                  >
                    {languageNames[loc]}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            <span className="sr-only">Menu</span>
          </Button>
      </div>

      {/* Mobile Menu Content */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b shadow-lg p-5 flex flex-col gap-4 md:hidden animate-in slide-in-from-top-2">
            <Link href={`/${locale}/explorar`} className="flex items-center gap-2 py-2 text-lg font-medium text-gray-800" onClick={() => setIsMobileMenuOpen(false)}>
              <Compass size={20} className="text-green-600" />
              {t('guides')}
            </Link>
            
            <div className="py-2">
              <div className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">{t('destinations')}</div>
              <div className="grid grid-cols-2 gap-2">
                 {yucatan.slice(0, 4).map(city => (
                    <Link key={city.slug} href={`/${locale}/ciudad/${city.slug}`} className="text-gray-600 py-1" onClick={() => setIsMobileMenuOpen(false)}>
                      {city.name}
                    </Link>
                 ))}
                 <Link href={`/${locale}/explorar`} className="text-green-600 font-medium py-1" onClick={() => setIsMobileMenuOpen(false)}>
                   Ver todos...
                 </Link>
              </div>
            </div>

            <div className="py-2 border-t border-gray-100">
              <div className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">{t('activities')}</div>
              <div className="grid grid-cols-2 gap-2">
                 {activities.slice(0, 4).map(act => (
                    <Link key={act.slug} href={`/${locale}/actividad/${act.slug}`} className="text-gray-600 py-1" onClick={() => setIsMobileMenuOpen(false)}>
                      {act.name}
                    </Link>
                 ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-2 pt-4 border-t border-gray-100">
               <Link href={`/${locale}/auth/login`} onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-center">
                    {t('becomeGuide')}
                  </Button>
               </Link>
            </div>
        </div>
      )}
    </div>
  </div>
</header>
)
}
