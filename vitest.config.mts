import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // jsdom gives tests a browser environment (window, localStorage). Vitest would otherwise default to node.
    environment: 'jsdom',
    // Deliberately .ts only. Widening to .tsx pulls in YearHeader.test.tsx, which needs @testing-library/react (not installed yet). A .spec.js pattern would pull in the cypress tests, which do not run today.
    include: ['src/**/*.test.ts', '*.test.ts'],
    // The app logs verbosely by design, so hide console output while tests pass and show it in full when one fails.
    silent: 'passed-only',
    // restoreMocks alone does not clear call history on vi.fn mocks, so counts leak between tests and break assertions like toHaveBeenCalledExactlyOnceWith.
    clearMocks: true,
    restoreMocks: true,
  },
});
