import fs from 'node:fs'
const root='.qa/release/2026-09-29-build'
const rows=fs.readdirSync(root+'/lighthouse').filter(f=>f.endsWith('.report.json')).map(file=>{
 const d=JSON.parse(fs.readFileSync(root+'/lighthouse/'+file,'utf8'))
 return {file,url:d.finalDisplayedUrl,version:d.lighthouseVersion,environment:d.environment,config:d.configSettings,scores:Object.fromEntries(Object.entries(d.categories).map(([k,v])=>[k,v.score])),metrics:Object.fromEntries(['largest-contentful-paint','cumulative-layout-shift','total-blocking-time','first-contentful-paint','total-byte-weight'].map(k=>[k,d.audits[k].numericValue])),heaviest:[...d.audits['network-requests'].details.items].sort((a,b)=>b.transferSize-a.transferSize).slice(0,5),failures:Object.entries(d.audits).filter(([,v])=>v.score===0).map(([id,v])=>({id,title:v.title}))}
})
fs.writeFileSync(root+'/lighthouse-summary.json',JSON.stringify(rows,null,2))
console.log(`Summarized ${rows.length} Lighthouse reports`)
