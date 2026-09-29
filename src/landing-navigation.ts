export const landingHome = { label: 'Trang chủ', href: '#hero' }
export const pricingDestination = '#/pricing'
export const termsDestination = '#/terms'
export const privacyDestination = '#/privacy'
export type SitePage = 'home' | 'guide' | 'terms' | 'privacy' | 'pricing'
export function getSiteRoute(hash: string, pathname = '/') {
  const route = hash.startsWith('#/') ? hash.split('#')[1] : pathname
  const anchor = hash.startsWith('#/') ? hash.split('#')[2] ?? '' : hash.slice(1)
  // Removed locales are accepted only as legacy input and normalized to English.
  const match = /^\/(?:(vi|en|ru|th|zh)(?:\/|$))?(guide|terms|privacy|pricing)?\/?$/.exec(route ?? '')
  const oldPrefix = /^\/(ru|th|zh)(?:\/|$)/.test(route ?? '')
  const prefix = /^\/(vi|en|ru|th|zh)(?:\/|$)/.exec(route ?? '')?.[1]
  return { found: Boolean(match), page: (match?.[2] ?? 'home') as SitePage, locale: prefix ? (prefix === 'vi' ? 'vi' : 'en') : oldPrefix ? 'en' : null, anchor }
}
export const siteDestination = (locale: string, page: SitePage = 'home', anchor = '') => `/${locale === 'vi' ? 'vi' : 'en'}${page === 'home' ? '/' : `/${page}`}${anchor ? `#${anchor}` : ''}`
export function localizedHref(href: string, locale: string) {
  if (!href.startsWith('#')) return href
  const route = getSiteRoute(href)
  return siteDestination(locale, route.page, route.anchor)
}
export function getGuideRoute(hash: string, pathname = '/') {
  const route = getSiteRoute(hash, pathname)
  return route.page === 'guide' ? route : null
}
export const guideDestination = (locale: string) => `/${locale === 'vi' ? 'vi' : 'en'}/guide`
export function getLegalPage(hash: string, pathname = '/'): 'terms' | 'privacy' | null {
  const { page } = getSiteRoute(hash, pathname)
  return page === 'terms' || page === 'privacy' ? page : null
}
export const landingExperienceDestination = 'https://aezcheck.com'
export const landingContactDestination = 'https://t.me/sophie_aezcheck'

export const landingNavItems = [
  { label: 'Tính năng', href: '#features' },
  { label: 'Lợi ích', href: '#benefits' },
  { label: 'Tường lửa bảo vệ', href: '#shield' },
  { label: 'Bảng giá', href: pricingDestination },
]

/** Header-only matching: legal pages never inherit the landing's Features fallback. */
export function getHeaderActiveNav({ pathname, hash }: Pick<Location, 'pathname' | 'hash'>): string | null {
  const { page, found } = getSiteRoute(hash, pathname)
  if (!found) return null
  if (['terms', 'privacy', 'guide'].includes(page)) return null
  if (page === 'pricing') return 'Bảng giá'
  return landingNavItems.find(item => item.href === hash)?.label ?? 'Tính năng'
}

export const landingFooterItems = [landingHome, ...landingNavItems]

// Support destinations share the landing header and footer.
export const landingSupportItems = [
  { label: 'Hướng dẫn sử dụng', href: '#/guide' },
  { label: 'Điều khoản dịch vụ', href: termsDestination },
  { label: 'Chính sách bảo mật', href: privacyDestination },
  { label: 'Liên hệ', href: landingContactDestination },
]
