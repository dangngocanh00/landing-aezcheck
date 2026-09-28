import fs from 'node:fs'
import assert from 'node:assert/strict'
const vi=JSON.parse(fs.readFileSync('src/content/guide/vi.json','utf8'))
const translations=new Map();let current
for(const line of fs.readFileSync('docs/guide/en-translation.txt','utf8').trim().split(/\r?\n/)){
  const divider=line.indexOf('|'),key=line.slice(0,divider),text=line.slice(divider+1)
  assert.ok(divider>0 && text)
  if(key.startsWith('@')){current={title:text,blocks:new Map()};translations.set(key.slice(1),current)}
  else {assert.ok(!current.blocks.has(Number(key)));current.blocks.set(Number(key),text)}
}
// Only paired markdown emphasis is parsed. Underscores inside API identifiers stay literal.
const runs=text=>text.split(/(\*\*.+?\*\*|(?<!\w)_.+?_(?!\w)|→)/g).filter(Boolean).map(part=>part.startsWith('**')?{style:'bold',text:part.slice(2,-2)}:part.startsWith('_')&&part.endsWith('_')?{style:'italic',text:part.slice(1,-1)}:{style:part==='→'?'arrow':'text',text:part})
const en=structuredClone(vi);en.locale='en';en.title='AezCheck User Guide'
en.intro[0].runs=runs('Step-by-step guides for every module — you will be ready to operate your workspace after just a few minutes of reading.')
let count=0
en.modules.forEach(module=>{
  const translation=translations.get(module.id);assert.ok(translation,`Missing module ${module.id}`);module.title=translation.title
  module.blocks.forEach((block,index)=>{
    if(block.type==='image'&&!block.caption)return
    const text=translation.blocks.get(index);assert.ok(text,`Missing translation ${module.id}:${index}`)
    if(block.type==='image')block.caption=runs(text);else block.runs=runs(text)
    translation.blocks.delete(index);count++
  })
  assert.equal(translation.blocks.size,0,`Unused translations in ${module.id}`)
})
en.groups.forEach(group=>group.title=group.id==='users-permissions'?'Users & Permissions':en.modules.find(m=>m.id===group.modules[0]).title)
fs.writeFileSync('src/content/guide/en.json',JSON.stringify(en,null,2))
console.log(`English guide: ${en.modules.length} modules, ${count} translated blocks, all image mappings and anchors preserved.`)
