import fs from 'node:fs'
import assert from 'node:assert/strict'

const targets = await (await fetch('http://localhost:9338/json')).json()
const target = targets.find(t => t.type === 'page')
const socket = new WebSocket(target.webSocketDebuggerUrl)
await new Promise(resolve => socket.addEventListener('open',resolve,{once:true}))
let sequence=0; const pending=new Map(), errors=[]
socket.addEventListener('message',event=>{
  const message=JSON.parse(event.data)
  if(message.id){const request=pending.get(message.id);pending.delete(message.id);message.error?request.reject(message.error):request.resolve(message.result)}
  if(message.method==='Runtime.exceptionThrown')errors.push(message.params.exceptionDetails)
})
const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++sequence;pending.set(id,{resolve,reject});socket.send(JSON.stringify({id,method,params}))})
const evaluate=async expression=>{const result=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(result.exceptionDetails)throw Error(JSON.stringify(result.exceptionDetails));return result.result.value}
const pause=ms=>new Promise(r=>setTimeout(r,ms))
const check=async(expression,label)=>assert.ok(await evaluate(expression),label)
const navigate=async path=>{await send('Page.navigate',{url:'http://localhost:8443'+path});await pause(650)}
const choose=async locale=>{await evaluate(`document.querySelector('.az-navbar-desktop .az-language-button[aria-expanded=false]')?.click()`);await pause(40);await evaluate(`document.querySelector('.az-navbar-desktop .az-language-menu [lang="${locale}"]').click()`);await pause(220)}
await send('Page.enable');await send('Runtime.enable')
await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]})
await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false})
const pages=['','guide','terms','privacy','pricing']
const checked=[]
for(const locale of ['vi','en'])for(const page of pages){
  const path=`/${locale}/${page}`
  await navigate(path)
  await check(`location.pathname===${JSON.stringify(path)}&&document.documentElement.lang==='${locale}'&&localStorage.getItem('aezcheck-language')==='${locale}'`,'route and persistence '+path)
  await evaluate(`document.querySelector('.az-navbar-desktop .az-language-button[aria-expanded=false]')?.click()`);await pause(40)
  assert.deepEqual(await evaluate(`[...document.querySelectorAll('.az-language-menu [lang]')].map(e=>e.lang)`),['vi','en'],'Two global options '+path)
  await check(`document.querySelector('.az-language-menu [lang="${locale}"]').getAttribute('aria-checked')==='true'`,'Selected locale '+path)
  await check(`document.querySelector('.az-language-menu [lang="en"] svg path').getAttribute('d')==='M12 0h6v20h-6zM0 7h30v6H0z'`,'England flag '+path)
  if(['guide','terms','privacy'].includes(page))await check(`!document.querySelector('.az-navbar [aria-current]')`,'Neutral header '+path)
  if(page==='pricing')await check(`document.querySelector('.az-navbar a[aria-current="page"]').getAttribute('href')==='/${locale}/pricing'`,'Pricing active '+path)
  if(page==='guide')await check(`document.querySelector('.guide-page').lang==='${locale}'`,'Guide content '+path)
  if(page==='terms'||page==='privacy')await check(`document.querySelector('.legal-page').lang==='${locale}'&&document.querySelector('.legal-toc a').getAttribute('href').startsWith('/${locale}/${page}#')`,'Legal content and TOC '+path)
  await check(`[...document.querySelectorAll('.az-navbar a, footer a')].every(a=>a.getAttribute('href').startsWith('/${locale}/'))`,'Navigation retains locale '+path)
  const next=locale==='vi'?'en':'vi'
  await choose(next)
  await check(`location.pathname==='/${next}/${page}'&&document.documentElement.lang==='${next}'`,'Switch keeps page '+path)
  await send('Page.reload');await pause(500)
  await check(`document.documentElement.lang==='${next}'&&location.pathname==='/${next}/${page}'`,'Reload '+path)
  checked.push(path)
}
for(const removed of ['ru','th','zh'])for(const page of pages){
  await navigate(`/${removed}/${page}#${page==='terms'?'terms-section-4':page==='privacy'?'sync-data':page==='guide'?'shield':page===''?'benefits':''}`)
  await check(`location.pathname==='/en/${page}'&&document.documentElement.lang==='en'`,'Redirect '+removed+'/'+page)
}
for(const removed of ['ru','th','zh']){
  await evaluate(`localStorage.setItem('aezcheck-language','${removed}')`)
  await navigate('/')
  await check(`location.pathname==='/en/'&&localStorage.getItem('aezcheck-language')==='en'`,'Migrate old saved locale '+removed)
}
for(const locale of ['vi','en']){
  await navigate(`/${locale}/terms#terms-section-4`)
  await check(`document.getElementById('terms-section-4').getBoundingClientRect().top>=90&&document.getElementById('terms-section-4').getBoundingClientRect().top<170`,'Legal deep link '+locale)
  await choose(locale==='vi'?'en':'vi')
  await check(`location.hash==='#terms-section-4'&&document.getElementById('terms-section-4').getBoundingClientRect().top>=90`,'Anchor survives switch')
}
for(const page of ['guide','terms','privacy','pricing']){
  await navigate('/#/'+page)
  await check(`location.pathname.endsWith('/${page}')&&!location.hash.startsWith('#/')`,'Old hash route '+page)
  await navigate('/#/ru/'+page)
  await check(`location.pathname==='/en/${page}'`,'Old localized hash route '+page)
}
await navigate('/en/privacy');await evaluate(`document.querySelector('.az-navbar-brand').click()`);await pause(550)
await check(`location.pathname==='/en/'&&!!document.getElementById('hero')`,'Logo returns to English landing')
await evaluate(`document.querySelector('.az-nav-links a[href="/en/#benefits"]').click()`);await pause(250)
await check(`document.querySelector('.az-nav-links a[aria-current]').getAttribute('href')==='/en/#benefits'`,'Landing section active')
await evaluate(`document.querySelector('footer a[href="/en/privacy"]').click()`);await pause(600)
await check(`!!document.getElementById('privacy-heading')&&!document.querySelector('.az-navbar [aria-current]')`,'Footer privacy link')
const responsive=[]
for(const width of [768,390])for(const page of pages){
  await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false})
  await navigate('/en/'+page)
  await evaluate(`document.getElementById('mobile-menu-toggle').click()`);await pause(60)
  await evaluate(`document.querySelector('.az-mobile-utilities .az-language-button').click()`);await pause(60)
  assert.deepEqual(await evaluate(`[...document.querySelectorAll('.az-mobile-utilities .az-language-menu [lang]')].map(e=>e.lang)`),['vi','en'],'Mobile options '+width+page)
  await evaluate(`document.querySelector('.az-mobile-utilities [lang="vi"]').click()`);await pause(180)
  await check(`location.pathname==='/vi/${page}'&&document.documentElement.scrollWidth<=innerWidth`,'Mobile switch/overflow '+width+page)
  responsive.push({width,page})
}
assert.equal(errors.length,0,'No browser exceptions')
fs.writeFileSync('docs/guide/site-locales-qa.json',JSON.stringify({result:'PASS',checked,legacyRedirects:15,responsive,errors},null,2))
console.log('PASS: both locales across all five pages, switch/reload, old routes, stored locale migration, anchors, navigation and mobile selectors.')
socket.close()
