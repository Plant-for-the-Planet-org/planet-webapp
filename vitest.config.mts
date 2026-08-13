import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // jsdom gives tests a browser environment (window, localStorage). Vitest would otherwise default to node.
    environment: 'jsdom',
    // Deliberately .ts only. Widening to .tsx pulls in YearHeader.test.tsx, which needs @testing-library/react (not installed yet). A .spec.js pattern would pull in the cypress tests, which do not run today.
    include: ['src/**/*.test.ts'],
    restoreMocks: true,
  },
});