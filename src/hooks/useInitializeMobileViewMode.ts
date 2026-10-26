import { useEffect } from 'react';
import { useMobileViewModeStore } from '../stores/mobileViewModeStore';
import { useCurrentPage } from './useCurrentPage';

export const useInitializeMobileViewMode = (isMobile: boolean) => {
  const currentPage = useCurrentPage();
  // store: action
  const setSelectedMode = useMobileViewModeStore(
    (state) => state.setSelectedMode
  );

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
