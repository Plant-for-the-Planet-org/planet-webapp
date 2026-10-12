import type { Page } from '@playwright/test';

// A long-lived, donatable staging project, so read-only checks have stable data.
export const PROJECT = { slug: 'yucatan', name: 'Yucatán Restoration' };

// A card in the project list is a link that wraps the project image and its own Donate link.
export const projectCards = (page: Page) =>
  page
    .getByRole('main')
    .getByRole('link')
    .filter({ has: page.getByRole('link', { name: 'Donate', exact: true }) });
