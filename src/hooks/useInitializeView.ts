import { useEffect } from 'react';
import { useViewStore } from '../stores/viewStore';
import { useRouter } from 'next/router';

export const useInitializeView = (isMobile: boolean) => {
  const router = useRouter();
  // store: state
  const currentPage = useViewStore((state) => state.page);
  // store: action
  const setPage = useViewStore((state) => state.setPage);
  const setSelectedMode = useViewStore((state) => state.setSelectedMode);

  useEffect(() => {
    if (!router.isReady) return;

    const { query, pathname } = router;
    const page =
      pathname === '/sites/[slug]/[locale]'
        ? 'project-list'
        : query.p !== undefined
        ? 'project-details'
        : null;

    // Only update if the page actually changed
    if (page !== currentPage) {
      setPage(page);
    }
  }, [router.isReady, router.pathname, router.query, currentPage, setPage]);

  useEffect(() => {
    if (!isMobile) return;
    /**
     * Mobile-only behavior:
     * Always default to list view on project details page
     */
    if (currentPage === 'project-details') {
      setSelectedMode('list');
    }
  }, [currentPage]);
};
