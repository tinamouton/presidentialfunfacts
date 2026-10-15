import type { WhoAmIQuestion } from './models';

export const ROUND_LENGTH = 5;

export function shuffle<T>(items: readonly T[], rng: () => number = Math.random): T[] {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index--) {
    const other = Math.floor(rng() * (index + 1));
    [shuffled[index], shuffled[other]] = [shuffled[other], shuffled[index]];
  }
  return shuffled;
}

export function createRound(questions: WhoAmIQuestion[], rng: () => number = Math.random) {
  if (new Set(questions.map((question) => question.id)).size < ROUND_LENGTH) {
    throw new Error('Who Am I? needs at least five unique questions.');
  }
  return shuffle(questions, rng)
    .slice(0, ROUND_LENGTH)
    .map((question) => ({
      ...question,
      choicePersonIds: shuffle(question.choicePersonIds, rng),
    }));
}

export function isCorrectAnswer(question: WhoAmIQuestion, personId: string): boolean {
  return question.answerPersonId === personId;
}
