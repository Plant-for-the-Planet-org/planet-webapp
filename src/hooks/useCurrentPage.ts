import { useRouter } from 'next/router';

/** Pages that support embed mode. Single source of truth for the `Page` type and the `isEmbeddablePage` check. */
export const EMBEDDABLE_PAGES = ['project-list', 'project-details'] as const;
export type EmbeddablePage = (typeof EMBEDDABLE_PAGES)[number];

/** `null` means the current route is not a project page. */
export type Page = EmbeddablePage | null;

/** Whether the given page is one that supports embed mode. */
export const isEmbeddablePage = (page: Page): page is EmbeddablePage =>
  page !== null && (EMBEDDABLE_PAGES as readonly string[]).includes(page);

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
