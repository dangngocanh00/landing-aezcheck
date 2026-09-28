import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
const root='.qa/release/2026-09-29-build',combined={baseUrl:'http://127.0.0.1:4173',buildHash:JSON.parse(fs.readFileSync(root+'/after-files.json')).buildHash,rows:[],errors:[],responseErrors:[],assets:[]}
for(const width of [393,1440])for(const locale of ['vi','en'])for(const page of ['landing','pricing','guide','terms','privacy']){
 const run=spawnSync(process.execPath,['scripts/qa-release-browser.mjs','after',String(width),locale,page],{stdio:'inherit'});
 if(run.status!==0)throw Error(`Browser case failed ${width}/${locale}/${page}`)
 const data=JSON.parse(fs.readFileSync(`${root}/after-${width}-${locale}-${page}-browser.json`));
 for(const key of ['rows','errors','responseErrors','assets'])combined[key].push(...data[key]);
 fs.writeFileSync(root+'/after-browser.json',JSON.stringify(combined,null,2));
}
