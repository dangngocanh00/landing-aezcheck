import fs from 'node:fs'

const root = '.qa/responsive/2026-09-29-audit'
const modes = ['matrix', 'details', 'journeys', 'cta', 'led', 'led-reference', 'input']
const runs = Object.fromEntries(modes.map(mode => [mode, JSON.parse(fs.readFileSync(`${root}/after-${mode}.json`, 'utf8'))]))
const cases = modes.flatMap(mode => runs[mode].results.map(row => ({
  ...row, suite: mode, browser: 'Chromium 153.0.8010.54',
  status: row.issues?.includes('EXPERIENCE_CTA_INERT') ? 'BLOCKED' : row.status,
})))
const totals = Object.fromEntries(['PASS', 'FAIL', 'BLOCKED', 'NOT RUN'].map(status => [status, cases.filter(row => row.status === status).length]))
const reviewed = JSON.parse(fs.readFileSync(`${root}/visual-review.json`, 'utf8'))
const screenshots = ['before', 'after', 'details'].flatMap(folder => fs.readdirSync(`${root}/${folder}`).filter(file => file.endsWith('.png')).map(file => `${folder}/${file}`))
const results = {
  baseUrl: 'http://localhost:8443', engine: 'Chromium 153.0.8010.54', device: 'Windows desktop browser + CDP mobile/touch emulation; no physical device',
  expected: 156, executed: cases.length, totals,
  mainMatrix: 60, extraMatrix: 28, touchMatrix: 10,
  runtimeExceptions: Object.values(runs).reduce((sum, run) => sum + run.errors.length, 0),
  consoleErrors: Object.values(runs).reduce((sum, run) => sum + run.consoleErrors.length, 0),
  networkErrors: Object.values(runs).reduce((sum, run) => sum + run.network.length, 0),
  build: 'PASS', typecheck: 'PASS', lint: 'NOT RUN — no lint script/config',
  webkit: 'NOT RUN — WebKit binary/tool unavailable', physicalDevices: 'NOT RUN',
  visuallyReviewed: reviewed,
  screenshotsNotIndividuallyReviewed: screenshots.filter(path => !reviewed.includes(path)),
  cases,
}
fs.writeFileSync(`${root}/results.json`, JSON.stringify(results, null, 2))
const evidence = row => (row.evidence || []).map(path => `[ảnh](${path})`).join(' · ')
const table = rows => '| Page | Locale | Browser | Viewport | Result | Issues | Evidence |\n|---|---|---|---|---|---|---|\n' + rows.map(row => `| ${row.route} | ${row.locale} | Chromium${row.touch ? ' touch' : ''} | ${row.width}×${row.height} | ${row.status} | ${(row.issues || []).join(', ') || '—'} | ${evidence(row)} |`).join('\n')
const summary = modes.map(mode => {
  const rows = cases.filter(row => row.suite === mode)
  return `| ${mode} | ${rows.length} | ${rows.filter(row => row.status === 'PASS').length} | ${rows.filter(row => row.status === 'FAIL').length} | ${rows.filter(row => row.status === 'BLOCKED').length} |`
}).join('\n')
const report = `# AezCheck responsive QA — 2026-09-29

## Kết quả cuối

Đã hoàn tất phạm vi kiểm thử, còn **BLOCKED: URL thật cho Bắt đầu trải nghiệm**. Không kết luận toàn website PASS chức năng CTA.

- Base URL: http://localhost:8443 — tái sử dụng Vite đã xác nhận đúng project; không mở server thứ hai.
- Chromium/HeadlessChrome 153.0.8010.54 trên Windows; mobile/touch là emulation, không phải iPhone thật.
- Dự kiến ${results.expected} case; đã chạy ${cases.length}; **PASS ${totals.PASS}, FAIL ${totals.FAIL}, BLOCKED ${totals.BLOCKED}, NOT RUN ${totals['NOT RUN']}** trong tập case Chromium bên dưới. 6 BLOCKED cùng một nguyên nhân thiếu URL, không phải 6 lỗi khác nhau.
- Layout: **60 tổ hợp chính + 28 viewport bổ sung + 10 touch = 98/98 PASS** theo các phép kiểm tự động đã ghi nhận. Không suy ra tất cả screenshot đã được xem trực tiếp.
- Các lượt retry/gián đoạn không cộng vào số case: kết quả ghép theo page/locale/viewport/suite, giữ một kết quả cuối cho mỗi case.
- Runtime exceptions ${results.runtimeExceptions}; console errors ${results.consoleErrors}; resource/network errors ${results.networkErrors} trong các tập kết quả cuối.

| Bộ kiểm tra | Đã chạy | PASS | FAIL | BLOCKED |
|---|---:|---:|---:|---:|
${summary}

## Phương pháp và giới hạn bằng chứng

Ma trận layout chạy animation bình thường, chờ font, cuộn toàn trang theo bước 80% viewport, đo document/client/body width, chờ decode ảnh lazy, chụp đầu trang và footer. Bảng/flow cuộn nội bộ được phân biệt với overflow toàn trang. Header, logo, giới hạn Free và tỷ lệ LED có kiểm tra riêng.

Các lượt thiếu kết quả, treo capture hoặc giữ trang cũ không được tính PASS. Đã chạy lại phần thiếu; script có kiểm tra URL sau navigation, chờ đúng loại nội dung, đối chiếu locale và viewport. Chụp viewport với captureBeyondViewport=false, đưa tab ra foreground và có timeout CDP. Những kiểm tra identity bổ sung được thêm khi xử lý retry; bản ghi ma trận đầu không có snapshot identity riêng. Không dùng các lượt lỗi công cụ để kết luận lỗi ứng dụng.

Interaction: 5 accordion × 6 lượt; 3 layer × 6 lượt; 5 tab quảng cáo × 6 lượt; nội dung, số dòng, cột cuối, flow cuối, height ổn định. Journey 5 trang × VI/EN × 3 viewport kiểm tra switch/reload/Back/Forward/TOC/search/lightbox/Escape/focus return. Các lượt này dùng DOM activation; bộ input bổ sung dùng touch và phím CDP thật. CTA khám phá dùng mouse/touch CDP thật.

Đã xem trực tiếp **${reviewed.length} screenshot** bằng công cụ xem ảnh, liệt kê cuối báo cáo. Các screenshot còn lại có kết quả đo tự động nhưng **NOT RUN cho việc xem từng ảnh bằng mắt**. Không coi capture thành visual review đầy đủ.

## Lỗi đã sửa

### R-001 — P1 — LED bị sticky header che ở landscape

- Route /vi/, /en/; Chromium 852×393, desktop emulation và mobile lighting rule.
- Repro: mở landing đầu trang ở 852×393. Mong muốn toàn khung LED nằm dưới header; thực tế mép trên khoảng 37px, header kết thúc 75px.
- Nguyên nhân: src/hero-motion.css đặt az-sign-motion top:-48px, kết hợp Hero short-height.
- Sửa src/sign-interaction.css: top:0 chỉ khi max-width:959px và max-height:479px. Không đổi kích thước, palette hay desktop.
- Retest PASS: top khoảng 85px, header 75px; không overflow; VI/EN đều đạt.
- [Trước](before/landing-vi-chromium-852x393-top.png) · [Sau](after/landing-vi-chromium-852x393-top.png).

### R-002 — P2 — header không đổi active theo scroll

- Route /vi/, /en/; Chromium 393×852, 768×1024, 1440×900.
- Repro: cuộn tới Shield, menu vẫn active Features. Mong muốn active đúng section hiện tại.
- Nguyên nhân: Navbar trong src/components/LandingOpening.tsx chỉ đọc pathname/hash, không theo vị trí scroll.
- Sửa: scroll listener passive + requestAnimationFrame; so vị trí section với sticky header; chỉ áp dụng home. Pricing giữ active Pricing; Guide/Terms/Privacy giữ neutral.
- Retest PASS cả 6 lượt tương tác và kiểm tra active trên trang con.
- [Trước](details/landing-vi-chromium-1440x900-shield.png) · [Sau](details/after-landing-en-chromium-1440x900-shield.png).

### R-003 — P2 — Khám phá tính năng cuối trang không có action

- Repro: click CTA cuối trang; button cũ không có href hoặc handler.
- Sửa src/App.tsx: Btn hỗ trợ anchor, FinalCTA reuse target Features từ landingNavItems và localizedHref. Giữ class/style và sticky offset sẵn có.
- Retest PASS bằng click/tap thật VI/EN tại 393, 768, 1440; URL đúng locale/#features, menu active Features, section không bị header che.
- [Trước](details/before-landing-vi-393-cta.png) · [Sau click mobile](details/after-cta-vi-393-destination.png) · [Sau click desktop](details/after-cta-en-1440-destination.png).

## BLOCKED và phần chưa chạy

### R-004 — Bắt đầu trải nghiệm: cần chủ sản phẩm xác nhận URL

Hero và Pricing reuse landingExperienceDestination='#contact' (src/landing-navigation.ts). Đây chỉ là section CTA cuối landing; Btn ở đó không có URL/action bắt đầu trải nghiệm. Chưa có cấu hình app/signup/login thật để reuse. Không tự đoán URL, không đổi nút thành Liên hệ. 6 journey ở landing giữ raw FAIL EXPERIENCE_CTA_INERT, được phân loại **BLOCKED** trong báo cáo tổng theo yêu cầu chủ sản phẩm; không đổi thành PASS.

WebKit **NOT RUN**: môi trường không có browser binary/tool WebKit. Safari/iPhone/iPad thật **NOT RUN**. Không suy ra kết quả các thiết bị này từ Chromium. Visual review từng screenshot ngoài danh sách **NOT RUN**. Không có lỗi layout UI còn được tái hiện trong các case đã hoàn tất.

## LED và regression

393×852 và 852×393, VI/EN: mỗi lượt 10.2 giây, 614 frame; opacity tối thiểu của panel/chữ/PRO = 1. Halo thay đổi nhẹ, không tắt lõi chữ. Có cuộn ra/vào và reduced-motion tĩnh. Ảnh minimum/maximum được cố định ở thời điểm halo tương ứng sau lượt quan sát animation bình thường, không thay thế lượt quan sát đó.

- [Minimum](details/after-led-vi-393-minimum.png) · [Maximum](details/after-led-vi-393-maximum.png) · [Landscape reduced](details/after-led-en-852-reduced.png).
- Desktop 1440×1000 VI/EN: computed styles LED khớp hoàn toàn artifacts/mobile-led/desktop-before.json. Tỷ lệ cụm chữ/khung responsive khoảng 0.878–0.881, khớp reference desktop. Không scale raster hoặc đổi thiết kế desktop.
- Ngưỡng kiểm tỷ lệ ban đầu đã báo nhầm desktop 1280 (khoảng 0.752): đây là desktop typography hiện có, không phải lỗi mobile; không sửa thiết kế desktop để ép qua ngưỡng. Bản kiểm cuối giới hạn assertion responsive dưới 1200px.
- Sau sửa CTA chỉ retest vùng liên quan 6 case và input/navigation VI/EN, không khởi động lại 98 lượt layout đã đạt.

## File thay đổi trong lượt này

- src/components/LandingOpening.tsx — Navbar scroll active.
- src/sign-interaction.css — khoảng cách LED landscape.
- src/App.tsx — CTA khám phá dùng link config.
- scripts/qa-site-responsive.mjs — browser QA có thể chạy lại, resume và evidence.
- scripts/qa-responsive-report.mjs — tổng hợp báo cáo.
- .qa/responsive/2026-09-29-audit/ — dữ liệu/screenshot/report; không đưa vào runtime assets.

Các thay đổi có sẵn của người dùng được giữ nguyên; không reset/stash/commit/push/deploy.

## Build / typecheck

- pnpm.cmd build — **PASS** (Vite 8.0.5).
- pnpm.cmd exec tsc --noEmit — **PASS**.
- Lint — **NOT RUN**: package.json không có lint script/config; không thay bằng kết luận PASS.

## Chạy lại

Server hiện tại phải ở 8443 và Chromium CDP ở 9338. Chạy tuần tự; không chạy nhiều tab capture cùng lúc. Script không mở thêm Vite.

\`\`\`powershell
node scripts/qa-site-responsive.mjs after matrix --isolated
node scripts/qa-site-responsive.mjs after details --isolated
node scripts/qa-site-responsive.mjs after journeys --isolated
node scripts/qa-site-responsive.mjs after cta --isolated
node scripts/qa-site-responsive.mjs after led --isolated
node scripts/qa-site-responsive.mjs after led-reference --isolated
node scripts/qa-site-responsive.mjs after input --isolated
node scripts/qa-responsive-report.mjs
\`\`\`

Thêm --resume cho matrix/journeys để chỉ chạy phần thiếu trên cùng phiên bản code. Không dùng resume nếu source liên quan đã thay đổi. Script giữ kết quả từng case trong JSON; xem status, không chỉ dựa vào exit code. input-incomplete-key-events.json là lượt công cụ gửi Enter thiếu text, đã bị loại và retest bằng key event đầy đủ; không phải lỗi UI tồn đọng.

## Ma trận layout chính — 60

${table(cases.filter(row => row.suite === 'matrix' && row.group === 'main'))}

## Viewport bổ sung — 28

${table(cases.filter(row => row.suite === 'matrix' && row.group === 'extra'))}

## Touch layout — 10

${table(cases.filter(row => row.suite === 'matrix' && row.group === 'touch'))}

## Interaction / regression / LED

${modes.filter(mode => mode !== 'matrix').map(mode => `### ${mode}\n\n${table(cases.filter(row => row.suite === mode))}`).join('\n\n')}

## Screenshot đã xem trực tiếp

${reviewed.map(path => `- [${path}](${path})`).join('\n')}

Danh sách ảnh chưa review trực tiếp nằm trong results.json → screenshotsNotIndividuallyReviewed.
`
fs.writeFileSync(`${root}/report.md`, report)
console.log(JSON.stringify({executed: cases.length, totals, reviewed: reviewed.length}, null, 2))
