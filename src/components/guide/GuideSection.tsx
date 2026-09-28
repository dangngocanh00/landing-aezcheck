import { Fragment, type ReactNode } from 'react'
import { type GuideBlock, type GuideModule, type GuideRun } from '../../content/guide'
import { GuideFigure, type GuideImage } from './GuideFigure'
import { useGuideLabels } from '../../i18n/guide-ui'

export function GuideInline({ runs }: { runs: GuideRun[] }) {
  return <>{runs.map((run, index) => run.style === 'bold' ? <strong key={index}>{run.text}</strong> : run.style === 'italic' ? <em key={index}>{run.text}</em> : run.style === 'arrow' ? <span className="guide-path-arrow" key={index}>{run.text}</span> : <Fragment key={index}>{run.text}</Fragment>)}</>
}
export function GuideTip({ runs }: { runs: GuideRun[] }) {
  const labels = useGuideLabels()
  return <aside className="guide-tip" aria-label={labels.tip}><span aria-hidden="true">💡</span><p><GuideInline runs={runs} /></p></aside>
}

function GuideList({ blocks }: { blocks: GuideBlock[] }) {
  const items: { block: GuideBlock; children: GuideBlock[] }[] = []
  for (const block of blocks) {
    if (block.type === 'bullet' && block.level === 2 && items.length) items[items.length - 1].children.push(block)
    else items.push({ block, children: [] })
  }
  const ordered = blocks[0].type === 'step'
  const Tag = ordered ? 'ol' : 'ul'
  return <Tag className={ordered ? 'guide-steps' : 'guide-list'} start={ordered ? blocks[0].number : undefined}>
    {items.map(({ block, children }, i) => <li key={i} value={ordered ? block.number : undefined}>
      <GuideInline runs={block.runs} />
      {children.length > 0 && <ul>{children.map((child, j) => <li key={j}><GuideInline runs={child.runs} /></li>)}</ul>}
    </li>)}
  </Tag>
}
export function GuideBlocks({ blocks, title, onImage }: { blocks: GuideBlock[]; title: string; onImage: (image: GuideImage) => void }) {
  const rendered: ReactNode[] = []
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]
    if (block.type === 'bullet' || block.type === 'step') {
      const list = [block]
      while (i + 1 < blocks.length && (blocks[i + 1].type === block.type || (blocks[i + 1].type === 'bullet' && blocks[i + 1].level === 2))) list.push(blocks[++i])
      rendered.push(<GuideList key={i} blocks={list} />)
    } else if (block.type === 'heading') rendered.push(<h3 key={i} id={block.id} data-guide-anchor tabIndex={-1}><GuideInline runs={block.runs} /></h3>)
    else if (block.type === 'tip') rendered.push(<GuideTip key={i} runs={block.runs} />)
    else if (block.type === 'image') rendered.push(<GuideFigure key={i} block={block} title={title} onOpen={onImage} />)
    else rendered.push(<p key={i}><GuideInline runs={block.runs} /></p>)
  }
  return <>{rendered}</>
}
export function GuideSection({ module, onImage }: { module: GuideModule; onImage: (image: GuideImage) => void }) {
  return <section className="guide-module" aria-labelledby={module.id}>
    <h2 id={module.id} data-guide-anchor tabIndex={-1}>{module.title}</h2>
    <GuideBlocks blocks={module.blocks} title={module.title} onImage={onImage} />
  </section>
}
