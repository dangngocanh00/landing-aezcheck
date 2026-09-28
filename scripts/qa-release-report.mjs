import fs from 'node:fs'
const root='.qa/release/2026-09-29-build'
const read=name=>JSON.parse(fs.readFileSync(`${root}/${name}`,'utf8'))
const build=read('after-files.json'), browser=read('after-browser.json')
const lh=read('lighthouse-summary.json')
const interactionFiles=fs.readdirSync(root+'/interactions').filter(f=>f.startsWith('after-')&&f.endsWith('.json'))
const interactions=interactionFiles.flatMap(file=>read('interactions/'+file).results.map(r=>({...r,suite:file})))
const originalExtras=read('extras.json')
const navigationRetest=read('navigation-retest.json')
const extras={...originalExtras,results:[...originalExtras.results.filter(r=>r.kind!=='navigation-click'),...navigationRetest.results],navigationRetestSource:'navigation-retest.json',originalSource:'extras.json'}
const finalMetadata=read('final-metadata.json')
const counts=rows=>Object.fromEntries(['PASS','FAIL','BLOCKED','NOT RUN'].map(s=>[s,rows.filter(r=>r.status===s).length]))
const blockers=[
 {id:'R01',severity:'P1',status:'BLOCKED',issue:'Experience CTA has no approved destination. Hero/Pricing point at #contact; final button has no action. Do not count contact scrolling as signup success.',owner:'Product owner: supply actual URL/action.'},
 {id:'R02',severity:'P1',status:'BLOCKED',issue:'Guide source screenshots contain account identifiers/contact data. Publication permission not supplied.',owner:'Product owner: approve or supply approved redacted source.'},
 {id:'R03',severity:'P2',status:'BLOCKED',issue:'Production domain and staging URL absent; canonical, hreflang, sitemap and hosting behavior cannot be finalized. Existing noindex and robots Disallow remain unchanged.',owner:'Product/deployment owner.'},
 {id:'R04',severity:'P2',status:'BLOCKED',issue:'Three explicit unconfirmed content placeholders remain in each Guide locale. Commercial/legal claims require owner approval.',owner:'Content owner.'},
 {id:'R05',severity:'P2',status:'FAIL',issue:'Unknown route displays correct client 404 but Vite SPA fallback returns HTTP 200; crawler-facing metadata remains generic raw HTML across routes.',owner:'Deployment/SEO configuration once hosting/domain is confirmed.'},
 {id:'R06',severity:'P2',status:'FAIL',issue:'Guide desktop Lighthouse CLS is 0.1405 (improved from 0.5477 but above the good 0.1 threshold). Mobile targeted CLS is below 0.002. Desktop loading-layout tuning remains.',owner:'Frontend performance follow-up.'},
]
const fixes=[
 ['F01','P1','Unknown routes incorrectly became homepage','src/landing-navigation.ts; src/i18n/LanguageContext.tsx; src/App.tsx','Open /vi/not-a-page or /en/not-a-page: expected 404, previously homepage. Preserve invalid path, show localized 404 and neutral header.','before-browser.json; extras.json; screenshots/route--vi-not-a-page.png'],
 ['F02','P2','1.1 MB logo downloaded for tiny header','assets/logo-removebg-128.png; assets/logo-removebg-640.png; Brand.tsx; DecorativeLogoScene.tsx','Load landing cold: use size-appropriate transparent derivatives of the original logo; keep original unchanged. Header asset now 26,648 bytes.','lighthouse/before-vi-mobile-1.report.html; lighthouse/after-vi-mobile-1.report.html'],
 ['F03','P2','Missing main landmark / skip navigation','src/App.tsx; src/index.css','Navigate landing with keyboard/axe: add main landmark and focus-visible skip link. No visual redesign.','Lighthouse before/after accessibility; interaction keyboard results'],
 ['F04','P2','Invalid pricing definition-list structure','src/components/PricingPage.tsx; src/components/pricing-page.css','Run axe on Pricing: direct dt/dd semantics were invalid. Correct dl grouping, retain layout and resource limits.','lighthouse/after-vi-pricing-mobile-1.report.html; lighthouse/pricingfix-vi-pricing-mobile-1.report.html'],
 ['F05','P2','Guide lazy fallback caused large cold-load shift','src/App.tsx','Cold-load Guide EN/VI: short loading placeholder exposed footer before content arrived. Reserve viewport-height loading area.','lighthouse/after-en-guide-mobile-1.report.html; lighthouse/guidefix-en-guide-mobile-1.report.html'],
 ['F06','P2','Generic scaffold metadata, favicon 404 and language accessible name','src/components/PageMetadata.tsx; index.html; .figma/make/site.json; src/components/LandingOpening.tsx','Check head/resource requests: set approved brand static description, client per-page locale metadata, actual favicon and visible locale in accessible name. Keep noindex.','before-browser.json; after-browser.json; Lighthouse guidefix desktop'],
]
const groups=[]
for(const route of ['vi','en','vi-pricing','en-pricing','vi-guide','en-guide']){
 const phase=route.includes('pricing')?'pricingfix':route.includes('guide')?'guidefix':'after'
 const rows=lh.filter(x=>x.file.startsWith(`${phase}-${route}-mobile-`))
 const metric=k=>{const v=rows.map(r=>k==='score'?r.scores.performance*100:r.metrics[k]).sort((a,b)=>a-b);return {median:v[Math.floor(v.length/2)],min:v[0],max:v.at(-1)}}
 groups.push({route,phase,runs:rows.length,performance:metric('score'),lcp:metric('largest-contentful-paint'),cls:metric('cumulative-layout-shift'),tbt:metric('total-blocking-time'),fcp:metric('first-contentful-paint'),bytes:metric('total-byte-weight')})
}
const inspected=fs.existsSync(root+'/visual-review.json')?read('visual-review.json'):[]
const result={build:{hash:build.buildHash,commit:build.commit,sourceHash:build.sourceHash,builtAt:build.builtAt,baseUrl:browser.baseUrl},engine:'Chromium 153.0.8010.54 / Lighthouse 13.5.0 (axe-core 4.13.0)',matrix:{planned:20,executed:browser.rows.length,counts:counts(browser.rows),rows:browser.rows},interactions:{counts:counts(interactions),rows:interactions},extras,blockers,fixes,performance:groups,lighthouseReports:lh.length,visualReview:inspected,checks:{build:'PASS',typecheck:'PASS',lint:'NOT RUN — no lint script/config',webkit:'NOT RUN — not installed',firefox:'NOT RUN — not installed',physicalDevices:'NOT RUN — unavailable',staging:'BLOCKED — no URL supplied'},security:{outputFiles:build.files.length,suspiciousFiles:build.suspicious,secretPatternMatches:build.sensitive},runtimeErrors:browser.errors,resourceErrors:browser.responseErrors}
result.finalMetadata=finalMetadata
result.matrix.buildHash=browser.buildHash
fs.writeFileSync(root+'/results.json',JSON.stringify(result,null,2))
const table=browser.rows.map(r=>`| ${r.page} | ${r.locale} | ${r.width} × ${r.width===393?852:900} | Chromium | ${r.status} | [image](${r.screenshot}) |`).join('\n')
const perf=groups.map(g=>`| ${g.route} | ${g.phase} | ${g.runs} | ${g.performance.median} (${g.performance.min}–${g.performance.max}) | ${(g.lcp.median/1000).toFixed(2)} | ${g.cls.median.toFixed(4)} | ${Math.round(g.tbt.median)} | ${(g.fcp.median/1000).toFixed(2)} | ${Math.round(g.bytes.median/1024)} |`).join('\n')
const md=`# AezCheck pre-release QA — 2026-09-29

## Release decision

Local production-build smoke coverage: ${JSON.stringify(counts(browser.rows))}, ${browser.rows.length}/20 cases executed. This is not public-release approval. Staging is untested; the blockers below remain. Existing responsive evidence in ../../responsive/2026-09-29-audit/ is retained, not recounted as new build cases.

Local rendering/navigation scope passes; overall functional release remains incomplete because the experience CTA has no destination. Four failed interaction cases reproduce that same issue. Staging has not been tested. Public release is blocked by the owner/deployment decisions listed below.

## Source and environment

- Commit: \`${build.commit}\`, with pre-existing uncommitted work preserved.
- Final source hash: \`${build.sourceHash}\`.
- Final dist hash: \`${build.buildHash}\`; built ${build.builtAt}.
- Production preview: ${browser.baseUrl}; Vite build assets, not localhost:8443 dev server. No dev modules counted as production evidence.
- Chromium 153.0.8010.54 on Windows, headless CDP; Lighthouse 13.5.0 / axe-core 4.13.0. Mobile/touch is emulation, not real iPhone/Safari.
- Build PASS; TypeScript noEmit PASS. Lint NOT RUN: package has format but no lint command/config. No commit/push/deploy.

## Executed coverage

- Core matrix: 5 pages × VI/EN × 393×852 and 1440×900 =20; fresh tabs, reload, locale switch/reload, back/forward, content identity, lazy images, overflow, footer targets and asset responses.
- Interaction suites: ${interactions.length} records; ${JSON.stringify(counts(interactions))}. See individual interactions/after-*.json for assertions and evidence; counts are suite cases, not individual assertions.
- Extras: ${extras.results.length} records; ${JSON.stringify(counts(extras.results))}: invalid/legacy routes, deep hashes, slow cold loading and attempted true browser zoom.
- Lighthouse: ${lh.length} separate reports (3 baseline +21 optimized matrix +7 Pricing retests +7 Guide retests). Retries/retests are measurements, not additional unique release matrix passes.
- Runtime errors in final matrix: ${browser.errors.length}; failed/MIME-invalid resource responses: ${browser.responseErrors.length}.
- One extras run was interrupted by a QA-script empty-hash TypeError. Corrected the script and reran extras; interrupted observations are not counted as passes. Extras and metadata checks use the final metadata-corrected build.
- Navigation geometry was retested against the actual section heading, not its padded wrapper top. Hero intentionally starts at page top; the acceptance requirement is visible content below the sticky header. Original wrapper-only measurements are preserved in extras.json; navigation-retest.json supplies final navigation results after fonts settle. No route/click/heading visibility assertion was removed.
- Direct visual review: ${inspected.length} screenshots, listed in visual-review.json. Other screenshots are evidence captured automatically, not claimed individually inspected.

| Page | Locale | Viewport | Browser | Result | Evidence |
|---|---|---|---|---|---|
${table}

## Defects corrected and retested

${fixes.map(([id,severity,issue,file,fix,evidence])=>`### ${id} — ${severity} — ${issue}\n\nFiles: ${file}.\n\n${fix}\n\nEvidence/retest: ${evidence}. Browser baseline and final matrix, plus targeted Lighthouse phases, retain before/after results.\n`).join('\n')}

## Performance: simulated lab measurements

| Route | Phase | Mobile runs | Performance median (range) | LCP s | CLS | TBT ms | FCP s | KiB transferred |
|---|---|---|---|---|---|---|---|---|
${perf}

Baseline VI landing mobile performance was 67/67/67 with LCP about9s and 1.4MB transfer. Logo optimization substantially reduces transfer; no decorative sections, effects or Guide screenshots were removed. Guide cold-load CLS before correction was about0.71. Latest guidefix reports show the result after reserving loading height.

Every HTML/JSON report includes exact throttling, viewport, CPU slowdown, browser version, failed audits, LCP element and heavy requests. Summary: lighthouse-summary.json. Default simulated mobile throttling with requested 393×852; desktop uses Lighthouse desktop preset. No concurrent browser QA during measurements. These are local lab results, not field Core Web Vitals/INP or production network results.

Separate cold-load interaction probes in extras.json use actual CDP network throttling (150ms,1.6384Mbps down,750Kbps up), CPU4x, cleared cache and reduced motion. Early menu responses passed on VI Landing/Pricing/Guide; zero service-worker registrations were observed. These probes do not replace the six-route Lighthouse matrix or establish default-motion field performance. Desktop Lighthouse latest: Landing98, Pricing97, Guide91; accessibility100 in targeted latest runs. Detailed outstanding performance audits remain in the reports.

Build association: before→before-files.json; after→optimized-build-files.json; pricingfix→pricing-build-files.json; guidefix and20-case matrix/interactions→validated-build-files.json. A final metadata-selector-only correction is in after-files.json and retested on all10 routes in final-metadata.json (${JSON.stringify(counts(finalMetadata.results))}). Landing/Pricing performance from earlier phases is not mislabeled as remeasured final-bundle performance; subsequent changes were Guide loading space, language accessible name and metadata selection.

## Open issues / owner decisions

${blockers.map(b=>`- **${b.id} ${b.severity} ${b.status}:** ${b.issue} ${b.owner}`).join('\n')}

- NOT RUN: WebKit/Firefox (not installed), physical devices, real Safari, screen reader. Genuine200% browser zoom result is recorded in extras.json; no CSS/pinch zoom substitute counts as pass.
- BLOCKED: staging/hosting/cache/CDN/HTTPS checks require URL/config. Local unknown-route HTTP200 is separately recorded from client404 UI.
- No canonical/hreflang/domain guessed. Raw HTML remains one SPA shell; rendered locale-specific titles/descriptions improve browser metadata but do not guarantee non-JS crawler/social previews. Noindex was intentionally preserved.
- SEO details: all10 rendered titles are distinct and descriptions are locale-aware after the final correction. Raw HTML title is AezCheck, lang=en, with a shared Vietnamese brand description; JavaScript updates locale and page metadata. Canonical/hreflang/sitemap/og:url/og:image are absent pending approved domain/social asset configuration. Lighthouse SEO66 is not a public SEO pass (noindex is deliberate).
- Remaining desktop Guide CLS is attributable mainly to the decorative global color band shifting as document height grows (remaining-cls.json). It is not claimed fixed by the mobile fallback improvement. Font-related header shift in that run was only about0.00025.

## Content, assets and safety

20 Guide WebP assets exist at exact-case manifest paths. Guide source order, captions, tips, steps and screenshots were retained. Per-page DOM counts and image decode results are in after-browser.json. Free limits remain1/2/3/5/75/50. Source screenshots containing identifiers were not copied into this report. Review content-security.json and manual-checklist.md before publication.

Dist inventory: ${build.files.length} files; suspicious PDF/maps/env/log/QA files: ${build.suspicious.length}; secret-pattern matches: ${build.sensitive.length}. This limited pattern scan is not a comprehensive security audit. No secret values logged. QA stays outside runtime assets. No service-worker cache is expected; cold-load observations record registrations. Build-time FIGMA_PUBLIC_URL is a base path setting, not an approved canonical domain.

## Rerun commands (PowerShell, project root)

\`\`\`powershell
pnpm.cmd build
pnpm.cmd exec tsc --noEmit
pnpm.cmd run preview --host 127.0.0.1 --port 4173 --strictPort
# Use existing Chromium CDP endpoint localhost:9338; run browser suites sequentially.
node scripts/qa-release-files.mjs after
node scripts/qa-release-matrix.mjs
foreach ($mode in @('details','journeys','input','led','led-reference','cta')) { node scripts/qa-release-interactions.mjs after $mode --isolated }
node scripts/qa-release-extras.mjs
node scripts/qa-release-navigation.mjs
node scripts/qa-release-metadata.mjs
# Run Lighthouse separately, without simultaneous browser suites.
powershell -ExecutionPolicy Bypass -File scripts/qa-release-lighthouse.ps1 -Phase after
node scripts/qa-release-lighthouse-summary.mjs
node scripts/qa-release-report.mjs
\`\`\`

Physical-device, staging and owner-approval checklist: [manual-checklist.md](manual-checklist.md). Machine-readable details: [results.json](results.json).
`
fs.writeFileSync(root+'/report.md',md)
console.log({matrix:result.matrix.counts,interactions:result.interactions.counts,extras:counts(extras.results),reports:lh.length})
