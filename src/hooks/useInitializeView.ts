import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useViewStore } from '../stores/viewStore';
import { useInterventionStore } from '../stores';

export const useInitializeView = () => {
  const router = useRouter();
  // store: state
  const currentPage = useViewStore((state) => state.page);
  const selectedMode = useViewStore((state) => state.selectedMode);
  // store: action
  const setPage = useViewStore((state) => state.setPage);
  const clearMapLayerInteractionStates = useInterventionStore(
    (state) => state.clearMapLayerInteractionStates
  );
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
    if (selectedMode === 'map') return;

    if (currentPage === 'project-details') {
      clearMapLayerInteractionStates();
    }
  }, [currentPage, selectedMode]);

  useEffect(() => {
    if (currentPage === 'project-details') {
      setSelectedMode('list');
    }
  }, [currentPage]);
};
