import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { translations } from './translations'
import { normalizeLocale, type AppLocale } from './locales'
import { getSiteRoute, siteDestination } from '../landing-navigation'

export type Locale = AppLocale
type LanguageValue = { language: Locale; locale: AppLocale; setLanguage: (value: AppLocale) => void; t: (text: string) => string }
const LanguageContext = createContext<LanguageValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<AppLocale>(() => {
    const route = getSiteRoute(window.location.hash, window.location.pathname)
    return normalizeLocale(route.locale ?? document.documentElement.lang)
  })
  const setLanguage = (value: AppLocale) => {
    const route = getSiteRoute(window.location.hash, window.location.pathname)
    const next = normalizeLocale(value)
    setLocale(next)
    const destination = route.found ? siteDestination(next, route.page, route.anchor) : window.location.pathname.replace(/^\/(vi|en|ru|th|zh)(?=\/|$)/, `/${next}`) + window.location.hash
    if (`${window.location.pathname}${window.location.hash}` !== destination) {
      window.history.pushState(null, '', destination)
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }
  useEffect(() => {
    const syncRoute = () => {
      const route = getSiteRoute(window.location.hash, window.location.pathname)
      const next = normalizeLocale(route.locale ?? locale)
      setLocale(next)
      if (!route.found) return
      const destination = siteDestination(next, route.page, route.anchor)
      if (`${window.location.pathname}${window.location.hash}` !== destination) {
        window.history.replaceState(null, '', destination)
        window.dispatchEvent(new PopStateEvent('popstate'))
      }
    }
    syncRoute()
    window.addEventListener('hashchange', syncRoute)
    window.addEventListener('popstate', syncRoute)
    return () => { window.removeEventListener('hashchange', syncRoute); window.removeEventListener('popstate', syncRoute) }
  }, [locale])
  const language: Locale = locale
  useEffect(() => {
    document.documentElement.lang = locale
    try { localStorage.setItem('aezcheck-language', locale) } catch { /* Storage can be unavailable in private contexts. */ }
  }, [language, locale])
  const t = (text: string) => {
    const trimmed = text.trim()
    const entry = translations[trimmed]
    return entry ? text.replace(trimmed, entry[language]) : text
  }
  return <LanguageContext.Provider value={{ language, locale, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const value = useContext(LanguageContext)
  if (!value) throw new Error('useLanguage requires LanguageProvider')
  return value
}
