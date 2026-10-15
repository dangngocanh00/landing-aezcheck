import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { translations } from './translations'
import { loadCatalog, setRenderLocale, translateText } from './localize'
import { normalizeLocale, type AppLocale } from './locales'
import { getSiteRoute, siteDestination } from '../landing-navigation'

export type Locale = AppLocale
type LanguageValue = { language: Locale; locale: AppLocale; setLanguage: (value: AppLocale) => void; t: (text: string) => string }
const LanguageContext = createContext<LanguageValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const changeRequest = useRef(0)
  const [locale, setLocale] = useState<AppLocale>(() => {
    const route = getSiteRoute(window.location.hash, window.location.pathname)
    let saved: string | null = null
    try { saved = localStorage.getItem('aezcheck-language') } catch { /* Storage is optional. */ }
    return normalizeLocale(route.locale ?? saved ?? document.documentElement.lang)
  })
  const setLanguage = async (value: AppLocale) => {
    const request = ++changeRequest.current
    const next = normalizeLocale(value)
    await loadCatalog(next)
    if (request !== changeRequest.current) return
    const route = getSiteRoute(window.location.hash, window.location.pathname)
    setLocale(next)
    const destination = route.found ? siteDestination(next, route.page, route.anchor) : window.location.pathname.replace(/^\/(vi|en|ru|th|zh|lo)(?=\/|$)/, `/${next}`) + window.location.hash
    if (`${window.location.pathname}${window.location.hash}` !== destination) {
      window.history.pushState(null, '', destination)
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }
  useEffect(() => {
    let cancelled = false
    let navigation = 0
    const syncRoute = async () => {
      const request = ++navigation
      const route = getSiteRoute(window.location.hash, window.location.pathname)
      const next = normalizeLocale(route.locale ?? locale)
      await loadCatalog(next)
      if (cancelled || request !== navigation) return
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
    return () => { cancelled = true; window.removeEventListener('hashchange', syncRoute); window.removeEventListener('popstate', syncRoute) }
  }, [locale])
  const language: Locale = locale
  setRenderLocale(locale)
  useEffect(() => {
    document.documentElement.lang = locale
    try { localStorage.setItem('aezcheck-language', locale) } catch { /* Storage can be unavailable in private contexts. */ }
  }, [language, locale])
  const t = (text: string) => {
    const trimmed = text.trim()
    const entry = translations[trimmed]
    const base = entry ? text.replace(trimmed, entry[language === 'vi' ? 'vi' : 'en']) : text
    return translateText(base, locale)
  }
  return <LanguageContext.Provider value={{ language, locale, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const value = useContext(LanguageContext)
  if (!value) throw new Error('useLanguage requires LanguageProvider')
  return value
}
