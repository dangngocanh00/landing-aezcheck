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

await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});await navigate('/vi/');
await evaluate(`document.querySelectorAll('.az-sign-motion,.az-product-badge,.az-product-badge *').forEach(e=>e.getAnimations().forEach(a=>{a.pause();a.currentTime=1200}))`);
const snapshot=await evaluate(`['.az-sign-motion','.az-product-badge','.az-product-aez','.az-product-check','.az-product-pro','.az-product-pro-text'].map(q=>{const s=getComputedStyle(document.querySelector(q));return {q,opacity:s.opacity,filter:s.filter,animation:s.animation,background:s.background,color:s.color,shadow:s.boxShadow,textShadow:s.textShadow,width:s.width,height:s.height,transform:s.transform}})`);
fs.mkdirSync('artifacts/mobile-led',{recursive:true});fs.writeFileSync('artifacts/mobile-led/desktop-before.json',JSON.stringify(snapshot,null,2));socket.close();
