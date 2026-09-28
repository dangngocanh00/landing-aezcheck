# Landing AezCheck — Vercel handoff

Prepared locally on 2026-09-29. No Vercel deployment, project linking, domain or DNS change was performed.

## Repository and build

- Repository: `https://github.com/dangngocanh00/landing-aezcheck` (public).
- Branch reviewed: `main`, upstream `origin/main`.
- No `.vercel/project.json`, GitHub workflows or public deployment/check records were found during preparation. Vercel account/team/project and integrations are **not verified**; absence of GitHub records does not prove push cannot deploy.
- Root directory: repository root (`.`).
- Framework: Vite / React SPA; no SSR, functions or production Node server.
- Node: `24.x`; locally verified `24.11.0`. Vercel controls minor/patch updates.
- Package manager: `pnpm@11.21.0`, verified from installed package and `node_modules/.modules.yaml`, then through Corepack. Lockfile format9 alone does not prove its original authoring version. A frozen install must succeed without changing it.
- Install: `node scripts/check-toolchain.mjs && corepack pnpm install --frozen-lockfile`.
- Build: `node scripts/check-toolchain.mjs && corepack pnpm run build`.
- Output: `dist`. Typecheck: `pnpm run typecheck`. No lint script exists; formatting is not lint.
- The toolchain check prints actual Node/pnpm versions and rejects mismatches. Do not use `latest`, delete the lockfile, bypass frozen mode or use dev/preview as production servers.

## Environment

| Name | Purpose | Visibility / target |
|---|---|---|
| `ENABLE_EXPERIMENTAL_COREPACK=1` | Vercel opt-in to the pinned package manager | Build setting for Preview/Production; not a secret. Must be explicitly enabled by the deployment owner. Not enabled remotely by this work. |
| `FIGMA_PUBLIC_URL` | Optional Vite asset base used by Figma tooling | Public build value. Leave unset on Vercel for root deployment. Not a canonical/signup URL. |
| `FIGMA_DEV_SERVER_HOST` | Local dev/preview bind host | Local tooling only; not required on Vercel. |
| `PORT` | Local dev/preview port | Local tooling only; do not configure8443 as a production server. |

There are no application `VITE_*` variables, API credentials or required runtime secrets in the inspected source. Do not invent an app/signup endpoint. Canonical/hreflang/social domain configuration awaits approved domain information.

Corepack remains an experimental Vercel opt-in. Current Vercel package-manager documentation lists built-in pnpm through10; do not assume lockfile auto-detection selects11.21.0. Verify the exact version in hosted build logs. See [Corepack configuration](https://vercel.com/docs/builds/configure-a-build), [package managers](https://vercel.com/docs/package-managers), and [Node versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).

## Routing and files

`vercel.json` rewrites only supported locale/page paths to `/index.html`: VI/EN and legacy RU/TH/ZH, with Landing/Pricing/Guide/Terms/Privacy and optional trailing slash. Unprefixed supported pages also reach the existing router. `/` serves the static index. Existing client logic keeps locale/hash and normalizes legacy locales to EN. Fragments never reach the server.

There is no catch-all rewrite for `/api`, missing assets or unknown pages. Static assets and robots remain normal files. Unknown URLs should reach Vercel's own not-found handling; **hosted HTTP status is not verified by local Vite preview**, which uses its own SPA fallback. Test direct URLs, reload, legacy URLs, hash links, missing JS/image/API paths and actual HTTP404 after deployment. See [Vercel rewrites](https://vercel.com/docs/rewrites).

Keep `.figma/make/site.json`: `vite.config.ts` imports it for title/description/robots. Other Figma helper files are not executed by the Vercel commands. Keep all source, runtime assets,20 Guide WebP images, VI/EN content and lockfile. Guide extraction manifest is now `docs/guide/asset-manifest.json`; it is tooling data, not public runtime content. Regeneration scripts require local excluded extraction inputs; normal build uses committed `src/content/guide/*.json` and does not regenerate them.

`.gitignore` / `.vercelignore` exclude QA screenshots/reports, artifacts ZIP, local linkage, caches, secrets, dependencies, build output and source extraction data. They do not exclude `public/`, source assets or the Figma build configuration. CLI upload also excludes Guide authoring/QA scripts and documents. Never force-add ignored outputs. Ignore rules do not remove previously tracked files; inspect the staged list before committing.

## Remaining release blockers

- Real experience/signup URL is unconfirmed: Hero/Pricing scroll to contact; final experience button has no action. Do not describe these as working signup links.
- Guide screenshots include account identifiers/contact data; owner must approve public-site publication. Three unconfirmed content placeholders per locale remain.
- Domain/staging, canonical/hreflang/sitemap/social metadata, hosting404/cache/HTTPS need deployment-owner verification. Existing `noindex` / robots `Disallow: /` are intentionally retained.
- Desktop Guide CLS remains about0.14 in the prior Lighthouse run. Physical devices, Safari/WebKit, Firefox and genuine200% zoom are not verified.

The local QA evidence stays under `.qa/release/2026-09-29-build/`, outside Git and the public output. This handoff does not claim release approval.

## Next deployment step (separate authorization)

1. Confirm account/team, target Vercel project, repo/branch and whether that project already serves live domains. Do not touch `aezcheck.com` or existing app domains without approval.
2. Review Git integration/Production Branch and deployment protection before pushing or importing. Importing or an initial CLI setup can create a Production deployment; omitting `--prod` is not proof of isolation. Consult [deployment behavior](https://vercel.com/docs/deployments).
3. Apply the build settings and Corepack opt-in above, preserving protection. Use the Vercel-generated URL first; do not attach domains or change DNS.
4. After an authorized deployment, record the actual SHA, environment, assigned domains, build log toolchain and URL. Test all five pages VI/EN, direct reload, locale/hash, assets/MIME and true HTTP404 on that URL. Do not create a duplicate manual deployment if Git integration already created one.

Local validation commands: `pnpm run build`, `pnpm run typecheck`. For a clean check, copy/export reviewed source to an isolated directory, run the pinned Corepack frozen install, then build/typecheck. Preserve the existing working tree and do not copy its node_modules. A Windows clean build is not proof of Linux/Vercel hosting behavior.

Validation completed during commit preparation: working-source build/typecheck PASS; isolated Git-index export frozen install/build/typecheck PASS on Node24.11.0 and pnpm11.21.0. The install reused the package store but did not reuse the working node_modules. The working lockfile is unchanged; the Git-index export has identical lockfile content after normalizing Git's Windows CRLF conversion. No lint command is configured. The staged-file scan found no credential-pattern matches, excluded-output paths or files above5MiB; all20 Guide WebP assets are retained. This limited scan is not a general security certification.
