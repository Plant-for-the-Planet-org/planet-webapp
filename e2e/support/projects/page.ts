import type { Page } from '@playwright/test';

import { expect } from '../fixtures';

// Found by test ID, not by role: each card is a link that wraps its own Donate link, which is invalid HTML and likely to change.
export const projectCards = (page: Page) =>
  page.getByTestId('project-list-item');

// A tab message ends with a tagged project count, such as `All <projectCountContainer>({noOfProjects})</projectCountContainer>`, so match only the words before it.
export const projectListTab = (page: Page, message: string) =>
  page.getByRole('tab', { name: message.split('<')[0].trim() });

// The message appears twice: once on screen and once in the live region for screen readers.
// Check both copies separately because Playwright also counts the visually hidden copy as visible.
export const expectStatusMessage = async (page: Page, message: string) => {
  await expect(
    page
      .getByText(message, { exact: true })
      .and(page.locator(':not([role="status"])'))
  ).toBeVisible();
  await expect(
    page.getByRole('status').filter({ hasText: message })
  ).toHaveText(message);
};
