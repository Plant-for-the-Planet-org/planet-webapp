import type { Page } from '@playwright/test';

import { test, expect } from './fixtures';
import { PROJECT, projectCards } from './projects';

const NO_RESULTS = 'Oops! No project found';
const NO_MATCH_QUERY = 'zzqx no such project';

const searchBox = (page: Page) =>
  page.getByRole('textbox', { name: 'Search Project' });

// The project image's alt text is the full project name.
const projectImage = (page: Page, name: string) =>
  page.getByRole('main').getByRole('img', { name, exact: true });

// The list only mounts the few cards near the top, so these are the names of those cards, not the whole list.
const listedProjectNames = async (page: Page) => {
  const images = projectCards(page).getByRole('img', { name: /./ });
  await expect(images.first()).toBeVisible();
  return images.evaluateAll((imgs) =>
    imgs.map((img) => img.getAttribute('alt') ?? '')
  );
};

// The list applies the typed text about a second after the last key press, so check results with auto-retrying assertions only.
const searchFor = async (page: Page, query: string) => {
  await page.getByRole('button', { name: 'Search Project' }).click();
  await searchBox(page).fill(query);
};

test.beforeEach(async ({ page }) => {
  await page.goto('/en');
});

test('a project name typed without its accent finds the project and hides the rest', async ({
  page,
}) => {
  // The API decides the list order and it changes over time, so the project may already be on screen.
  const otherNames = (await listedProjectNames(page)).filter(
    (name) => name !== PROJECT.name
  );
  expect(otherNames.length).toBeGreaterThan(0);

  // The full name, because `yucatan` alone also matches any project located in Yucatán.
  await searchFor(page, 'yucatan restoration');

  await expect(projectImage(page, PROJECT.name)).toBeVisible();
  for (const name of otherNames) {
    await expect(projectImage(page, name)).toBeHidden();
  }
});

test('a search with no match shows the no-results message and no projects', async ({
  page,
}) => {
  await searchFor(page, NO_MATCH_QUERY);

  await expect(page.getByText(NO_RESULTS)).toBeVisible();
  await expect(projectCards(page)).toHaveCount(0);
});

test('emptying the search box brings back the project list', async ({
  page,
}) => {
  const listedNames = await listedProjectNames(page);
  await searchFor(page, NO_MATCH_QUERY);
  await expect(page.getByText(NO_RESULTS)).toBeVisible();

  await searchBox(page).fill('');

  for (const name of listedNames) {
    await expect(projectImage(page, name)).toBeVisible();
  }
  await expect(searchBox(page)).toBeVisible();
});

test('Clear search closes the search and brings back the Top Projects list', async ({
  page,
}) => {
  const listedNames = await listedProjectNames(page);
  await searchFor(page, NO_MATCH_QUERY);
  await expect(page.getByText(NO_RESULTS)).toBeVisible();

  await page.getByRole('button', { name: 'Clear search' }).click();

  await expect(searchBox(page)).toBeHidden();
  await expect(
    page.getByRole('tab', { name: /^Top Projects/ })
  ).toHaveAttribute('aria-selected', 'true');
  for (const name of listedNames) {
    await expect(projectImage(page, name)).toBeVisible();
  }

  // The next search starts from an empty box, not the old query.
  await page.getByRole('button', { name: 'Search Project' }).click();
  await expect(searchBox(page)).toHaveValue('');
});
