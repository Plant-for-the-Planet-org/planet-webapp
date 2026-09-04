import { useEffect } from 'react';
import { useViewStore } from '../stores/viewStore';
import { useCurrentPage } from './useCurrentPage';

export const useInitializeView = (isMobile: boolean) => {
  const currentPage = useCurrentPage();
  // store: action
  const setSelectedMode = useViewStore((state) => state.setSelectedMode);

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
