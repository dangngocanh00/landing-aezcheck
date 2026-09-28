import { guideText, type GuideBlock } from '../../content/guide'
import { GuideInline } from './GuideSection'
import { useGuideLabels } from '../../i18n/guide-ui'

export type GuideImage = { src: string; alt: string }
export function GuideFigure({ block, title, onOpen }: { block: GuideBlock; title: string; onOpen: (image: GuideImage) => void }) {
  const labels = useGuideLabels()
  const image = { src: `/assets/guide/${block.file}`, alt: block.caption ? guideText(block.caption) : title }
  return <figure className="guide-figure">
    <img src={image.src} alt={image.alt} width={block.width} height={block.height} loading="lazy" decoding="async" role="button" tabIndex={0} aria-haspopup="dialog" aria-label={`${labels.zoom}: ${image.alt}`} onClick={() => onOpen(image)} onKeyDown={event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onOpen(image) }
    }} />
    {block.caption && <figcaption><GuideInline runs={block.caption} /></figcaption>}
  </figure>
}
