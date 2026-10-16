import type { Fact } from './models';

// Only the existing curated clues are grandfathered in. Missing metadata never
// opens the rest of the legacy collection to new questions.
const legacyClueFactIds = new Set([
  'kennedy-08',
  'kennedy-15',
  'jefferson-08',
  'jefferson-06',
  'randolph-11',
  'randolph-14',
  'edith-roosevelt-14',
  'edith-roosevelt-11',
  'jacqueline-kennedy-08',
  'jacqueline-kennedy-02',
]);

export function isGameEligible(fact: Fact): boolean {
  return (
    fact.verification === 'verified' &&
    (fact.evidence === undefined || fact.evidence === 'documented') &&
    (fact.gameEligible === true ||
      (fact.gameEligible === undefined && legacyClueFactIds.has(fact.id)))
  );
}

export function evidenceNotice(fact: Fact): string | undefined {
  if (fact.evidence === 'disputed') {
    return 'Disputed account — historians disagree about this claim.';
  }
  if (fact.evidence === 'legend') {
    return 'Legend — this story is part of historical folklore, not an established event.';
  }
  return undefined;
}
