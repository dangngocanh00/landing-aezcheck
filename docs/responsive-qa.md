# Responsive implementation and browser QA

## Source changes

- src/App.tsx: explicit shrinkable single-column grids, compact mobile section padding, footer links with 44px minimum height.
- src/index.css: centered CTA wrapper, 44px header controls, reduced-motion pulse fallback.
- src/theme/theme.css: removed blanket horizontal clipping from all sections.
- src/components/FeatureSpotlight.tsx and feature-spotlight.css: one responsive visual tree, placed inside the selected accordion panel below 960px; inactive mobile scenes removed from layout; tabs scroll; finance table retains all columns; floating cards stack.
- src/components/agency-workspace-scene.css: removed rules hiding table columns; readable mobile table with local horizontal scrolling; floating cards below the panel.
- src/components/monitoring-product-preview.css: readable internally scrolling mobile table.
- src/components/product-ecosystem.css: seven-stage flow scrolls horizontally below 1200px, with snapping and a visible scrollbar; intro/outcome and compact checkpoints remain.
- src/components/shield-illustration.css: mobile risk grid ? firewall ? protected asset grid, without crossing desktop connectors.
- src/components/control-center-stack.css: readable mobile labels and 44px layer controls; existing inactive layer visibility and stable grid height retained.
- src/components/control-center-benefits.css, benefit-glass-cards.css, analytics-scene.css: larger mobile descriptions and small chart/status labels.
- src/components/challenge.css: mobile text and padding; decorative glow stays inside available width.
- src/components/pricing-page.css: bounded decorative ellipse (its rotated tall box caused overflow), full-width mobile CTA.
- src/components/legal-page.css and src/pages/guide-page.css: compact padding, scrollable mobile legal TOC, comfortable TOC and lightbox targets.

No copy, mock data, locale dictionaries, image assets, or dependencies changed. Existing desktop surfaces, gold pricing strip, LED sign, transparent Benefits, and shared navigation remain.

## Breakpoints

- Below 480px: compact section gutters.
- Below 768px: mobile Shield layout, single active Control Center layer, floating cards in normal flow.
- Below 960px: inline accordion visual; shared mobile header and collapsed article TOCs.
- Below 1200px: horizontal ecosystem flow. Existing desktop layout retained above this breakpoint.

## Browser evidence

Chrome headless against local Vite. All five pages (Landing, Pricing, Guide, Terms, Privacy), both VI and EN.

- artifacts/responsive/audit.json: 120 page/width measurements at 320, 360, 375, 390, 414, 768, 820, 1024, 1280, 1440, 1536, 1920. Final measurements show no document horizontal overflow. Tables/flow intentionally scroll inside their containers.
- artifacts/responsive/interactions.json: 70 page/viewport combinations at 360?800, 390?844, 768?1024, 1024?768, 1440?900, 844?390 landscape, and 720?450 (CSS viewport equivalent to 200% zoom on 1440?900). Scroll traversal to footer, mobile menu/Escape, five accordion states, three Control Center layers, five advertising tabs. No runtime exceptions.
- artifacts/responsive/*.png: desktop/mobile page screenshots and mobile illustration states, VI/EN. Selected Hero, Pricing, flow, Shield, Control Center, and table screenshots reviewed visually.
- artifacts/responsive/touch.json: touch-only media, first/last flow reachability, all table columns reachable, mobile legal TOC, final mobile scene and normal-motion desktop checks.
- scripts/qa-responsive.mjs, qa-responsive-interactions.mjs, qa-responsive-touch.mjs reproduce the checks. Existing qa-locales.mjs and qa-guide.mjs cover locale persistence, routes, deep links, TOC, and lightbox.

## Validation

- pnpm build: PASS.
- pnpm exec tsc --noEmit: PASS.
- Existing locale and Guide browser suites: PASS (switch/reload/anchors, 20 image assets, TOC and lightbox).
- Lint: no lint script configured in package.json.

## Limits

Viewport/touch emulation is Chrome-based, not a physical iOS/Android or Safari test. The 200% check uses the equivalent CSS viewport, not native browser-toolbar zoom. Automated full-page scrolling does not replace pixel-by-pixel visual review of every screenshot/width. No commit or push performed.
