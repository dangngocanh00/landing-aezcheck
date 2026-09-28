import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { Brand } from './Brand'
import { PAINS } from './challenge-data'
import './challenge.css'
import './challenge-accent-wave.css'

// Keep TKQC consistent with the existing copy in both locales; these are asset types, not integrations.
const assets = ['VIA', 'TKQC', 'BM', 'FANPAGE']
const streams = [
  'M125 0 C125 100 500 60 500 140',
  'M375 0 C375 70 500 80 500 140',
  'M625 0 C625 70 500 80 500 140',
  'M875 0 C875 100 500 60 500 140',
]

export function ChallengeSection() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const convergenceRef = useRef<HTMLDivElement>(null)
  const [logoActive, setLogoActive] = useState(false)
  const [hoveredAsset, setHoveredAsset] = useState<number | null>(null)
  const [focusedAsset, setFocusedAsset] = useState<number | null>(null)
  const activeAsset = hoveredAsset ?? focusedAsset
  const gradientId = useId()
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    let visible = false
    const update = () => { section.dataset.paused = String(!visible || document.hidden) }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) section.dataset.entered = 'true'
      update()
    }, { threshold: .05 })
    observer.observe(section)
    const convergence = convergenceRef.current
    const convergenceObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && convergence) convergence.dataset.entered = 'true'
    }, { threshold: .15 })
    if (convergence) convergenceObserver.observe(convergence)
    document.addEventListener('visibilitychange', update)
    return () => { observer.disconnect(); convergenceObserver.disconnect(); document.removeEventListener('visibilitychange', update) }
  }, [])

  return <section ref={sectionRef} className="challenge-section az-landing-section" aria-labelledby="challenge-heading" data-entered="false" data-paused="true">
    <div className="challenge-inner">
      <header className="challenge-header">
        <h2 id="challenge-heading">
          <span>{t('Quản lý quảng cáo càng nhiều,')}</span>
          <span>{t('mọi thứ càng dễ mất kiểm soát.')}</span>
        </h2>
      </header>
      <ol className="challenge-journey">
        {PAINS.map((pain, index) => <li key={pain.title} style={{ '--step': index } as CSSProperties}>
          <span className="challenge-number" aria-hidden="true">0{index + 1}<span className="challenge-number-wave">0{index + 1}</span></span>
          <article className="challenge-card" tabIndex={0} aria-labelledby={`challenge-title-${index}`}>
            <span className="challenge-icon" aria-hidden="true">
              {pain.icon}
              <svg className="challenge-icon-wave" viewBox="0 0 24 24" fill="none" stroke={`url(#${gradientId}-icon-${index})`}>
                <defs><linearGradient id={`${gradientId}-icon-${index}`} x1="0" y1="0" x2="1" y2="0">
                  <stop stopColor="#49d692" /><stop offset=".5" stopColor="#48e098" /><stop offset="1" stopColor="#8ef0c0" />
                </linearGradient></defs>
                {pain.icon.props.children}
              </svg>
            </span>
            <h3 id={`challenge-title-${index}`}>{t(pain.title)}</h3>
            <p>{t(pain.desc)}</p>
          </article>
          {index < PAINS.length - 1 && <span className="challenge-connector" aria-hidden="true"><i /></span>}
        </li>)}
      </ol>
      <div ref={convergenceRef} className="challenge-convergence" data-entered="false" data-active-asset={activeAsset !== null} data-logo-active={logoActive}>
        <ul className="challenge-assets">
          {assets.map((asset, index) => <li key={asset} style={{ '--step': index } as CSSProperties}>
            <span tabIndex={0} className={`challenge-asset ${activeAsset === index ? 'is-active' : ''}`}
              onPointerEnter={event => { if (event.pointerType === 'mouse') setHoveredAsset(index) }}
              onPointerLeave={() => setHoveredAsset(null)} onFocus={() => setFocusedAsset(index)} onBlur={() => setFocusedAsset(null)}>
              {t(asset)}
            </span>
          </li>)}
        </ul>
        <svg className="challenge-streams" viewBox="0 0 1000 150" preserveAspectRatio="none" fill="none" aria-hidden="true">
          <defs><linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="150" gradientUnits="userSpaceOnUse">
            <stop stopColor="#609d8c" stopOpacity=".5" /><stop offset="1" stopColor="#4fe39a" stopOpacity=".7" />
          </linearGradient></defs>
          {streams.map((path, index) => <g key={path} className={activeAsset === index ? 'is-active' : ''} style={{ '--step': index } as CSSProperties} stroke={`url(#${gradientId})`}>
            <path className="challenge-stream" d={path} />
            <path className="challenge-asset-dot" d={path} pathLength="100" />
          </g>)}
          <path d="m494 136 6 7 6-7" stroke="#4fe39a" strokeOpacity=".65" />
        </svg>
        <div className="challenge-solution" tabIndex={0}
          onPointerEnter={event => { if (event.pointerType === 'mouse') setLogoActive(true) }}
          onPointerLeave={event => setLogoActive(event.currentTarget.matches(':focus-visible'))}
          onFocus={() => setLogoActive(true)} onBlur={() => setLogoActive(false)}>
          <span key={activeAsset ?? 'idle'} className={`challenge-solution-glow ${activeAsset !== null ? 'is-active' : ''}`} aria-hidden="true" />
          <Brand />
        </div>
        <p className="challenge-control-caption">{t('Quản lý tài sản tập trung')}</p>
      </div>
    </div>
  </section>
}
