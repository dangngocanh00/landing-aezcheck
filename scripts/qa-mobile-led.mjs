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

fs.mkdirSync('artifacts/mobile-led',{recursive:true});
const read=`(()=>{const b=document.querySelector('.az-product-badge');const selectors=['.az-sign-motion','.az-product-badge','.az-product-aez','.az-product-check','.az-product-pro','.az-product-pro-text'];return {parts:selectors.map(q=>{const e=document.querySelector(q),s=getComputedStyle(e);return {q,opacity:+s.opacity,filter:s.filter,animation:s.animationName}}),halo:getComputedStyle(b,'::before').opacity,border:+getComputedStyle(b).getPropertyValue('--az-border-level'),width:innerWidth,scroll:document.documentElement.scrollWidth}})()`;
await send('Page.addScriptToEvaluateOnNewDocument',{source: `new MutationObserver((_,o)=>{if(document.querySelector('.az-product-pro-text')){window.__ledFirst=`+read+`;o.disconnect()}}).observe(document,{childList:true,subtree:true})`});
const shot=async name=>{const r=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync('artifacts/mobile-led/'+name+'.png',Buffer.from(r.data,'base64'))};
const assertBright=(value,label)=>{for(const p of value.parts){assert.equal(p.opacity,1,label+' '+p.q+' opacity');assert.equal(p.filter,'none',label+' '+p.q+' filter');assert.equal(p.animation,'none',label+' '+p.q+' animation')}assert.ok(value.border>=.9,label+' border');assert.ok(value.scroll<=value.width+1,label+' overflow')};
const results=[];
for(const [width,height,touch] of [[320,800,false],[360,800,true],[375,812,false],[393,852,true],[414,896,true],[430,932,false],[852,393,false],[852,393,true]]){
 const name=width+'x'+height+(touch?'-touch':'-mouse');
 await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:touch});await send('Emulation.setTouchEmulationEnabled',{enabled:touch,maxTouchPoints:1});
 await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});await navigate('/vi/');
 const first=await evaluate('window.__ledFirst');assertBright(first,name+' first');await shot(name+'-initial');
 const sample=await evaluate(`new Promise(resolve=>{const start=performance.now();let frames=0,minHalo=1,maxHalo=0;const violations=[];function tick(){const v=`+read+`;frames++;minHalo=Math.min(minHalo,+v.halo);maxHalo=Math.max(maxHalo,+v.halo);if(v.parts.some(p=>p.opacity!==1||p.filter!=='none'||p.animation!=='none')||v.border<.9)violations.push(v);if(performance.now()-start>=10200)resolve({frames,minHalo,maxHalo,violations});else requestAnimationFrame(tick)}tick()})`);
 assert.equal(sample.violations.length,0,name+' continuous lighting');assert.ok(sample.maxHalo>.98&&sample.minHalo<.02,name+' full pulse');
 await evaluate('scrollTo(0,document.documentElement.scrollHeight)');await pause(100);await evaluate('scrollTo(0,0)');await pause(100);assertBright(await evaluate(read),name+' return');
 for(const [phase,time] of [['minimum',0],['maximum',1200]]){
  await evaluate('document.getAnimations().filter(a=>a.animationName==="mobileSignHalo").forEach(a=>{a.pause();a.currentTime='+time+'})');await pause(40);assertBright(await evaluate(read),name+phase);await shot(name+'-'+phase);
 }
 await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await pause(80);assertBright(await evaluate(read),name+' reduced');await check('!document.getAnimations().some(a=>a.animationName==="mobileSignHalo")','Reduced pulse disabled');await shot(name+'-reduced');
 const bounds=await evaluate(`(()=>{const r=document.querySelector('.az-product-badge').getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right,headerBottom:document.querySelector('.az-navbar').getBoundingClientRect().bottom}})()`);results.push({name,first,sample,reduced:true,scrollReturn:true,bounds});fs.writeFileSync('artifacts/mobile-led/qa-mobile.json',JSON.stringify(results,null,2));console.log('PASS '+name+' '+sample.frames+' frames');
}
await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});await send('Emulation.setTouchEmulationEnabled',{enabled:false});await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});await navigate('/vi/');
await evaluate(`document.querySelectorAll('.az-sign-motion,.az-product-badge,.az-product-badge *').forEach(e=>e.getAnimations().forEach(a=>{a.pause();a.currentTime=1200}))`);
const desktop=await evaluate(`['.az-sign-motion','.az-product-badge','.az-product-aez','.az-product-check','.az-product-pro','.az-product-pro-text'].map(q=>{const s=getComputedStyle(document.querySelector(q));return {q,opacity:s.opacity,filter:s.filter,animation:s.animation,background:s.background,color:s.color,shadow:s.boxShadow,textShadow:s.textShadow,width:s.width,height:s.height,transform:s.transform}})`);
assert.deepEqual(desktop,JSON.parse(fs.readFileSync('artifacts/mobile-led/desktop-before.json','utf8')),'Desktop unchanged');await shot('desktop-1440');
await evaluate('document.querySelector(".az-product-badge").dispatchEvent(new PointerEvent("pointerover",{bubbles:true,pointerType:"mouse"}))');await pause(50);await check('document.querySelector(".az-product-badge").dataset.powerActive==="true"','Desktop hover still enabled');
await send('Emulation.setDeviceMetricsOverride',{width:393,height:852,deviceScaleFactor:1,mobile:false});await pause(1000);await check('!document.querySelector(".az-product-badge").dataset.powerActive','Resize clears desktop state');assertBright(await evaluate(read),'Resize');
fs.writeFileSync('artifacts/mobile-led/qa.json',JSON.stringify({results,desktopUnchanged:true,errors},null,2));assert.equal(errors.length,0);console.log('PASS: mobile LED and unchanged desktop');socket.close();
