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

fs.mkdirSync('artifacts/responsive',{recursive:true});const checked=[];
const shot=async name=>{const r=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync('artifacts/responsive/'+name+'.png',Buffer.from(r.data,'base64'))};
for(const locale of ['vi','en'])for(const [width,height] of [[360,800],[390,844],[768,1024],[1024,768],[1440,900],[844,390],[720,450]]){
 await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
 for(const page of ['','pricing','guide','terms','privacy']){
  await navigate('/'+locale+'/'+page);await check('!!document.querySelector(".az-navbar")','render');
  const length=await evaluate('document.documentElement.scrollHeight');
  for(let y=0;y<length;y+=height*.85){await evaluate('scrollTo(0,'+y+')');await pause(15)}
  await check('document.documentElement.scrollWidth<=innerWidth+1','overflow '+locale+page+width);
  await evaluate('scrollTo(0,0)');await pause(100);
  if(width===390||width===1440)await shot(locale+'-'+(page||'landing')+'-'+width);
  if(width<960){await evaluate('document.getElementById("mobile-menu-toggle").focus();document.getElementById("mobile-menu-toggle").click()');await check('document.getElementById("mobile-menu-toggle").getAttribute("aria-expanded")==="true"','menu');await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await check('document.getElementById("mobile-menu-toggle").getAttribute("aria-expanded")==="false"','escape');}
  if(page===''){
   for(let i=0;i<5;i++){
    await evaluate('[...document.querySelectorAll(".spot-item h2 button")]['+i+'].click()');await pause(100);
    await check('document.querySelectorAll(".spot-scene.is-active").length===1','one scene');
    if(width<960)await check('!!document.querySelector(".spot-item.is-active .spot-visual")','inline scene');
    await check('document.documentElement.scrollWidth<=innerWidth+1','scene overflow');
    if(width===390){await evaluate('document.querySelector(".spot-scene.is-active").scrollIntoView({block:"start"})');await shot(locale+'-scene-'+i);}
   }
   for(let i=0;i<3;i++){await evaluate('[...document.querySelectorAll(".cc-stack-nav button")]['+i+'].click()');await check('document.querySelectorAll(".cc-browser--front").length===1','active layer');}
   for(let i=0;i<5;i++){await evaluate('[...document.querySelectorAll(".ads-preview-tabs button")]['+i+'].click()');await check('document.querySelectorAll(".ads-preview-tabs [aria-selected=true]").length===1','ad tab');}
   if(width===390){for(const [name,selector] of [['flow','.eco-flow'],['shield','.shield-stage'],['control','.cc-stack']]){await evaluate('document.querySelector('+JSON.stringify(selector)+').scrollIntoView({block:"start"})');await shot(locale+'-'+name);}}
  }
  checked.push({locale,page:page||'landing',width,height});
 }
}
fs.writeFileSync('artifacts/responsive/interactions.json',JSON.stringify({checked,errors},null,2));assert.equal(errors.length,0);console.log('PASS '+checked.length+' page/viewport combinations');socket.close();
