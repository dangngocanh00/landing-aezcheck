# Website locales

- Supported locales: `vi`, `en`, defined once in `src/i18n/locales.ts`. Every header selector uses this list; flags are Vietnam and England (St George's cross).
- `LanguageContext` is the single app locale state. It retains the existing `aezcheck-language` localStorage key. Saved unsupported locale values migrate to English. An explicit URL locale takes precedence over the saved preference.
- Canonical pages: `/{vi|en}/`, `/{vi|en}/pricing`, `/{vi|en}/guide`, `/{vi|en}/terms`, `/{vi|en}/privacy`. SPA hosting must serve the entry document for these paths (Vite already does).
- Legacy `/ru/…`, `/th/…`, `/zh/…` and localized hash routes are replaced with the corresponding English page, retaining anchors. Old unlocalized hash links use the current global locale. Unknown old page names fall back to the English landing page.
- Switching languages retains page and anchor. Header/footer navigation and legal cross-links use locale-aware destinations. Pricing's CTA returns to the contact section in the same locale.
- Landing keeps its existing section active behavior. Pricing is active on its route. Guide/Terms/Privacy have no active navigation item.
- Runtime dictionaries for pricing, terms, privacy and footer now contain VI/EN only. Guide retains `vi.json` and `en.json`; other landing dictionaries already use VI/EN. There are no existing canonical/hreflang locale tags to remove.
- Verification: `scripts/qa-locales.mjs` covers all five pages in both languages, switching/reload, old URLs, saved-preference migration, deep links, header/footer destinations and mobile selectors. Result: `docs/guide/site-locales-qa.json`. Build and TypeScript checks pass.
