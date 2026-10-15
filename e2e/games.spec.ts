import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import type { WhoAmIQuestion, Person, Fact, Source } from '../src/models';

const whoAmIQuestions: WhoAmIQuestion[] = JSON.parse(readFileSync('src/data/whoAmI.json', 'utf8'));
const history: { people: Person[]; facts: Fact[]; sources: Source[] } = JSON.parse(
  readFileSync('src/data/history.json', 'utf8'),
);
const { facts } = history;
const personById = (id: string) => history.people.find((person) => person.id === id);
const sourceById = (id: string) => history.sources.find((source) => source.id === id)!;

test('keyboard answers lock, reveal sources, progress, complete and restart', async ({ page }) => {
  await page.goto('/games');
  await page.getByRole('link', { name: 'Play Who Am I?' }).click();
  const seen = new Set<string>();
  for (let index = 0; index < 5; index++) {
    await expect(page.getByRole('heading', { name: `Question ${index + 1} of 5` })).toBeVisible();
    const clue = await page.locator('.clue').textContent();
    const question = whoAmIQuestions.find((item) => item.clue === clue)!;
    expect(question).toBeTruthy();
    expect(seen.has(question.id)).toBe(false);
    seen.add(question.id);
    const choices = page.getByRole('group').getByRole('button');
    await expect(choices).toHaveCount(4);
    await expect(page.locator('.discovery')).toHaveCount(0);
    const personId =
      index % 2 === 0
        ? question.answerPersonId
        : question.choicePersonIds.find((id) => id !== question.answerPersonId)!;
    const selected = page.getByRole('button', { name: personById(personId)!.name, exact: true });
    await selected.focus();
    await page.keyboard.press('Enter');
    await expect(
      page.getByRole('status').filter({ hasText: /You got it|Good guess/ }),
    ).toBeVisible();
    await expect(page.locator('.correct')).toContainText('✓ Correct answer');
    await expect(page.locator('.correct')).toContainText(personById(question.answerPersonId)!.name);
    for (const choice of await choices.all())
      await expect(choice).toHaveAttribute('aria-disabled', 'true');
    const feedback = await page.locator('.feedback').textContent();
    await choices.first().focus();
    await page.keyboard.press('Enter');
    expect(await page.locator('.feedback').textContent()).toBe(feedback);
    await expect(page.locator('.discovery')).toContainText(question.explanation);
    const fact = facts.find((item) => item.id === question.sourceFactId)!;
    await expect(page.locator('.source')).toHaveAttribute('href', sourceById(fact.sourceId).url);
    await expect(page.locator('.profile-link')).toHaveAttribute(
      'href',
      `/person/${question.answerPersonId}`,
    );
    await page
      .getByRole('button', { name: index === 4 ? 'Finish adventure' : 'Next Question' })
      .click();
    await expect(page.locator('h1')).toBeFocused();
  }
  await expect(page.getByRole('heading', { name: /Huzzah/ })).toBeVisible();
  await page.getByRole('button', { name: 'Play Again' }).click();
  await expect(page.getByRole('heading', { name: 'Question 1 of 5' })).toBeFocused();
  await expect(page.locator('.discovery')).toHaveCount(0);
  await expect(page.getByRole('group').getByRole('button', { pressed: true })).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Question 1 of 5' })).toBeVisible();
});

test('Fun & Games navigation and layouts fit phone, tablet and desktop', async ({ page }) => {
  for (const width of [320, 390, 768, 980, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ['/games', '/games/who-am-i']) {
      await page.goto(path);
      await expect(page.locator('h1')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      if (path.endsWith('who-am-i')) {
        await page.locator('.choice').first().click();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
          true,
        );
      }
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page
    .getByRole('navigation', { name: 'Mobile navigation' })
    .getByRole('link', { name: 'Fun & Games' })
    .click();
  await expect(page.getByRole('heading', { name: 'Fun & Games' })).toBeVisible();
  await page.screenshot({ path: '/tmp/presidentialfunfacts-games-mobile.png', fullPage: true });
});
