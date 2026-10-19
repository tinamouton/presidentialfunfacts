import rosterJson from '../research/roster.json';
import auditJson from '../research/audit.json';
import { people, facts, sources, categories, relationships, terms } from '../src/data';
import { whoAmIQuestions } from '../src/data/whoAmI';
import { collectionCoverage, type Roster, type ClaimAudit } from './collection';

const roster = rosterJson as Roster;
const audit = auditJson.claims as ClaimAudit[];
const coverage = collectionCoverage(roster, {
  people,
  facts,
  sources,
  categories,
  relationships,
  terms,
});
console.log(`Historical coverage (roster as of ${roster.asOf})`);
console.log(
  `Presidents: ${coverage.presidents.total} distinct; ${coverage.presidents.represented} published; ${coverage.presidents.missing.length} missing profiles`,
);
console.log(
  `Numbered presidencies: ${coverage.numberedPresidencies} roster; ${coverage.representedPresidencies} published`,
);
console.log(
  `First Ladies / hostesses: ${coverage.firstLadiesAndHostesses.total} distinct; ${coverage.firstLadiesAndHostesses.represented} published; ${coverage.firstLadiesAndHostesses.missing.length} missing profiles`,
);
console.log(
  `Published identities missing from roster: ${coverage.publishedWithoutRoster.join(', ') || 'none'}`,
);
console.log(`Below published minimum: ${coverage.belowMinimum.join(', ') || 'none'}`);
console.log(`Classifications: ${JSON.stringify(coverage.classifications)}`);
console.log(
  `Historical sources: ${sources.length}; separate roster references: ${roster.sources.length}; Who Am I? questions: ${whoAmIQuestions.length}`,
);
for (const status of ['supported', 'qualified', 'needs-review'])
  console.log(`Audit ${status}: ${audit.filter((entry) => entry.support === status).length}`);
for (const status of ['inspected', 'partial', 'inaccessible', 'not-inspected']) {
  const entries = audit.filter((entry) => entry.sourceStatus === status);
  console.log(
    `Audit source ${status}: ${entries.length} claims / ${new Set(entries.map((entry) => entry.sourceId)).size} cited sources`,
  );
}
console.log(`Missing president profiles: ${coverage.presidents.missing.join(', ')}`);
console.log(
  `Missing First Lady / hostess profiles: ${coverage.firstLadiesAndHostesses.missing.join(', ')}`,
);
console.log('Unresolved roster questions:');
for (const question of roster.questions) console.log(`- ${question}`);
console.log('Unresolved source/claim review (research/audit.json):');
for (const entry of audit.filter((entry) => entry.support === 'needs-review'))
  console.log(`- ${entry.factId} [${entry.sourceId}]: ${entry.notes}`);
