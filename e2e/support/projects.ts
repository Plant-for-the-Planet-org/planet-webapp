import type { Page } from '@playwright/test';

// A long-lived, donatable staging project, so read-only checks have stable data.
export const PROJECT = { slug: 'yucatan', name: 'Yucatán Restoration' };

// Found by test ID, not by role: each card is a link that wraps its own Donate link, which is invalid HTML and likely to change.
export const projectCards = (page: Page) =>
  page.getByTestId('project-list-item');

// A tab message ends with a tagged project count, such as `All <projectCountContainer>({noOfProjects})</projectCountContainer>`, so match only the words before it.
export const projectListTab = (page: Page, message: string) =>
  page.getByRole('tab', { name: message.split('<')[0].trim() });
