import fs from 'node:fs'
import assert from 'node:assert/strict'

const targets = await (await fetch('http://localhost:9338/json')).json()
const target = true
 ? await (await fetch('http://localhost:9338/json/new?about:blank',{method:'PUT'})).json()
 : targets.find(t => t.type === 'page' && !t.url.startsWith('chrome:'))
const socket = new WebSocket(target.webSocketDebuggerUrl)
await new Promise(resolve => socket.addEventListener('open',resolve,{once:true}))
let sequence=0; const pending=new Map(), errors=[]
socket.addEventListener('message',event=>{
  const message=JSON.parse(event.data)
  if(message.id){const request=pending.get(message.id);pending.delete(message.id);message.error?request.reject(message.error):request.resolve(message.result)}
  if(message.method==='Runtime.exceptionThrown')errors.push(message.params.exceptionDetails)
})
const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++sequence;const timer=setTimeout(()=>{pending.delete(id);reject(Error('CDP timeout: '+method))},90000);pending.set(id,{resolve:r=>{clearTimeout(timer);resolve(r)},reject:e=>{clearTimeout(timer);reject(e)}});socket.send(JSON.stringify({id,method,params}))})
const evaluate=async expression=>{const result=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(result.exceptionDetails)throw Error(JSON.stringify(result.exceptionDetails));return result.result.value}
const pause=ms=>new Promise(r=>setTimeout(r,ms))
const check=async(expression,label)=>assert.ok(await evaluate(expression),label)
let expectedPath='';
const navigate=async path=>{
 expectedPath=path;
 for(let attempt=0;attempt<3;attempt++){
  const navigation=await send('Page.navigate',{url:'http://127.0.0.1:4173'+path});await pause(900);
  if(!navigation.errorText&&await evaluate(`location.pathname+location.hash===${JSON.stringify(path)}`))return;
 }
 throw Error('Navigation did not reach '+path);
}
const choose=async locale=>{await evaluate(`document.querySelector('.az-navbar-desktop .az-language-button[aria-expanded=false]')?.click()`);await pause(40);await evaluate(`document.querySelector('.az-navbar-desktop .az-language-menu [lang="${locale}"]').click()`);await pause(220)}
await send('Page.enable');await send('Runtime.enable')
await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]})
await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false})
const root='.qa/vercel-prep/smoke',phase=process.argv[2]||'before';
const filter=process.argv[3]?{width:+process.argv[3],locale:process.argv[4],page:process.argv[5]==='landing'?'':process.argv[5]}:null;
const output=phase+(filter?'-'+filter.width+'-'+filter.locale+'-'+(filter.page||'landing'):'');
await send('Network.enable');await send('Network.setCacheDisabled',{cacheDisabled:true});
const responseErrors=[],assets=[],rows=[];
socket.addEventListener('message',event=>{const m=JSON.parse(event.data);if(m.method==='Network.responseReceived'){const r=m.params.response;assets.push({url:r.url,status:r.status,mime:r.mimeType});if(r.status>=400||(/\.(js|css|png|webp|woff2)(\?|$)/.test(r.url)&&r.mimeType==='text/html'))responseErrors.push({url:r.url,status:r.status,mime:r.mimeType})}});
const save=()=>fs.writeFileSync(root+'/'+output+'-browser.json',JSON.stringify({baseUrl:'http://127.0.0.1:4173',rows,errors,responseErrors,assets},null,2));
const read=()=>evaluate(`(()=>{const p=document.querySelector('.guide-page,.legal-page');return {path:location.pathname,lang:document.documentElement.lang,title:document.title,h1:document.querySelector('h1')?.textContent,contentLang:p?.lang,description:document.querySelector('meta[name=description]')?.content,canonical:document.querySelector('link[rel=canonical]')?.href,og:document.querySelector('meta[property="og:title"]')?.content,active:[...document.querySelectorAll('.az-navbar [aria-current]')].map(e=>e.getAttribute('href')),width:innerWidth,scroll:document.documentElement.scrollWidth,scripts:[...document.scripts].map(s=>s.src).filter(Boolean)}})()`);
for(const width of [393,1440])for(const locale of ['vi','en'])for(const page of ['','pricing','guide','terms','privacy']){
 if(filter&&(filter.width!==width||filter.locale!==locale||filter.page!==page))continue;
 await send('Emulation.setDeviceMetricsOverride',{width,height:width===393?852:900,deviceScaleFactor:1,mobile:width===393});await send('Emulation.setTouchEmulationEnabled',{enabled:width===393});await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
 await navigate('/'+locale+'/'+page);await pause(1300);await evaluate('document.fonts.ready');
 const initial=await read();await send('Page.reload',{ignoreCache:true});await pause(1300);const reload=await read();
 const expected=page==='guide'?'.guide-page':page==='terms'||page==='privacy'?'.legal-page':page==='pricing'?'.pricing-resource':'#hero';const correct=await evaluate('!!document.querySelector('+JSON.stringify(expected)+')');const next=locale==='vi'?'en':'vi';
 if(width===393)await evaluate('document.getElementById("mobile-menu-toggle").click()');
 const prefix=width===393?'.az-mobile-utilities':'.az-navbar-desktop';await evaluate('document.querySelector('+JSON.stringify(prefix+' .az-language-button')+').click()');await pause(50);
 const options=await evaluate('[...document.querySelectorAll('+JSON.stringify(prefix+' .az-language-menu [lang]')+')].map(e=>e.lang)');
 await evaluate('document.querySelector('+JSON.stringify(prefix+' [lang="'+next+'"]')+').click()');await pause(300);
 const switched=await read();await evaluate('history.back()');await pause(250);const back=await read();await evaluate('history.forward()');await pause(250);const forward=await read();await send('Page.reload',{ignoreCache:true});await pause(1300);const switchReload=await read();
 await navigate('/'+locale+'/'+page);await pause(1300);
 const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});const screenshot='screenshots/'+phase+'-'+(page||'landing')+'-'+locale+'-'+width+'.png';fs.writeFileSync(root+'/'+screenshot,Buffer.from(shot.data,'base64'));
 const traversal=await evaluate(`(async()=>{let overflow=false;for(let y=0;y<document.documentElement.scrollHeight;y+=innerHeight*.8){scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,30));overflow ||=document.documentElement.scrollWidth>innerWidth+1}await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));return {overflow,badImages:[...document.images].filter(i=>!i.naturalWidth).length,guideCounts:['.guide-module','.guide-module h3','.guide-tip','.guide-figure figcaption','.guide-steps > li','.guide-figure img'].map(q=>document.querySelectorAll(q).length),links:[...document.querySelectorAll('.az-navbar a,footer a,.az-hero-primary,.pricing-cta,#contact button,#contact a')].map(e=>({label:e.textContent.trim(),href:e.getAttribute('href'),tag:e.tagName}))}})()`);
 const footerSelector='footer a[href="/'+locale+'/'+(page||'#hero')+'"]';await evaluate('document.querySelector('+JSON.stringify(footerSelector)+')?.click()');await pause(900);const footerNavigation=await read();
 const issues=[];if(!correct||initial.path!=='/'+locale+'/'+page||initial.lang!==locale)issues.push('PAGE_IDENTITY');if(initial.scripts.some(s=>s.includes('/src/')||s.includes('@vite')))issues.push('NOT_BUILD');if(reload.path!==initial.path||switched.path!=='/'+next+'/'+page||back.path!==initial.path||forward.path!==switched.path||switchReload.path!==switched.path)issues.push('ROUTE_HISTORY_LOCALE');if(traversal.overflow||traversal.badImages)issues.push('LAYOUT_ASSET');
 rows.push({page:page||'landing',locale,width,status:issues.length?'FAIL':'PASS',issues,initial,reload,switched,back,forward,switchReload,footerNavigation,options,traversal,screenshot});save();console.log(phase,page||'landing',locale,width,issues.length?issues:'PASS');
}
if(!filter)for(const path of ['/vi/not-a-page','/en/not-a-page','/ru/privacy','/th/guide','/zh/terms','/en/guide#shield','/vi/terms#terms-section-4','/en/privacy#sync-data']){await send('Page.navigate',{url:'http://127.0.0.1:4173'+path});await pause(1500);rows.push({requested:path,actual:await evaluate('location.pathname+location.hash'),h1:await evaluate('document.querySelector("h1")?.textContent')})}
save();socket.close();await fetch('http://localhost:9338/json/close/'+target.id);
