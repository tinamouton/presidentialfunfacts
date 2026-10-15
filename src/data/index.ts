import raw from './history.json';
import type { Category, Fact, Person, PresidentialTerm, Relationship, Source } from '../models';
export const people = raw.people as Person[];
export const facts = raw.facts as Fact[];
export const relationships = raw.relationships as Relationship[];
export const terms = raw.terms as PresidentialTerm[];
export const sources = raw.sources as Source[];
export const categories: Category[] = [
  {
    id: 'early-life',
    name: 'Growing up',
    description: 'Small beginnings, remarkable lives.',
    symbol: '🌱',
    color: 'sage',
  },
  {
    id: 'family',
    name: 'Family & home',
    description: 'Meet the people behind the portraits.',
    symbol: '🏡',
    color: 'red',
  },
  {
    id: 'adventures',
    name: 'Adventures',
    description: 'Unexpected journeys and daring deeds.',
    symbol: '🧭',
    color: 'blue',
  },
  {
    id: 'arts',
    name: 'Arts & ideas',
    description: 'Books, buildings, and big imaginations.',
    symbol: '🪶',
    color: 'gold',
  },
  {
    id: 'firsts',
    name: 'Presidential firsts',
    description: 'There’s a first time for everything.',
    symbol: '⭐',
    color: 'gold',
  },
  {
    id: 'legacy',
    name: 'Making history',
    description: 'Achievements, contradictions, and change.',
    symbol: '📜',
    color: 'sage',
  },
];
export const personById = (id: string) => people.find((p) => p.id === id);
export const sourceById = (id: string) => sources.find((s) => s.id === id)!;
export const relatedPeople = (id: string) =>
  relationships
    .filter((r) => r.from === id)
    .map((r) => ({ relationship: r, person: personById(r.to)! }));

export const randomTopic = {
  id: 'random' as const,
  name: 'Random',
  description: 'Let Captain Facts choose a surprise.',
  symbol: '✦',
  color: 'gold',
};
