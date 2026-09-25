import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { translations } from './translations'

export type Locale = 'vi' | 'en'
type LanguageValue = { language: Locale; setLanguage: (value: Locale) => void; t: (text: string) => string }
const LanguageContext = createContext<LanguageValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Locale>(() => document.documentElement.lang === 'en' ? 'en' : 'vi')
  useEffect(() => {
    document.documentElement.lang = language
    document.title = 'AezCheck — ' + translations['Nền tảng vận hành quảng cáo Meta'][language]
    try { localStorage.setItem('aezcheck-language', language) } catch { /* Storage can be unavailable in private contexts. */ }
  }, [language])
  const t = (text: string) => {
    const trimmed = text.trim()
    const entry = translations[trimmed]
    return entry ? text.replace(trimmed, entry[language]) : text
  }
  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const value = useContext(LanguageContext)
  if (!value) throw new Error('useLanguage requires LanguageProvider')
  return value
}
