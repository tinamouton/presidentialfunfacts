# Phase 4.1 historical foundation

Run `npm run coverage` for current collection totals, missing published profiles, content minimum
shortfalls, classification counts, source counts, questions, and unresolved research. The report is
internal console output; it does not add routes, profiles, or runtime imports to the application.
`npm run validate` checks the roster and audit alongside published content. No new dependencies are
needed. Counts come from JSON rather than a second maintained collection table.

## Canonical roster scope

`roster.json` is the canonical identity and role inventory as of its `asOf` date. It includes every
president, recognized presidential First Lady spouse (including four who died before the presidency),
and documented substantial substitute hostesses. A person appears once, with one or more role records.
Existing public IDs are preserved. A roster record does **not** publish a profile.

The presidential baseline was compared with the [WHHA biographies](https://www.whitehousehistory.org/collections/president-biographies)
and the [U.S. House Historian table](https://history.house.gov/Institution/Presidents-Coinciding/Presidents-Coinciding//?mobilizer=b96fc63268e1322498efdbb382dcd446).
Cleveland has separate ordinal 22 and 24 records; Trump has 45 and 47. An ordinal describes a numbered
presidency, not every election or four-year term. The current service end is null; the roster never
presents an anticipated future end as completed history.

The women's baseline combines the [WHHA biography collection](https://www.whitehousehistory.org/collections/first-lady-biographies),
[National First Ladies Library and Museum](https://firstladies.org/home/first-ladies),
[NPS roster](https://home.nps.gov/fila/learn/historyculture/first-ladies.htm), and
[WHHA hostess scholarship](https://www.whitehousehistory.org/white-house-hostesses-the-forgotten-first-ladies).
Individual records cite these references and supplemental institutional biographies or collection
records. Index years alone are not definitive service dates. All links in the roster source list were
retrieved or their relevant search excerpts inspected; underlying footnoted manuscripts were not
independently inspected. This inventory is extensible, not a claim that no other hostess existed.

Inclusion requires an institutional account of substitute responsibilities or recognition as a
hostess. Attending a reception, being a relative, or helping at one family event is insufficient.
Harriet Lane's role is `hostess` with a niece relationship to Buchanan; this does not deny her historical
recognition as a First Lady. Role names describe relationships and service, not a legally defined office.

### Service and inclusion decisions

- `first-lady` denotes recognized presidential spouse status; `hostess` denotes documented substitute
  duties. Recognition does not require exclusive responsibility for entertaining.
- Martha Wayles Skelton Jefferson, Rachel Jackson, Hannah Van Buren, and Ellen Arthur have
  `recognized-not-served`, explanatory notes, and **no service periods**. Their spouses' presidential
  years are not assigned to them as service. Anna Harrison was First Lady during her husband's brief
  presidency but never occupied the White House; Jane Irwin Harrison performed hosting duties.
- Frances Cleveland and Melania Trump each have two First Lady records under one identity.
- Randolph has two winter-season periods. Year precision does not mean every day in those years.
  Dolley has a separate, occasional Jefferson hostess association alongside her Madison First Lady role.
- Emily Donelson and Sarah Yorke Jackson have overlapping records. The NPS index truncates Emily's
  service at 1834 and WHHA's index starts Sarah in 1836; the narrative supports shared duties before
  Sarah assumed sole responsibility. The roster retains the overlap and an uncertainty note.
- Priscilla Cooper Tyler served while Letitia Tyler was alive; Letitia Tyler Semple briefly succeeded
  Priscilla in 1844 before Julia Tyler. These women are distinct identities.
- Mary Elizabeth Taylor Bliss is also called Betty Taylor Bliss; WHHA's hostess list uses “Margaret
  Elizabeth,” while its Margaret Taylor biography uses “Mary Elizabeth.” Do not split these aliases.
- Mary Abigail Fillmore, Martha Johnson Patterson, and Mary Arthur McElroy are distinct substitutes,
  not duplicate records for the associated presidential spouses.
- Varina Howell Davis is included for substitute duties during the **U.S. Pierce administration**,
  based on the WHHA hostess inventory. Her later Confederate role is outside this roster. Abby Kent
  Means is the same person as Abigail Kent Means. Exact individual dates remain approximate.
- Mary C. Hoyt is listed by WHHA scholarship. Her service dates are unknown; they are not inferred
  from Cleveland's administration. The roster retains the source's name while her expanded identity
  (commonly Mary Cleveland Hoyt) and extent of duties await further documentary research.
- Mary Scott Harrison McKee's 1892–1893 service follows Caroline's death, rather than assigning her
  the entire administration. A Library of Congress collection record also identifies her as hostess.
- Helen Taft Manning and Helen Herron Taft are daughter and mother, respectively. WHHA's Helen Taft
  biography and the Miller Center describe her daughter and sisters Jennie Anderson, Eleanor More,
  and Maria Herron fulfilling duties during her recovery. Approximate recovery-era ranges permit overlap.
- Margaret Wilson's interval between Ellen's death and Woodrow's remarriage is corroborated by a WHHA
  collection record. That narrative takes precedence over the conflicting NPS index years.
- Helen Woodrow Bones is included beyond the WHHA hostess list because the Library of Congress
  explicitly identifies her as a White House hostess, while WHHA scholarship describes her substantial
  duties after Ellen Wilson died. Her approximate role overlaps Margaret Wilson's. Jane Irwin
  Findlay's help with two Harrison receptions and Anna Tuthill Harrison Taylor's reported co-hosting
  remain inclusion candidates for further institutional research; neither is automatically included.
- Eliza Monroe Hay is included because the University of Mary Washington's Papers of James Monroe
  describes her substitute work during Monroe's second term; WHHA's Elizabeth Monroe biography
  corroborates it. Her range describes that term, not an uninterrupted appointment.
- Maria (Mary) Jefferson Eppes is included because the Miller Center explicitly describes her
  substituting when her sister could not host. Her Monticello biography could not be retrieved in
  this review. Dates remain unknown rather than inferring a continuous tenure from her visits.

`periods` use year strings, nullable unknown/current boundaries, and `year`, `approximate`, or `unknown`
precision. Approximate/unknown dates require explanatory notes. Overlap is permitted among women's
roles; presidential service for the same person must not overlap. Same-year starts and ends are valid at
year precision, including William Henry Harrison and Garfield; reversed years remain invalid. Sources and unresolved questions are
internal; the published data's existing service/relationship model remains intact.

## Classifications and sourcing

- `fact`: a claim supported by credible historical evidence.
- `legend`: a documented story or tradition whose occurrence is uncertain, disputed, or unsupported.
- `mystery`: an unresolved historical event or question, supported as unresolved by historical research.

Legends and mysteries require a concise child-friendly `uncertainty` explanation. An unusual pet,
invention, hobby, or coincidence does not establish uncertainty. Ordinary biographical gaps do not
become mysteries. No new mystery or filler entry was invented in this phase.

`classification` is optional for compatibility, but **absence means unclassified**, never `fact`.
The old `evidence` field remains readable; validators reject contradictions between old and new values.
Legacy `disputed` records continue to receive their existing notice; future editors should decide
whether the actual claim is a legend, mystery, or a more carefully worded fact instead of automatically
mapping every dispute to a mystery. Shared FactCard notices display a text label and explanation, so
color is not the only signal. Ordinary fact presentation is unchanged.

Use institutional historical collections first: WHHA, National First Ladies Library and Museum,
presidential libraries, Archives, LOC, NPS, university documentary editions, and comparable collections.
Read the relevant passage, compare **both headline and description**, preserve qualifiers, and record a
locator. A source's documentation of a legend proves the story circulated, not that it happened.
Distinguish a person's later recollection from independent corroboration. Avoid unsourced claims,
invented quotations, and citations inferred from titles or URLs.

## Existing-content audit

`audit.json` records every existing claim and headline, source ID, classification decision, inspection
status, support assessment, locator, and notes. Its source list records the exact URLs attempted. The
review date is independent of the older `checkedOn` values in published data. The validator detects
missing, duplicate, stale, or unknown claim records and prevents support assertions for unread sources.
This artifact is an editorial record; its conclusions are not produced by automated truth detection.

The follow-up resolves `dolley-madison-06` using a fully retrieved WHHA essay about weekly receptions,
with the Wednesday headline corroborated by its James Madison biography. The revised wording promises
an opportunity to meet and talk, not guaranteed cooperation. It is classified `fact` and verified.

`dolley-madison-07` is now a verified `fact` citing an inspected University of Virginia Press
scholarly biography. Its wording is narrowed to documented conversations, visits, and letters; the
audit records the relevant sections and preserves the earlier pending claim in `reviewHistory`.
Both Dolley entries remain ineligible for new questions.

The earlier Smithsonian embroidered-gown source remains `partial`: only indexed text was inspected,
with www returning HTTP 500 and non-www timing out. Its `checkedOn` dates that index review, not
full-page inspection. It no longer supplies published claim evidence and was not retried. The original
Smithsonian dress source also remains as history. The State Department alternative for entry 06 has
only indexed text available (direct retrieval returned HTTP 403) and was not relied on for resolution.
Exact mappings, research-pass scope, and locators are in
[RESEARCH.md](../RESEARCH.md#phase-41-dolley-sourcing-follow-up--october-18-2026).

The two pre-existing legends remain legends with specific explanations. WHHA explicitly calls the
Royall interview tale apocryphal. The Coolidge Foundation annual report reproduces a review calling
“You lose” a likely invention (PDF page 55, zero-based page 54); WHHA also repeats the anecdote.
Neither legend supplies a factual quiz clue. Retrospective accounts such as Grace's bathtub story and
Carter's woodworking are expressly attributed in the existing wording.

Two headlines were narrowed: `lincoln-12` no longer implies the dancing joke is established fact, and
`randolph-04` no longer implies a location for her private education. Washington's January marriage date is corroborated by the inspected Martha Washington biography;
the cited brochure itself gives only the year. Jimmy Carter's Camp David date
is corroborated by the inspected WHHA biography, separately from his cited Center summary. The
portrait rescue wording already credits staff; differing accounts of individual workers' roles were
not turned into a mystery. No stable IDs, favorites keys, or question references changed.

The report distinguishes `supported`, `qualified`, and `needs-review` from `inspected`, `partial`,
`inaccessible`, and `not-inspected`. “Inspected” means relevant retrieved **text** was read, not every
linked manuscript, book, or image. This is a claim-to-source review, not an independent scholarly audit
of all primary records. No existing claims remain in `needs-review`; the inaccessible sources remain documented as history, not inspected evidence.

## Published-profile minimums

Before publishing, require a stable person ID, accurate display name, historical role/relationship,
appropriate service information, brief child-friendly introduction, and at least **one sourced fact**.
The existing image/provenance requirements still apply. A profile with no facts, or only a legend,
fails validation. Roster-only records need no biography, portrait, or facts. Aim for two or three
interesting facts per new person; do not add filler to meet a target. Structural validation cannot
judge interestingness, age suitability, historical accuracy, or institutional credibility; those remain
human editorial responsibilities.

Who Am I? questions remain separately authored and optional. New clue sources must have a fact
classification, verified source flag, and an explicit eligibility decision. Existing original clue
IDs retain their compatibility allowlist; uncertainty and explicit false always override it. All
existing question source facts were rechecked; no question required a change. Random replay and gentle
feedback remain unchanged. Favorites continue using existing IDs and the v1 localStorage format.

## Remaining work

Suggested sequencing for the remaining phases (no missing profiles are published in Phase 4.1):

- Phase 4.2: research a small batch of missing presidents, starting with James Monroe to extend the early chronology. Use the report's missing-ID
  lists; write complete profiles and distinctive optional questions only after inspecting sources.
- Phase 4.3: expand First Ladies and hostesses using the canonical identities; refine ambiguous
  substitute dates and assess unresolved inclusion candidates before adding them.
- Phase 4.4: enrich profiles toward two or three interesting facts, revisit uncertain classifications,
  improve source diversity, and repeat accessibility, mobile, favorites, gameplay, and offline checks.

Preserve the research distinction between missing public content and unresolved roster scope in every
phase. Institutional indexes contain errors and differ in scope; they are starting points, not an
exclusive or immutable definition of the role.
