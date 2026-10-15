# Localization maintenance

Supported locales: `vi`, `en`, `ru`, `zh` (Simplified Chinese), `th`, `lo`.

The four new catalogs in `src/i18n/generated` are static machine translations of the existing public website copy. They are loaded separately on demand. The production site does not contact a translation service. Native-speaker editorial review has not been performed. Guide screenshots retain their original pixels; surrounding text, captions and accessible labels are localized.

`localize.ts` translates visible React text and accessible labels without rewriting the DOM. Existing bilingual structured copy is extended by `withLocales`; stable IDs, routes, file paths, numbers and glossary terms are preserved. The English guide supplies the structure for the four new guides, including searchable translated text.

When adding copy, use `t(...)`, `localizeNode(...)` for rendered text, or `translateText(...)` for text attributes. Keep identifiers and URLs outside translation calls. Language names and the pricing brand signature intentionally retain their original spelling.

Run `node scripts/i18n/generate-catalog.mjs` to extract source copy and fill missing catalog entries. This development command sends public source copy to Google Translate and requires network access. Review translations before release. Use `--refresh-source` to regenerate Vietnamese-source or glossary-bearing entries; use `--prune` to remove obsolete entries without network access. Hand edits to existing entries are retained by the default generation command.

Validation:

```sh
npm run typecheck
npm run build
node scripts/i18n/verify.mjs
```

The verification script renders all 30 locale/page combinations, tests modern and legacy routes and anchors, and verifies guide structure and catalog output. Rendered HTML and results are saved under ignored `.qa/i18n`. It does not replace browser layout and interaction checks.
