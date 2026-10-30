import type { Page } from '@playwright/test';

import { test, expect } from '../../support/fixtures';
import {
  LOCALE,
  allProjectsText as text,
  countryText,
} from '../../support/i18n';
import { PROJECT, projectCards, projectListTab } from '../../support/projects';

const NO_RESULTS = text.noProjectFound;
const NO_MATCH_QUERY = 'zzqx no such project';

// Role locators, not test IDs: they also check that each control has a label a screen reader can read.
const searchBox = (page: Page) =>
  page.getByRole('textbox', { name: text.searchProject });

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
  await page.getByRole('button', { name: text.searchProject }).click();
  await searchBox(page).fill(query);
};

test.beforeEach(async ({ page }) => {
  await page.goto(`/${LOCALE}`);
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

test('a country name finds the projects in that country and hides the rest', async ({
  page,
}) => {
  // On staging, Italy is in no project's name, location or TPO, so any result can only come from the country name.
  const italy = countryText.it;
  // The list starts with projects from many countries, so the check for other cards below cannot pass before the search applies.
  await expect(projectCards(page).first()).toBeVisible();

  await searchFor(page, italy);

  await expect(projectCards(page).filter({ hasNotText: italy })).toHaveCount(0);
  await expect(
    projectCards(page).filter({ hasText: italy }).first()
  ).toBeVisible();
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

  await page.getByRole('button', { name: text.clearSearch }).click();

  await expect(searchBox(page)).toBeHidden();
  await expect(projectListTab(page, text.topProjects)).toHaveAttribute(
    'aria-selected',
    'true'
  );
  for (const name of listedNames) {
    await expect(projectImage(page, name)).toBeVisible();
  }

  // The next search starts from an empty box, not the old query.
  await page.getByRole('button', { name: text.searchProject }).click();
  await expect(searchBox(page)).toHaveValue('');
});
