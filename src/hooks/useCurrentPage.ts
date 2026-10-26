import type { Page } from '../stores/viewStore';

import { useRouter } from 'next/router';

/**
 * Derives the current page from `router.pathname`, which is known on the first render, on both server and client.
 * Unlike `router.query`, it needs no `router.isReady` wait, so a page-gated component cannot miss its mount on a `null` first render (see #3010).
 */
export const useCurrentPage = (): Page => {
  const { pathname } = useRouter();

  if (pathname === '/sites/[slug]/[locale]') return 'project-list';
  if (pathname === '/sites/[slug]/[locale]/[p]') return 'project-details';
  return null;
};
