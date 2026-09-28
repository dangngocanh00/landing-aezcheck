import { useEffect } from 'react'
import type { SitePage } from '../landing-navigation'
import logo from '../../assets/logo-removebg-128.png'

const titles: Record<SitePage, [string, string]> = {
  home: ['AezCheck — Nền tảng vận hành quảng cáo Meta', 'AezCheck — Meta ad operations platform'],
  pricing: ['AezCheck Free — Gói miễn phí', 'AezCheck Free — Free plan'],
  guide: ['Hướng dẫn sử dụng AezCheck', 'AezCheck User Guide'],
  terms: ['Điều khoản dịch vụ — AezCheck', 'Terms of service — AezCheck'],
  privacy: ['Chính sách bảo mật AezCheck', 'AezCheck Privacy Policy'],
}

export function PageMetadata({ page, locale, found }: { page: SitePage; locale: string; found: boolean }) {
  useEffect(() => {
    const title = found ? titles[page][locale === 'vi' ? 0 : 1] : locale === 'vi' ? 'Không tìm thấy trang — AezCheck' : 'Page not found — AezCheck'
    document.title = title
    const meta = (attribute: 'name' | 'property', key: string, value: string) => {
      let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)
      if (!element) { element = document.createElement('meta'); element.setAttribute(attribute, key); document.head.append(element) }
      element.content = value
    }
    meta('property', 'og:title', title)
    // Reuse visible page copy; do not invent commercial or legal claims.
    const description = () => {
      const selector = page === 'home' ? '.az-hero-description' : page === 'pricing' ? '.pricing-description' : page === 'guide' ? '.guide-page > article p' : '.legal-page article p'
      const paragraph = document.querySelector(selector)?.textContent?.trim()
      meta('name', 'description', paragraph || title)
      meta('property', 'og:description', paragraph || title)
    }
    description()
    const observer = new MutationObserver(description)
    const content = document.getElementById('page-content')
    if (content) observer.observe(content, { childList: true, subtree: true })
    let icon = document.head.querySelector<HTMLLinkElement>('link[rel="icon"]')
    if (!icon) { icon = document.createElement('link'); icon.rel = 'icon'; document.head.append(icon) }
    icon.href = logo
    return () => observer.disconnect()
  }, [page, locale, found])
  return null
}
