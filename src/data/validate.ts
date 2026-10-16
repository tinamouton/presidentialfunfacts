import { isGameEligible } from '../editorial';
import type { Person, Fact, Relationship, Source, PresidentialTerm, Category } from '../models';
export interface Dataset {
  people: Person[];
  facts: Fact[];
  relationships: Relationship[];
  sources: Source[];
  terms: PresidentialTerm[];
  categories: Category[];
}
function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isReviewDate(value: unknown): boolean {
  if (typeof value !== 'string' || value.length !== 10 || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    return false;

  const [year, month, day] = value.split('-').map(Number);
  const isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  return month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth[month - 1];
}

function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

export function validateData(data: Dataset): string[] {
  const errors: string[] = [];
  const unique = (items: { id: string }[], name: string) => {
    const ids = items.map((x) => x.id);
    if (ids.some((id) => !hasText(id))) errors.push(`Missing ${name} ID`);
    if (new Set(ids).size !== ids.length) errors.push(`Duplicate ${name} IDs`);
  };
  for (const [items, name] of [
    [data.people, 'person'],
    [data.facts, 'fact'],
    [data.sources, 'source'],
    [data.categories, 'category'],
  ] as const)
    unique(items, name);
  const people = new Map(data.people.map((p) => [p.id, p])),
    sources = new Set(data.sources.map((s) => s.id)),
    categories = new Set(data.categories.map((c) => c.id)),
    claims = new Set<string>();

  for (const f of data.facts) {
    if (!people.has(f.personId)) errors.push(`${f.id}: unknown person`);
    if (!sources.has(f.sourceId)) errors.push(`${f.id}: unknown source`);
    if (!categories.has(f.category)) errors.push(`${f.id}: unknown category`);
    if (!hasText(f.id) || !hasText(f.headline) || !hasText(f.description))
      errors.push(`${f.id}: missing text`);
    if (f.verification !== 'verified' && f.verification !== 'unverified')
      errors.push(`${f.id}: invalid verification`);
    if (f.evidence !== undefined && !['documented', 'disputed', 'legend'].includes(f.evidence))
      errors.push(`${f.id}: invalid evidence classification`);
    if (f.gameEligible !== undefined && typeof f.gameEligible !== 'boolean')
      errors.push(`${f.id}: invalid game eligibility`);
    if (f.gameEligible === true && !isGameEligible(f))
      errors.push(`${f.id}: unsuitable game eligibility`);
    const claim = `${f.personId}:${hasText(f.description) ? f.description.trim().toLowerCase() : ''}`;
    if (claims.has(claim)) errors.push(`${f.id}: duplicate claim`);
    claims.add(claim);
  }
  for (const p of data.people) {
    if (!['president', 'first-lady', 'hostess'].includes(p.kind))
      errors.push(`${p.id}: invalid person kind`);
    if (!hasText(p.name)) errors.push(`${p.id}: missing person name`);
    if (
      !/^\/portraits\/[a-z0-9-]+\.(jpg|png|webp)$/.test(p.image?.path) ||
      !isHttpsUrl(p.image?.sourceUrl) ||
      !hasText(p.image?.rights) ||
      !hasText(p.image?.attribution)
    )
      errors.push(`${p.id}: missing image provenance`);
    if (![p.biography, p.years, p.subtitle].every(hasText))
      errors.push(`${p.id}: missing biography metadata`);
  }
  for (const category of data.categories) {
    if (![category.name, category.description, category.symbol, category.color].every(hasText))
      errors.push(`${category.id}: missing category metadata`);
  }
  for (const source of data.sources) {
    if (!hasText(source.name)) errors.push(`${source.id}: missing source name`);
    try {
      if (new URL(source.url).protocol !== 'https:') errors.push(`${source.id}: insecure source`);
    } catch {
      errors.push(`${source.id}: invalid source URL`);
    }
    if (!isReviewDate(source.checkedOn)) errors.push(`${source.id}: missing review date`);
  }
  const edges = new Set<string>();
  for (const r of data.relationships) {
    const edge = `${r.from}:${r.to}:${r.kind}`;
    if (edges.has(edge)) errors.push('Duplicate relationship');
    edges.add(edge);
    if (!['spouse', 'daughter', 'father', 'administration-association'].includes(r.kind))
      errors.push('Invalid relationship kind');
    if (!hasText(r.label)) errors.push('Missing relationship label');
    if (r.sourceId !== undefined && !sources.has(r.sourceId))
      errors.push('Unknown relationship source');
    if (
      r.kind === 'administration-association' &&
      (!r.sourceId || ![people.get(r.from)?.kind, people.get(r.to)?.kind].includes('president'))
    )
      errors.push('Invalid administration association');
    if (
      (r.kind === 'daughter' || r.kind === 'father') &&
      !data.relationships.some(
        (other) =>
          other.from === r.to &&
          other.to === r.from &&
          other.kind === (r.kind === 'daughter' ? 'father' : 'daughter'),
      )
    )
      errors.push('Missing reciprocal family relationship');
    if (!people.has(r.from) || !people.has(r.to) || r.from === r.to)
      errors.push('Invalid relationship');
    if (
      r.kind === 'spouse' &&
      !data.relationships.some((x) => x.from === r.to && x.to === r.from && x.kind === 'spouse')
    )
      errors.push('Missing reciprocal spouse relationship');
  }
  if (
    data.relationships.some(
      (r) => r.kind === 'spouse' && (r.from === 'randolph' || r.to === 'randolph'),
    )
  )
    errors.push('Randolph was a daughter, not Jefferson’s spouse');
  if (
    people.has('randolph') &&
    (!data.relationships.some(
      (r) => r.from === 'jefferson' && r.to === 'randolph' && r.kind === 'daughter',
    ) ||
      people.get('randolph')?.kind !== 'hostess')
  )
    errors.push('Missing accurate hostess relationship');
  for (const term of data.terms) {
    if (
      people.get(term.presidentId)?.kind !== 'president' ||
      !Number.isInteger(term.start) ||
      !Number.isInteger(term.end) ||
      term.start >= term.end ||
      !Number.isInteger(term.ordinal) ||
      term.ordinal < 1
    )
      errors.push('Invalid presidential term');
  }
  const ordinals = data.terms.map((term) => term.ordinal);
  if (new Set(ordinals).size !== ordinals.length) errors.push('Duplicate presidential ordinal');
  for (const person of data.people.filter((person) => person.kind === 'president')) {
    const service = data.terms
      .filter((term) => term.presidentId === person.id)
      .sort((a, b) => a.start - b.start);
    if (!service.length) errors.push(`${person.id}: missing presidential service`);
    if (service.some((term, index) => index > 0 && term.start < service[index - 1].end))
      errors.push(`${person.id}: overlapping presidential service`);
  }
  return errors;
}

export function validateQuestions(
  questions: import('../models').WhoAmIQuestion[],
  data: Pick<Dataset, 'people' | 'facts' | 'sources'>,
): string[] {
  const errors: string[] = [];
  const ids = new Set(questions.map((question) => question.id));
  if (ids.size !== questions.length) errors.push('Duplicate question IDs');
  const clues = questions.map((question) => question.clue.trim().toLowerCase());
  if (new Set(clues).size !== clues.length) errors.push('Duplicate question clues');
  const personIds = new Set(data.people.map((person) => person.id));
  for (const question of questions) {
    const fail = (message: string) => errors.push(`${question.id}: ${message}`);
    if (!question.id.trim() || !question.clue.trim() || !question.explanation.trim())
      fail('missing question text');
    if (
      !personIds.has(question.answerPersonId) ||
      question.choicePersonIds.some((id) => !personIds.has(id))
    )
      fail('unknown person');
    if (question.choicePersonIds.length !== 4 || new Set(question.choicePersonIds).size !== 4)
      fail('expected four distinct choices');
    if (!question.choicePersonIds.includes(question.answerPersonId)) fail('missing correct answer');
    const fact = data.facts.find((item) => item.id === question.sourceFactId);
    const source = data.sources.find((item) => item.id === fact?.sourceId);
    if (!fact || !isGameEligible(fact) || fact.personId !== question.answerPersonId)
      fail('invalid source fact');
    try {
      if (!source?.name.trim() || new URL(source.url).protocol !== 'https:')
        fail('invalid source reference');
    } catch {
      fail('invalid source reference');
    }
  }
  if (errors.length || ids.size < 5)
    errors.push('Expected at least five valid questions and no invalid questions');
  return errors;
}
