import { useLanguage } from '../i18n/LanguageContext'
import { useEffect, useRef, useState } from 'react'
import { Brand } from './Brand'
import { useTheme } from '../theme/ThemeContext'
import { useHeroMotion } from './useHeroMotion'

const links = [
  ['Tính năng', '#features'], ['Lợi ích', '#benefits'],
  ['Shield', '#shield'], ['Bảng giá', '#contact'],
]

function ContactArrow() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function NavbarUtilities() {
  const { t: translate, language, setLanguage } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const [languageOpen, setLanguageOpen] = useState(false)
  const selector = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const themeLabel = translate(theme === 'dark' ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối')
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
      <button type="button" className="az-theme-button" aria-label={themeLabel} title={themeLabel} onClick={toggleTheme}>
        <svg key={theme} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          {theme === 'dark' ? <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" strokeLinecap="round" /></> : <path d="M20.5 13A8.5 8.5 0 0 1 11 3.5 8.5 8.5 0 1 0 20.5 13Z" />}
        </svg>
      </button>
      <span className="az-nav-separator" aria-hidden="true" />
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
        <button ref={trigger} type="button" className="az-language-button" aria-label={translate('Chọn ngôn ngữ')} aria-haspopup="menu" aria-expanded={languageOpen} onClick={() => setLanguageOpen(!languageOpen)}>
          {language.toUpperCase()}<svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        {languageOpen && <div className="az-language-menu" role="menu" aria-label={translate('Chọn ngôn ngữ')}>
          {(['vi', 'en'] as const).map((locale) => <button key={locale} type="button" role="menuitemradio" aria-checked={language === locale} lang={locale} onClick={() => {
            setLanguage(locale); setLanguageOpen(false); trigger.current?.focus()
          }}><span>{locale === 'vi' ? 'Tiếng Việt' : 'English'}</span><span aria-hidden="true">{language === locale ? '✓' : ''}</span></button>)}
        </div>}
      </div>
    </div>
  )
}

export function Navbar() {
  const { t: translate } = useLanguage()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('Tính năng')
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 960px)')
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false) }
    desktop.addEventListener('change', closeOnDesktop)
    return () => desktop.removeEventListener('change', closeOnDesktop)
  }, [])

  const navigation = links.map(([label, href]) => (
    <a key={label} href={href} className="az-nav-link" aria-current={active === label ? 'location' : undefined} onClick={() => {
      setActive(label)
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
        <a href="#hero" className="az-navbar-brand" onClick={() => setOpen(false)} aria-label={translate("AezCheck — Trang chủ")}><Brand /></a>
        <div className="az-navbar-desktop">
          <div className="az-nav-links">{navigation}</div>
          <div className="az-nav-actions">
            <a href="#contact" className="az-contact">{translate("Liên hệ")}<ContactArrow /></a>
            <NavbarUtilities />
          </div>
        </div>
        <button id="mobile-menu-toggle" type="button" className="az-menu-toggle" aria-label={translate(open ? 'Đóng menu' : 'Mở menu')} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeWidth="1.5" d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 7h16M4 12h16M4 17h16'} /></svg>
        </button>
      </div>
      <div id="mobile-navigation" hidden={!open} className="az-mobile-navigation">
        <div className="az-mobile-links">{navigation}</div>
        <a href="#contact" className="az-contact" onClick={() => setOpen(false)}>{translate("Liên hệ")}<ContactArrow /></a>
        <div className="az-mobile-utilities">{open && <NavbarUtilities />}</div>
      </div>
    </nav>
  )
}

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

  useEffect(() => () => {
    clearTimeout(releaseTimer.current)
    releaseAnimations.current.forEach((animation) => animation.cancel())
  }, [])

  function settlePower(board: HTMLDivElement) {
    if (!window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) {
      delete board.dataset.powerActive
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
    <section ref={heroRef} id="hero" className="az-hero" aria-labelledby="hero-heading">
      <div className="az-hero-ambient" aria-hidden="true" />
      <div className="az-hero-intro">
        <div className="az-hero-eyebrow"><span aria-hidden="true" />{translate("META ADS OPERATIONS PLATFORM")}</div>
        <div className="az-sign-motion">
        <div className="az-product-badge" onPointerEnter={(event) => {
          cancelRelease()
          delete event.currentTarget.dataset.powerRest
          if (window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) {
            event.currentTarget.dataset.powerActive = 'true'
          }
        }} onPointerLeave={(event) => settlePower(event.currentTarget)}>
          <span className="az-sign-energy-wave" aria-hidden="true" />
          <span className="az-sign-spark-track" aria-hidden="true"><span className="az-sign-spark" /></span>
          <span className="az-sign-sweep-track" aria-hidden="true"><span className="az-sign-sweep" /></span>
          <span className="az-product-name">
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
          <a href="#contact" className="az-hero-button az-hero-primary">{translate("BẮT ĐẦU TRẢI NGHIỆM")}<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
          <a href="#hero-dashboard" className="az-hero-button az-hero-secondary"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m8 5 11 7-11 7V5Z" strokeLinejoin="round" /></svg>{translate("XEM DEMO")}</a>
        </div>
      </div>
    </section>
  )
}
