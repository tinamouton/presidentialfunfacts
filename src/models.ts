export type CategoryId = 'family' | 'firsts' | 'adventures' | 'arts' | 'legacy' | 'early-life';
export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  symbol: string;
  color: string;
}
export interface Source {
  id: string;
  name: string;
  url: string;
  checkedOn: string;
}
export interface HistoricalImage {
  path: string;
  sourceUrl: string;
  attribution: string;
  rights: string;
}
export interface PresidentialTerm {
  presidentId: string;
  start: number;
  end: number;
  ordinal: number;
}
export interface Person {
  id: string;
  name: string;
  kind: 'president' | 'first-lady' | 'hostess';
  years: string;
  subtitle: string;
  biography: string;
  image: HistoricalImage;
}
export interface Relationship {
  from: string;
  to: string;
  kind: 'spouse' | 'daughter' | 'father' | 'administration-association';
  label: string;
  sourceId?: string;
}
export interface Fact {
  id: string;
  personId: string;
  headline: string;
  description: string;
  category: CategoryId;
  sourceId: string;
  verification: 'verified' | 'unverified';
  // Historical certainty is separate from whether the cited source was checked.
  evidence?: 'documented' | 'disputed' | 'legend';
  // Absent means not yet classified; it never implicitly means fact.
  classification?: 'fact' | 'legend' | 'mystery';
  uncertainty?: string;
  // Suitability for separately authored questions; see the legacy policy in editorial.ts.
  gameEligible?: boolean;
}

export interface WhoAmIQuestion {
  id: string;
  clue: string;
  answerPersonId: string;
  choicePersonIds: string[];
  explanation: string;
  sourceFactId: string;
}
