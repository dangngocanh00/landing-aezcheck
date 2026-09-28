import fs from 'node:fs'
import assert from 'node:assert/strict'

const source=JSON.parse(fs.readFileSync('docs/reference/aezcheck-guide-content.json','utf8'))
const map=JSON.parse(fs.readFileSync('docs/guide/source-map.json','utf8'))
const runtime=JSON.parse(fs.readFileSync('src/content/guide/vi.json','utf8'))
const manifest=JSON.parse(fs.readFileSync('docs/guide/asset-manifest.json','utf8'))
const blocks=[...map.intro,...map.modules.flatMap(m=>[m.heading,...m.blocks])]
const references=new Map(source.pages.flatMap(page=>page.textItems.flatMap((item,index)=>item.str?[[`${page.page}:${index}`,item.str]]:[])))
const seen=new Set()
const canonical=text=>text.replace(/\s/g,'')
for(const block of blocks){
  for(const ref of block.refs){assert.ok(!seen.has(ref),`Duplicate text ${ref}`);assert.ok(references.has(ref));seen.add(ref)}
  const text=block.refs.map(ref=>references.get(ref))
  if(['bullet','tip'].includes(block.type))text.shift()
  if(block.type==='step')text.splice(0,2)
  const rendered=(block.type==='image'?block.caption??[]:block.runs).map(run=>run.text).join('')
  assert.equal(canonical(rendered),canonical(text.join('')),`Text altered in ${block.type} on page ${block.pages}`)
}
assert.equal(seen.size,references.size,'All source text items retained')
assert.equal(runtime.title,'Hướng dẫn sử dụng AezCheck','Requested H1')
assert.equal(runtime.modules.length,source.sections.length)
const pictures=map.modules.flatMap(m=>m.blocks.filter(b=>b.type==='image'))
assert.deepEqual(pictures.map(b=>[b.pages[0],b.file]),source.pages.flatMap(p=>p.images.map(i=>[p.page,i.file])),'Image placement order matches pages 1–39')
for(const asset of manifest.assets)assert.ok(fs.existsSync(`public/assets/guide/${asset.file}`))
const flat=JSON.stringify(runtime)
assert.ok(flat.includes('[chức năng cần xác nhận]'))
assert.ok(flat.includes('[Điền thông tin cấu hình: tên, phạm vi áp dụng và loại cấu hình].'))
assert.ok(flat.includes('[Điền thông tin tag: tên, màu sắc…].'))
const normalized=JSON.parse(JSON.stringify({locale:'vi',title:runtime.title,intro:map.intro.filter(b=>b.type!=='title'),groups:runtime.groups,modules:map.modules},(key,value)=>['refs','pages','captionPages','heading'].includes(key)?undefined:value))
assert.deepEqual(runtime,normalized,'Runtime preserves normalized source')
const pages=source.pages.map(page=>({page:page.page,textItems:page.textItems.filter(i=>i.str).length,matchedTextItems:[...seen].filter(ref=>ref.startsWith(`${page.page}:`)).length,imageOccurrences:page.images.length,result:'PASS'}))
const report={result:'PASS',sourceSha256:source.sha256,...map.stats,pages,note:'All non-whitespace source characters retained. PDF bullets/step markers become semantic HTML. Only H1 is replaced with the user-requested title.'}
fs.writeFileSync('docs/guide/content-qa.json',JSON.stringify(report,null,2))
console.log(JSON.stringify({result:report.result,pages:pages.length,textItems:seen.size,images:pictures.length,assets:manifest.assets.length}))
