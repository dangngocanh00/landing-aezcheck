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

for(const width of [440,1024,768,430,393,375,1440]){
 await send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:false});await navigate('/vi/');
 const v=await evaluate(`(()=>{const e=document.querySelector('.az-product-badge'),r=e.getBoundingClientRect(),m=new DOMMatrix(getComputedStyle(e).transform);return {width:innerWidth,angle:Math.atan2(m.b,m.a)*180/Math.PI,left:r.left,right:r.right}})()`);
 assert.ok(Math.abs(v.angle-(width<1200?-2:0))<.01,'Tilt '+width);assert.ok(v.left>=0&&v.right<=width,'Fits '+width);console.log(v);
 if(width===393){fs.mkdirSync('artifacts/led-tilt',{recursive:true});const shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync('artifacts/led-tilt/393.png',Buffer.from(shot.data,'base64'))}
}
assert.equal(errors.length,0);socket.close();
