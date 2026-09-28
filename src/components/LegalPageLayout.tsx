import { useEffect, useRef, useState, type ReactNode } from 'react'
import './legal-page.css'

type TocItem = { id: string; title: string }
type Props = { pageId: string; locale: string; destination: string; tocLabel: string; items: TocItem[]; children: ReactNode }

/** Shared Privacy layout, typography and navigation; page components own their legal copy. */
export function LegalPageLayout({ pageId, locale, destination, tocLabel, items, children }: Props) {
  const [active, setActive] = useState('introduction')
  const [tocOpen, setTocOpen] = useState(() => window.matchMedia('(min-width: 960px)').matches)
  const page = useRef<HTMLElement>(null)
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 960px)')
    const sync = () => setTocOpen(desktop.matches)
    desktop.addEventListener('change', sync)
    return () => desktop.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    let frame = 0
    const updateActive = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const sections = [...(page.current?.querySelectorAll<HTMLElement>('[data-legal-section]') ?? [])]
        let current = sections[0]?.id ?? 'introduction'
        for (const section of sections) if (section.getBoundingClientRect().top <= 150) current = section.id
        if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) current = sections.at(-1)?.id ?? current
        setActive(current)
      })
    }
    updateActive()
    window.addEventListener('scroll', updateActive, { passive: true })
    window.addEventListener('resize', updateActive)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', updateActive); window.removeEventListener('resize', updateActive) }
  }, [locale, pageId])

  useEffect(() => {
    let frame = 0
    const scrollToAnchor = (smooth: boolean) => {
      cancelAnimationFrame(frame)
      if (window.location.pathname !== destination) return
      const slug = window.location.hash.slice(1)
      const section = [...(page.current?.querySelectorAll<HTMLElement>('[data-legal-section]') ?? [])].find(item => item.id === slug)
      if (!section) return
      frame = requestAnimationFrame(() => {
        section.scrollIntoView({ block: 'start', behavior: smooth && !window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'smooth' : 'instant' })
        section.focus({ preventScroll: true })
      })
    }
    const onHashChange = () => scrollToAnchor(true)
    scrollToAnchor(false)
    window.addEventListener('hashchange', onHashChange)
    window.addEventListener('popstate', onHashChange)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('hashchange', onHashChange); window.removeEventListener('popstate', onHashChange) }
  }, [destination])

  return <main ref={page} id={pageId} lang={locale} aria-labelledby={`${pageId}-heading`} className="legal-page">
    <aside className="legal-sidebar">
      <details className="legal-toc" open={tocOpen} onToggle={event => setTocOpen(event.currentTarget.open)}>
        <summary>{tocLabel}<span aria-hidden="true">⌄</span></summary>
        <nav aria-label={tocLabel}>
          <h2>{tocLabel}</h2>
          <ol>{items.map(item => <li key={item.id}><a href={`${destination}#${item.id}`} aria-current={active === item.id ? 'location' : undefined} onClick={event => {
            if (!window.matchMedia('(min-width: 960px)').matches) setTocOpen(false)
            if (`${window.location.pathname}${window.location.hash}` === `${destination}#${item.id}`) {
              event.preventDefault()
              requestAnimationFrame(() => {
                const target = document.getElementById(item.id)
                target?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
                target?.focus({ preventScroll: true })
              })
            }
          }}>{item.title}</a></li>)}</ol>
        </nav>
      </details>
    </aside>
    <article className="legal-article">{children}</article>
  </main>
}
