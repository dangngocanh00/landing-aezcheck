import type { ReactNode } from 'react'
import type { AppLocale } from './locales'
import { translations } from './translations'
const catalogs: Record<string, Record<string, string>> = {}
const loaders = {
  ru: () => import('./generated/ru.json'), zh: () => import('./generated/zh.json'),
  th: () => import('./generated/th.json'), lo: () => import('./generated/lo.json'),
}
const loading = new Map<string, Promise<void>>()
const invariant = new Set(['AezCheck', 'AezCheck Free', 'AEZCHECK', 'AEZ', 'CHECK', 'PRO', 'Meta', 'Facebook', 'VIA', 'BM', 'TKQC', 'FANPAGE', 'Fanpage', 'Shield', 'Agency Workspace'])
export async function loadCatalog(locale: AppLocale): Promise<void> {
  if (!(locale in loaders) || catalogs[locale]) return
  if (!loading.has(locale)) loading.set(locale, loaders[locale as keyof typeof loaders]().then(module => { catalogs[locale] = module.default }).catch(error => { loading.delete(locale); throw error }))
  await loading.get(locale)
}
let activeLocale: AppLocale = 'en'
export function setRenderLocale(locale: AppLocale) { activeLocale = locale }

/** Static catalog lookup. No network requests or DOM rewriting at runtime. */
export function translateText(text: string, locale: string = activeLocale): string {
  const key = text.trim().replace(/\s+/g, ' ')
  if (invariant.has(key)) return text
  const source = translations[key]?.en ?? key
  const translated = catalogs[locale]?.[source] ?? catalogs[locale]?.[key]
  return translated !== undefined ? text.replace(text.trim(), translated) : text
}

/** Translate rendered text only; React elements, numbers and identifiers retain their identity. */
export function localizeNode<T extends ReactNode>(value: T): T {
  if (typeof value === 'string') return translateText(value) as T
  if (Array.isArray(value)) return value.map(item => localizeNode(item)) as unknown as T
  return value
}

export function localizeData<T>(value: T, locale: string, key = ''): T {
  if (typeof value === 'string') {
    // Navigation, image files and structural keys are stable across locales.
    return (['id', 'type', 'style', 'file', 'href', 'locale', 'icon', 'modules'].includes(key) ? value : translateText(value, locale)) as T
  }
  if (Array.isArray(value)) return value.map(item => localizeData(item, locale, key)) as T
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k,v]) => [k, localizeData(v, locale, k)])) as T
  return value
}

/** Expand typed VI/EN content while keeping existing source copy and stable IDs. */
export function withLocales<T>(copy: { vi: T; en: T }): Record<AppLocale, T> {
  const cache: Partial<Record<AppLocale, T>> = {}
  const get = (locale: AppLocale) => {
    if (!catalogs[locale]) return copy.en
    return cache[locale] ?? (cache[locale] = localizeData(copy.en, locale))
  }
  return { ...copy, get ru() { return get('ru') }, get zh() { return get('zh') }, get th() { return get('th') }, get lo() { return get('lo') } }
}
