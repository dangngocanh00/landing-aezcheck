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

await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
await send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});
const checks=[];
for(const locale of ['vi','en']){
 await navigate('/'+locale+'/');
 await check('matchMedia("(hover: none)").matches','Touch has no hover');
 const flow=await evaluate(`(()=>{const e=document.querySelector('.eco-stages');e.scrollLeft=e.scrollWidth;return {end:e.scrollWidth-e.clientWidth-e.scrollLeft,count:e.children.length}})()`);
 assert.equal(flow.count,7);assert.ok(flow.end<=1);checks.push(locale+' flow endpoints');
 for(const index of [0,2,3]){
  await evaluate('[...document.querySelectorAll(".spot-item h2 button")]['+index+'].click()');await pause(100);
  await check(`(()=>{const e=document.querySelector('.spot-scene.is-active :is(.aw-table-wrap,.spot-table-scroll,.monitor-table-wrap)');e.scrollLeft=e.scrollWidth;return e.scrollWidth>e.clientWidth&&e.scrollWidth-e.clientWidth-e.scrollLeft<=1&&[...e.querySelectorAll('th')].every(c=>getComputedStyle(c).display!=='none')})()`,'All table columns reachable');
 }

 for(const width of [320,390,768]){
  await send('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:true});
  for(let i=0;i<5;i++){
   await evaluate('[...document.querySelectorAll(".spot-item h2 button")]['+i+'].click()');await pause(100);
   await check('document.documentElement.scrollWidth<=innerWidth+1','Final mobile scene overflow '+width+i);
  }
  if(width===390){await evaluate('document.querySelector(".spot-scene.is-active").scrollIntoView();scrollBy(0,-90)');await pause(100);const r=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync('artifacts/responsive/'+locale+'-analytics-final.png',Buffer.from(r.data,'base64'));}
 }
 await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
 for(const page of ['terms','privacy']){
  await navigate('/'+locale+'/'+page);await evaluate('document.querySelector(".legal-toc summary").click()');
  await evaluate('[...document.querySelectorAll(".legal-toc a")].at(-1).click()');await pause(250);
  await check('!document.querySelector(".legal-toc").open&&!document.querySelector(".az-navbar [aria-current]")','Legal mobile TOC and neutral nav');
 }
}
await send('Emulation.setTouchEmulationEnabled',{enabled:false});
await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
await navigate('/vi/');await pause(1500);await check('document.documentElement.scrollWidth<=innerWidth+1','Normal-motion desktop overflow');
checks.push('Final 30 mobile scenes and normal-motion desktop');
fs.writeFileSync('artifacts/responsive/touch.json',JSON.stringify({result:'PASS',checks,errors},null,2));assert.equal(errors.length,0);console.log('PASS: touch flow, full tables, legal mobile TOCs');socket.close();
