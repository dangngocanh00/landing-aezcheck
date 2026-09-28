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
for(const locale of ['vi','en'])for(const width of [393,1440]){
 await send('Emulation.setDeviceMetricsOverride',{width,height:width===393?852:900,deviceScaleFactor:1,mobile:width===393});
 for(const [area,destination] of [['header','#hero'],['header','#features'],['header','#benefits'],['header','#shield'],['header','pricing'],['header','#contact'],['footer','guide'],['footer','terms'],['footer','privacy']]){
  await navigate('/'+locale+'/terms');await evaluate('document.fonts.ready');
  const href='/'+locale+'/'+destination;
  const selector=area==='footer'?`footer a[href="${href}"]`:destination==='#hero'?'.az-navbar-brand':width===393?`#mobile-navigation a[href="${href}"]`:`.az-navbar a[href="${href}"]`;
  if(width===393&&area==='header'&&destination!=='#hero')await evaluate(`document.getElementById('mobile-menu-toggle').click()`);
  const clicked=await evaluate(`(()=>{const a=document.querySelector(${JSON.stringify(selector)});if(!a)return false;a.click();return true})()`);await pause(1000);await evaluate('document.fonts.ready');await pause(300);
  const state=await evaluate(`(()=>{const target=location.hash?document.getElementById(location.hash.slice(1)):null;const heading=target?.querySelector('h1,h2');return {path:location.pathname+location.hash,h1:document.querySelector('h1')?.textContent,top:target?.getBoundingClientRect().top,headingTop:heading?.getBoundingClientRect().top,headingText:heading?.textContent,viewport:innerHeight,header:document.querySelector('.az-navbar').getBoundingClientRect().bottom}})()`);
  const routeOK=state.path===href;const visible=!destination.startsWith('#')||(state.headingTop!==undefined&&state.headingTop>=state.header&&state.headingTop<state.viewport);
  results.push({kind:'navigation-click',locale,width,area,destination,state,status:clicked&&routeOK&&visible?'PASS':'FAIL'});
 }
}
fs.writeFileSync(root+'/navigation-retest.json',JSON.stringify({results,errors},null,2));socket.close();await fetch('http://localhost:9338/json/close/'+target.id);