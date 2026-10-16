import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import type { Person, Fact } from '../src/models';

const { people, facts }: { people: Person[]; facts: Fact[] } = JSON.parse(
  readFileSync('src/data/history.json', 'utf8'),
);
test('desktop discovery, favorites persistence, relationships and sources', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Big personalities. Surprising stories.' }),
  ).toBeVisible();
  await page.screenshot({ path: '/tmp/presidentialfunfacts-desktop.png', fullPage: true });
  await page.getByRole('link', { name: 'Explore the presidents', exact: true }).click();
  await expect(page.locator('.person-card')).toHaveCount(
    people.filter((person) => person.kind === 'president').length,
  );
  await page.getByRole('textbox', { name: 'Search people' }).fill('lincoln');
  await expect(page.locator('.person-card')).toHaveCount(1);
  await page.getByRole('button', { name: 'Save Abraham Lincoln', exact: true }).click();
  await page.getByRole('link', { name: 'Abraham Lincoln', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Abraham Lincoln', exact: true })).toBeVisible();
  const initial = await page.locator('.fact-card h3').textContent();
  await page.getByRole('button', { name: 'Next discovery' }).click();
  expect(await page.locator('.fact-card h3').textContent()).not.toBe(initial);
  await page.locator('.fact-card button').click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Saved to favorites' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.getByRole('link', { name: /Mary Todd Lincoln Spouse/ }).click();
  await expect(page.getByRole('heading', { name: 'Mary Todd Lincoln', exact: true })).toBeVisible();
  await page.goto('/person/jefferson');
  await page.getByRole('link', { name: /Martha Jefferson Randolph Daughter/ }).click();
  await expect(
    page.getByText('White House hostess · Jefferson administration', { exact: true }),
  ).toBeVisible();
  await page.goto('/favorites');
  await expect(page.locator('.fact-card')).toHaveCount(1);
  await page.getByRole('button', { name: /People 1/ }).click();
  await expect(page.locator('.person-card')).toHaveCount(1);
  await page.goto('/topics?category=arts');
  await expect(page.locator('.facts-grid .fact-card')).not.toHaveCount(0);
  await page.getByRole('textbox', { name: 'Search facts' }).fill('pulitzer');
  await expect(page.locator('.fact-card')).toHaveCount(1);
  await expect(page.locator('.source-row a')).toHaveAttribute('href', /jfklibrary.org/);
  await page.goto('/topics?category=random');
  const first = await page.locator('.fact-card h3').textContent();
  await page.getByRole('button', { name: 'Another surprise!' }).click();
  expect(await page.locator('.fact-card h3').textContent()).not.toBe(first);
  expect(errors).toEqual([]);
});
test('mobile pages have working navigation, loaded portraits and no page overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of [
    '/',
    '/presidents',
    '/first-ladies',
    '/topics',
    '/person/kennedy',
    '/person/john-adams',
    '/person/abigail-adams',
    '/person/james-madison',
    '/person/dolley-madison',
    '/topics?category=random',
    '/favorites',
  ]) {
    await page.goto(path);
    await page.locator('h1').waitFor();
    await page.locator('img').evaluateAll(async (imgs) => {
      await Promise.all(
        imgs.map((img) => {
          (img as HTMLImageElement).loading = 'eager';
          return (img as HTMLImageElement).decode();
        }),
      );
    });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
    await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible();
  }
  await page.goto('/');
  await page.screenshot({ path: '/tmp/presidentialfunfacts-mobile.png', fullPage: true });
  await page.getByRole('button', { name: 'Toggle menu' }).click();
  await page
    .getByRole('navigation', { name: 'More navigation' })
    .getByRole('link', { name: 'First Ladies' })
    .click();
  await expect(page.locator('.person-card')).toHaveCount(
    people.filter((person) => person.kind !== 'president').length,
  );
  await expect(page.getByRole('navigation', { name: 'More navigation' })).toHaveCount(0);
});
test('production PWA caches all portraits and fonts and loads routes offline', async ({
  page,
  context,
}) => {
  await page.goto('/');
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
  const manifest = await (await context.request.get('/manifest.webmanifest')).json();
  expect(manifest.display).toBe('standalone');
  expect(manifest.icons).toHaveLength(2);
  const cached = await page.evaluate(async () => {
    const names = await caches.keys();
    const all = await Promise.all(
      names.map(async (name) => (await (await caches.open(name)).keys()).map((r) => r.url)),
    );
    return all.flat();
  });
  expect(cached.filter((url) => url.includes('/portraits/'))).toHaveLength(people.length);
  expect(cached.some((url) => url.endsWith('.woff2'))).toBe(true);
  await context.setOffline(true);
  await page.goto('/first-ladies');
  await expect(page.getByRole('heading', { name: 'Meet the women.' })).toBeVisible();
  await expect(page.getByRole('status').filter({ hasText: 'You’re offline' })).toContainText(
    'You’re offline',
  );
  await page.locator('img').evaluateAll(async (imgs) => {
    await Promise.all(
      imgs.map((img) => {
        (img as HTMLImageElement).loading = 'eager';
        return (img as HTMLImageElement).decode();
      }),
    );
  });
  for (const person of people.filter((person) =>
    ['john-adams', 'abigail-adams', 'james-madison', 'dolley-madison'].includes(person.id),
  )) {
    await page.goto(`/person/${person.id}`);
    await expect(page.locator('h1')).toHaveText(person.name);
    await page
      .locator('.detail-portrait img')
      .evaluate((image) => (image as HTMLImageElement).decode());
    await expect(page.locator('.fact-card')).toBeVisible();
  }
  await page.goto('/games/who-am-i');
  await expect(page.locator('.choice')).toHaveCount(4);
  await page.goto('/topics?category=random');
  await expect(page.locator('.fact-card')).toBeVisible();
  await page.getByRole('button', { name: 'Another surprise!' }).click();
  await context.setOffline(false);
});

test('Random lives in Topics and old links redirect there', async ({ page }) => {
  await page.goto('/topics');
  await expect(
    page
      .getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link', { name: 'Random', exact: true }),
  ).toHaveCount(0);
  const random = page.getByRole('button', { name: 'Random Let Captain Facts choose a surprise.' });
  await random.click();
  await expect(random).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.random-fact .fact-card')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Search facts' })).toHaveCount(0);
  await page.getByLabel('Surprise me with').selectOption('arts');
  await expect(page.locator('.random-fact .pill')).toContainText('Arts & ideas');
  const initial = await page.locator('.random-fact h3').textContent();
  await page.getByRole('button', { name: 'Another surprise!' }).click();
  expect(await page.locator('.random-fact h3').textContent()).not.toBe(initial);
  await page.getByRole('button', { name: /Arts & ideas .*stories to discover/ }).click();
  await expect(random).toHaveAttribute('aria-pressed', 'false');
  await expect(page.getByRole('textbox', { name: 'Search facts' })).toBeVisible();
  await expect(page.locator('.random-stage')).toHaveCount(0);
  await page.goto('/random');
  await expect(page).toHaveURL(/\/topics\?category=random$/);
  await expect(page.locator('.random-fact .fact-card')).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(
    page
      .getByRole('navigation', { name: 'Mobile navigation' })
      .getByRole('link', { name: 'Topics' }),
  ).toBeVisible();
});

test('expanded profiles follow chronology, search, relationships and favorites', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('.trust-strip')).toContainText(`${facts.length} stories`);
  await page.goto('/presidents');
  const names = await page.locator('.person-card h3').allTextContents();
  expect(names.slice(0, 4)).toEqual([
    'George Washington',
    'John Adams',
    'Thomas Jefferson',
    'James Madison',
  ]);
  await page.getByRole('textbox', { name: 'Search people' }).fill('madison');
  await expect(page.locator('.person-card h3')).toHaveText(['James Madison']);
  await page.goto('/person/dolley-madison');
  await expect(page.locator('.connections')).toContainText('James MadisonSpouse');
  await page.getByRole('link', { name: /Thomas Jefferson Occasional hosting/ }).click();
  await expect(page.locator('.connections')).toContainText(
    'Occasional hostess during this administration',
  );
  await page.getByRole('link', { name: /Dolley Madison Occasional hostess/ }).click();
  await page.getByRole('button', { name: 'Save this person' }).click();
  await page.locator('.fact-card button').click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Saved to favorites' })).toBeVisible();
  await page.goto('/favorites');
  await expect(page.locator('.fact-card h3')).toHaveText('A North Carolina beginning');
  await page.getByRole('button', { name: /People 1/ }).click();
  await expect(page.locator('.person-card h3')).toHaveText('Dolley Madison');
  await page.goto('/topics');
  await page.getByRole('textbox', { name: 'Search facts' }).fill('abigail adams');
  await expect(page.locator('.fact-card')).toHaveCount(
    facts.filter(
      (fact) =>
        fact.personId === 'abigail-adams' ||
        fact.description.toLowerCase().includes('abigail adams'),
    ).length,
  );
});
