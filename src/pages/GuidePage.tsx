import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { getGuideContent } from '../content/guide'
import { getGuideRoute, guideDestination } from '../landing-navigation'
import { GuideBlocks, GuideSection } from '../components/guide/GuideSection'
import { GuideToc } from '../components/guide/GuideToc'
import { GuideLightbox } from '../components/guide/GuideLightbox'
import type { GuideImage } from '../components/guide/GuideFigure'
import './guide-page.css'

export function GuidePage() {
  const { locale } = useLanguage()
  const content = getGuideContent(locale)
  const page = useRef<HTMLElement>(null)
  const [active, setActive] = useState(content.modules[0].id)
  const [image, setImage] = useState<GuideImage | null>(null)
  const closeImage = useCallback(() => setImage(null), [])
  const scrollTo = useCallback((id: string, smooth: boolean) => {
    const target = document.getElementById(id)
    if (!target || !page.current?.contains(target)) return
    target.scrollIntoView({ block: 'start', behavior: smooth && !window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'smooth' : 'instant' })
    target.focus({ preventScroll: true })
    setActive(id)
  }, [])
  useEffect(() => {
    let frame = 0
    const navigate = (smooth: boolean) => {
      const id = getGuideRoute(window.location.hash, window.location.pathname)?.anchor
      if (id) frame = requestAnimationFrame(() => scrollTo(decodeURIComponent(id), smooth))
      else window.scrollTo({ top: 0, behavior: 'instant' })
    }
    const change = () => navigate(true)
    navigate(false)
    window.addEventListener('hashchange', change)
    window.addEventListener('popstate', change)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('hashchange', change); window.removeEventListener('popstate', change) }
  }, [scrollTo, locale])
  useEffect(() => {
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const headings = [...(page.current?.querySelectorAll<HTMLElement>('[data-guide-anchor]') ?? [])]
        let current = headings[0]?.id
        for (const heading of headings) if (heading.getBoundingClientRect().top <= 160) current = heading.id
        if (current) setActive(current)
      })
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [])
  const onNavigate = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return
    if (`${window.location.pathname}${window.location.hash}` === `${guideDestination(locale)}#${id}`) { event.preventDefault(); requestAnimationFrame(() => scrollTo(id, true)) }
  }
  return <main ref={page} className="guide-page" lang={content.locale} aria-labelledby="guide-title">
    <GuideToc content={content} destination={guideDestination(locale)} active={active} onNavigate={onNavigate} />
    <article className="guide-article">
      <header className="guide-intro"><h1 id="guide-title">{content.title}</h1><GuideBlocks blocks={content.intro} title={content.title} onImage={setImage} /></header>
      {content.modules.map(module => <GuideSection key={module.id} module={module} onImage={setImage} />)}
    </article>
    {image && <GuideLightbox image={image} onClose={closeImage} />}
  </main>
}
