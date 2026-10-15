import { describe, expect, it } from 'vitest';
import { createRound, isCorrectAnswer, shuffle } from './games';
import { whoAmIQuestions } from './data/whoAmI';
import { people, facts, sources } from './data';
import { validateQuestions } from './data/validate';

const dataset = { people, facts, sources };

describe('Who Am I? rounds', () => {
  it('selects five unique questions with four distinct choices and the answer present', () => {
    for (const rng of [() => 0, () => 0.5, () => 0.999]) {
      const round = createRound(whoAmIQuestions, rng);
      expect(round).toHaveLength(5);
      expect(new Set(round.map((question) => question.id)).size).toBe(5);
      for (const question of round) {
        expect(new Set(question.choicePersonIds).size).toBe(4);
        expect(question.choicePersonIds).toContain(question.answerPersonId);
      }
    }
  });

  it('shuffles deterministically without changing the curated pool', () => {
    const original = structuredClone(whoAmIQuestions);
    expect(createRound(whoAmIQuestions, () => 0)).toEqual(createRound(whoAmIQuestions, () => 0));
    expect(createRound(whoAmIQuestions, () => 0)).not.toEqual(
      createRound(whoAmIQuestions, () => 0.999),
    );
    expect(whoAmIQuestions).toEqual(original);
    expect(shuffle([], () => 0)).toEqual([]);
    expect(() => createRound(whoAmIQuestions.slice(0, 4))).toThrow(/five/);
  });

  it('evaluates the correct answer and a different choice', () => {
    for (const question of whoAmIQuestions) {
      expect(isCorrectAnswer(question, question.answerPersonId)).toBe(true);
      const other = question.choicePersonIds.find((id) => id !== question.answerPersonId)!;
      expect(isCorrectAnswer(question, other)).toBe(false);
    }
  });
});

describe('curated question validation', () => {
  it('validates the actual dataset', () => {
    expect(validateQuestions(whoAmIQuestions, dataset)).toEqual([]);
  });

  it.each([
    ['missing question text', { clue: ' ' }],
    ['missing question text', { explanation: '' }],
    ['unknown person', { answerPersonId: 'missing' }],
    ['unknown person', { choicePersonIds: ['kennedy', 'jefferson', 'lincoln', 'missing'] }],
    ['four distinct choices', { choicePersonIds: ['kennedy', 'kennedy', 'lincoln', 'jefferson'] }],
    ['four distinct choices', { choicePersonIds: ['kennedy'] }],
    [
      'missing correct answer',
      { choicePersonIds: ['washington', 'jefferson', 'lincoln', 'roosevelt'] },
    ],
    ['invalid source fact', { sourceFactId: 'missing' }],
    ['invalid source fact', { sourceFactId: 'jefferson-01' }],
  ])('rejects %s', (message, change) => {
    const questions = [{ ...whoAmIQuestions[0], ...change }, ...whoAmIQuestions.slice(1)];
    expect(validateQuestions(questions, dataset).join('\n')).toContain(message);
  });

  it('rejects duplicate IDs, small pools, unverified facts and unusable sources', () => {
    expect(validateQuestions([...whoAmIQuestions, whoAmIQuestions[0]], dataset).join()).toContain(
      'Duplicate',
    );
    expect(validateQuestions(whoAmIQuestions.slice(0, 4), dataset).join()).toContain('five valid');
    const changedFacts = facts.map((fact) => ({ ...fact, verification: 'unverified' as const }));
    expect(
      validateQuestions(whoAmIQuestions, { ...dataset, facts: changedFacts }).join(),
    ).toContain('invalid source fact');
    for (const url of ['invalid', 'http://example.org']) {
      const changedSources = sources.map((source) => ({ ...source, url }));
      expect(
        validateQuestions(whoAmIQuestions, { ...dataset, sources: changedSources }).join(),
      ).toContain('invalid source reference');
    }
    expect(validateQuestions(whoAmIQuestions, { ...dataset, sources: [] }).join()).toContain(
      'invalid source reference',
    );
  });
});
