import type { Person, Fact, Relationship, Source, PresidentialTerm, Category } from '../models';
export interface Dataset {
  people: Person[];
  facts: Fact[];
  relationships: Relationship[];
  sources: Source[];
  terms: PresidentialTerm[];
  categories: Category[];
}
export function validateData(data: Dataset): string[] {
  const errors: string[] = [];
  const unique = (items: { id: string }[], name: string) => {
    const ids = items.map((x) => x.id);
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
  if (data.people.length !== 10) errors.push('Expected ten people');
  if (data.facts.length < 150 || data.facts.length > 200) errors.push('Expected 150–200 facts');
  for (const f of data.facts) {
    if (!people.has(f.personId)) errors.push(`${f.id}: unknown person`);
    if (!sources.has(f.sourceId)) errors.push(`${f.id}: unknown source`);
    if (!categories.has(f.category)) errors.push(`${f.id}: unknown category`);
    if (!f.id || !f.headline.trim() || !f.description.trim()) errors.push(`${f.id}: missing text`);
    if (f.verification !== 'verified' && f.verification !== 'unverified')
      errors.push(`${f.id}: invalid verification`);
    const claim = `${f.personId}:${f.description.toLowerCase()}`;
    if (claims.has(claim)) errors.push(`${f.id}: duplicate claim`);
    claims.add(claim);
  }
  for (const p of data.people) {
    const count = data.facts.filter((f) => f.personId === p.id).length;
    if (count < 15 || count > 20) errors.push(`${p.id}: expected 15–20 facts, found ${count}`);
    if (
      !p.image.path.startsWith('/portraits/') ||
      !p.image.sourceUrl.startsWith('https://') ||
      !p.image.rights ||
      !p.image.attribution
    )
      errors.push(`${p.id}: missing image provenance`);
    if (!p.biography || !p.years || !p.subtitle) errors.push(`${p.id}: missing biography metadata`);
  }
  for (const source of data.sources) {
    try {
      if (new URL(source.url).protocol !== 'https:') errors.push(`${source.id}: insecure source`);
    } catch {
      errors.push(`${source.id}: invalid source URL`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(source.checkedOn))
      errors.push(`${source.id}: missing review date`);
  }
  for (const r of data.relationships) {
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
    !data.relationships.some(
      (r) => r.from === 'jefferson' && r.to === 'randolph' && r.kind === 'daughter',
    ) ||
    people.get('randolph')?.kind !== 'hostess'
  )
    errors.push('Missing accurate hostess relationship');
  for (const term of data.terms) {
    if (
      people.get(term.presidentId)?.kind !== 'president' ||
      term.start >= term.end ||
      term.ordinal < 1
    )
      errors.push('Invalid presidential term');
  }
  if (data.terms.length !== 5 || new Set(data.terms.map((t) => t.presidentId)).size !== 5)
    errors.push('Expected one term range per president');
  return errors;
}
