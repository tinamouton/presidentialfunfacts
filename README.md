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

Production preview is normally `http://localhost:4173`. The service worker is enabled in the production build, not the development server. Install from the browser's install control (or the app's install button when supported). On iOS, use Safari → Share → Add to Home Screen. Hosted installs require HTTPS; localhost works for development.

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

Deploy `dist/` to a static HTTPS host that rewrites application routes to `index.html`. The app assumes hosting at the origin root. On an update, the existing worker remains active until the user chooses **Update app**. A first-ever visit while offline cannot load uncached content.

## POC scope and future work

All requested screens and local interactions are implemented. Phase 3.2 added four Adams and Madison profiles and 40 facts. Phase 3.3 adds eight profiles and 74 facts, bringing the collection to 22 people and 264 facts. Facts are concise discovery prompts, not full essays; some are essential biographical context. No backend, accounts, analytics, or cloud synchronization are included. Physical-device installation and cross-browser accessibility audits remain release checks; automated Chromium checks do not replace them.

No changes are automatically committed, pushed, or deployed. Existing Git configuration and `.gitignore` are preserved. Git excludes dependencies, production builds, local environment files, caches, and exploratory design references. Commit application source, the npm lockfile, production assets, and attribution records.

## Historical expansion policies

Facts remain in consolidated local JSON; game questions remain separately curated. New profiles target 8–12 well-supported facts without a validation quota. Optional `evidence` (`documented`, `disputed`, `legend`) is separate from source verification; uncertainty appears on fact cards. Every new fact has an explicit `gameEligible` decision, and disputed, legendary, or unverified sources cannot supply established-fact clues. Only the ten original curated clue sources inherit eligibility when the new field is absent; other legacy facts need editorial review before new game use. Eligibility never generates a question. See [RESEARCH.md](RESEARCH.md#phase-32-editorial-policies) for the policy, exceptions, exact source mappings, and portrait permissions.
