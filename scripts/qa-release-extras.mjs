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
const shot=async name=>{const r=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});const file='screenshots/'+name+'.png';fs.writeFileSync(root+'/'+file,Buffer.from(r.data,'base64'));return file};
await send('Network.enable');await send('Network.setCacheDisabled',{cacheDisabled:true});
for(const path of ['/vi/not-a-page','/en/not-a-page','/ru/privacy','/th/guide','/zh/terms','/en/guide#shield','/vi/terms#terms-section-4','/en/privacy#sync-data']){
 const response=await fetch('http://127.0.0.1:4173'+path);await send('Page.navigate',{url:'http://127.0.0.1:4173'+path});await pause(1500);
 const state=await evaluate(`(()=>{const h=location.hash.slice(1),t=h&&document.getElementById(h);return {url:location.pathname+location.hash,title:document.title,h1:document.querySelector('h1')?.textContent,headingTop:t?t.getBoundingClientRect().top:null,headerBottom:document.querySelector('.az-navbar').getBoundingClientRect().bottom,active:!!document.querySelector('.az-navbar [aria-current]'),main:document.querySelectorAll('main').length,metaDuplicates:document.querySelectorAll('meta[name=description]').length,serviceWorkers:navigator.serviceWorker?null:'unavailable'}})()`);
 const expected=path.replace(/^\/(ru|th|zh)/,'/en');const pass=state.url===expected&&(path.includes('not-a-page')?state.h1.includes('404'):true)&&(!path.includes('#')||state.headingTop>=state.headerBottom);
 results.push({kind:'route/deeplink',path,httpStatus:response.status,state,status:pass?'PASS':'FAIL',evidence:await shot('route-'+path.replace(/[^a-z0-9]/g,'-'))});
}
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
await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
for(const locale of ['vi','en'])for(const page of ['','pricing','guide','terms','privacy']){
 await navigate('/'+locale+'/'+page);await send('Page.bringToFront');
 await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
 const focus=await evaluate(`({href:document.activeElement.getAttribute('href'),text:document.activeElement.textContent,top:document.activeElement.getBoundingClientRect().top})`);
 await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});await pause(100);
 const target=await evaluate(`document.activeElement.id`);
 results.push({kind:'keyboard-skip',locale,page:page||'landing',focus,target,status:focus.href==='#page-content'&&focus.top>=0&&target==='page-content'?'PASS':'FAIL'});
}
// Real browser keyboard zoom is attempted and measured, never simulated with CSS.
await navigate('/vi/');await pause(1000);const beforeZoom=await evaluate('({dpr:devicePixelRatio,width:innerWidth})');
for(let i=0;i<4;i++){await send('Input.dispatchKeyEvent',{type:'keyDown',key:'+',code:'Equal',modifiers:2,windowsVirtualKeyCode:187});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'+',code:'Equal',modifiers:2,windowsVirtualKeyCode:187})}
const afterZoom=await evaluate('({dpr:devicePixelRatio,width:innerWidth})');results.push({kind:'browser-zoom-200',beforeZoom,afterZoom,status:afterZoom.dpr===beforeZoom.dpr*2?'PASS':'NOT RUN',reason:'Headless CDP key events did not establish browser zoom 200%; no CSS scale substitute used.'});
await send('Input.dispatchKeyEvent',{type:'keyDown',key:'0',code:'Digit0',modifiers:2,windowsVirtualKeyCode:48});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'0',code:'Digit0',modifiers:2,windowsVirtualKeyCode:48});
await send('Page.addScriptToEvaluateOnNewDocument',{source:`window.__qaPerf={cls:0,longTasks:[],lcp:0};new PerformanceObserver(l=>l.getEntries().forEach(e=>{if(!e.hadRecentInput)window.__qaPerf.cls+=e.value})).observe({type:'layout-shift',buffered:true});new PerformanceObserver(l=>l.getEntries().forEach(e=>window.__qaPerf.longTasks.push(e.duration))).observe({type:'longtask',buffered:true});new PerformanceObserver(l=>l.getEntries().forEach(e=>window.__qaPerf.lcp=e.startTime)).observe({type:'largest-contentful-paint',buffered:true});`});
await send('Emulation.setDeviceMetricsOverride',{width:393,height:852,deviceScaleFactor:1,mobile:true});await send('Emulation.setTouchEmulationEnabled',{enabled:true});await send('Emulation.setCPUThrottlingRate',{rate:4});await send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:1638400/8,uploadThroughput:750000/8,connectionType:'cellular3g'});
for(const page of ['','pricing','guide']){
 await send('Network.clearBrowserCache');await send('Page.navigate',{url:'http://127.0.0.1:4173/vi/'+page});
 for(let i=0;i<120;i++){if(await evaluate('!!document.getElementById("mobile-menu-toggle")'))break;await pause(100)}
 await evaluate('document.getElementById("mobile-menu-toggle").click()');await pause(150);const earlyMenu=await evaluate('document.getElementById("mobile-menu-toggle").getAttribute("aria-expanded")==="true"');await evaluate('document.getElementById("mobile-menu-toggle").click()');
 await pause(10000);await evaluate('document.fonts.ready');
 const metrics=await evaluate(`(async()=>({...window.__qaPerf,fonts:document.fonts.status,loadedImages:[...document.images].filter(i=>i.complete&&i.naturalWidth).length,totalImages:document.images.length,resources:performance.getEntriesByType('resource').map(r=>({name:r.name,bytes:r.transferSize,duration:r.duration})),serviceWorkers:await navigator.serviceWorker.getRegistrations().then(r=>r.length)}))()`);
 results.push({kind:'cold-slow',page:page||'landing',locale:'vi',width:393,height:852,network:'150ms, 1.6384 Mbps down / 750 Kbps up; CPU 4x; cache cleared',earlyMenu,metrics,status:earlyMenu?'PASS':'FAIL',evidence:await shot('slow-'+(page||'landing'))});
}
await send('Emulation.setCPUThrottlingRate',{rate:1});await send('Network.emulateNetworkConditions',{offline:false,latency:0,downloadThroughput:-1,uploadThroughput:-1});
fs.writeFileSync(root+'/extras.json',JSON.stringify({results,errors},null,2));socket.close();await fetch('http://localhost:9338/json/close/'+target.id);
