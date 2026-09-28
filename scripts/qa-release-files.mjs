import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { execFileSync } from 'node:child_process'
const root='.qa/release/2026-09-29-build',phase=process.argv[2]||'before'
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)])
const files=walk('dist').map(file=>({path:file.replaceAll('\\','/'),bytes:fs.statSync(file).size,sha256:crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')}))
const sensitive=[]
for(const file of files){
 if(/\.(js|html|json|txt|css|map|env)$/.test(file.path)){
  const text=fs.readFileSync(file.path,'utf8')
  for(const [kind,pattern] of Object.entries({privateKey:/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,awsAccess:/AKIA[0-9A-Z]{16}/,githubToken:/gh[pousr]_[A-Za-z0-9]{30,}/,jwt:/eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/}))if(pattern.test(text))sensitive.push({path:file.path,kind,value:'[REDACTED — review required]'})
 }
}
const suspicious=files.filter(f=>/(\.pdf$|\.map$|\.env|\/\.qa\/|\.log$|extracted|report\.html)/i.test(f.path))
const sourceFiles=['package.json','vite.config.ts','index.html',...walk('src')];const sourceHash=crypto.createHash('sha256');for(const f of sourceFiles.sort())sourceHash.update(f).update(fs.readFileSync(f))
const result={builtAt:fs.statSync('dist/index.html').mtime.toISOString(),commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),workingTree:execFileSync('git',['status','--short'],{encoding:'utf8'}),sourceHash:sourceHash.digest('hex'),buildHash:crypto.createHash('sha256').update(JSON.stringify(files)).digest('hex'),files,suspicious,sensitive,rawHTML:fs.readFileSync('dist/index.html','utf8'),robots:fs.existsSync('dist/robots.txt')?fs.readFileSync('dist/robots.txt','utf8'):null}
fs.writeFileSync(`${root}/${phase}-files.json`,JSON.stringify(result,null,2));console.log({files:files.length,suspicious:suspicious.map(f=>f.path),secretPatternMatches:sensitive.length,buildHash:result.buildHash})
