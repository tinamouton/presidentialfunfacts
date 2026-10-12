import { people, facts } from './data';
import type { Fact, CategoryId } from './models';
export function filterFacts(
  items: Fact[],
  options: { query?: string; category?: CategoryId | ''; personId?: string } = {},
): Fact[] {
  const query = (options.query ?? '').trim().toLocaleLowerCase();
  return items.filter(
    (f) =>
      (!options.category || f.category === options.category) &&
      (!options.personId || f.personId === options.personId) &&
      (!query ||
        [f.headline, f.description, people.find((p) => p.id === f.personId)?.name ?? '']
          .join(' ')
          .toLocaleLowerCase()
          .includes(query)),
  );
}
export function randomFact(
  items: Fact[] = facts,
  previousId?: string,
  rng: () => number = Math.random,
): Fact | undefined {
  const choices = items.length > 1 ? items.filter((f) => f.id !== previousId) : items;
  return choices[Math.min(choices.length - 1, Math.floor(rng() * choices.length))];
}
export interface SavedItems {
  people: string[];
  facts: string[];
}
export const STORAGE_KEY = 'presidentialfunfacts:favorites:v1';
export function parseFavorites(value: string | null): SavedItems {
  try {
    const parsed: unknown = JSON.parse(value ?? 'null');
    if (!parsed || typeof parsed !== 'object') return { people: [], facts: [] };
    const record = parsed as Record<string, unknown>;
    const valid = (v: unknown, ids: Set<string>) =>
      Array.isArray(v)
        ? [...new Set(v.filter((id): id is string => typeof id === 'string' && ids.has(id)))]
        : [];
    return {
      people: valid(record.people, new Set(people.map((p) => p.id))),
      facts: valid(record.facts, new Set(facts.map((f) => f.id))),
    };
  } catch {
    return { people: [], facts: [] };
  }
}
export function toggleId(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
}
