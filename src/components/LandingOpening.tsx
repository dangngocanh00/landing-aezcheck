import { useLanguage } from '../i18n/LanguageContext'
import { useEffect, useRef, useState } from 'react'
import { Brand } from './Brand'
import { supportedLocales, localeNames } from '../i18n/locales'
import { useHeroMotion } from './useHeroMotion'
import { landingHome, landingNavItems, landingExperienceDestination, landingContactDestination, pricingDestination, getHeaderActiveNav, getSiteRoute, localizedHref } from '../landing-navigation'

function ContactArrow() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function NavbarUtilities() {
  const { t: translate, locale: language, setLanguage } = useLanguage()
  const [languageOpen, setLanguageOpen] = useState(false)
  const selector = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!languageOpen) return
    selector.current?.querySelector<HTMLButtonElement>('[aria-checked="true"]')?.focus()
    const outside = (event: PointerEvent) => {
      if (!selector.current?.contains(event.target as Node)) setLanguageOpen(false)
    }
    document.addEventListener('pointerdown', outside)
    return () => document.removeEventListener('pointerdown', outside)
  }, [languageOpen])
  return (
    <div className="az-nav-utilities">
      <div ref={selector} className="az-language-selector" onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) setLanguageOpen(false)
      }} onKeyDown={(event) => {
        if (event.key === 'Escape' && languageOpen) {
          event.stopPropagation(); setLanguageOpen(false); trigger.current?.focus()
        }
        if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
          event.preventDefault()
          if (!languageOpen) { setLanguageOpen(true); return }
          const options = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]')]
          const index = options.indexOf(document.activeElement as HTMLButtonElement)
          const next = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length
          options[next]?.focus()
        }
      }}>
        <button ref={trigger} type="button" className="az-language-button" aria-label={`${language.toUpperCase()} — ${translate('Chọn ngôn ngữ')}`} aria-haspopup="menu" aria-expanded={languageOpen} onClick={() => setLanguageOpen(!languageOpen)}>
          {language.toUpperCase()}<svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        {languageOpen && <div className="az-language-menu" role="menu" aria-label={translate('Chọn ngôn ngữ')}>
          {supportedLocales.map((locale) => <button key={locale} type="button" role="menuitemradio" aria-checked={language === locale} lang={locale} onClick={() => {
            setLanguage(locale); setLanguageOpen(false); trigger.current?.focus()
          }}><span><svg width="18" height="12" viewBox="0 0 30 20" aria-hidden="true" style={{ display: 'inline-block', marginRight: 8, verticalAlign: 'middle' }}>
            {locale === 'en' ? <><rect width="30" height="20" fill="white" /><path d="M12 0h6v20h-6zM0 7h30v6H0z" fill="#CE1124" /></> : <><rect width="30" height="20" fill="#DA251D" /><path d="m15 3 1.6 4.9h5.2l-4.2 3 1.6 4.9-4.2-3-4.2 3 1.6-4.9-4.2-3h5.2z" fill="#FFDF00" /></>}
          </svg>{localeNames[locale]}</span><span aria-hidden="true">{language === locale ? '✓' : ''}</span></button>)}
        </div>}
      </div>
    </div>
  )
}

export function Navbar() {
  const { t: translate, locale } = useLanguage()
  const [open, setOpen] = useState(false)
  const [location, setLocation] = useState(() => ({ pathname: window.location.pathname, hash: window.location.hash }))
  const [scrollActive, setScrollActive] = useState<string | null>(null)
  const matchedRoute = getSiteRoute(location.hash, location.pathname)
  const isHome = matchedRoute.found && matchedRoute.page === 'home'
  const active = isHome ? scrollActive ?? getHeaderActiveNav(location) : getHeaderActiveNav(location)
  const destination = (href: string) => localizedHref(href, locale)
  useEffect(() => {
    const syncNavigation = () => {
      setLocation({ pathname: window.location.pathname, hash: window.location.hash })
      setOpen(false)
    }
    window.addEventListener('hashchange', syncNavigation)
    window.addEventListener('popstate', syncNavigation)
    return () => {
      window.removeEventListener('hashchange', syncNavigation)
      window.removeEventListener('popstate', syncNavigation)
    }
  }, [])
  useEffect(() => {
    if (!isHome) { setScrollActive(null); return }
    let frame = 0
    const update = () => {
      frame = 0
      const threshold = (document.querySelector('.az-navbar')?.getBoundingClientRect().bottom ?? 75) + 40
      const sections = landingNavItems.flatMap(item => {
        if (!item.href.startsWith('#') || item.href.startsWith('#/')) return []
        const section = document.getElementById(item.href.slice(1))
        return section ? [{ label: item.label, top: section.getBoundingClientRect().top }] : []
      }).sort((a, b) => a.top - b.top)
      setScrollActive(sections.filter(section => section.top <= threshold).at(-1)?.label ?? sections[0]?.label ?? null)
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [isHome, location.pathname, location.hash])
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 960px)')
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false) }
    desktop.addEventListener('change', closeOnDesktop)
    return () => desktop.removeEventListener('change', closeOnDesktop)
  }, [])

  const navigation = landingNavItems.map(({ label, href }) => (
    <a key={label} href={destination(href)} className="az-nav-link" aria-current={active === label ? (href === pricingDestination ? 'page' : 'location') : undefined} onClick={() => {
      setOpen(false)
    }}>{translate(label)}</a>
  ))

  return (
    <nav className="az-navbar" aria-label={translate("Điều hướng chính")} onKeyDown={(event) => {
      if (event.key === 'Escape' && open) {
        setOpen(false)
        document.getElementById('mobile-menu-toggle')?.focus()
      }
    }}>
      <div className="az-navbar-inner">
        <a href={destination(landingHome.href)} className="az-navbar-brand" onClick={() => setOpen(false)} aria-label={translate("AezCheck — Trang chủ")}><Brand /></a>
        <div className="az-navbar-desktop">
          <div className="az-nav-links">{navigation}</div>
          <div className="az-nav-actions">
            <a href={landingContactDestination} target="_blank" rel="noopener noreferrer" className="az-contact">{translate("Liên hệ")}<ContactArrow /></a>
            <NavbarUtilities />
          </div>
        </div>
        <button id="mobile-menu-toggle" type="button" className="az-menu-toggle" aria-label={translate(open ? 'Đóng menu' : 'Mở menu')} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeWidth="1.5" d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 7h16M4 12h16M4 17h16'} /></svg>
        </button>
      </div>
      <div id="mobile-navigation" hidden={!open} className="az-mobile-navigation">
        <div className="az-mobile-links">{navigation}</div>
        <a href={landingContactDestination} target="_blank" rel="noopener noreferrer" className="az-contact" onClick={() => setOpen(false)}>{translate("Liên hệ")}<ContactArrow /></a>
        <div className="az-mobile-utilities">{open && <NavbarUtilities />}</div>
      </div>
    </nav>
  )
}

// Keep in sync with the always-on media query in sign-interaction.css.
const mobileSignMedia = '(max-width: 767px), (hover: none), (pointer: coarse), (max-width: 959px) and (max-height: 479px)'

export function Hero() {
  const heroRef = useHeroMotion()
  const { t: translate } = useLanguage()
  const releaseTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const releaseAnimations = useRef<Animation[]>([])

  function cancelRelease() {
    clearTimeout(releaseTimer.current)
    releaseAnimations.current.forEach((animation) => animation.cancel())
    releaseAnimations.current = []
  }

  useEffect(() => {
    const query = window.matchMedia(mobileSignMedia)
    const resetMobilePower = () => {
      if (!query.matches) return
      cancelRelease()
      const board = heroRef.current?.querySelector<HTMLElement>('.az-product-badge')
      if (board) {
        delete board.dataset.powerActive
        delete board.dataset.powerRest
      }
    }
    query.addEventListener('change', resetMobilePower)
    return () => query.removeEventListener('change', resetMobilePower)
  }, [heroRef])

  useEffect(() => () => {
    clearTimeout(releaseTimer.current)
    releaseAnimations.current.forEach((animation) => animation.cancel())
  }, [])

  function settlePower(board: HTMLDivElement) {
    if (window.matchMedia(mobileSignMedia).matches || !window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) {
      cancelRelease()
      delete board.dataset.powerActive
      delete board.dataset.powerRest
      return
    }
    cancelRelease()
    const channels = [board, ...board.querySelectorAll<HTMLElement>('.az-product-aez, .az-product-check, .az-product-pro, .az-product-pro-text, .az-sign-energy-wave, .az-sign-sweep, .az-sign-spark')]
    const lightState = (element: HTMLElement) => {
      const style = getComputedStyle(element)
      return {
        filter: style.filter, opacity: style.opacity, transform: style.transform,
        boxShadow: style.boxShadow, textShadow: style.textShadow,
        backgroundColor: style.backgroundColor, borderColor: style.borderColor,
        '--az-border-level': style.getPropertyValue('--az-border-level'),
      }
    }
    const current = channels.map(lightState)
    board.dataset.powerRest = 'true'
    delete board.dataset.powerActive
    releaseAnimations.current = channels.map((element, index) => {
      const effect = element.matches('.az-sign-energy-wave, .az-sign-sweep, .az-sign-spark')
      const delay = element === board ? 40 : element.matches('.az-product-check') ? 30 : element.matches('.az-product-pro, .az-product-pro-text') ? 15 : 0
      return element.animate([current[index], lightState(element)], {
        duration: effect ? 180 : 500,
        delay: effect ? 0 : delay,
        fill: 'backwards',
        easing: 'cubic-bezier(.22, 1, .36, 1)',
      })
    })
    releaseTimer.current = setTimeout(() => {
      delete board.dataset.powerRest
      releaseAnimations.current = []
    }, 540)
  }

  return (
    <section ref={heroRef} id="hero" className="az-hero az-landing-section" aria-labelledby="hero-heading">
      <div className="az-hero-ambient" aria-hidden="true" />
      <div className="az-hero-intro">
        <div className="az-sign-motion">
        <div className="az-product-badge" onPointerEnter={(event) => {
          cancelRelease()
          delete event.currentTarget.dataset.powerRest
          if (!window.matchMedia(mobileSignMedia).matches && window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) {
            event.currentTarget.dataset.powerActive = 'true'
          }
        }} onPointerLeave={(event) => settlePower(event.currentTarget)}>
          <span className="az-sign-energy-wave" aria-hidden="true" />
          <span className="az-sign-spark-track" aria-hidden="true"><span className="az-sign-spark" /></span>
          <span className="az-sign-sweep-track" aria-hidden="true"><span className="az-sign-sweep" /></span>
          <span className="az-product-name az-sign-content">
            <span className="az-product-brand"><span className="az-product-aez">AEZ</span><span className="az-product-check">CHECK</span></span>
            {' '}<span className="az-product-pro"><span className="az-product-pro-text">PRO</span></span>
          </span>
        </div>
        </div>
        <div className="az-hero-text-motion">
        <h1 id="hero-heading" className="az-hero-heading">
          <span className="az-hero-heading-intro">{translate("KIỂM SOÁT TOÀN BỘ")}</span>{' '}
          <span className="az-hero-heading-main">{translate("HỆ THỐNG QUẢNG CÁO")}</span>
        </h1>
        <p className="az-hero-assets">
          {['VIA', 'BM', 'TKQC', 'Fanpage', 'Campaign', 'Ads'].map((asset, index) => (
            <span className="inline-block whitespace-nowrap" key={asset}>
              {translate(asset)}{index < 5 && <>{' '}<span className="az-hero-asset-dot">·</span>{' '}</>}
            </span>
          ))}
        </p>
        <p className="az-hero-description">{translate("Tất cả được quản lý trên một nền tảng duy nhất.")}</p>
        </div>
        <div className="az-hero-actions">
          <a href={landingExperienceDestination} className="az-hero-button az-hero-primary">{translate("BẮT ĐẦU TRẢI NGHIỆM")}<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
        </div>
      </div>
    </section>
  )
}
