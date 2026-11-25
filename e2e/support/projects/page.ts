import type { Page } from '@playwright/test';

import { expect } from '../fixtures';

// Found by test ID, not by role: the card wrapper is a plain div with no role. The card's own link sits on top of the card and does not wrap its content.
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
