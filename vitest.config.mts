import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    // Mirrors the `@/*` path in tsconfig.json.
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  // An inline config stops Vite from loading postcss.config.js, whose string plugin names only Next.js understands. Tests do not need PostCSS output.
  css: { postcss: {} },
  test: {
    // jsdom gives tests a browser environment (window, localStorage). Vitest would otherwise default to node.
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}', '*.test.ts'],
    // Unmounts rendered hooks after each test, since globals are off. See the file for why.
    setupFiles: ['./src/test-utils/setup.ts'],
    // The app logs verbosely by design, so hide console output while tests pass and show it in full when one fails.
    silent: 'passed-only',
    // restoreMocks alone does not clear call history on vi.fn mocks, so counts leak between tests and break assertions like toHaveBeenCalledExactlyOnceWith.
    clearMocks: true,
    restoreMocks: true,
  },
});
