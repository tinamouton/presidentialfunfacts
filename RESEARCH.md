# Historical research and image rights

Phase 4.1 review: **October 18, 2026**. Current scope, classification rules, roster inclusion decisions,
source-access limitations, and future research are documented in [research/README.md](research/README.md).
Run `npm run coverage` for generated totals. The per-entry [audit](research/audit.json) distinguishes
inspected supporting text from prior source checks. Both Dolley sourcing issues are resolved using
inspected WHHA and University of Virginia Press text. No existing claims remain awaiting sourcing
review; earlier Smithsonian access limitations are preserved in the audit history.

The source mappings and batch notes below preserve the earlier October 9, 15, and 17 reviews. Their
“verified” labels describe those reviews, not a claim that every citation was freshly accessible.

## Verification method

Each headline and short description is an original, concise paraphrase of a claim actually present on the linked institutional page. Sources were read during implementation, not inferred from their URL. `verification: verified` means the cited page supports the published claim; it does not mean an independent historian has audited the app. Fact IDs connect directly to person IDs and source IDs in `src/data/history.json`. Source records include URL, institution, and review date. All source links appear on the cards.

Facts favor short discovery prompts. Essential biographical facts sit beside unexpected stories; no invented anecdotes, quotations, or placeholder citations are included. No wholesale biographies or reference artwork were copied.

## Earlier source-check counts (historical batch record)

| Person                    | Role       | Verified | Unverified |
| ------------------------- | ---------- | -------: | ---------: |
| George Washington         | president  |       15 |          0 |
| Thomas Jefferson          | president  |       15 |          0 |
| Abraham Lincoln           | president  |       15 |          0 |
| Theodore Roosevelt        | president  |       15 |          0 |
| John F. Kennedy           | president  |       15 |          0 |
| Martha Washington         | first-lady |       15 |          0 |
| Martha Jefferson Randolph | hostess    |       15 |          0 |
| Mary Todd Lincoln         | first-lady |       15 |          0 |
| Edith Roosevelt           | first-lady |       15 |          0 |
| Jacqueline Kennedy        | first-lady |       15 |          0 |
| John Adams                | president  |       10 |          0 |
| Abigail Adams             | first-lady |       10 |          0 |
| James Madison             | president  |       10 |          0 |
| Dolley Madison            | first-lady |       10 |          0 |
| John Quincy Adams         | president  |       10 |          0 |
| Louisa Catherine Adams    | first-lady |       10 |          0 |
| Ulysses S. Grant          | president  |       10 |          0 |
| Julia Dent Grant          | first-lady |        9 |          0 |
| Calvin Coolidge           | president  |        8 |          0 |
| Grace Coolidge            | first-lady |        8 |          0 |
| Jimmy Carter              | president  |        9 |          0 |
| Rosalynn Carter           | first-lady |       10 |          0 |
| **Total**                 |            |  **264** |      **0** |

## Sources and fact mapping

Every identifier below is a fact in the bundled dataset. Source links are the exact pages reviewed; institutions retain copyright in their page text. Only short original paraphrases are bundled.

### washington

[National Park Service](https://www.nps.gov/gewa/planyourvisit/park-brochure.htm) — checked 2026-10-09.

Supports: `washington-01`, `washington-02`, `washington-03`, `washington-04`, `washington-05`, `washington-06`, `washington-07`, `washington-08`, `washington-09`, `washington-10`, `washington-11`, `washington-12`, `washington-13`, `washington-14`, `washington-15`.

### martha-washington

[National Park Service](https://www.nps.gov/people/martha-washington.htm) — checked 2026-10-09.

Supports: `martha-washington-01`, `martha-washington-02`, `martha-washington-03`, `martha-washington-04`, `martha-washington-05`, `martha-washington-06`, `martha-washington-07`, `martha-washington-08`, `martha-washington-09`, `martha-washington-10`, `martha-washington-11`, `martha-washington-12`, `martha-washington-13`, `martha-washington-14`, `martha-washington-15`.

### jefferson

[Thomas Jefferson Foundation / Monticello](https://www.monticello.org/biography-of-jefferson) — checked 2026-10-09.

Supports: `jefferson-01`, `jefferson-02`, `jefferson-03`, `jefferson-04`, `jefferson-05`, `jefferson-06`, `jefferson-07`, `jefferson-08`, `jefferson-09`, `jefferson-10`, `jefferson-11`, `jefferson-12`, `jefferson-14`, `jefferson-15`.

### randolph

[White House Historical Association](https://www.whitehousehistory.org/bios/martha-jefferson-randolph) — checked 2026-10-09.

Supports: `jefferson-13`, `randolph-01`, `randolph-02`, `randolph-03`, `randolph-04`, `randolph-05`, `randolph-06`, `randolph-07`, `randolph-08`, `randolph-09`, `randolph-10`, `randolph-11`, `randolph-12`, `randolph-13`, `randolph-14`, `randolph-15`.

### lincoln

[National Park Service](https://www.nps.gov/people/abraham-lincoln.htm) — checked 2026-10-09.

Supports: `lincoln-01`, `lincoln-02`, `lincoln-03`, `lincoln-04`, `lincoln-05`, `lincoln-06`, `lincoln-07`, `lincoln-08`, `lincoln-09`, `lincoln-10`.

### lincoln-home

[National Park Service](https://www.nps.gov/features/liho/home/home.htm) — checked 2026-10-09.

Supports: `lincoln-11`, `lincoln-12`, `lincoln-13`, `lincoln-14`, `lincoln-15`, `mary-lincoln-08`, `mary-lincoln-09`, `mary-lincoln-10`, `mary-lincoln-11`, `mary-lincoln-12`, `mary-lincoln-13`, `mary-lincoln-14`, `mary-lincoln-15`.

### mary-lincoln

[National Park Service](https://www.nps.gov/liho/learn/historyculture/marylincoln.htm) — checked 2026-10-09.

Supports: `mary-lincoln-01`, `mary-lincoln-02`, `mary-lincoln-03`, `mary-lincoln-04`, `mary-lincoln-05`, `mary-lincoln-06`, `mary-lincoln-07`.

### roosevelt

[National Park Service](https://www.nps.gov/articles/000/theodore-roosevelt-biography.htm) — checked 2026-10-09.

Supports: `roosevelt-01`, `roosevelt-02`, `roosevelt-03`, `roosevelt-04`, `roosevelt-05`, `roosevelt-06`, `roosevelt-07`, `roosevelt-08`, `roosevelt-09`, `roosevelt-10`, `roosevelt-11`, `roosevelt-12`, `roosevelt-13`, `roosevelt-14`, `roosevelt-15`.

### edith-roosevelt

[White House Historical Association](https://www.whitehousehistory.org/bios/edith-roosevelt) — checked 2026-10-09.

Supports: `edith-roosevelt-01`, `edith-roosevelt-02`, `edith-roosevelt-03`, `edith-roosevelt-04`, `edith-roosevelt-05`, `edith-roosevelt-06`, `edith-roosevelt-07`, `edith-roosevelt-08`, `edith-roosevelt-09`, `edith-roosevelt-10`, `edith-roosevelt-11`, `edith-roosevelt-12`, `edith-roosevelt-13`, `edith-roosevelt-14`, `edith-roosevelt-15`.

### kennedy

[John F. Kennedy Presidential Library and Museum](https://www.jfklibrary.org/learn/about-jfk/life-of-john-f-kennedy) — checked 2026-10-09.

Supports: `kennedy-01`, `kennedy-02`, `kennedy-03`, `kennedy-04`, `kennedy-05`, `kennedy-06`, `kennedy-07`, `kennedy-08`, `kennedy-09`, `kennedy-10`, `kennedy-11`, `kennedy-12`, `kennedy-13`, `kennedy-14`, `kennedy-15`.

### jacqueline-kennedy

[John F. Kennedy Presidential Library and Museum](https://www.jfklibrary.org/learn/about-jfk/life-of-jacqueline-b-kennedy) — checked 2026-10-09.

Supports: `jacqueline-kennedy-01`, `jacqueline-kennedy-02`, `jacqueline-kennedy-03`, `jacqueline-kennedy-04`, `jacqueline-kennedy-05`, `jacqueline-kennedy-06`, `jacqueline-kennedy-07`, `jacqueline-kennedy-08`, `jacqueline-kennedy-09`, `jacqueline-kennedy-10`, `jacqueline-kennedy-11`, `jacqueline-kennedy-12`, `jacqueline-kennedy-13`, `jacqueline-kennedy-14`, `jacqueline-kennedy-15`.

## Historical distinctions and context

- Martha Jefferson Randolph was the president’s daughter, not his spouse. Her hostess service was intermittent: winter seasons 1802–1803 and 1805–1806. Martha Wayles Jefferson died before Jefferson’s presidency and is not the woman modeled here.
- Presidential term ranges reflect time in office, not lifespan. The hostess’s displayed years reflect service seasons rather than the entire Jefferson administration.
- Martha Washington’s estate and Jefferson’s Monticello depended on enslaved labor. The app includes this history rather than presenting their households as uncomplicated achievements.
- Lincoln’s Emancipation Proclamation is described as an issued document; the fact does not claim that it immediately freed everyone enslaved in the United States.
- Kennedy is described as the youngest president **elected**, which does not imply the youngest to assume office.
- The women’s screen uses “First Ladies” as navigation shorthand and explicitly includes and labels White House hostesses. Relationships have direction and distinct spouse/daughter/father types.

## Portrait licenses and attribution

Portraits are locally bundled JPEG thumbnails resized from historical works. CSS crops, sepia, and saturation changes provide a consistent card treatment. Source records below preserve creators and rights; the detailed records are also available from each person’s page. Public-domain claims are scoped to the United States where relevant. No reference-board art is used.

### George Washington

Local file: `/portraits/washington.jpg`.

Gilbert Stuart, George Washington, 1803. Clark Art Institute; reproduction via Wikimedia Commons.

Public-domain painting and faithful reproduction; artist died in 1828.

[Image source and rights record](https://commons.wikimedia.org/wiki/File:Gilbert_Stuart_Williamstown_Portrait_of_George_Washington.jpg)

### Thomas Jefferson

Local file: `/portraits/jefferson.jpg`.

Rembrandt Peale, Thomas Jefferson, 1800. Official presidential portrait reproduction via Wikimedia Commons.

Public-domain painting; official U.S. Executive Office reproduction is public domain.

[Image source and rights record](https://commons.wikimedia.org/wiki/File:Official_Presidential_portrait_of_Thomas_Jefferson_%28by_Rembrandt_Peale%2C_1800%29.jpg)

### Abraham Lincoln

Local file: `/portraits/lincoln.jpg`.

Alexander Gardner, Abraham Lincoln, 1863. Mead Art Museum; reproduction via Wikimedia Commons.

Public domain: historical photograph published before 1931; photographer died in 1882.

[Image source and rights record](https://commons.wikimedia.org/wiki/File:Abraham_Lincoln_O-77_matte_collodion_print.jpg)

### Theodore Roosevelt

Local file: `/portraits/roosevelt.jpg`.

Pach Brothers, Theodore Roosevelt, 1904. Library of Congress; restored by Adam Cuerden; cropped version via Wikimedia Commons.

Public domain in the U.S. (published before 1931). Restorer grants unrestricted reuse and requests attribution.

[Image source and rights record](https://commons.wikimedia.org/wiki/File:Theodore_Roosevelt_by_the_Pach_Bros_%284x5_cropped%29_%282%29.jpg)

### John F. Kennedy

Local file: `/portraits/kennedy.jpg`.

Cecil W. Stoughton, John F. Kennedy, 1963. White House photograph; JFK Library / National Archives, via Wikimedia Commons.

Public domain: photograph made in the course of official U.S. federal government duties.

[Image source and rights record](https://commons.wikimedia.org/wiki/File:John_F._Kennedy%2C_White_House_color_photo_portrait.jpg)

### Martha Washington

Local file: `/portraits/martha-washington.jpg`.

Unidentified artist, copy after Gilbert Stuart. Martha Washington, early–mid 19th century. National Portrait Gallery, Smithsonian Institution, NPG.70.3; via Wikimedia Commons.

CC0 / Smithsonian Open Access; public-domain artwork.

[Image source and rights record](https://firstladies.si.edu/object/npg_NPG.70.3)

### Martha Jefferson Randolph

Local file: `/portraits/randolph.jpg`.

Thomas Sully, Martha Jefferson Randolph. Image from Monticello via Wikimedia Commons.

Public-domain painting and faithful reproduction; artist died in 1872.

[Image source and rights record](https://commons.wikimedia.org/wiki/File:Martha_Jefferson_Randolph_portrait.jpg)

### Mary Todd Lincoln

Local file: `/portraits/mary-lincoln.jpg`.

Mathew Brady, Mary Todd Lincoln, circa 1861; crop by Materialscientist via Wikimedia Commons.

Public-domain historical photograph; Commons marks the cropped reproduction as public domain.

[Image source and rights record](https://commons.wikimedia.org/wiki/File:Mary_Todd_Lincoln2crop.jpg)

### Edith Roosevelt

Local file: `/portraits/edith-roosevelt.jpg`.

Frances Benjamin Johnston, Edith Roosevelt. Library of Congress; restored by Adam Cuerden; cropped version via Wikimedia Commons.

Public-domain historical photograph. Restorer grants unrestricted reuse and requests attribution.

[Image source and rights record](https://commons.wikimedia.org/wiki/File:Edith_Kermit_Carow_Roosevelt_by_Frances_Benjamin_Johnston_%28cropped%29.jpg)

### Jacqueline Kennedy

Local file: `/portraits/jacqueline-kennedy.jpg`.

Mark Shaw, Jacqueline Kennedy, 1961; originally in Look magazine; cropped reproduction via Wikimedia Commons.

Public domain in the U.S. due to nonrenewal of copyright as recorded by Commons; other jurisdictions may differ.

[Image source and rights record](https://commons.wikimedia.org/wiki/File:Jackie_Kennedy_Color_Portrait_%283x4_cropped%29.jpg)

## Other production assets

- `public/mascot.svg`: original Captain Facts illustration created for this project; inspired by the visual brief, not traced or extracted from the concept board.
- App icons and the White House scene: original artwork created for this project.
- DM Sans and Fraunces: locally bundled Fontsource packages, SIL Open Font License 1.1. License texts are retained in `public/licenses/`.
- Lucide icons: ISC license; license text retained in `public/licenses/`. Topic icons use SVG rather than platform-dependent emoji.

## Research backlog and limits

The Phase 4.1 follow-up resolves `dolley-madison-06` using inspected WHHA text. `dolley-madison-07` is now a verified fact using an inspected University of Virginia Press scholarly biography; its earlier Smithsonian limitation remains in the audit history. The original ten profiles retain their fifteen facts each. Each of the four Phase 3.2 profiles has ten facts; the eight Phase 3.3 profiles have eight to ten facts each. There are no editorial-target shortfalls. The current minimum is one sourced fact per published profile, with two or three interesting facts as the later research aim; the earlier eight-to-twelve target is superseded. Some biographies support multiple distinct facts; those claims share a source intentionally. Source pages can change, so periodically recheck the claims and record a new review date.

The data validator verifies IDs, relationships, service coverage, source syntax, metadata, question eligibility, and asset presence; it cannot establish historical truth or guarantee a remote website remains reachable. There is no automated claim-verification system.

## Phase 3.2 editorial policies

Phase 3.2 added John Adams, Abigail Adams, James Madison, and Dolley Madison. The following policies and mappings describe that completed batch, which added 40 facts, 12 source records, four portraits, six directed relationships, two service ranges, and two curated questions. Existing historical and question records and IDs are preserved.

### Evidence and source verification

`verification` continues to mean that the source supports the wording of the claim. Optional `evidence` describes the nature of the claim: `documented` for supported history, `disputed` for competing historical accounts, and `legend` for folklore whose existence can be sourced without proving the event happened. A checked source can document a legend; the two fields answer different questions. Absence of `evidence` preserves legacy records without retroactively declaring a new certainty assessment.

Every new fact is explicitly `documented`. No legend or disputed anecdote was needed to fill this batch. FactCard displays a plain-language uncertainty notice for disputed and legendary material, independently of the source-check label and citation. Rendering tests use fictional fixtures, never new historical claims.

### Gameplay eligibility

`gameEligible: true` records an editorial suitability review, not a generated question or a promise of an unambiguous clue. Each of the 40 new facts has an explicit boolean. Unverified, disputed, and legendary claims cannot qualify, even if marked eligible. For new content, omit the field only while editing: the default is informational only.

Legacy policy: the ten existing source facts already selected by the original curated questions are grandfathered through an explicit ID allowlist in `src/editorial.ts`. Other old facts without a decision are ineligible for new questions until reviewed. Explicit false overrides the allowlist; disputed/legendary evidence or unverified status also overrides it. This preserves old gameplay without treating all 150 legacy facts as ready-made quiz content. The existing rescue and Monticello questions are retained compatibility exceptions, not templates for new sensitive-topic clues; future editorial review may revisit them. No existing fact has been silently reclassified.

New informational-only facts: `john-adams-02` (fatal violence), `john-adams-08` (repression), `abigail-adams-05` (wartime reporting), `abigail-adams-07` (slavery), `abigail-adams-10` (repression), `james-madison-07` (war and destruction), `james-madison-08` (enslavement), `dolley-madison-02` (family deaths), `dolley-madison-08` (wartime flight and enslaved workers), and `dolley-madison-09` (enslavement and sale of people). All other new facts passed a non-sensitive subject review; they remain informational unless a separate question is authored.

The two new questions are `first-vice-president` → `john-adams-06` and `remember-the-ladies` → `abigail-adams-06`. Their stated offices and named correspondent distinguish the answers from all three distractors. Existing clues were reviewed against the expanded roster: Adams’s committee work is distinct from Jefferson’s first draft; Dolley’s hosting is distinct from Randolph’s specified daughter/season clue. No questions were automatically generated, and the Madisons need not receive questions in this batch.

### Relationships, service, and responsible wording

Dolley remains `first-lady` with James Madison as spouse. Two separately labeled, source-linked `administration-association` edges describe occasional hosting for Jefferson. These edges confer no formal title and never imply marriage. The original Jefferson–Randolph daughter/father graph remains intact. The Adams and Madison marriage sources also support their profile biographies and service context; presidential years are service ranges, not lifespans.

Presidents sort by their earliest structured service range, independent of JSON order. Spouses sort by the spouse administration; occasional administration associations do not move Dolley into Jefferson’s chronological position. Hostesses without spouse service metadata fall back to the first displayed service year. Multiple nonoverlapping service ranges for one president are allowed. Subtitles and service years still require editorial review; there is no comprehensive role system.

Slavery, illness, warfare, and restrictions on dissent are presented plainly and excluded from new quizzes. The portrait rescue wording credits staff through Paul Jennings’s memoir rather than claiming Dolley personally took down the painting. Institutional accounts differ on Jennings’s physical role; this batch does not resolve that detail or repeat attributed dialogue. The White House Historical Association’s collection entry identifies staff removal; its Dolley biography and the [NPS rescue article](https://www.nps.gov/articles/dolley-madison-washingtons-portrait.htm) corroborate her direction but differ in detail. No ice-cream invention, diminutive-height joke, or unsupported anecdote is included.

## Phase 3.2 source-to-fact mapping

All following records were reviewed October 15, 2026. URLs below are the cited records, not institutional homepages. Headline and description are original concise paraphrases. IDs are the precise crosswalk; some sources intentionally support several independent facts. Original-source records and mappings above remain unchanged.

### john-adams-bio

[National Park Service · John Adams biography](https://home.nps.gov/adam/john-adams-biography.htm)

Supports: `john-adams-01`, `john-adams-02`, `john-adams-03`, `john-adams-04`, `john-adams-05`.

Locator/review: Early Life; Young Lawyer; Patriot; Diplomat.

### john-adams-presidency

[National Park Service · Adams as president and retiree](https://home.nps.gov/adam/ja-bio-page2.htm)

Supports: `john-adams-06`, `john-adams-07`, `john-adams-09`, `john-adams-10`.

Locator/review: Vice President; Senior Statesman, including the November 1800 move, 1812 correspondence, and retirement.

### alien-sedition

[National Archives · Alien and Sedition Acts](https://www.archives.gov/milestone-documents/alien-and-sedition-acts)

Supports: `john-adams-08`.

Locator/review: Introductory explanation and the four acts; read alongside the NPS account for Adams’s signing. The NPS claim that Adams took no enforcement steps is not repeated.

### abigail-adams-bio

[National Park Service · Abigail Adams biography](https://www.nps.gov/adam/abigailbio.htm)

Supports: `abigail-adams-01`, `abigail-adams-02`, `abigail-adams-03`.

Locator/review: Early Life; Marriage and Pre-Revolutionary Years.

### abigail-adams-public-life

[National Park Service · Abigail Adams in public life](https://www.nps.gov/adam/abigailbio2.htm)

Supports: `abigail-adams-04`, `abigail-adams-05`, `abigail-adams-07`, `abigail-adams-08`, `abigail-adams-09`, `abigail-adams-10`.

Locator/review: Securing Liberty at Home and Abroad; Abigail Adams as First Lady. The NPS’s overly broad assertions about universal equality are not reproduced.

### remember-ladies

[National Park Service · Abigail Adams and women’s rights](https://www.nps.gov/people/abigail-adams.htm)

Supports: `abigail-adams-06`.

Locator/review: Transcribed passage from the March 1776 letter; context on education and women’s status. The MHS letter endpoint returned 502; its curriculum PDF downloaded, but the citation uses the fully readable NPS page rather than claiming a complete primary-letter review.

### james-madison-bio

[White House Historical Association · James Madison](https://www.whitehousehistory.org/bios/james-madison)

Supports: `james-madison-01`, `james-madison-04`, `james-madison-06`, `james-madison-07`, `james-madison-08`.

Locator/review: College, Federalist essays, secretary of state, presidential household, War of 1812. Biography and service context: election as fourth president, two terms, retirement in 1817.

### madison-treasures

[Library of Congress · Madison’s Treasures](https://loc.gov/exhibits/madison/objects.html)

Supports: `james-madison-02`, `james-madison-03`, `james-madison-09`, `james-madison-10`.

Locator/review: Family Tree (#obj0); congressional library proposal (#obj3); Virginia Plan (#obj6); Federal Convention (#obj9–11). Includes primary manuscript images and catalog explanations; notes are historical evidence, not a verbatim transcript of every speech.

### bill-rights-history

[National Archives · Making the Bill of Rights](https://www.archives.gov/founding-docs/bill-of-rights/how-did-it-happen)

Supports: `james-madison-05`.

Locator/review: Opposition to the Constitution; Introducing the Bill of Rights in the First Congress.

### dolley-madison-bio

[White House Historical Association · Dolley Madison](https://www.whitehousehistory.org/bios/dolley-madison)

Supports: `dolley-madison-01`, `dolley-madison-02`, `dolley-madison-03`, `dolley-madison-04`, `dolley-madison-05`, `dolley-madison-09`, `dolley-madison-10`.

Locator/review: Chronological biography; footnotes 3–7 and 10. Footnote 6 supports the distinct Jefferson association. Later life and sale of enslaved people are informational only.

### dolley-social-politics

[Smithsonian · Dolley Madison’s silk dress](https://avpreservation.si.edu/object/nmah_490927)

Earlier mapping: `dolley-madison-06`, `dolley-madison-07`. This source and its original check date are retained as review history; neither entry currently cites it. The Phase 4.1 retrieval failed. No image from this record is bundled.

### Phase 4.1 Dolley sourcing follow-up — October 18, 2026

`dolley-madison-06` now cites `dolley-weekly-receptions`:
[WHHA · An Essay on “The Splendid Mrs. Madison”](https://www.whitehousehistory.org/the-splendid-mrs-madison-in-the-elliptical-saloon-1810-1814-by-peter-waddell).
Full article text was retrieved and the paragraph about the purpose of the weekly receptions was
inspected. It supports opportunities for the parties to meet and talk, rather than guaranteeing
cooperation. The headline's Wednesday detail is corroborated by the inspected
[WHHA James Madison biography](https://www.whitehousehistory.org/bios/james-madison), paragraph on
Wednesday Drawing Rooms. Classification is `fact`; verification is `verified`.

The [State Department alternative](https://www.diplomaticrooms.state.gov/discover-the-rooms/dolley-madison-namesake/)
returned HTTP 403 on direct retrieval. Its indexed Life & Contributions text corroborates Wednesday
receptions and conversation across political views; the full page was not inspected and is not needed
for the resolved claim.

Earlier review of `dolley-madison-07` cited `dolley-embroidered-gown`:
[Smithsonian · Dolley Madison's embroidered gown](https://www.americanhistory.si.edu/collections/object/nmah_515208).
The revised description removes the job-favor claim and uses the proposed child-friendly account of
letters, visits, political events, and shared news. Search-index Description text supports that reading.
The www page returned HTTP 500 and the non-www URL timed out. This is **partial, index-only review**,
not fresh inspection of the full page. `checkedOn` records the limited review date; verification is
`unverified`, classification remains absent, and the earlier `evidence: documented` value is retained
as legacy metadata, not a fresh verification. Both entries remain informational (`gameEligible: false`).
That review did not resolve entry 07. The focused replacement-source pass below supersedes its pending status.

The focused pass retrieved [Holly C. Shulman’s scholarly biography](https://rotunda.upress.virginia.edu/dmde/bio-intro.xqy)
in the University of Virginia Press’s Dolley Madison Digital Edition. Its Early Years, Secretary of
State Years, and First Lady Years sections support the revised entry’s political conversations, social
visits, and letters. Entry 07 now cites `dolley-correspondence`, is classified `fact`, and is verified.
The wording avoids inferring why she exchanged information. Individual manuscripts were not separately
inspected. The old Smithsonian source and partial inspection record are preserved; its URL was not
retried. The pass also inspected WHHA’s “An American Icon,” Montpelier’s “Becoming America’s First Lady,”
the Library of Congress Dolley research guide, the National Archives Selected Letters project page,
Virginia Magazine’s interview with Shulman, and the Digital Edition introduction. They provided context;
the scholarly biography is the claim’s cited evidence. WHHA’s “Unraveling the Dolley Myths” redirected
to an Issuu issue shell without relevant article text and was not used as evidence.

### portrait-rescue

[White House Historical Association · Workers and the Washington portrait](https://www.whitehousehistory.org/galleries/enslaved-labor-in-the-white-house-white-house-collection)

Supports: `dolley-madison-08`.

Locator/review: George Washington, 1797 collection entry: Paul Jennings’s memoir distinguishes Dolley’s order from staff removal. Do not infer that she personally carried or cut out the painting.

## Phase 3.2 portrait provenance

The following four assets were visually checked against their institutional records. Each is a 250-pixel-wide RGB JPEG, proportionally resized with Lanczos and saved at quality 85 with optimization using already-installed Pillow. No retouching, restoration, or generative processing was performed. Existing CSS may crop or apply sepia. Original art and digital reproduction permissions are distinguished below. No dependencies or design-reference artwork were added.

| Person / local asset                             | Work and holding institution                                                                                                                              | Rights evidence                                                                                                                                                                                                                                                                  |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| John Adams — `/portraits/john-adams.jpg`         | Gilbert Stuart, c. 1821; National Gallery of Art, Washington; Ailsa Mellon Bruce Fund; 1979.4.1                                                           | [Object record](https://www.nga.gov/artworks/56913-john-adams) identifies the media as public domain.                                                                                                                                                                            |
| Abigail Adams — `/portraits/abigail-adams.jpg`   | Gilbert Stuart, 1800/1815; National Gallery of Art, Washington; Gift of Mrs. Robert Homans; 1954.7.2                                                      | [Object record](https://www.nga.gov/artworks/42934-abigail-smith-adams-mrs-john-adams) identifies the media as public domain.                                                                                                                                                    |
| James Madison — `/portraits/james-madison.jpg`   | Gilbert Stuart, c. 1821; National Gallery of Art, Washington; Ailsa Mellon Bruce Fund; 1979.4.2                                                           | [Object record](https://www.nga.gov/artworks/56914-james-madison) identifies the media as public domain.                                                                                                                                                                         |
| Dolley Madison — `/portraits/dolley-madison.jpg` | Gilbert Stuart, 1804; White House Collection, 994.1737.1; gift of the Walter H. and Phyllis J. Shorenstein Foundation in memory of Phyllis J. Shorenstein | [Commons file and rights record](https://commons.wikimedia.org/wiki/File:Dolley_Madison.jpg): public-domain painting and faithful reproduction (PD-Art, scoped to the United States). [Institutional identification](https://www.whitehousehistory.org/photos/dolley-madison-1). |

For the three NGA works, Stuart’s public-domain original and the digital files are separately covered: each object page explicitly permits its media, and the [NGA Open Access policy](https://www.nga.gov/terms-and-notices#open-access-policy) releases covered reproductions under CC0 for any use. This does not license all text or images on the institution’s site. For Dolley, the Commons file page separately explains the original’s expired copyright and faithful-reproduction status; its current file history credits Adam Cuerden’s 2019 upload of an unaltered reproduction, not a restoration. No broader claim about all WHHA photographs or international reproduction rights is made.

Direct downloaded image URLs:

- [John Adams](https://api.nga.gov/iiif/46052f6d-93b8-455c-987f-3817781b6c49/full/%21800%2C800/0/default.jpg)
- [Abigail Adams](https://api.nga.gov/iiif/3c07a617-32b9-4527-be7c-1cef37ca41ef/full/%21800%2C800/0/default.jpg)
- [James Madison](https://api.nga.gov/iiif/ab7f71b8-00f6-408f-847a-1ae2986be106/full/%21800%2C800/0/default.jpg)
- [Dolley Madison](https://upload.wikimedia.org/wikipedia/commons/8/8b/Dolley_Madison.jpg)

There are no unresolved portrait-license blockers in this batch. This is a scoped review of these four assets, not a renewed certification of the original ten portraits. All remote citations may change; offline access covers local facts, portraits, and gameplay, not external sources.

## Phase 3.3 editorial review

Phase 3.3 adds John Quincy Adams, Louisa Catherine Adams, Ulysses S. Grant, Julia Dent Grant, Calvin Coolidge, Grace Coolidge, Jimmy Carter, and Rosalynn Carter. These eight profiles add 74 facts, 26 source records, four presidential service ranges, eight reciprocal spouse relationships, and six curated questions. At the end of Phase 3.3, the collection contained 264 historical entries, 49 sources, and 18 Who Am I? questions. Existing profiles, facts, questions, and IDs are preserved. No other historical figures are included in this batch.

All 74 additions have explicit evidence classifications and gameplay decisions: 72 are `documented` and two are `legend`; 50 are game-eligible and 24 are informational only. `john-quincy-adams-10` presents the apocryphal Anne Royall swimming interview story, and `calvin-coolidge-08` presents the likely invented “You lose” exchange. Their citations establish the stories and their uncertainty, not the truth of the alleged events. Neither supplies a game clue. Sensitive history is informational only; source verification does not replace human editorial judgment.

The source records in [history.json](src/data/history.json) retain the exact institutional URLs and October 17, 2026 access dates; each fact's `sourceId` provides its source mapping. The new sources include National Park Service biographies and historical articles, White House Historical Association accounts, Carter Center biographies and recollections, the State Department's historical account of the 1924 Immigration Act, and a skeptical book review reprinted by the Coolidge Foundation. First-person memories and later retellings are distinguished in the fact wording.

All eight profiles use their approved local portraits, with item-level `sourceUrl`, `attribution`, and `rights` in `Person.image`. John Quincy Adams uses the Meade Brothers photographic copy (Smithsonian S/NPG.85.265, CC0); Jimmy Carter uses NARA 558522 with documented Naval Photographic Center provenance; Rosalynn Carter uses NARA 173749 with its public-domain staff-collection basis. The original exposure date and photographer remain unidentified where the records do not establish them. No portrait or historical claim was changed during this documentation update.
