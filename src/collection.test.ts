import { describe, expect, it } from 'vitest';
import { createSSRApp, h } from 'vue';
import { renderToString } from '@vue/server-renderer';
import { createPinia } from 'pinia';
import rosterJson from '../research/roster.json';
import auditJson from '../research/audit.json';
import {
  collectionCoverage,
  validateRoster,
  validateAudit,
  type Roster,
  type ClaimAudit,
} from '../scripts/collection';
import { people, facts, sources, categories, relationships, terms } from './data';
import { validateData, validateQuestions } from './data/validate';
import { whoAmIQuestions } from './data/whoAmI';
import { evidenceNotice, isGameEligible } from './editorial';
import { parseFavorites, STORAGE_KEY } from './utils';
import type { Fact } from './models';
import FactCard from './components/FactCard.vue';

const dataset = { people, facts, sources, categories, relationships, terms };
const roster = rosterJson as Roster;
const audit = auditJson.claims as ClaimAudit[];
const withFact = (fact: Fact) => ({ ...dataset, facts: [fact, ...facts.slice(1)] });

describe('Phase 4.1 roster and coverage', () => {
  it('validates sourced identities and preserves every published ID', () => {
    expect(validateRoster(roster, dataset)).toEqual([]);
    const coverage = collectionCoverage(roster, dataset);
    expect(coverage.presidents).toMatchObject({ total: 45, represented: 11 });
    expect(coverage.presidents.missing).toHaveLength(34);
    expect(coverage.firstLadiesAndHostesses).toMatchObject({ total: 71, represented: 11 });
    expect(coverage.firstLadiesAndHostesses.missing).toHaveLength(60);
    expect(coverage.numberedPresidencies).toBe(47);
    expect(coverage.representedPresidencies).toBe(11);
    expect(coverage.publishedWithoutRoster).toEqual([]);
    expect(coverage.belowMinimum).toEqual([]);
    const ordinals = roster.people
      .flatMap((person) => person.roles.flatMap((role) => (role.ordinal ? [role.ordinal] : [])))
      .sort((a, b) => a - b);
    expect(ordinals).toEqual(Array.from({ length: 47 }, (_, index) => index + 1));
  });

  it('counts repeated presidencies and First Lady tenures once per person', () => {
    for (const [id, ordinals] of [
      ['grover-cleveland', [22, 24]],
      ['donald-trump', [45, 47]],
    ] as const) {
      expect(roster.people.filter((person) => person.id === id)).toHaveLength(1);
      expect(
        roster.people.find((person) => person.id === id)!.roles.map((role) => role.ordinal),
      ).toEqual(ordinals);
    }
    expect(
      roster.people
        .find((person) => person.id === 'frances-cleveland')!
        .roles.map((role) => role.periods[0].start),
    ).toEqual(['1886', '1893']);
    expect(
      roster.people.find((person) => person.id === 'donald-trump')!.roles[1].periods[0].end,
    ).toBeNull();
  });

  it('accepts year-level ranges for presidencies shorter than one year', () => {
    // Structural fixture only; this does not change Washington's published service.
    expect(
      validateData({
        ...dataset,
        terms: [{ ...terms[0], end: terms[0].start }, ...terms.slice(1)],
      }),
    ).toEqual([]);
    for (const id of ['william-henry-harrison', 'james-a-garfield']) {
      const period = roster.people.find((person) => person.id === id)!.roles[0].periods[0];
      expect(period.start).toBe(period.end);
    }
  });

  it('allows overlapping substitutes, multiple administrations, and unknown dates', () => {
    const dolley = roster.people.find((person) => person.id === 'dolley-madison')!;
    expect(dolley.roles.map((role) => role.presidentId)).toEqual(['james-madison', 'jefferson']);
    const jackson = roster.people.filter((person) =>
      person.roles.some((role) => role.kind === 'hostess' && role.presidentId === 'andrew-jackson'),
    );
    expect(jackson).toHaveLength(2);
    expect(jackson.every((person) => person.roles[0].periods[0].end! >= '1834')).toBe(true);
    expect(
      roster.people.find((person) => person.id === 'mary-c-hoyt')!.roles[0].periods[0],
    ).toEqual({ start: null, end: null, precision: 'unknown' });
    expect(validateRoster(roster, dataset)).toEqual([]);
  });

  it('does not invent service for spouses who died before the presidency', () => {
    for (const id of [
      'martha-wayles-jefferson',
      'rachel-jackson',
      'hannah-van-buren',
      'ellen-arthur',
    ]) {
      const role = roster.people.find((person) => person.id === id)!.roles[0];
      expect(role.status).toBe('recognized-not-served');
      expect(role.periods).toEqual([]);
      const changed = structuredClone(roster);
      changed.people
        .find((person) => person.id === id)!
        .roles[0].periods.push({ start: '1801', end: '1809', precision: 'year' });
      expect(validateRoster(changed, dataset).join()).toContain('non-serving spouse');
    }
    expect(roster.people.find((person) => person.id === 'anna-harrison')!.roles[0].notes).toContain(
      'never occupied',
    );
    expect(roster.people.find((person) => person.id === 'harriet-lane')!.roles[0]).toMatchObject({
      kind: 'hostess',
      relationship: 'niece',
      presidentId: 'james-buchanan',
    });
  });

  it('rejects duplicate identities, invalid sources, and contradictory presidential periods', () => {
    const duplicate = structuredClone(roster);
    duplicate.people.push({ ...duplicate.people[0], id: 'another-washington' });
    expect(validateRoster(duplicate, dataset).join()).toContain('Duplicate roster identities');
    const broken = structuredClone(roster);
    broken.people[0].roles[0].sourceIds = ['missing'];
    broken.people[0].roles[0].presidentId = 'unknown';
    expect(validateRoster(broken, dataset).join()).toMatch(/unknown associated president/);
    expect(validateRoster(broken, dataset).join()).toContain('unknown or missing roster source');
    const overlapping = structuredClone(roster);
    overlapping.people.find(
      (person) => person.id === 'grover-cleveland',
    )!.roles[1].periods[0].start = '1888';
    expect(validateRoster(overlapping, dataset).join()).toContain(
      'overlapping presidential service',
    );
  });

  it('distinguishes absent public content from missing canonical identities', () => {
    const absentProfile = {
      ...dataset,
      people: people.filter((person) => person.id !== 'washington'),
      terms: terms.filter((term) => term.presidentId !== 'washington'),
    };
    expect(collectionCoverage(roster, absentProfile).presidents.missing).toContain('washington');
    const missingIdentity = {
      ...roster,
      people: roster.people.filter((person) => person.id !== 'washington'),
    };
    expect(collectionCoverage(missingIdentity, dataset).publishedWithoutRoster).toContain(
      'washington',
    );
    expect(validateRoster(missingIdentity, dataset).join()).toContain(
      'published profile missing from master roster',
    );
    expect(roster.people.length).toBeGreaterThan(people.length);
  });
});

describe('historical classifications and published minimums', () => {
  it.each(['fact', 'legend', 'mystery'] as const)(
    'accepts %s and renders uncertainty when applicable',
    async (classification) => {
      const fact: Fact = {
        ...facts[0],
        classification,
        uncertainty:
          classification === 'fact' ? undefined : 'Historians are still checking this test story.',
        evidence: undefined,
        gameEligible: false,
      };
      expect(validateData(withFact(fact))).toEqual([]);
      const app = createSSRApp({ render: () => h(FactCard, { fact }) });
      app.use(createPinia());
      app.component('RouterLink', { render: () => h('span') });
      const markup = await renderToString(app);
      if (classification === 'fact') expect(evidenceNotice(fact)).toBeUndefined();
      else {
        expect(markup).toContain(classification === 'legend' ? 'Legend' : 'Mystery');
        expect(markup).toContain(fact.uncertainty);
        expect(isGameEligible({ ...fact, gameEligible: true })).toBe(false);
      }
    },
  );

  it('rejects invalid classifications, missing explanations, and incompatible evidence', () => {
    expect(
      validateData(
        withFact({ ...facts[0], classification: 'rumor' as Fact['classification'] }),
      ).join(),
    ).toContain('invalid historical classification');
    for (const classification of ['legend', 'mystery'] as const) {
      expect(
        validateData(withFact({ ...facts[0], classification, uncertainty: ' ' })).join(),
      ).toContain('missing uncertainty explanation');
    }
    expect(
      validateData(withFact({ ...facts[0], classification: 'fact', evidence: 'legend' })).join(),
    ).toContain('conflicting historical classifications');
    expect(
      validateData(
        withFact({
          ...facts[0],
          classification: 'legend',
          evidence: 'documented',
          uncertainty: 'Uncertain.',
        }),
      ).join(),
    ).toContain('conflicting historical classifications');
  });

  it('requires one sourced entry and metadata only for published profiles', () => {
    const emptyProfile = {
      ...dataset,
      facts: facts.filter((fact) => fact.personId !== people[0].id),
    };
    expect(validateData(emptyProfile).join()).toContain(
      'published profile needs at least one sourced',
    );
    expect(collectionCoverage(roster, emptyProfile).belowMinimum).toContain(people[0].id);
    const subset = {
      ...dataset,
      people: [people[0]],
      facts: [facts[0]],
      relationships: [],
      terms: [terms[0]],
    };
    expect(validateData(subset)).toEqual([]);
    expect(validateRoster(roster, subset)).toEqual([]);
    expect(validateData({ ...subset, people: [{ ...people[0], biography: '' }] }).join()).toContain(
      'missing biography metadata',
    );
    expect(
      validateData({ ...subset, facts: [{ ...facts[0], sourceId: 'missing' }] }).join(),
    ).toContain('unknown source');
  });

  it('preserves quiz behavior and favorites while excluding uncertainty and incomplete review', () => {
    expect(validateQuestions(whoAmIQuestions, dataset)).toEqual([]);
    for (const question of whoAmIQuestions) {
      expect(facts.find((fact) => fact.id === question.sourceFactId)!.classification).toBe('fact');
    }
    const unsupported = {
      ...facts[0],
      classification: undefined,
      evidence: undefined,
      gameEligible: true,
    };
    expect(isGameEligible(unsupported)).toBe(false);
    expect(STORAGE_KEY).toBe('presidentialfunfacts:favorites:v1');
    const saved = {
      people: ['washington', 'randolph'],
      facts: ['washington-01', 'john-quincy-adams-10', 'dolley-madison-07'],
    };
    expect(parseFavorites(JSON.stringify(saved))).toEqual(saved);
  });

  it('tracks source inspection separately from reference existence and earlier checks', () => {
    expect(validateAudit(audit, dataset)).toEqual([]);
    const unresolved = audit.filter((entry) => entry.support === 'needs-review');
    expect(unresolved).toEqual([]);
    expect(collectionCoverage(roster, dataset).classifications).toEqual({
      fact: 262,
      legend: 2,
      mystery: 0,
      unclassified: 0,
    });
    const reception = facts.find((fact) => fact.id === 'dolley-madison-06')!;
    expect(reception).toMatchObject({
      sourceId: 'dolley-weekly-receptions',
      classification: 'fact',
      verification: 'verified',
      gameEligible: false,
    });
    expect(audit.find((entry) => entry.factId === reception.id)).toMatchObject({
      sourceStatus: 'inspected',
      support: 'supported',
      additionalSourceIds: ['james-madison-bio'],
    });
    expect(facts.find((fact) => fact.id === 'dolley-madison-07')).toMatchObject({
      sourceId: 'dolley-correspondence',
      classification: 'fact',
      verification: 'verified',
      gameEligible: false,
    });
    expect(audit.find((entry) => entry.factId === 'dolley-madison-07')).toMatchObject({
      sourceStatus: 'inspected',
      support: 'supported',
    });
    expect(
      validateAudit(
        audit.map((entry) =>
          entry.factId === 'dolley-madison-07' ? { ...entry, sourceStatus: 'partial' } : entry,
        ),
        dataset,
      ).join(),
    ).toContain('support requires inspected source');
    expect(validateAudit(audit.slice(1), dataset).join()).toContain('missing audit record');
    expect(
      validateAudit([{ ...audit[0], claim: 'Changed' }, ...audit.slice(1)], dataset).join(),
    ).toContain('stale audit record');
    expect(
      validateAudit(
        [{ ...audit[0], sourceStatus: 'not-inspected' }, ...audit.slice(1)],
        dataset,
      ).join(),
    ).toContain('support requires inspected source');
  });
});
