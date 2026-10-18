# PresidentialFunFacts

**Little-known facts. Big personalities.** A mobile-first Vue 3 Progressive Web App exploring 11 presidents and 11 First Ladies and White House hostesses: 22 people overall, with 264 source-checked historical facts and 49 sources.

## Launch locally

Requires Node.js 22.12+ (tested with Node 24) and npm.

```sh
npm ci
npm run dev
```

Open the URL Vite prints, normally `http://localhost:5173`.

```sh
npm test
npm run validate
npm run build
npm run preview
```

Production preview is `http://localhost:4173/presidentialfunfacts/`. Production routes use hashes (for example, `#/games`), so direct links and refreshes work on GitHub Pages without server rewrites. Local development keeps history URLs. Older path-only deep links must be changed to hash links. The service worker is enabled in the production build, not the development server. Install from the browser's install control (or the app's install button when supported). On iOS, use Safari → Share → Add to Home Screen. Hosted installs require HTTPS; localhost works for development.

## What's included

- Home with original Captain Facts SVG artwork, featured discovery, president portraits, topic discovery, and first-lady navigation.
- Searchable Presidents and First Ladies lists with terms/administrations and sorting.
- Person biographies, relationship navigation, keyboard-accessible fact carousel, and portrait rights.
- Random facts within Topics, with topic selection and no immediate repeated fact when alternatives exist.
- Six topics, fact search, and persistent favorites for people and facts.
- Responsive desktop navigation, mobile bottom navigation and expanded menu, reduced-motion support, labeled controls, skip link, and live results/status messages.
- Installable PWA, 192/512px icons, locally bundled portraits/fonts/facts, offline application shell, and a user-controlled update prompt.

The First Ladies screen labels Martha Jefferson Randolph as a daughter and occasional White House hostess. It does not identify her as Jefferson's spouse. Dolley Madison remains a First Lady and James Madison’s spouse; her occasional hosting for Jefferson is labeled as a separate administration association. Difficult history, including slavery, is included with contextual source links.

## Structure

- `src/models.ts`: strict historical and image models.
- `src/data/history.json`: all historical content, sources, rights, relationships, and term ranges.
- `src/data/index.ts`: typed data access and topic definitions.
- `src/data/validate.ts`: referential integrity and completeness validation.
- `src/editorial.ts`: evidence notices and explicit eligibility for curated gameplay, including the legacy clue allowlist.
- `src/utils.ts`: discovery, randomization, and safe favorites parsing.
- `src/stores/favorites.ts`: Pinia state with localStorage persistence and graceful storage errors.
- `src/components/`: shared person and fact cards.
- `src/views/`: Home, Explore (lists/topics/favorites), Detail, FunAndGames, WhoAmI; random discovery lives in Topics.
- `src/styles/variables.less`: shared palette, CSS custom properties, and Less breakpoint variables.
- `src/styles/base.less`: document defaults, typography, accessibility, and reduced-motion rules.
- `src/styles/utilities.less`: shared buttons, layout grids, headings, and utility classes.
- `src/styles/index.less`: the global style entry point, imported once in `src/main.ts`.
- Scoped `<style lang="less">` blocks in Vue components: component and screen styles with colocated responsive rules. Shared topic-card presentation lives in `TopicCard.vue`.
- `public/`: original mascot/icons and bundled historical portraits.

See [RESEARCH.md](RESEARCH.md) for fact counts, source mappings, verification methodology, and licensing. The ignored `design/concept-board.png` is inspiration only and is not a production asset.

## Validation

`npm test` runs Vitest coverage of search and combined filters, random selection, favorites parsing/toggling, reciprocal spouse navigation, hostess distinctions, and data integrity including deliberately invalid datasets. `npm run validate` also checks bundled portrait/icon files and prints verified counts per person. It checks structure, not historical truth; historical claims were separately compared against source pages.

Browser smoke tests are in `e2e/app.spec.ts`. After installing Chromium with `npx playwright install chromium`, run `npm run test:e2e`. The suite builds and serves production locally, checks mobile/desktop interactions, persistence, navigation, source links, image loading, overflow, and offline service-worker behavior. It does not contact external source websites.

Phase 3.2 introduced the Adams and Madison families, scalable historical validation, evidence notices, explicit gameplay eligibility, and chronological browsing. Phase 3.3 adds the John Quincy Adams, Grant, Coolidge, and Carter couples, with 74 facts and six curated questions. Checks cover unit tests, Chromium browser tests, data and asset validation, the strict TypeScript production build, and formatting. Tests cover the expanded collection, evidence rendering, game eligibility, chronological service order, mixed legacy/new favorites, and offline portraits and routes. Historical truth and reuse rights still require editorial review; validation checks structure and references.

## Offline and deployment

After one complete online load and service-worker activation, the shell, historical data, all portraits, fonts, and icons are precached. Offline status clearly explains that external source websites still require a connection. Favorites stay on the current browser/device; there is no account or sync.

Production URL: https://tinamouton.github.io/presidentialfunfacts/

In the repository's **Settings → Pages → Build and deployment**, select **GitHub Actions** as the source. Ensure Actions are enabled and the `github-pages` environment permits `main` deployments (configure reviewers if desired). The user must make these settings changes manually.

`.github/workflows/pages.yml` validates and builds on pushes to `main`, then deploys the validated `dist/` artifact using official Pages Actions. Manual execution is supported, but both jobs require `main`. No pull request or feature branch deploys. Formatting, data validation, unit tests, Playwright Chromium tests, and the TypeScript production build must all succeed before publication. There is no ESLint configuration or lint script. Node 24 and `npm ci` match local npm conventions. Only the deploy job receives `pages: write` and `id-token: write`; deployments run sequentially.

Run all checks locally:

```sh
npm run format
npm run format:check
npm run validate
npm test
npx playwright install --with-deps chromium
npm run test:e2e
npm run build
npm run preview
```

Playwright builds and starts its own production preview under `/presidentialfunfacts/`. Release tests verify manifest/asset URLs, worker scope, offline favorites and gameplay, and a real waiting-worker update. The latter temporarily changes generated `dist/sw.js` and restores it; do not run it against a shared preview session. The update controller also has deterministic unit tests for deferral, dismissal, duplicate events/clicks, explicit activation, cross-tab reload protection, errors, and favorites preservation.

A first-ever visit while offline cannot load uncached content. After successful caching, biographies, facts, portraits, fonts, Who Am I?, and favorites work offline; external source pages need internet. Browsers may evict cached data, so installation alone does not guarantee permanent offline availability. Favorites retain the `presidentialfunfacts:favorites:v1` key and `{ people: string[], facts: string[] }` format. They stay on the browser's origin/device, persist across ordinary updates, and do not transfer from localhost to GitHub Pages. Clearing site data removes favorites.

The existing worker stays active when an update is detected. **A fresh version is ready!** offers **Update now** and **Later**. Update now asks the waiting worker to activate, then reloads once it takes control. Later keeps the update waiting and dismisses the prompt for the current foreground session; returning to the foreground or relaunching can offer it again. Registration checks on launch; foreground network checks are limited to once per hour with no background timer. Active Who Am I? rounds hide the prompt until completion or exit, including after Play Again. An activation from another open tab never forces this tab to reload mid-round; it offers a reload after the round. Existing tabs may continue running an older in-memory application until accepted or closed.

The manifest, worker scope, start URL, icons, and offline shell use the repository base. Existing 192×192 and 512×512 PNGs are retained. They are advertised as ordinary icons: a dedicated maskable asset would need at least a 512×512 opaque image with essential artwork inside the centered safe circle (radius 40% of image width). Current artwork does not fit that safe area. No About/settings area exists, so a visible version label is intentionally omitted; updates use worker revisions independently of `package.json`'s version.

On Android, open the production URL in Chrome and use **Install app** (when offered), or the browser menu's install/Add to Home screen action. On iOS, open it in Safari, choose **Share → Add to Home Screen**, enable **Open as Web App** if offered, then Add. Allow the initial online load/caching to finish before testing offline.

### Manual two-release verification

These deployed/mobile checks remain manual and are not replaced by local Chromium tests:

1. **Release A:** manually merge/push the reviewed changes to `main`. Confirm the Actions build and Pages deployment succeed, then open the production URL and refresh a copied `#/person/lincoln` link. Confirm portraits, fonts, and navigation load.
2. Install on Android and iOS. Save several people and facts. After a complete online load and worker activation, disconnect and relaunch. View and modify favorites, browse facts, and answer a Who Am I? question offline. Reconnect.
3. **Release B:** keep Release A open, start a round, then manually publish a subsequent build with a small recognizable UI change. Bring the installed app back to the foreground after the check interval (or use browser DevTools → Application → Service Workers → Update for a controlled check). Confirm a worker waits while no prompt interrupts the round.
4. Finish the round and confirm exactly one prompt appears. Also verify the exit path in another run. Choose **Later** and confirm no reload or loss of the current screen. Background/foreground the app or relaunch; the prompt should become available outside gameplay.
5. Choose **Update now**, confirm one reload and Release B's recognizable change. Verify saved favorites remain. Disconnect, relaunch, browse, play, and modify favorites again. Repeat on physical Android/iOS devices and with multiple open tabs.

### Caching troubleshooting

Use DevTools → Application to inspect the manifest, `/presidentialfunfacts/` worker scope, waiting worker, and Cache Storage. A waiting worker after Later is expected. Close all app tabs/windows and relaunch, or foreground the app after the check interval to retry discovery. Verify the latest Pages workflow succeeded and you are using the production URL. Browser/CDN caching can delay detection; normal reloads do not necessarily activate a waiting worker. Do not enable DevTools “Update on reload” while checking the normal prompted lifecycle. For a clean installation test, first record favorites, then explicitly clear site data/unregister the worker; this is destructive to local favorites and is never part of application update handling.

## POC scope and future work

All requested screens and local interactions are implemented. Phase 3.2 added four Adams and Madison profiles and 40 facts. Phase 3.3 adds eight profiles and 74 facts, bringing the collection to 22 people and 264 facts. Facts are concise discovery prompts, not full essays; some are essential biographical context. No backend, accounts, analytics, or cloud synchronization are included. Physical-device installation and cross-browser accessibility audits remain release checks; automated Chromium checks do not replace them.

No changes are automatically committed, pushed, or deployed. Existing Git configuration and `.gitignore` are preserved. Git excludes dependencies, production builds, local environment files, caches, and exploratory design references. Commit application source, the npm lockfile, production assets, and attribution records.

## Historical expansion policies

Facts remain in consolidated local JSON; game questions remain separately curated. New profiles target 8–12 well-supported facts without a validation quota. Optional `evidence` (`documented`, `disputed`, `legend`) is separate from source verification; uncertainty appears on fact cards. Every new fact has an explicit `gameEligible` decision, and disputed, legendary, or unverified sources cannot supply established-fact clues. Only the ten original curated clue sources inherit eligibility when the new field is absent; other legacy facts need editorial review before new game use. Eligibility never generates a question. See [RESEARCH.md](RESEARCH.md#phase-32-editorial-policies) for the policy, exceptions, exact source mappings, and portrait permissions.
