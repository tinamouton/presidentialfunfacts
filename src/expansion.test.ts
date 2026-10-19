import { describe, expect, it } from 'vitest';
import { createSSRApp, h } from 'vue';
import { renderToString } from '@vue/server-renderer';
import { createPinia } from 'pinia';
import {
  people,
  facts,
  sources,
  categories,
  relationships,
  terms,
  relatedPeople,
  chronologicalPeople,
} from './data';
import { validateData, validateQuestions } from './data/validate';
import { whoAmIQuestions } from './data/whoAmI';
import { evidenceNotice, isGameEligible } from './editorial';
import { parseFavorites, randomFact } from './utils';
import FactCard from './components/FactCard.vue';
import type { Fact, Person, Relationship } from './models';

const dataset = { people, facts, sources, categories, relationships, terms };
const newIds = [
  'john-adams',
  'abigail-adams',
  'james-madison',
  'dolley-madison',
  'john-quincy-adams',
  'louisa-catherine-adams',
  'ulysses-s-grant',
  'julia-dent-grant',
  'calvin-coolidge',
  'grace-coolidge',
  'jimmy-carter',
  'rosalynn-carter',
];

describe('expansion foundations', () => {
  it('supports small collections, few facts per person and large collections without ceilings', () => {
    const subset = {
      ...dataset,
      people: [people[0]],
      facts: [facts[0]],
      relationships: [],
      terms: [terms[0]],
    };
    expect(validateData(subset)).toEqual([]);
    expect(
      validateData({
        ...subset,
        facts: Array.from({ length: 250 }, (_, index) => ({
          ...facts[0],
          id: `claim-${index}`,
          description: `Distinct claim ${index}`,
        })),
      }),
    ).toEqual([]);
  });

  it('allows nonconsecutive presidential service and rejects missing, overlapping or malformed service', () => {
    expect(
      validateData({
        ...dataset,
        terms: [...terms, { presidentId: 'john-adams', start: 2100, end: 2104, ordinal: 99 }],
      }),
    ).toEqual([]);
    for (const change of [
      { start: NaN },
      { end: 1788 },
      { ordinal: 1.5 },
      { presidentId: 'abigail-adams' },
    ]) {
      expect(
        validateData({ ...dataset, terms: [{ ...terms[0], ...change }, ...terms.slice(1)] }).join(),
      ).toContain('Invalid presidential term');
    }
    expect(
      validateData({
        ...dataset,
        terms: terms.filter((term) => term.presidentId !== 'john-adams'),
      }).join(),
    ).toContain('missing presidential service');
    expect(
      validateData({
        ...dataset,
        terms: [...terms, { presidentId: 'john-adams', start: 1798, end: 1802, ordinal: 99 }],
      }).join(),
    ).toContain('overlapping presidential service');
  });

  it('sorts presidents by structured service even when JSON and display text are out of order', () => {
    const presidents = people
      .filter((person) => person.kind === 'president')
      .toReversed()
      .map((person) => ({ ...person, years: '9999' }));
    expect(
      chronologicalPeople(presidents)
        .slice(0, 4)
        .map((person) => person.id),
    ).toEqual(['washington', 'john-adams', 'jefferson', 'james-madison']);
    expect(
      chronologicalPeople(people.filter((person) => person.kind !== 'president'))
        .slice(0, 4)
        .map((person) => person.id),
    ).toEqual(['martha-washington', 'abigail-adams', 'randolph', 'dolley-madison']);
  });

  it('keeps Dolley’s marriage distinct from her cited Jefferson association', () => {
    expect(people.find((person) => person.id === 'dolley-madison')?.kind).toBe('first-lady');
    const connections = relatedPeople('dolley-madison');
    expect(connections.find((item) => item.person.id === 'james-madison')?.relationship.kind).toBe(
      'spouse',
    );
    const association = connections.find((item) => item.person.id === 'jefferson')!.relationship;
    expect(association.kind).toBe('administration-association');
    expect(association.label).toContain('Occasional hosting');
    expect(sources.some((source) => source.id === association.sourceId)).toBe(true);
    expect(
      relationships.some(
        (item) =>
          item.kind === 'spouse' &&
          [item.from, item.to].includes('dolley-madison') &&
          [item.from, item.to].includes('jefferson'),
      ),
    ).toBe(false);
    expect(
      validateData({ ...dataset, relationships: [{ ...association, sourceId: 'missing' }] }).join(),
    ).toContain('Unknown relationship source');
    expect(
      validateData({
        ...dataset,
        relationships: [...relationships, { ...association, sourceId: undefined }],
      }).join(),
    ).toContain('Invalid administration association');
  });

  it('rejects invalid kinds, references, metadata and duplicate relationships', () => {
    const errors = validateData({
      ...dataset,
      people: [
        {
          ...people[0],
          kind: 'unknown' as Person['kind'],
          name: '',
          image: { ...people[0].image, sourceUrl: 'https://', path: '/portraits/../bad.jpg' },
        },
        ...people.slice(1),
      ],
      facts: [{ ...facts[0], category: 'unknown' as Fact['category'] }, ...facts.slice(1)],
      sources: [{ ...sources[0], name: '', checkedOn: '' }, ...sources.slice(1)],
      relationships: [
        ...relationships,
        relationships[0],
        { from: 'missing', to: 'washington', kind: 'unknown' as Relationship['kind'], label: '' },
      ],
    }).join();
    for (const message of [
      'invalid person kind',
      'missing person name',
      'missing image provenance',
      'unknown category',
      'missing source name',
      'missing review date',
      'Duplicate relationship',
      'Invalid relationship kind',
      'Missing relationship label',
      'Invalid relationship',
    ])
      expect(errors).toContain(message);
    for (const key of ['people', 'facts', 'sources', 'categories'] as const) {
      expect(
        validateData({ ...dataset, [key]: [...dataset[key], dataset[key][0]] }).join(),
      ).toContain('Duplicate');
    }
  });

  it('reports missing fact fields, image metadata, invalid dates and family edges', () => {
    expect(
      validateData({
        ...dataset,
        facts: [{ ...facts[0], description: undefined as unknown as string }, ...facts.slice(1)],
      }).join(),
    ).toContain('missing text');
    expect(
      validateData({
        ...dataset,
        people: [
          { ...people[0], image: undefined as unknown as Person['image'] },
          ...people.slice(1),
        ],
      }).join(),
    ).toContain('missing image provenance');
    expect(
      validateData({
        ...dataset,
        sources: [{ ...sources[0], checkedOn: '2026-02-30' }, ...sources.slice(1)],
      }).join(),
    ).toContain('review date');
    expect(
      validateData({
        ...dataset,
        relationships: relationships.filter((relationship) => relationship.kind !== 'father'),
      }).join(),
    ).toContain('reciprocal family');
    expect(
      validateData({
        ...dataset,
        relationships: relationships.filter(
          (relationship) => relationship.from !== 'abigail-adams',
        ),
      }).join(),
    ).toContain('reciprocal spouse');
  });

  it('reviews every new fact explicitly and preserves mixed old and new favorites', () => {
    for (const id of newIds) {
      const items = facts.filter((fact) => fact.personId === id);
      expect(items.length).toBeGreaterThan(0);
      for (const fact of items) {
        expect(['documented', 'disputed', 'legend']).toContain(fact.evidence);
        expect(typeof fact.gameEligible).toBe('boolean');
      }
      expect(randomFact(items, undefined, () => 0)?.personId).toBe(id);
    }
    const saved = {
      people: ['lincoln', ...newIds],
      facts: ['kennedy-08', ...newIds.map((id) => `${id}-01`)],
    };
    expect(parseFavorites(JSON.stringify(saved))).toEqual(saved);
  });
});

describe('evidence and curated gameplay', () => {
  it('grandfathers only existing curated clue facts, without changing legacy records', () => {
    expect(isGameEligible(facts.find((fact) => fact.id === 'kennedy-08')!)).toBe(true);
    expect(isGameEligible(facts.find((fact) => fact.id === 'washington-01')!)).toBe(false);
    expect(isGameEligible({ ...facts[0], gameEligible: true })).toBe(true);
    expect(evidenceNotice(facts[0])).toBeUndefined();
  });

  it.each(['disputed', 'legend', 'unverified', 'informational', 'missing-decision'] as const)(
    'rejects %s clue sources even if otherwise valid',
    (caseName) => {
      const question = whoAmIQuestions.find((question) => question.id === 'first-vice-president')!;
      const original = facts.find((fact) => fact.id === question.sourceFactId)!;
      const changed = { ...original };
      if (caseName === 'disputed' || caseName === 'legend') changed.evidence = caseName;
      if (caseName === 'unverified') changed.verification = 'unverified';
      if (caseName === 'informational') changed.gameEligible = false;
      if (caseName === 'missing-decision') delete changed.gameEligible;
      expect(isGameEligible(changed)).toBe(false);
      expect(
        validateQuestions(whoAmIQuestions, {
          ...dataset,
          facts: facts.map((fact) => (fact.id === changed.id ? changed : fact)),
        }).join(),
      ).toContain('invalid source fact');
    },
  );

  it('rejects invalid evidence, eligibility and duplicate clue text', () => {
    for (const change of [
      { evidence: 'rumor' as Fact['evidence'] },
      { gameEligible: 'yes' as unknown as boolean },
      { evidence: 'legend' as const, gameEligible: true },
    ]) {
      expect(
        validateData({ ...dataset, facts: [{ ...facts[0], ...change }, ...facts.slice(1)] }).join(),
      ).toMatch(/invalid evidence|invalid game|unsuitable game/);
    }
    expect(
      validateQuestions(
        [{ ...whoAmIQuestions[0], id: 'another-id' }, ...whoAmIQuestions],
        dataset,
      ).join(),
    ).toContain('Duplicate question clues');
  });

  it.each(['disputed', 'legend'] as const)(
    'renders %s uncertainty separately from source verification and attribution',
    async (evidence) => {
      // Fictional test fixture only; no folklore is inserted into the historical collection.
      const app = createSSRApp({
        render: () =>
          h(FactCard, {
            fact: { ...facts[0], headline: 'Test account', evidence, gameEligible: false },
          }),
      });
      app.use(createPinia());
      app.component('RouterLink', {
        render() {
          return h('span');
        },
      });
      const rendered = await renderToString(app);
      expect(rendered).toContain(
        evidence === 'disputed' ? 'historians disagree' : 'not an established event',
      );
      expect(rendered).toContain('Source checked');
      expect(rendered).toContain(sources.find((source) => source.id === facts[0].sourceId)!.url);
    },
  );
});

describe('historical source review dates', () => {
  it.each(['2026-10-15', '2026-04-30', '1900-02-28', '2024-02-29', '2000-02-29', '0000-02-29'])(
    'accepts the valid calendar date %s',
    (checkedOn) => {
      expect(
        validateData({ ...dataset, sources: [{ ...sources[0], checkedOn }, ...sources.slice(1)] }),
      ).toEqual([]);
    },
  );

  it.each<{ label: string; value: unknown }>([
    { label: 'impossible February day', value: '2026-02-30' },
    { label: 'non-leap year', value: '2023-02-29' },
    { label: 'non-leap century', value: '1900-02-29' },
    { label: 'future non-leap century', value: '2100-02-29' },
    { label: 'April 31', value: '2026-04-31' },
    { label: 'day zero', value: '2026-01-00' },
    { label: 'day 32', value: '2026-01-32' },
    { label: 'month zero', value: '2026-00-01' },
    { label: 'month 13', value: '2026-13-01' },
    { label: 'unpadded month', value: '2026-1-15' },
    { label: 'unpadded day', value: '2026-10-5' },
    { label: 'short year', value: '026-10-15' },
    { label: 'expanded year', value: '02026-10-15' },
    { label: 'alternate separators', value: '2026/10/15' },
    { label: 'leading space', value: ' 2026-10-15' },
    { label: 'trailing space', value: '2026-10-15 ' },
    { label: 'trailing newline', value: '2026-10-15\n' },
    { label: 'timestamp', value: '2026-10-15T00:00:00Z' },
    { label: 'arbitrary text', value: 'not a date' },
    { label: 'empty text', value: '' },
    { label: 'missing value', value: undefined },
    { label: 'null', value: null },
    { label: 'number', value: 20261015 },
    { label: 'boolean', value: true },
    { label: 'array', value: ['2026-10-15'] },
    { label: 'object', value: {} },
    { label: 'symbol', value: Symbol('review date') },
    {
      label: 'object that throws on string coercion',
      value: {
        toString() {
          throw new Error('Review dates must not be coerced');
        },
      },
    },
  ])('reports a validation error without throwing for $label', ({ value }) => {
    const errors = validateData({
      ...dataset,
      sources: [{ ...sources[0], checkedOn: value as string }, ...sources.slice(1)],
    });
    expect(errors).toContain(`${sources[0].id}: missing review date`);
  });
});
