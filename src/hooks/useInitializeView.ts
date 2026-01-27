import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useViewStore } from '../stores/viewStore';

export const useInitializeView = () => {
  const router = useRouter();
  const setPage = useViewStore((state) => state.setPage);
  const currentPage = useViewStore((state) => state.page);

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
};
