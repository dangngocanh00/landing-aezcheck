import fs from 'node:fs'

// Normalize the already-extracted JSON. This script never opens or extracts the PDF.
const source = JSON.parse(fs.readFileSync('docs/reference/aezcheck-guide-content.json', 'utf8'))
const manifest = JSON.parse(fs.readFileSync('docs/guide/asset-manifest.json', 'utf8'))
const slug = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const textOf = runs => runs.map(run => run.text).join('')
const blocks = []
let lastLine = null
const allRefs = []
function append(line) {
  const first = line.items[0]
  const text = line.items.map(i => i.str).join(' ')
  const heading = line.items.some(i => i.fontName === 'g_d0_f1' && i.height > 13)
  const numberedHeading = heading && /^\d+\./.test(text)
  const caption = ['image','caption'].includes(blocks.at(-1)?.type) && line.items.some(i => i.fontName === 'g_d0_f15') && line.items.every(i => ['g_d0_f15','g_d0_f14','g_d0_f4'].includes(i.fontName) || /^[.,]$/.test(i.str))
  let kind = line.page === 1 && first.height > 25 ? 'title' : numberedHeading ? 'heading' : heading ? 'module' : caption ? 'caption' : text.startsWith('💡') ? 'tip' : /^[•◦]/.test(text) ? 'bullet' : /^\d+\s+\./.test(text) ? 'step' : 'paragraph'
  const level = text.startsWith('◦') ? 2 : 1
  const number = kind === 'step' ? Number(text.match(/^\d+/)[0]) : undefined
  const skip = kind === 'bullet' || kind === 'tip' ? 1 : kind === 'step' ? 2 : 0
  const runs = []
  line.items.slice(skip).forEach((item, index) => {
    const style = ['g_d0_f1','g_d0_f10'].includes(item.fontName) ? 'bold' : ['g_d0_f14','g_d0_f15'].includes(item.fontName) ? 'italic' : item.str === '→' ? 'arrow' : 'text'
    const previous = runs.at(-1)
    if (previous?.style === style) previous.text += ' ' + item.str
    else runs.push({ text: (index ? ' ' : '') + item.str, style })
  })
  const refs = line.items.map(i => i.ref)
  allRefs.push(...refs)
  const previous = blocks.at(-1)
  const gap = lastLine?.page === line.page ? lastLine.y - line.y : 19.5
  const continuation = previous && (gap < 23 || (kind === 'module' && gap < 28)) && (
    (kind === 'paragraph' && (previous.type === 'paragraph' || previous.type === 'tip' || (['bullet','step'].includes(previous.type) && first.transform[4] > 45))) ||
    (kind === 'module' && previous.type === 'module') ||
    (kind === 'caption' && previous.type === 'caption')
  )
  if (continuation) {
    runs[0].text = ' ' + runs[0].text
    previous.runs.push(...runs); previous.refs.push(...refs)
    if (!previous.pages.includes(line.page)) previous.pages.push(line.page)
  } else blocks.push({ type: kind, runs, pages: [line.page], refs, ...(kind === 'bullet' ? { level } : {}), ...(number ? { number } : {}) })
  lastLine = line
}
for (const page of source.pages) {
  const lines = []
  page.textItems.forEach((item, index) => {
    if (!item.str) return
    let line = lines.find(l => Math.abs(l.y - item.transform[5]) < 2)
    if (!line) lines.push(line = { y: item.transform[5], page: page.page, items: [] })
    line.items.push({ ...item, ref: `${page.page}:${index}` })
  })
  lines.sort((a,b) => b.y-a.y)
  let imageIndex = 0, previousY = page.height
  const addImage = () => {
    const occurrence = page.images[imageIndex++]
    if (!occurrence) throw Error(`Unmapped image gap page ${page.page}`)
    const asset = manifest.assets.find(a => a.file === occurrence.file)
    blocks.push({ type: 'image', file: asset.file, width: asset.width, height: asset.height, pages: [page.page], refs: [], runs: [] })
    lastLine = null
  }
  for (const line of lines) {
    line.items.sort((a,b) => a.transform[4]-b.transform[4])
    if (previousY-line.y > 140) addImage()
    append(line); previousY=line.y
  }
  // Pages 13 and 26 end with screenshots; all other image placements occur in gaps.
  while (imageIndex < page.images.length) addImage()
}
const modules = [], intro = []
for (const block of blocks) {
  if (block.type === 'module') {
    const section = source.sections[modules.length]
    modules.push({ id: section.id, title: textOf(block.runs), heading: block, blocks: [] })
  } else (modules.at(-1)?.blocks ?? intro).push(block)
}
if (modules.length !== 16) throw Error(`Unexpected module count: ${modules.length}`)
for (const module of modules) {
  for (let i=0;i<module.blocks.length;i++) {
    const block=module.blocks[i]
    if (block.type === 'heading') block.id = `${module.id}-${slug(textOf(block.runs).replace(/^\d+\.\s*/, ''))}`
    if (block.type === 'caption') {
      const image = module.blocks[i-1]
      if (image?.type !== 'image') throw Error(`Caption has no image: ${module.id}`)
      image.caption=block.runs; image.refs.push(...block.refs); image.captionPages=block.pages
      module.blocks.splice(i--,1)
    }
  }
}
// Four consecutive permission modules are nested in a single TOC group.
const groups = modules.filter(m => !['roles','permission-groups','permissions'].includes(m.id)).map(m => ({
  id: m.id === 'users' ? 'users-permissions' : m.id,
  title: m.id === 'users' ? 'Người dùng & Phân quyền' : m.title,
  modules: m.id === 'users' ? ['users','roles','permission-groups','permissions'] : [m.id],
}))
const expected = source.pages.flatMap(p => p.textItems.flatMap((i,index) => i.str ? [`${p.page}:${index}`] : []))
if (allRefs.length !== expected.length || new Set(allRefs).size !== expected.length || expected.some(ref => !allRefs.includes(ref))) throw Error('Source text coverage mismatch')
const ids = modules.flatMap(m=>[m.id,...m.blocks.filter(b=>b.id).map(b=>b.id)])
if (new Set(ids).size !== ids.length) throw Error('Duplicate slugs')
const stats = { pages: source.pages.map(p=>p.page), groups: groups.length, modules: modules.length, subsections: modules.reduce((n,m)=>n+m.blocks.filter(b=>b.type==='heading').length,0), tips: blocks.filter(b=>b.type==='tip').length, bullets: blocks.filter(b=>b.type==='bullet').length, steps: blocks.filter(b=>b.type==='step').length, captions: blocks.filter(b=>b.type==='caption').length, imageOccurrences: blocks.filter(b=>b.type==='image').length, uniqueImages: new Set(blocks.filter(b=>b.type==='image').map(b=>b.file)).size, sourceTextItems: expected.length }
fs.mkdirSync('src/content/guide',{recursive:true})
// Keep source references in an audit file, not in the runtime payload.
fs.mkdirSync('docs/guide',{recursive:true})
fs.writeFileSync('docs/guide/source-map.json',JSON.stringify({sha256:source.sha256, stats, intro, modules},null,2))
const runtime = JSON.parse(JSON.stringify({ locale:'vi', title:'Hướng dẫn sử dụng AezCheck', intro:intro.filter(b=>b.type!=='title'), groups, modules },(key,value)=>['refs','pages','captionPages','heading'].includes(key)?undefined:value))
fs.writeFileSync('src/content/guide/vi.json',JSON.stringify(runtime,null,2))
console.log(JSON.stringify(stats,null,2))
