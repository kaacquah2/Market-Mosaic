"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe } from "lucide-react"

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' }
]

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const [currentLocale, setCurrentLocale] = useState(() => {
    // Extract locale from pathname
    const segments = pathname.split('/')
    const locale = segments[1]
    return languages.find(lang => lang.code === locale)?.code || 'en'
  })

  const handleLanguageChange = (locale: string) => {
    setCurrentLocale(locale)
    
    // Remove current locale from pathname
    const segments = pathname.split('/')
    if (languages.some(lang => lang.code === segments[1])) {
      segments.splice(1, 1)
    }
    
    // Add new locale to pathname
    const newPath = locale === 'en' 
      ? `/${segments.slice(1).join('/')}`
      : `/${locale}/${segments.slice(1).join('/')}`
    
    router.push(newPath)
  }

  const currentLanguage = languages.find(lang => lang.code === currentLocale)

  return (
    <Select value={currentLocale} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-auto border-0 bg-transparent hover:bg-muted/50">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span className="text-sm">{currentLanguage?.flag}</span>
        </div>
      </SelectTrigger>
      <SelectContent>
        {languages.map((language) => (
          <SelectItem key={language.code} value={language.code}>
            <div className="flex items-center gap-2">
              <span>{language.flag}</span>
              <span>{language.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
