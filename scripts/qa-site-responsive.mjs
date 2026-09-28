import fs from 'node:fs'
import assert from 'node:assert/strict'

const targets = await (await fetch('http://localhost:9338/json')).json()
const target = process.argv.includes('--isolated')
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
  const navigation=await send('Page.navigate',{url:'http://localhost:8443'+path});await pause(900);
  if(!navigation.errorText&&await evaluate(`location.pathname+location.hash===${JSON.stringify(path)}`))return;
 }
 throw Error('Navigation did not reach '+path);
}
const choose=async locale=>{await evaluate(`document.querySelector('.az-navbar-desktop .az-language-button[aria-expanded=false]')?.click()`);await pause(40);await evaluate(`document.querySelector('.az-navbar-desktop .az-language-menu [lang="${locale}"]').click()`);await pause(220)}
await send('Page.enable');await send('Runtime.enable')
await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]})
await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false})
const phase=process.argv[2] || 'before';
const mode=process.argv[3] || 'matrix';
const root='.qa/responsive/2026-09-29-audit';
fs.mkdirSync(`${root}/${phase}`,{recursive:true});
fs.mkdirSync(`${root}/details`,{recursive:true});
const network=[], consoleErrors=[], urls=new Map();
socket.addEventListener('message',event=>{
 const m=JSON.parse(event.data),p=m.params;
 if(m.method==='Network.requestWillBeSent')urls.set(p.requestId,p.request.url);
 if(m.method==='Network.responseReceived' && p.response.status>=400)network.push({url:p.response.url,status:p.response.status});
 if(m.method==='Network.loadingFailed'&&!p.canceled)network.push({url:urls.get(p.requestId),error:p.errorText});
 if(m.method==='Runtime.consoleAPICalled'&&p.type==='error')consoleErrors.push(p.args.map(a=>a.value||a.description).join(' '));
});
await send('Network.enable');
await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
const results=process.argv.includes('--resume')&&fs.existsSync(`${root}/${phase}-${mode}.json`)?JSON.parse(fs.readFileSync(`${root}/${phase}-${mode}.json`)).results:[];
const screenshot=async(name,folder=phase)=>{
 await send('Page.bringToFront');
 const r=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
 const path=`${folder}/${folder==='details'?phase+'-':''}${name}.png`;fs.writeFileSync(`${root}/${path}`,Buffer.from(r.data,'base64'));return path;
};
const metrics=()=>evaluate(`(()=>{const r=document.documentElement;return {viewport:innerWidth,client:r.clientWidth,scroll:r.scrollWidth,body:document.body.scrollWidth}})()`);
const ready=async()=>{
 for(let attempt=0;attempt<60;attempt++){
  if(await evaluate(`(()=>{const p=location.pathname.split('/').filter(Boolean)[1];return p==='guide'?!!document.querySelector('.guide-toc'):p==='terms'||p==='privacy'?!!document.querySelector('.legal-toc'):p==='pricing'?!!document.querySelector('.pricing-resource'):!!document.getElementById('hero')})()`))break;
  await pause(100);
 }
 await evaluate(`document.fonts.ready`);
 await check(`!!document.querySelector('.az-navbar')&&!!document.querySelector('footer')`,'Application loaded');
 await pause(1400);
 const identity=await evaluate(`(()=>{const path=location.pathname.split('/').filter(Boolean),page=path[1]||'landing',locale=path[0],root=page==='guide'?document.querySelector('.guide-page'):page==='terms'||page==='privacy'?document.querySelector('.legal-page'):null;return {path:location.pathname,page,locale,lang:document.documentElement.lang,contentLang:root?.getAttribute('lang'),width:innerWidth,height:innerHeight,fonts:document.fonts.status}})()`);
 assert.equal(identity.path,expectedPath.split('#')[0],'Correct route before capture');
 await check(`(()=>{const p=location.pathname.split('/').filter(Boolean)[1];return p==='guide'?!!document.querySelector('.guide-toc'):p==='terms'||p==='privacy'?!!document.querySelector('.legal-toc'):p==='pricing'?!!document.querySelector('.pricing-resource'):!!document.getElementById('hero')})()`,'Correct page content before capture');
 assert.equal(identity.lang,identity.locale,'Rendered locale matches route');
 if(identity.contentLang)assert.equal(identity.contentLang,identity.locale,'Content locale matches route');
 assert.equal(identity.width,currentViewport.width,'Viewport width');assert.equal(identity.height,currentViewport.height,'Viewport height');
};
let currentViewport={width:1440,height:1000};
const setup=async(width,height,touch=false)=>{
 currentViewport={width,height};
 await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:touch});
 await send('Emulation.setTouchEmulationEnabled',{enabled:touch,maxTouchPoints:1});
};
const primary=[[360,800],[393,852],[430,932],[768,1024],[1024,768],[1440,900]];
const extra=[[320,740],[375,812],[414,896],[820,1180],[1280,800],[1920,1080],[852,393]];
const pages=['','pricing','guide','terms','privacy'];
const cases=[];
// Priority cases are intentionally first and remain part of the 60-case matrix.
for(const locale of ['vi','en'])cases.push({page:'',locale,width:393,height:852,group:'main'});
for(const page of pages)for(const locale of ['vi','en'])for(const [width,height] of primary)
 if(!(page===''&&width===393))cases.push({page,locale,width,height,group:'main'});
for(const page of ['', 'pricing'])for(const locale of ['vi','en'])for(const [width,height] of extra)cases.push({page,locale,width,height,group:'extra'});
for(const page of pages)for(const locale of ['vi','en'])cases.push({page,locale,width:393,height:852,touch:true,group:'touch'});
const save=()=>fs.writeFileSync(`${root}/${phase}-${mode}.json`,JSON.stringify({baseUrl:'http://localhost:8443',engine:'Chromium',phase,mode,results,errors,consoleErrors,network},null,2));
const click=async(selector,index=0)=>{
 for(let attempt=0;attempt<40;attempt++){
  if(await evaluate(`!!document.querySelectorAll(${JSON.stringify(selector)})[${index}]`))break;
  await pause(100);
 }
 await check(`!!document.querySelectorAll(${JSON.stringify(selector)})[${index}]`,'Missing control '+selector+' '+await evaluate('location.href'));
 await evaluate(`(()=>{const e=document.querySelectorAll(${JSON.stringify(selector)})[${index}];e.scrollIntoView({block:'center',inline:'nearest',behavior:'instant'});e.focus?.({preventScroll:true});e.click()})()`);await pause(450);
};
if(mode==='matrix')for(const c of cases){
 if(results.some(r=>r.page===c.page&&r.locale===c.locale&&r.width===c.width&&r.height===c.height&&!!r.touch===!!c.touch))continue;
 const {page,locale,width,height,touch=false}=c;const name=`${page||'landing'}-${locale}-chromium-${width}x${height}${touch?'-touch':''}`;
 const issues=[],evidence=[];const startNet=network.length,startError=errors.length,startConsole=consoleErrors.length;
 await setup(width,height,touch);await navigate(`/${locale}/${page}`);await ready();
 evidence.push(await screenshot(name+'-top'));
 const header=await evaluate(`(()=>{const n=document.querySelector('.az-navbar').getBoundingClientRect(),i=document.querySelector('.az-navbar .az-brand-image'),r=i.getBoundingClientRect();return {height:n.height,logoHeight:r.height,logoFits:r.left>=0&&r.right<=innerWidth&&r.top>=n.top&&r.bottom<=n.bottom}})()`);
 if(!header.logoFits||header.height>100||header.logoHeight>60)issues.push('HEADER_GEOMETRY');
 let led=null;
 if(page===''){
  led=await evaluate(`(()=>{const b=document.querySelector('.az-product-badge'),n=b.querySelector('.az-product-name'),r=b.getBoundingClientRect(),h=document.querySelector('.az-navbar').getBoundingClientRect();return {textRatio:parseFloat(getComputedStyle(n).width)/parseFloat(getComputedStyle(b).width),top:r.top,headerBottom:h.bottom,left:r.left,right:r.right}})()`);
  if(led.top<led.headerBottom+2)issues.push('LED_HEADER_OVERLAP');
  if(width<1200&&(led.textRatio<.80||led.textRatio>.94))issues.push('LED_TEXT_RATIO');
 }
 const traversal=await evaluate(`(async()=>{const samples=[];for(let y=0;y<document.documentElement.scrollHeight;y+=innerHeight*.8){scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,55));samples.push({y,scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth,body:document.body.scrollWidth,width:innerWidth})}await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));return {samples,images:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),footer:document.querySelector('footer').getBoundingClientRect().bottom<=innerHeight+2}})()`);
 if(traversal.samples.some(s=>s.scroll>s.width+1))issues.push('DOCUMENT_OVERFLOW');
 if(traversal.images.length)issues.push('IMAGE_LOAD');
 evidence.push(await screenshot(name+'-footer'));
 if(['terms','privacy','guide'].includes(page)&&await evaluate(`!!document.querySelector('.az-navbar [aria-current]')`))issues.push('LEGAL_HEADER_ACTIVE');
 if(page==='pricing'){
  const values=await evaluate(`[...document.querySelectorAll('.pricing-resource dd')].map(e=>e.textContent.trim())`);
  if(JSON.stringify(values)!==JSON.stringify(['1','2','3','5','75','50']))issues.push('FREE_LIMITS');
 }
 if(errors.length>startError||consoleErrors.length>startConsole)issues.push('RUNTIME');
 if(network.length>startNet)issues.push('RESOURCE_NETWORK');
 results.push({...c,route:`/${locale}/${page}`,status:issues.length?'FAIL':'PASS',issues,evidence,header,led,traversal,network:network.slice(startNet)});save();
 console.log(`${phase} ${name}: ${issues.join(', ')||'PASS'}`);
}
if(mode==='details')for(const locale of ['vi','en'])for(const [width,height] of [[393,852],[768,1024],[1440,900]]){
 const c={locale,width,height,touch:width===393};await setup(width,height,c.touch);await navigate(`/${locale}/`);await ready();
 const issues=[],evidence=[],checks=[];const name=`landing-${locale}-chromium-${width}x${height}`;
 const verify=async(expression,label)=>{const pass=await evaluate(expression);checks.push({label,pass});if(!pass)issues.push(label)};
 if(width<960){await click('#mobile-menu-toggle');evidence.push(await screenshot(name+'-menu','details'));await verify(`document.getElementById('mobile-menu-toggle').getAttribute('aria-expanded')==='true'`,'menu opens');await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await pause(80);await verify(`document.getElementById('mobile-menu-toggle').getAttribute('aria-expanded')==='false'`,'menu Escape');}
 for(let i=0;i<5;i++){
  await click('.spot-item h2 button',i);
  await verify(`document.querySelectorAll('.spot-scene.is-active').length===1&&document.querySelector('.spot-scene.is-active').dataset.scene===['workspace','core','finance','monitoring','reports'][${i}]`,'scene '+i);
  if(width<960)await verify(`!!document.querySelector('.spot-item.is-active .spot-visual')`,'inline visual '+i);
  await evaluate(`document.querySelector('.spot-scene.is-active').scrollIntoView({block:'start',behavior:'instant'});scrollBy(0,-95)`);await pause(70);
  evidence.push(await screenshot(name+'-scene-'+i,'details'));
  await verify(`document.documentElement.scrollWidth<=innerWidth+1`,'scene overflow '+i);
 }
 const layerHeights=[],layerTitles=[];
 for(let i=0;i<3;i++){
  await click('.cc-stack-nav button',i);layerHeights.push(await evaluate(`document.querySelector('.cc-stack-stage').getBoundingClientRect().height`));layerTitles.push(await evaluate(`document.querySelector('.cc-browser--front h3').textContent`));
  await evaluate(`document.querySelector('.cc-stack').scrollIntoView({block:'start',behavior:'instant'});scrollBy(0,-95)`);await pause(70);evidence.push(await screenshot(name+'-layer-'+i,'details'));
  await verify(`document.documentElement.scrollWidth<=innerWidth+1`,'layer overflow '+i);
 }
 if(new Set(layerTitles).size!==3)issues.push('layer content not changing');if(Math.max(...layerHeights)-Math.min(...layerHeights)>4)issues.push('layer height jump');
 const contents=[];
 for(let i=0;i<5;i++){
  await click('.ads-preview-tabs button',i);contents.push(await evaluate(`document.querySelector('.ads-preview tbody').textContent`));
  await verify(`document.querySelectorAll('.ads-preview tbody tr').length===${i===4?6:5}`,'ads row count '+i);
  await evaluate(`(()=>{const t=document.querySelector('.ads-preview-scroll');t.scrollLeft=t.scrollWidth})()`);
  await verify(`(()=>{const e=document.querySelector('.ads-preview-scroll');return e.scrollWidth-e.clientWidth-e.scrollLeft<=1})()`,'last column '+i);
  if(i===4)evidence.push(await screenshot(name+'-posts-last-column','details'));
 }
 if(new Set(contents).size!==5)issues.push('ads content not changing');
 await evaluate(`document.querySelector('.eco-flow').scrollIntoView({block:'center',behavior:'instant'});const f=document.querySelector('.eco-stages');f.scrollLeft=f.scrollWidth`);
 await verify(`(()=>{const f=document.querySelector('.eco-stages');return f.children.length===7&&f.scrollWidth-f.clientWidth-f.scrollLeft<=1})()`,'flow last reachable');evidence.push(await screenshot(name+'-flow-last','details'));
 await evaluate(`document.getElementById('shield').scrollIntoView({block:'start',behavior:'instant'})`);await pause(150);
 await verify(`document.querySelector('.az-navbar a[aria-current]')?.getAttribute('href').endsWith('#shield')`,'HEADER_SCROLL_ACTIVE');
 evidence.push(await screenshot(name+'-shield','details'));
 await verify(`[...document.querySelectorAll('.benefit-glass-card')].every(e=>{const s=getComputedStyle(e);return s.borderTopWidth==='0px'&&s.backgroundColor==='rgba(0, 0, 0, 0)'})`,'benefit surfaces');
 results.push({...c,route:`/${locale}/`,status:issues.length?'FAIL':'PASS',issues,checks,evidence,layerHeights,layerTitles});save();console.log(`${phase} ${name} interactions: ${issues.join(', ')||'PASS'}`);
}
if(mode==='journeys')for(const locale of ['vi','en'])for(const [width,height] of [[393,852],[768,1024],[1440,900]])for(const page of pages){
 if(results.some(r=>r.route===`/${locale}/${page}`&&r.width===width))continue;
 await setup(width,height,width===393);await navigate(`/${locale}/${page}`);await ready();
 const issues=[],checks=[],evidence=[];const name=`${page||'landing'}-${locale}-${width}`;
 const verify=async(expression,label)=>{const pass=await evaluate(expression);checks.push({label,pass});if(!pass)issues.push(label)};
 const chooseLocale=async next=>{
  if(width<960&&await evaluate(`document.getElementById('mobile-menu-toggle').getAttribute('aria-expanded')==='false'`))await click('#mobile-menu-toggle');
  const prefix=width<960?'.az-mobile-utilities':'.az-navbar-desktop';
  await click(prefix+' .az-language-button');
  await verify(`document.querySelectorAll('${prefix} .az-language-menu [lang]').length===2`,'two locale options');
  await click(prefix+` [lang="${next}"]`);await pause(200);
 };
 const next=locale==='vi'?'en':'vi';await chooseLocale(next);
 await verify(`location.pathname==='/${next}/${page}'&&document.documentElement.lang==='${next}'`,'locale keeps page');
 await evaluate('history.back()');await pause(350);await verify(`location.pathname==='/${locale}/${page}'`,'Back locale');
 await evaluate('history.forward()');await pause(350);await verify(`location.pathname==='/${next}/${page}'`,'Forward locale');
 await send('Page.reload');await pause(1200);await verify(`location.pathname==='/${next}/${page}'&&document.documentElement.lang==='${next}'`,'reload locale');
 await chooseLocale(locale);
 if(['terms','privacy','guide'].includes(page)){
  await verify(`!document.querySelector('.az-navbar [aria-current]')`,'neutral header');
  const toc=page==='guide'?'.guide-toc':'.legal-toc';
  if(width<960)await click(toc+' summary');
  if(page==='guide'){
   await evaluate(`(()=>{const i=document.querySelector('.guide-search input');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(i,'zzzz-no-match');i.dispatchEvent(new Event('input',{bubbles:true}))})()`);await pause(100);
   await verify(`!!document.querySelector('.guide-no-results')`,'search empty result');
   await evaluate(`(()=>{const i=document.querySelector('.guide-search input');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(i,'');i.dispatchEvent(new Event('input',{bubbles:true}))})()`);await pause(100);
  }
  const anchor=await evaluate(`document.querySelectorAll('${toc} a')[2].hash`);
  await click(toc+' a',2);await pause(650);
  await verify(`location.hash===${JSON.stringify(anchor)}`,'TOC anchor');
  await verify(`(()=>{const r=document.getElementById(${JSON.stringify(anchor.slice(1))}).getBoundingClientRect();return r.top>=75&&r.top<innerHeight})()`,'TOC target visible');
  if(width<960)await verify(`!document.querySelector('${toc}').open`,'TOC closes');
  await send('Page.reload');await pause(1200);await verify(`location.hash===${JSON.stringify(anchor)}`,'deep link reload');
  evidence.push(await screenshot(name+'-toc','details'));
  if(page==='guide'){
   await click('.guide-figure img');await verify(`!!document.querySelector('.guide-lightbox[open]')`,'lightbox opens');
   evidence.push(await screenshot(name+'-lightbox','details'));
   await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await pause(100);
   await verify(`!document.querySelector('.guide-lightbox')&&document.activeElement.matches('.guide-figure img')`,'lightbox Escape focus restore');
  }
 }
 if(page==='pricing')await verify(`document.querySelector('.az-navbar [aria-current="page"]')?.getAttribute('href')==='/${locale}/pricing'`,'pricing active');
 if(page===''){
  await evaluate(`document.getElementById('contact').scrollIntoView({behavior:'instant'})`);await pause(500);
  const previous=await evaluate('location.href');await click('#contact button',0);
  await verify(`location.href!==${JSON.stringify(previous)}||!!document.querySelector('dialog[open]')`,'EXPERIENCE_CTA_INERT');
  evidence.push(await screenshot(name+'-cta','details'));
 }
 results.push({route:`/${locale}/${page}`,locale,width,height,status:issues.length?'FAIL':'PASS',issues,checks,evidence});save();console.log(`${phase} ${name} journeys: ${issues.join(', ')||'PASS'}`);
}
if(mode==='led')for(const locale of ['vi','en'])for(const [width,height] of [[393,852],[852,393]]){
 await setup(width,height,true);await navigate(`/${locale}/`);await ready();
 const evidence=[],issues=[];
 const sample=await evaluate(`new Promise(resolve=>{const start=performance.now();let frames=0,minOpacity=1,minHalo=1,maxHalo=0;function tick(){const b=document.querySelector('.az-product-badge');for(const e of [b,...b.querySelectorAll('.az-product-aez,.az-product-check,.az-product-pro,.az-product-pro-text')])minOpacity=Math.min(minOpacity,+getComputedStyle(e).opacity);const halo=+getComputedStyle(b,'::before').opacity;minHalo=Math.min(minHalo,halo);maxHalo=Math.max(maxHalo,halo);frames++;if(performance.now()-start>=10200)resolve({frames,minOpacity,minHalo,maxHalo});else requestAnimationFrame(tick)}tick()})`);
 if(sample.minOpacity!==1||sample.minHalo>.05||sample.maxHalo<.95)issues.push('LED_CONTINUITY');
 for(const [level,time] of [['minimum',0],['maximum',1200]]){
  await evaluate(`document.getAnimations().filter(a=>a.animationName==='mobileSignHalo').forEach(a=>{a.pause();a.currentTime=${time}})`);
  evidence.push(await screenshot(`led-${locale}-${width}-${level}`,'details'));
 }
 await evaluate(`document.getAnimations().filter(a=>a.animationName==='mobileSignHalo').forEach(a=>a.play())`);
 await evaluate(`scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'})`);await pause(150);await evaluate(`scrollTo({top:0,behavior:'instant'})`);await pause(250);
 evidence.push(await screenshot(`led-${locale}-${width}-normal`,'details'));
 await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await pause(250);
 const reduced=await evaluate(`!document.getAnimations().some(a=>a.animationName==='mobileSignHalo')&&getComputedStyle(document.querySelector('.az-product-check')).opacity==='1'`);
 if(!reduced)issues.push('LED_REDUCED_MOTION');
 evidence.push(await screenshot(`led-${locale}-${width}-reduced`,'details'));
 await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
 results.push({route:`/${locale}/`,locale,width,height,touch:true,sample,reduced,status:issues.length?'FAIL':'PASS',issues,evidence});save();console.log(`LED ${locale} ${width}: ${issues.join(', ')||'PASS'}`);
}
if(mode==='led-reference')for(const locale of ['vi','en']){
 await setup(1440,1000,false);await navigate(`/${locale}/`);await ready();
 await evaluate(`document.querySelectorAll('.az-sign-motion,.az-product-badge,.az-product-badge *').forEach(e=>e.getAnimations().forEach(a=>{a.pause();a.currentTime=1200}))`);
 const desktop=await evaluate(`['.az-sign-motion','.az-product-badge','.az-product-aez','.az-product-check','.az-product-pro','.az-product-pro-text'].map(q=>{const s=getComputedStyle(document.querySelector(q));return {q,opacity:s.opacity,filter:s.filter,animation:s.animation,background:s.background,color:s.color,shadow:s.boxShadow,textShadow:s.textShadow,width:s.width,height:s.height,transform:s.transform}})`);
 const unchanged=JSON.stringify(desktop)===JSON.stringify(JSON.parse(fs.readFileSync('artifacts/mobile-led/desktop-before.json','utf8')));
 const ratio=await evaluate(`parseFloat(getComputedStyle(document.querySelector('.az-product-name')).width)/parseFloat(getComputedStyle(document.querySelector('.az-product-badge')).width)`);
 results.push({route:`/${locale}/`,locale,width:1440,height:1000,status:unchanged?'PASS':'FAIL',issues:unchanged?[]:['DESKTOP_LED_REGRESSION'],ratio,desktop,evidence:[await screenshot(`led-${locale}-desktop-reference`,'details')]});save();console.log(`desktop LED ${locale}: ${unchanged?'PASS':'FAIL'}`);
}
if(mode==='cta')for(const locale of ['vi','en'])for(const [width,height] of [[393,852],[768,1024],[1440,900]]){
 await setup(width,height,width===393);await navigate(`/${locale}/`);await ready();const issues=[],evidence=[];
 await evaluate(`document.querySelector('#contact a').scrollIntoView({block:'center',behavior:'instant'})`);await pause(100);
 evidence.push(await screenshot(`cta-${locale}-${width}-before-click`,'details'));
 const rect=await evaluate(`(()=>{const r=document.querySelector('#contact a').getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2}})()`);
 if(width===393){await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[rect]});await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]})}
 else {await send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...rect});await send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...rect})}
 await pause(1500);
 const state=await evaluate(`(()=>{const r=document.getElementById('features').getBoundingClientRect();return {path:location.pathname,hash:location.hash,top:r.top,header:document.querySelector('.az-navbar').getBoundingClientRect().bottom,active:document.querySelector('.az-navbar [aria-current]')?.getAttribute('href'),scroll:document.documentElement.scrollWidth,width:innerWidth,hero:document.querySelector('.az-hero-primary').getAttribute('href'),finalButton:document.querySelector('#contact button').outerHTML}})()`);
 if(state.path!==`/${locale}/`||state.hash!=='#features'||state.top<state.header-1||state.top>state.header+60||state.active!==`/${locale}/#features`||state.scroll>state.width+1)issues.push('EXPLORE_FEATURES_CTA');
 evidence.push(await screenshot(`cta-${locale}-${width}-destination`,'details'));
 results.push({route:`/${locale}/`,locale,width,height,status:issues.length?'FAIL':'PASS',issues,state,evidence});save();console.log(`CTA ${locale} ${width}: ${issues.join(', ')||'PASS'}`);
}
if(mode==='input')for(const locale of ['vi','en'])for(const page of pages){
 await setup(393,852,true);await navigate(`/${locale}/${page}`);await ready();const issues=[],evidence=[],checks=[];
 const verify=async(expression,label)=>{const pass=await evaluate(expression);checks.push({label,pass});if(!pass)issues.push(label)};
 const tap=async selector=>{const point=await evaluate(`(()=>{const r=document.querySelector('${selector}').getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2}})()`);await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point]});await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await pause(250)};
 await tap('#mobile-menu-toggle');await verify(`document.getElementById('mobile-menu-toggle').getAttribute('aria-expanded')==='true'`,'touch menu');
 await tap('.az-mobile-utilities .az-language-button');await verify(`(()=>{const e=document.querySelector('.az-mobile-utilities .az-language-menu');if(!e)return false;const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.bottom<=innerHeight})()`,'touch dropdown fits');
 evidence.push(await screenshot(`input-${locale}-${page||'landing'}`,'details'));
 for(const key of ['Escape','Escape']){await send('Input.dispatchKeyEvent',{type:'keyDown',key,code:key,windowsVirtualKeyCode:27});await send('Input.dispatchKeyEvent',{type:'keyUp',key,code:key,windowsVirtualKeyCode:27});await pause(100)}
 await verify(`document.getElementById('mobile-menu-toggle').getAttribute('aria-expanded')==='false'&&document.activeElement.id==='mobile-menu-toggle'`,'Escape closes and restores focus');
 await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r',unmodifiedText:'\r'});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});await pause(100);
 await verify(`document.getElementById('mobile-menu-toggle').getAttribute('aria-expanded')==='true'`,'keyboard menu');
 await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
 await verify(`document.activeElement.matches('#mobile-navigation a')`,'Tab reaches navigation');
 await tap('.az-mobile-links a[href="/'+locale+'/#shield"]');await pause(1100);
 await verify(`location.pathname==='/${locale}/'&&location.hash==='#shield'&&document.getElementById('mobile-menu-toggle').getAttribute('aria-expanded')==='false'`,'subpage touch link and menu closes');
 await verify(`document.querySelectorAll('.benefit-glass-card').length===4`,'four benefits');
 results.push({route:`/${locale}/${page}`,locale,width:393,height:852,touch:true,status:issues.length?'FAIL':'PASS',issues,checks,evidence});save();console.log(`input ${locale}/${page}: ${issues.join(', ')||'PASS'}`);
}
if(mode==='visuals')for(const locale of ['vi','en'])for(const [width,height] of [[393,852],[1440,900]]){
 await setup(width,height,width===393);await navigate(`/${locale}/`);await ready();
 const evidence=[];
 const selectors=['#hero','.eco-flow','.challenge-grid','.spot-visual','.cc-stack','#shield','.benefit-glass-card','#contact'];
 for(const selector of selectors){
  if(!await evaluate(`!!document.querySelector('${selector}')`))continue;
  await evaluate(`document.querySelector('${selector}').scrollIntoView({block:'start',behavior:'instant'});scrollBy(0,-100)`);await pause(650);
  evidence.push(await screenshot(`${locale}-${width}-${selector.replace(/[^a-z-]/g,'')}`,'details'));
 }
 results.push({locale,width,height,evidence});save();
}
save();socket.close();
if(process.argv.includes('--isolated'))await fetch('http://localhost:9338/json/close/'+target.id);
