import { renderHook } from '@testing-library/react';
import { useLocale } from 'next-intl';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useInitializeLanguage } from './useInitializeLanguage';

vi.mock('next-intl', () => ({ useLocale: vi.fn() }));

// #3015: this hook is the only writer of `localStorage.language`, which the donation and login screens read.
describe('useInitializeLanguage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('writes the current locale to localStorage.language', () => {
    vi.mocked(useLocale).mockReturnValue('de');

    renderHook(() => useInitializeLanguage());

    expect(localStorage.getItem('language')).toBe('de');
  });

  it('updates localStorage.language when the locale changes', () => {
    vi.mocked(useLocale).mockReturnValue('en');
    const { rerender } = renderHook(() => useInitializeLanguage());

    vi.mocked(useLocale).mockReturnValue('fr');
    rerender();

    expect(localStorage.getItem('language')).toBe('fr');
  });
});
