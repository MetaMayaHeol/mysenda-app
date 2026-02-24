"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Compass, Globe, Menu, X, BookOpen } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { locales } from '@/lib/i18n/config'
import { User } from '@supabase/supabase-js'

export function Header({ user }: { user?: User | null }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const t = useTranslations('nav')
  const tBlog = useTranslations('blogNav')
  const locale = useLocale()
  const pathname = usePathname()
  
  // Get path without locale prefix for language switching
  const pathWithoutLocale = pathname.replace(new RegExp(`^/(${locales.join('|')})`), '') || '/'

  // Language names
  const languageNames: Record<string, string> = {
    es: 'Español',
    fr: 'Français',
    en: 'English',
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/80 text-white">
      <div className="container mx-auto px-5">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 font-bold text-xl text-white hover:text-green-400 transition-colors">
            <Compass className="text-green-600" size={28} />
            MySenda
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            <Link href={`/${locale}/blog`} className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
              <BookOpen size={18} />
              {tBlog('notebooks')}
            </Link>

            {/* Language Switcher (Desktop) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-2">
                  <Globe size={18} />
                  <span className="sr-only">Langue</span>
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

            {/* User Navigation */ }
            {user ? (
               <div className="flex items-center gap-2 ml-4 border-l border-gray-700 pl-4">
                 <Link href={`/${locale}/admin/blog`}>
                   <Button variant="ghost" size="sm">{tBlog('adminBlog')}</Button>
                 </Link>
                 <form action="/auth/signout" method="post">
                   <Button type="submit" variant="ghost" size="icon" className="text-gray-500 hover:text-red-600">
                     <span className="sr-only">Déconnexion</span>
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                   </Button>
                 </form>
               </div>
            ) : null}
          </nav>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-4">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Globe size={18} />
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
            <div className="absolute top-16 left-0 right-0 bg-gray-900 border-b border-gray-800 shadow-lg p-5 flex flex-col gap-4 md:hidden animate-in slide-in-from-top-2">
                <Link href={`/${locale}/blog`} className="flex items-center gap-2 py-2 text-lg font-medium text-white" onClick={() => setIsMobileMenuOpen(false)}>
                  <BookOpen size={20} className="text-green-600" />
                  {tBlog('notebooksAndBlog')}
                </Link>

                {user && (
                   <div className="flex flex-col gap-3 mt-2 pt-4 border-t border-gray-800">
                     <Link href={`/${locale}/admin/blog`} onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full justify-center bg-transparent text-white border-gray-600 hover:bg-gray-800">
                          {tBlog('adminBlog')}
                        </Button>
                     </Link>
                   </div>
                )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
