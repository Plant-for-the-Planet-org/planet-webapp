import type { Page } from '@playwright/test';

// A long-lived, donatable staging project, so read-only checks have stable data.
export const PROJECT = { slug: 'yucatan', name: 'Yucatán Restoration' };

// Found by test ID, not by role: each card is a link that wraps its own Donate link, which is invalid HTML and likely to change.
export const projectCards = (page: Page) =>
  page.getByTestId('project-list-item');
