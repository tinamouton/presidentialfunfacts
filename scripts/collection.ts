import type { Fact } from '../src/models';
import type { Dataset } from '../src/data/validate';

export interface ServicePeriod {
  start: string | null;
  end: string | null;
  precision: 'year' | 'approximate' | 'unknown';
}

export interface RosterRole {
  kind: 'president' | 'first-lady' | 'hostess';
  presidentId: string;
  relationship: string;
  status: 'served' | 'recognized-not-served';
  periods: ServicePeriod[];
  sourceIds: string[];
  ordinal?: number;
  notes?: string;
}

export interface Roster {
  asOf: string;
  sources: { id: string; name: string; url: string; inspectedOn: string }[];
  people: { id: string; name: string; roles: RosterRole[] }[];
  questions: string[];
}

export interface ClaimAudit {
  factId: string;
  sourceId: string;
  headline: string;
  claim: string;
  classification: Fact['classification'] | null;
  sourceStatus: 'inspected' | 'partial' | 'inaccessible' | 'not-inspected';
  support: 'supported' | 'qualified' | 'needs-review';
  locator: string;
  notes: string;
  additionalSourceIds?: string[];
}

export function validateRoster(roster: Roster, data: Dataset): string[] {
  const errors: string[] = [];
  const ids = roster.people.map((person) => person.id);
  const names = roster.people.map((person) => person.name.trim().toLowerCase());
  if (new Set(ids).size !== ids.length || new Set(names).size !== names.length)
    errors.push('Duplicate roster identities');
  const sourceIds = new Set(roster.sources.map((source) => source.id));
  if (sourceIds.size !== roster.sources.length) errors.push('Duplicate roster source IDs');
  for (const source of roster.sources) {
    try {
      if (new URL(source.url).protocol !== 'https:')
        errors.push(`${source.id}: insecure roster source`);
    } catch {
      errors.push(`${source.id}: invalid roster source URL`);
    }
    if (!source.name.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(source.inspectedOn))
      errors.push(`${source.id}: missing roster source metadata`);
  }
  const presidents = new Set(
    roster.people
      .filter((person) => person.roles.some((role) => role.kind === 'president'))
      .map((person) => person.id),
  );
  const ordinals: number[] = [];
  for (const person of roster.people) {
    if (
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(person.id) ||
      !person.name.trim() ||
      !person.roles.length
    )
      errors.push(`${person.id}: incomplete roster identity`);
    const roleKeys = new Set<string>();
    for (const role of person.roles) {
      const fail = (message: string) => errors.push(`${person.id}: ${message}`);
      const roleKey = JSON.stringify([role.kind, role.presidentId, role.ordinal, role.periods]);
      if (roleKeys.has(roleKey)) fail('duplicate role record');
      roleKeys.add(roleKey);
      if (!['president', 'first-lady', 'hostess'].includes(role.kind)) fail('invalid roster role');
      if (!presidents.has(role.presidentId)) fail('unknown associated president');
      if (!role.relationship.trim()) fail('missing relationship');
      if (!role.sourceIds.length || role.sourceIds.some((id) => !sourceIds.has(id)))
        fail('unknown or missing roster source');
      if (!['served', 'recognized-not-served'].includes(role.status))
        fail('invalid service status');
      if (role.status === 'recognized-not-served') {
        if (
          role.kind !== 'first-lady' ||
          role.relationship !== 'spouse' ||
          role.periods.length ||
          !role.notes?.trim()
        )
          fail('non-serving spouse must have explanation and no service periods');
      } else if (!role.periods.length) fail('missing service information');
      for (const period of role.periods) {
        if (!['year', 'approximate', 'unknown'].includes(period.precision))
          fail('invalid date precision');
        if ([period.start, period.end].some((value) => value !== null && !/^\d{4}$/.test(value)))
          fail('invalid service year');
        if (period.start !== null && period.end !== null && period.start > period.end)
          fail('reversed service years');
        if (period.precision === 'year' && !period.start) fail('missing service start');
        if (period.precision !== 'year' && !role.notes?.trim()) fail('uncertain dates need notes');
      }
      if (role.kind === 'president') {
        if (
          role.presidentId !== person.id ||
          role.status !== 'served' ||
          !Number.isInteger(role.ordinal) ||
          (role.ordinal ?? 0) < 1 ||
          role.periods.length !== 1
        )
          fail('invalid presidential service');
        if (role.ordinal !== undefined) ordinals.push(role.ordinal);
      } else if (role.ordinal !== undefined) fail('ordinal belongs to presidential service');
    }
    const service = person.roles
      .filter((role) => role.kind === 'president')
      .flatMap((role) => role.periods)
      .sort((a, b) => (a.start ?? '').localeCompare(b.start ?? ''));
    if (
      service.some(
        (period, index) =>
          index > 0 &&
          (service[index - 1].end === null || (period.start ?? '') < service[index - 1].end!),
      )
    )
      errors.push(`${person.id}: overlapping presidential service`);
  }
  if (new Set(ordinals).size !== ordinals.length)
    errors.push('Duplicate roster presidential ordinal');
  for (const person of data.people) {
    const entry = roster.people.find((entry) => entry.id === person.id);
    if (!entry) errors.push(`${person.id}: published profile missing from master roster`);
    else if (!entry.roles.some((role) => role.kind === person.kind))
      errors.push(`${person.id}: published role missing from master roster`);
  }
  for (const term of data.terms) {
    const role = roster.people
      .find((person) => person.id === term.presidentId)
      ?.roles.find((role) => role.ordinal === term.ordinal);
    if (
      !role ||
      role.periods[0]?.start !== String(term.start) ||
      role.periods[0]?.end !== String(term.end)
    )
      errors.push(`${term.presidentId}: published presidential service differs from roster`);
  }
  return errors;
}

export function validateAudit(audit: ClaimAudit[], data: Dataset): string[] {
  const errors: string[] = [];
  const ids = new Set(audit.map((entry) => entry.factId));
  if (ids.size !== audit.length) errors.push('Duplicate audit fact IDs');
  for (const fact of data.facts) {
    const entry = audit.find((entry) => entry.factId === fact.id);
    if (!entry) errors.push(`${fact.id}: missing audit record`);
    else {
      if (
        entry.sourceId !== fact.sourceId ||
        entry.headline !== fact.headline ||
        entry.claim !== fact.description ||
        entry.classification !== (fact.classification ?? null)
      )
        errors.push(`${fact.id}: stale audit record`);
      if (
        !['inspected', 'partial', 'inaccessible', 'not-inspected'].includes(entry.sourceStatus) ||
        !['supported', 'qualified', 'needs-review'].includes(entry.support)
      )
        errors.push(`${fact.id}: invalid audit status`);
      if (
        entry.support !== 'needs-review' &&
        (entry.sourceStatus !== 'inspected' || !entry.locator.trim())
      )
        errors.push(`${fact.id}: support requires inspected source and locator`);
      if (!entry.notes.trim()) errors.push(`${fact.id}: missing audit notes`);
      if (entry.additionalSourceIds?.some((id) => !data.sources.some((source) => source.id === id)))
        errors.push(`${fact.id}: unknown supplementary audit source`);
    }
  }
  if (audit.some((entry) => !data.facts.some((fact) => fact.id === entry.factId)))
    errors.push('Audit references unknown fact');
  return errors;
}

export function collectionCoverage(roster: Roster, data: Dataset) {
  const published = new Set(data.people.map((person) => person.id));
  const group = (kinds: RosterRole['kind'][]) => {
    const entries = roster.people.filter((person) =>
      person.roles.some((role) => kinds.includes(role.kind)),
    );
    return {
      total: entries.length,
      represented: entries.filter((person) => published.has(person.id)).length,
      missing: entries.filter((person) => !published.has(person.id)).map((person) => person.id),
    };
  };
  const presidentialRoles = roster.people.flatMap((person) =>
    person.roles.filter((role) => role.kind === 'president'),
  );
  const representedOrdinals = new Set(data.terms.map((term) => term.ordinal));
  return {
    presidents: group(['president']),
    firstLadiesAndHostesses: group(['first-lady', 'hostess']),
    numberedPresidencies: presidentialRoles.length,
    representedPresidencies: presidentialRoles.filter((role) =>
      representedOrdinals.has(role.ordinal!),
    ).length,
    publishedWithoutRoster: data.people
      .filter((person) => !roster.people.some((entry) => entry.id === person.id))
      .map((person) => person.id),
    belowMinimum: data.people
      .filter(
        (person) =>
          ![person.id, person.name, person.years, person.subtitle, person.biography].every(
            (value) => value?.trim(),
          ) ||
          !data.facts.some(
            (fact) =>
              fact.personId === person.id &&
              fact.classification === 'fact' &&
              fact.description.trim() &&
              data.sources.some((source) => source.id === fact.sourceId),
          ),
      )
      .map((person) => person.id),
    classifications: Object.fromEntries(
      ['fact', 'legend', 'mystery', 'unclassified'].map((kind) => [
        kind,
        data.facts.filter((fact) => (fact.classification ?? 'unclassified') === kind).length,
      ]),
    ),
  };
}
