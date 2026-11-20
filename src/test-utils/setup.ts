import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Unmount everything a test rendered once it ends. Otherwise hooks from earlier tests stay mounted and react to later tests' routers and store changes.
// Testing Library does this by itself only when afterEach is a global. Vitest globals are off here, so this file does it instead.
afterEach(() => cleanup());
