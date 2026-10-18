import { test, expect } from '@playwright/test';
import { readFileSync, writeFileSync } from 'node:fs';

const base = '/presidentialfunfacts/';

test('repository URLs, manifest, worker scope, and offline favorites', async ({
  page,
  context,
}) => {
  await page.goto('./#/person/lincoln');
  await expect(page.locator('h1')).toHaveText('Abraham Lincoln');
  await page.reload();
  await expect(page.locator('h1')).toHaveText('Abraham Lincoln');
  const manifestURL = await page.locator('link[rel="manifest"]').getAttribute('href');
  expect(manifestURL).toBe(`${base}manifest.webmanifest`);
  const manifest = await (await context.request.get(manifestURL!)).json();
  expect(manifest.start_url).toBe(base);
  expect(manifest.scope).toBe(base);
  expect(manifest.icons.map((icon: { sizes: string }) => icon.sizes)).toEqual([
    '192x192',
    '512x512',
  ]);
  for (const icon of manifest.icons) {
    expect((await context.request.get(new URL(icon.src, page.url().split('#')[0]).href)).ok()).toBe(
      true,
    );
  }
  const scope = await page.evaluate(async () => (await navigator.serviceWorker.ready).scope);
  expect(new URL(scope).pathname).toBe(base);
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
  const urls = await page
    .locator('script[src], link[rel="stylesheet"], img')
    .evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute('src') ?? node.getAttribute('href')),
    );
  expect(urls.every((url) => url?.startsWith(base))).toBe(true);
  await page.getByRole('button', { name: 'Save this person' }).click();
  await context.setOffline(true);
  await page.goto('./#/favorites');
  await page.getByRole('button', { name: /People 1/ }).click();
  await expect(page.locator('.person-card h3')).toHaveText('Abraham Lincoln');
  await page.getByRole('button', { name: 'Unsave Abraham Lincoln' }).click();
  await page.reload();
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem('presidentialfunfacts:favorites:v1')!).people,
    ),
  ).toEqual([]);
  await page.goto('./#/games/who-am-i');
  await page.locator('.choice').first().click();
  await expect(page.locator('.discovery')).toBeVisible();
});

test('real waiting worker defers through a round, Later, and explicit update', async ({ page }) => {
  const original = readFileSync('dist/sw.js', 'utf8');
  try {
    await page.goto('./#/person/lincoln');
    await page.getByRole('button', { name: 'Save this person' }).click();
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready;
    });
    await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
    await page.goto('./#/games/who-am-i');
    const saved = await page.evaluate(() =>
      localStorage.getItem('presidentialfunfacts:favorites:v1'),
    );
    writeFileSync('dist/sw.js', `${original}\n// Release test ${Date.now()}\n`);
    await page.evaluate(async () => {
      await (await navigator.serviceWorker.ready).update();
    });
    await expect
      .poll(() => page.evaluate(async () => !!(await navigator.serviceWorker.ready).waiting))
      .toBe(true);
    await expect(page.locator('.update-banner')).toHaveCount(0);
    for (let index = 0; index < 5; index++) {
      await page.locator('.choice').first().click();
      await page
        .getByRole('button', { name: index === 4 ? 'Finish adventure' : 'Next Question' })
        .click();
    }
    await expect(page.locator('.update-banner')).toHaveCount(1);
    await page.getByRole('button', { name: 'Later', exact: true }).click();
    await expect(page.locator('.update-banner')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: /Huzzah/ })).toBeVisible();
    // A normal launch rediscovers the waiting worker without discarding it.
    await page.reload();
    await expect(page.locator('.update-banner')).toHaveCount(0);
    await page.getByRole('link', { name: 'Fun & Games', exact: true }).first().click();
    await expect(page.locator('.update-banner')).toHaveCount(1);
    await Promise.all([
      page.waitForEvent('load'),
      page.getByRole('button', { name: 'Update now', exact: true }).click(),
    ]);
    await expect
      .poll(() => page.evaluate(async () => !(await navigator.serviceWorker.ready).waiting))
      .toBe(true);
    await expect(page.locator('.update-banner')).toHaveCount(0);
    expect(
      await page.evaluate(() => localStorage.getItem('presidentialfunfacts:favorites:v1')),
    ).toBe(saved);
  } finally {
    writeFileSync('dist/sw.js', original);
  }
});
