import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'

const root = 'src'
const strings = new Set()
const add = value => {
  const s = value.trim().replace(/\s+/g, ' ')
  if (!s || !/\p{L}/u.test(s) || /^(https?:|data:|\/|\.\.?\/|#|@)/.test(s)) return
  if (/\b(?:px-|py-|gap-|items-|justify-|bg-|text-\[|rounded-|border-|font-(?:bold|semibold)|max-w-|min-w-|w-\d|h-\d)|var\(--/.test(s)) return
  if (/^[Mm][\d .,-]+[A-Za-z\d .,-]*$/.test(s)) return
  if (s.includes(' ') || /^[a-z]{3,}$/.test(s) || /[A-Z\u00c0-\u024f\u1e00-\u1eff]/.test(s)) strings.add(s)
}
function scan(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name)
    if (entry.isDirectory()) { if (entry.name !== 'generated') scan(file); continue }
    if (/\.(ts|tsx)$/.test(file)) {
      const source = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true)
      function visit(node) {
        if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isJsxText(node)) add(node.text)
        ts.forEachChild(node, visit)
      }
      visit(source)
    }
    // New locales derive from the English guide; the Vietnamese guide remains independent.
    if (file.endsWith('en.json')) {
      function walk(value, key) {
        if (typeof value === 'string' && ['text', 'title'].includes(key)) add(value)
        else if (value && typeof value === 'object') Object.entries(value).forEach(([k,v]) => walk(v,k))
      }
      walk(JSON.parse(fs.readFileSync(file, 'utf8')))
    }
  }
}
scan(root)
fs.mkdirSync('src/i18n/generated', { recursive: true })
fs.writeFileSync('src/i18n/generated/source.json', JSON.stringify([...strings], null, 2))
if (process.argv.includes('--extract')) { console.log(`${strings.size} source strings`); process.exit() }
const locales = ['ru', 'zh', 'th', 'lo']
if (process.argv.includes('--prune')) {
  for (const locale of locales) {
    const file = `src/i18n/generated/${locale}.json`
    const catalog = JSON.parse(fs.readFileSync(file, 'utf8'))
    const entries = Object.entries(catalog).filter(([key]) => strings.has(key)).sort(([a],[b]) => a.localeCompare(b))
    fs.writeFileSync(file, JSON.stringify(Object.fromEntries(entries), null, 2) + '\n')
    console.log(`${locale}: ${entries.length} strings`)
  }
  process.exit()
}
for (const locale of locales) {
  const file = `src/i18n/generated/${locale}.json`
  const catalog = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {}
  const sourceLanguage = s => /[\u0102-\u01b0\u1ea0-\u1ef9]/.test(s) ? 'vi' : 'en'
  const glossary = ['Agency Workspace', 'AezCheck', 'TKQC', 'VIA', 'BM', 'Shield']
  const missing = [...strings].filter(s => !catalog[s] || (process.argv.includes('--refresh-source') && (sourceLanguage(s) === 'vi' || glossary.some(term => s.includes(term)))))
    .sort((a,b) => sourceLanguage(a).localeCompare(sourceLanguage(b)))
  const batches = []
  let batch = [], size = 0
  for (const s of missing) {
    if (batch.length && (size + s.length > 2200 || sourceLanguage(s) !== sourceLanguage(batch[0]))) { batches.push(batch); batch = []; size = 0 }
    batch.push(s); size += s.length + 2
  }
  if (batch.length) batches.push(batch)
  let cursor = 0, done = 0
  async function translate(text, sl) {
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        const url = new URL('https://translate.googleapis.com/translate_a/single')
        let protectedText = text
        glossary.forEach((term,i) => { protectedText = protectedText.replace(new RegExp(`\\b${term}\\b`, 'g'), `ZXQ${i}QXZ`) })
        url.search = new URLSearchParams({ client: 'gtx', sl, tl: locale, dt: 't', q: protectedText }).toString()
        const response = await fetch(url, { signal: AbortSignal.timeout(45000) })
        if (!response.ok) throw Error(`HTTP ${response.status}`)
        const data = await response.json()
        let result = data[0].map(s => s[0] ?? '').join('')
        glossary.forEach((term,i) => { result = result.replace(new RegExp(`ZXQ\\s*${i}\\s*QXZ`, 'gi'), term) })
        if (/ZXQ\s*\d/i.test(result)) throw Error('Unresolved glossary token')
        return result
      } catch (error) { if (attempt === 4) throw error; await new Promise(r => setTimeout(r, 1500 * (attempt + 1))) }
    }
  }
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (cursor < batches.length) {
      const values = batches[cursor++]
      const sl = sourceLanguage(values[0])
      const translated = (await translate(values.join('\n\n'), sl)).split(/\n\s*\n/)
      if (translated.length === values.length) values.forEach((s,i) => { catalog[s] = translated[i].trim() })
      else for (const s of values) catalog[s] = (await translate(s, sl)).trim()
      fs.writeFileSync(file, JSON.stringify(catalog, null, 2) + '\n')
      console.log(`${locale}: ${++done}/${batches.length}`)
    }
  }))
}
