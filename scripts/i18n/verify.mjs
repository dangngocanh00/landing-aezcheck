import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createServer } from 'vite'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const server = await createServer({ server: { middlewareMode: true, watch: null, hmr: false }, appType: 'custom' })
globalThis.localStorage = { getItem: () => null, setItem() {} }
globalThis.document = { documentElement: { lang: 'en', dataset: {} } }
globalThis.window = { location: { pathname: '/', hash: '' }, matchMedia: () => ({ matches: false }), innerWidth: 1440 }
try {
  const { LanguageProvider } = await server.ssrLoadModule('/src/i18n/LanguageContext.tsx')
  const { ThemeProvider } = await server.ssrLoadModule('/src/theme/ThemeContext.tsx')
  const { default: App } = await server.ssrLoadModule('/src/App.tsx')
  const { GuidePage } = await server.ssrLoadModule('/src/pages/GuidePage.tsx')
  const { loadCatalog, translateText } = await server.ssrLoadModule('/src/i18n/localize.ts')
  const { getSiteRoute, siteDestination } = await server.ssrLoadModule('/src/landing-navigation.ts')
  const { getGuideContent } = await server.ssrLoadModule('/src/content/guide/index.ts')
  const scripts = { ru: /[А-Яа-я]/, zh: /[\u4e00-\u9fff]/, th: /[\u0e00-\u0e7f]/, lo: /[\u0e80-\u0eff]/ }
  const results = []
  const englishText = new Map()
  fs.mkdirSync('.qa/i18n', { recursive: true })
  for (const locale of ['vi','en','ru','zh','th','lo']) {
    await loadCatalog(locale)
    for (const page of ['home','pricing','guide','terms','privacy']) {
      const pathname = siteDestination(locale,page)
      const route = getSiteRoute('', pathname)
      assert.equal(route.locale,locale)
      assert.equal(route.page,page)
      assert.equal(route.found,true)
      window.location = { pathname, hash: '' }
      const child = React.createElement(page === 'guide' ? GuidePage : App)
      const html = renderToStaticMarkup(React.createElement(ThemeProvider, null, React.createElement(LanguageProvider, null, child)))
      const text = html.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ')
      assert.ok(text.length > 100, `${locale}/${page}: rendered content`)
      if (scripts[locale]) assert.match(text, scripts[locale], `${locale}/${page}: translated content`)
      assert.ok(!html.includes('undefined'), `${locale}/${page}: undefined content`)
      const sentences = [...html.matchAll(/>([^<>]+)</g)].map(match => match[1].trim()).filter(value => value.length > 30 && value.split(/\s+/).length >= 5 && /[A-Za-z]/.test(value))
      if (locale === 'en') englishText.set(page, sentences)
      if (scripts[locale]) for (const sentence of englishText.get(page)) {
        assert.ok(!html.includes(`>${sentence}<`), `${locale}/${page}: untranslated sentence ${sentence.slice(0,80)}`)
      }
      fs.writeFileSync(`.qa/i18n/${locale}-${page}.html`,html)
      results.push({ locale,page,textLength:text.length })
    }
    if (scripts[locale]) {
      const catalog = JSON.parse(fs.readFileSync(`src/i18n/generated/${locale}.json`, 'utf8'))
      assert.ok(!Object.values(catalog).some(value => /ZXQ\s*\d/i.test(value)), `${locale}: glossary placeholders resolved`)
      for (const term of ['AezCheck','AEZ','CHECK','PRO','VIA','BM','TKQC']) assert.equal(translateText(term,locale),term)
      const guide = getGuideContent(locale)
      assert.equal(guide.locale,locale)
      assert.match(guide.title,scripts[locale])
      assert.equal(guide.modules.length,getGuideContent('en').modules.length)
      assert.equal(guide.modules[0].id,getGuideContent('en').modules[0].id)
      assert.notEqual(translateText('Select language',locale),'Select language')
    }
    assert.equal(getSiteRoute('', `/${locale}/unknown-page`).found,false)
    for (const page of ['home','pricing','guide','terms','privacy']) {
      const route = getSiteRoute(`#/` + locale + (page === 'home' ? '/' : '/' + page) + '#example')
      assert.equal(route.locale,locale)
      assert.equal(route.anchor,'example')
    }
  }
  fs.writeFileSync('.qa/i18n/results.json',JSON.stringify(results,null,2))
  console.log(`PASS: ${results.length} locale/page renders; all routes, guide structure and translation catalogs`)
} finally { await server.close() }
