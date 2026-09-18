import type { Page } from '../stores/viewStore';

import { useRouter } from 'next/router';

/**
 * Derives the current page from `router.pathname`, which is known
 * synchronously on both server and client. Unlike `router.query`, this needs
 * no `router.isReady` wait, so there is no `null` window during which a
 * page-gated render can permanently miss its mount (see issue #3010).
 */
export const useCurrentPage = (): Page => {
  const { pathname } = useRouter();

  if (pathname === '/sites/[slug]/[locale]') return 'project-list';
  if (pathname === '/sites/[slug]/[locale]/[p]') return 'project-details';
  return null;
};
