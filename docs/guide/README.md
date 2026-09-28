# AezCheck Guide

Routes: `/vi/guide` and `/en/guide`. Deep links use stable source-title slugs, for example `/en/guide#permissions-cap-va-thu-hoi-quyen` and `/vi/guide#shield`. Legacy `#/guide` and `#/vi/guide` links redirect to the locale path while retaining the anchor. Vite serves the SPA entry for direct path loads; deployment hosting must likewise support SPA route fallback.

The existing landing header/footer are reused. Guide, Terms and Privacy have no active header item; Pricing remains active on its page. The entire site uses the shared VI/EN configuration in `src/i18n/locales.ts`, with Vietnam and England flags. LanguageContext controls content, header/footer, route changes and existing localStorage persistence. All page routes use `/vi/` or `/en/`. Old RU/TH/ZH URLs and saved preferences normalize to English; removed translations are no longer bundled. Navigation and language changes retain the page and anchor.

## Content and mapping

`src/content/guide/vi.json` is the normalized runtime source. There are 13 TOC groups, 16 source modules, 62 numbered subsections, 143 body paragraphs, 345 bullets (including nested bullets), 20 ordered steps, 26 tips and 15 captions. A wrapped dashboard tip now stays inside one callout. The H1 follows the requested wording; source copy is otherwise unchanged except whitespace introduced by PDF line wrapping. Bracketed placeholders and contradictory source instructions are preserved.

The user authorized a full English translation. `docs/guide/en-translation.txt` contains 610 translated blocks (including captions) plus module titles, compiled by `scripts/build-guide-en.mjs` into `src/content/guide/en.json`. The compiler rejects missing or extra entries. Source screenshots, block types, numbered steps, image dimensions and anchor IDs are shared across locales. Screenshots retain the original PDF interface language. `src/i18n/guide-ui.ts` translates search, TOC and accessibility labels. `language-qa.json` records locale routing, persistence, back navigation, direct/legacy routes, unsupported-locale fallback, legal-page options and desktop/mobile selector checks.

Twenty distinct WebP files appear in the original 31 positions. Repeated PDF screenshots reuse the same file rather than creating duplicates. Images without captions in the PDF have no invented caption. Original dimensions are reserved to prevent layout shifts, and all figures use lazy loading and async decoding.

| Module | Asset suffix (all files start with `guide-` and end with `.webp`) | Source pages |
|---|---|---|
| Bắt đầu | getting-started | 1 |
| Dashboard TKQC | dashboard-overview; dashboard-overview-detail | 3; 4 |
| Tài chính | finance-dashboard; finance-dashboard-detail | 6; 6 |
| Tài sản | assets-via; assets-via-detail | 8; 9 |
| Quảng cáo | ads-manager; ads-manager-detail | 13; 13 |
| Thẻ thanh toán | payment-cards | 16, 17 |
| Khách hàng thuê | rental-customers | 19 (twice) |
| Tiền tệ | currency | 23 (twice) |
| Người dùng | users | 25 (twice) |
| Vai trò | roles | 26, 27 |
| Nhóm quyền | permission-groups | 28 (twice) |
| Phân quyền | permissions | 30 (twice) |
| Shield | shield | 32 (twice) |
| Tag | tags | 34 (twice) |
| Nhật ký | audit-log | 35, 36 |
| Admin BM | admin-bm | 37, 38 |

## UI

- `GuidePage`: layout, route anchors, scroll spy and locale-ready content selection; loaded in a separate route chunk.
- `GuideToc`: collapsible groups, active group expansion, mobile accordion and accent-insensitive title search.
- `GuideSection` / `GuideBlocks` / `GuideInline` / `GuideTip`: semantic headings, paragraphs, lists, nested steps, source emphasis, navigation arrows and tip callouts.
- `GuideFigure`: original screenshots and source captions, pointer/keyboard zoom.
- `GuideLightbox`: native modal dialog, focus containment/return, scroll locking, Escape, outside click and close button.
- `guide-page.css`: scoped styles consistent with legal pages; 1360px desktop container, 284px sidebar and 60px gap; collapsible TOC below 960px.

## QA and cleanup

`content-qa.json` records complete coverage of all 39 pages and 10,417 nonempty extracted text items. The check compares every normalized block against its source characters, verifies image order and ensures no duplicate or missing text reference. `source-map.json` preserves page/item provenance. `browser-qa.json` records browser checks at 1440, 1024, 768 and 390px, all image dimensions, lightbox, anchors/reload, search, locale fallback, shared header, pricing, mobile navigation and footer navigation.

The PDF and `artifacts/guide-review/` temporary renders were deleted only after successful source/browser QA. The obsolete extraction script was removed. Extracted JSON/text references remain intentionally for auditing and future reviewed translations; they are not runtime dependencies. `artifacts/guide-ui/` contains the current responsive QA captures.

Run:

```sh
node scripts/normalize-guide.mjs
node scripts/verify-guide-content.mjs
node scripts/build-guide-en.mjs
pnpm build
pnpm exec tsc --noEmit
```

`scripts/qa-guide.mjs` runs against the existing Vite server on port 8443 and a local headless Chrome CDP endpoint on port 9338. No application dependencies were added.
