import { localizeNode, translateText } from '../../i18n/localize'
import { useEffect, useState, type MouseEvent } from 'react'
import { guideText, type GuideContent } from '../../content/guide'
import { useGuideLabels } from '../../i18n/guide-ui'

const fold = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLowerCase()
export function GuideToc({ content, destination, active, onNavigate }: { content: GuideContent; destination: string; active: string; onNavigate: (event: MouseEvent<HTMLAnchorElement>, id: string) => void }) {
  const [query, setQuery] = useState('')
  const labels = useGuideLabels()
  const [open, setOpen] = useState(() => window.matchMedia('(min-width: 960px)').matches)
  const [expanded, setExpanded] = useState<string[]>([content.groups[0].id])
  const activeModule = content.modules.find(m => m.id === active || m.blocks.some(b => b.id === active))
  const activeGroup = content.groups.find(g => g.modules.includes(activeModule?.id ?? ''))?.id
  useEffect(() => { if (activeGroup) setExpanded(previous => previous.includes(activeGroup) ? previous : [...previous, activeGroup]) }, [activeGroup])
  useEffect(() => {
    const media = window.matchMedia('(min-width: 960px)')
    const update = () => setOpen(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  const search = fold(query.trim())
  const link = (id: string, label: string) => <a href={`${destination}#${id}`} aria-current={active === id ? 'location' : undefined} onClick={event => {
    if (!window.matchMedia('(min-width: 960px)').matches) setOpen(false)
    onNavigate(event, id)
  }}>{localizeNode(label)}</a>
  let results = 0
  const groups = content.groups.map(group => {
    const groupMatch = fold(group.title).includes(search)
    const modules = group.modules.map(id => content.modules.find(m => m.id === id)!).map(module => ({
      ...module, children: module.blocks.filter(b => b.type === 'heading' && (groupMatch || fold(module.title).includes(search) || fold(guideText(b.runs)).includes(search))),
    })).filter(module => groupMatch || fold(module.title).includes(search) || module.children.length)
    if (!modules.length) return null
    results++
    return <li key={group.id} className="guide-toc-group">
      <div className="guide-toc-group-heading">{localizeNode(link(group.modules[0], group.title))}
        <button type="button" aria-expanded={search ? true : expanded.includes(group.id)} aria-controls={`toc-${group.id}`} aria-label={translateText(`${labels.toggle} ${group.title}`)} onClick={() => setExpanded(previous => previous.includes(group.id) ? previous.filter(id => id !== group.id) : [...previous, group.id])}>{localizeNode("⌄")}</button>
      </div>
      {localizeNode((search || expanded.includes(group.id)) && <ul id={`toc-${group.id}`}>{localizeNode(modules.map(module => <li key={module.id}>
        {localizeNode(group.modules.length > 1 && link(module.id, module.title))}
        <ul className={group.modules.length > 1 ? 'guide-toc-nested' : ''}>{localizeNode(module.children.map(child => <li key={child.id}>{localizeNode(link(child.id!, guideText(child.runs).replace(/^\d+\.\s*/, '')))}</li>))}</ul>
      </li>))}</ul>)}
    </li>
  })
  return <aside className="guide-sidebar"><details className="guide-toc" open={open} onToggle={event => setOpen(event.currentTarget.open)}>
    <summary>{localizeNode(labels.toc)} <span aria-hidden="true">{localizeNode("⌄")}</span></summary>
    <nav aria-label={translateText(labels.toc)}>
      <h2>{localizeNode(labels.toc)}</h2>
      <label className="guide-search"><span className="sr-only">{localizeNode(labels.search)}</span><input type="search" placeholder={translateText(labels.placeholder)} value={query} onChange={event => setQuery(event.target.value)} /></label>
      <ul>{localizeNode(groups)}</ul>
      {localizeNode(results === 0 && <p role="status" className="guide-no-results">{localizeNode(labels.empty)}</p>)}
    </nav>
  </details></aside>
}
