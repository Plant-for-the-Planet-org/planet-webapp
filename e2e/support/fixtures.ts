import { test as base, expect } from '@playwright/test';

// Specs import `test` from here instead of `@playwright/test`, so every test also fails when the page throws an uncaught error, which is how React crashes show up.
export const test = base.extend({
  page: async ({ page }, use) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    await use(page);

    expect(pageErrors, 'Uncaught errors in the page').toEqual([]);
  },
});

export { expect };
