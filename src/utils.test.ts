import { describe, it, expect } from 'vitest';
import { filterFacts, randomFact, parseFavorites, toggleId } from './utils';
import { people, facts, sources, categories, relationships, terms, relatedPeople } from './data';
import { validateData } from './data/validate';
const dataset = { people, facts, sources, categories, relationships, terms };
describe('fact discovery', () => {
  it('finds headlines, descriptions and names case insensitively', () => {
    expect(filterFacts(facts, { query: ' COCONUT ' })).toHaveLength(1);
    expect(filterFacts(facts, { query: 'ABRAHAM LINCOLN' })).toHaveLength(15);
  });
  it('combines category and person filters', () => {
    const result = filterFacts(facts, { category: 'arts', personId: 'jefferson' });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((f) => f.personId === 'jefferson' && f.category === 'arts')).toBe(true);
  });
  it('returns no matches for unknown search', () =>
    expect(filterFacts(facts, { query: 'nonexistent story' })).toEqual([]));
  it('excludes previous fact and handles empty or single pools', () => {
    expect(randomFact(facts, facts[0].id, () => 0)?.id).not.toBe(facts[0].id);
    expect(randomFact([])).toBeUndefined();
    expect(randomFact([facts[0]], facts[0].id)).toBe(facts[0]);
  });
});
describe('favorites', () => {
  it('adds and removes saved IDs', () => {
    expect(toggleId([], 'lincoln')).toEqual(['lincoln']);
    expect(toggleId(['lincoln'], 'lincoln')).toEqual([]);
  });
  it('recovers from corrupt or unexpected stored data', () => {
    for (const v of [null, '{', 'null', '42', '[]'])
      expect(parseFavorites(v)).toEqual({ people: [], facts: [] });
  });
  it('round trips both types, drops unknown IDs and deduplicates', () => {
    expect(
      parseFavorites(
        JSON.stringify({
          people: ['lincoln', 'lincoln', 'missing', 12],
          facts: [facts[0].id, 'missing'],
        }),
      ),
    ).toEqual({ people: ['lincoln'], facts: [facts[0].id] });
  });
});
describe('historical relationships', () => {
  it('distinguishes a daughter and hostess from a spouse', () => {
    const relation = relatedPeople('jefferson');
    expect(relation).toHaveLength(1);
    expect(relation[0].relationship.kind).toBe('daughter');
    expect(relation[0].person.kind).toBe('hostess');
    expect(relatedPeople('randolph')[0].relationship.kind).toBe('father');
  });
  it('supports reciprocal spouse navigation', () => {
    for (const id of ['washington', 'lincoln', 'roosevelt', 'kennedy']) {
      const relative = relatedPeople(id)[0];
      expect(relative.relationship.kind).toBe('spouse');
      expect(relatedPeople(relative.person.id)[0].person.id).toBe(id);
    }
  });
});
describe('data integrity', () => {
  it('validates all 150 facts and portrait metadata', () =>
    expect(validateData(dataset)).toEqual([]));
  it('rejects broken references and duplicate IDs', () => {
    const broken = {
      ...dataset,
      facts: [...facts, { ...facts[0], personId: 'missing', sourceId: 'missing' }],
    };
    const errors = validateData(broken);
    expect(errors.some((e) => e.includes('Duplicate fact'))).toBe(true);
    expect(errors.some((e) => e.includes('unknown person'))).toBe(true);
    expect(errors.some((e) => e.includes('unknown source'))).toBe(true);
  });
  it('rejects an inaccurate spouse relationship', () => {
    const broken = {
      ...dataset,
      relationships: [
        ...relationships,
        { from: 'jefferson', to: 'randolph', kind: 'spouse' as const, label: 'Spouse' },
      ],
    };
    expect(validateData(broken).some((e) => e.includes('not Jefferson'))).toBe(true);
  });
});
