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
const root='.qa/release/2026-09-29-build',results=[];
for(const locale of ['vi','en'])for(const page of ['','pricing','guide','terms','privacy']){
 await navigate('/'+locale+'/'+page);await pause(700);
 const state=await evaluate(`(()=>{const selector=${JSON.stringify(page===''?'.az-hero-description':page==='pricing'?'.pricing-description':page==='guide'?'.guide-page > article p':'.legal-page article p')};return {path:location.pathname,lang:document.documentElement.lang,title:document.title,description:document.querySelector('meta[name=description]').content,expected:document.querySelector(selector)?.textContent.trim(),count:document.querySelectorAll('meta[name=description]').length,active:[...document.querySelectorAll('.az-navbar [aria-current]')].map(e=>e.getAttribute('href')),favicon:document.querySelector('link[rel=icon]').href}})()`);
 results.push({locale,page:page||'landing',state,status:state.lang===locale&&state.description===state.expected&&state.count===1?'PASS':'FAIL'});
}
fs.writeFileSync(root+'/final-metadata.json',JSON.stringify({buildHash:JSON.parse(fs.readFileSync(root+'/after-files.json')).buildHash,results,errors},null,2));
console.log(results.map(r=>[r.locale,r.page,r.status]));socket.close();await fetch('http://localhost:9338/json/close/'+target.id);
