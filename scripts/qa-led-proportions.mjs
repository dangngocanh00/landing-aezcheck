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

fs.mkdirSync('artifacts/led-proportions',{recursive:true});const results=[];
for(const [width,height] of [[1440,1000],[1024,768],[768,1024],[430,932],[393,852],[375,812],[320,800],[852,393]]){
 await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});await send('Emulation.setTouchEmulationEnabled',{enabled:false});await navigate('/vi/');await pause(100);
 const result=await evaluate(`(()=>{const b=document.querySelector('.az-product-badge'),n=b.querySelector('.az-product-name'),p=b.querySelector('.az-product-pro'),s=getComputedStyle(b),t=getComputedStyle(n),r=b.getBoundingClientRect(),nr=n.getBoundingClientRect();return {viewport:innerWidth,width:parseFloat(s.width),height:parseFloat(s.height),font:parseFloat(t.fontSize),proFont:parseFloat(getComputedStyle(p).fontSize),gap:parseFloat(t.gap),nameWidth:nr.width,boxLeft:r.left,boxRight:r.right,contentFits:nr.left>=r.left&&nr.right<=r.right,opacity:getComputedStyle(b.querySelector('.az-product-aez')).opacity,filter:s.filter,scroll:document.documentElement.scrollWidth}})()`);
 assert.ok(result.contentFits,'Content fits '+width);assert.ok(result.boxLeft>=0&&result.boxRight<=width,'Frame fits '+width);assert.ok(result.scroll<=width+1,'Page fits '+width);
 if(width<1200){assert.ok(Math.abs(result.font/result.width-94/900)<.001,'Shared text ratio');assert.ok(Math.abs(result.proFont/result.font-.8)<.001,'PRO ratio');assert.ok(Math.abs(result.width/result.height-900/192)<.12,'Frame ratio')}
 if(width<768)assert.equal(result.opacity,'1','Always on');
 const image=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync('artifacts/led-proportions/'+width+'.png',Buffer.from(image.data,'base64'));results.push(result);
}
await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});await navigate('/vi/');
await evaluate(`document.querySelectorAll('.az-sign-motion,.az-product-badge,.az-product-badge *').forEach(e=>e.getAnimations().forEach(a=>{a.pause();a.currentTime=1200}))`);
const desktop=await evaluate(`['.az-sign-motion','.az-product-badge','.az-product-aez','.az-product-check','.az-product-pro','.az-product-pro-text'].map(q=>{const s=getComputedStyle(document.querySelector(q));return {q,opacity:s.opacity,filter:s.filter,animation:s.animation,background:s.background,color:s.color,shadow:s.boxShadow,textShadow:s.textShadow,width:s.width,height:s.height,transform:s.transform}})`);
assert.deepEqual(desktop,JSON.parse(fs.readFileSync('artifacts/mobile-led/desktop-before.json','utf8')),'Desktop preserved');assert.equal(errors.length,0);fs.writeFileSync('artifacts/led-proportions/qa.json',JSON.stringify({results,desktopUnchanged:true,errors},null,2));console.log(JSON.stringify(results,null,2));socket.close();
