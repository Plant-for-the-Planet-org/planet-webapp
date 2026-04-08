import type { Site, ExtendedProfileProjectProperties } from '../../../common/types/project';
import type { Nullable } from '@planet-sdk/common/build/types/util';

import { useState, useCallback } from 'react';

interface UseRestorSyncParams {
  projectDetails: Nullable<ExtendedProfileProjectProperties>;
  siteList: Site[];
  onConfigError: (message: string) => void;
}

const useRestorSync = ({ projectDetails, siteList, onConfigError }: UseRestorSyncParams) => {
  const [isSyncingSites, setIsSyncingSites] = useState(false);
  const [isSiteSyncModalOpen, setIsSiteSyncModalOpen] = useState(false);
  const [isSiteSyncSuccessful, setIsSiteSyncSuccessful] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [syncErrors, setSyncErrors] = useState<string[]>([]);
  const [syncErrorAnchor, setSyncErrorAnchor] = useState<HTMLButtonElement | null>(null);

  const handleSyncSites = useCallback(async () => {
    if (isSyncingSites) return;
    setIsSyncingSites(true);

    try {
      const purpose = projectDetails?.purpose;
      const firstTreePlanted =
        (projectDetails as { firstTreePlanted?: string | null } | null)?.firstTreePlanted ?? null;

      let interventionStartYear: number | '' = '';
      if (firstTreePlanted) {
        const dt = new Date(firstTreePlanted.trim().replace(' ', 'T'));
        if (!isNaN(dt.getTime())) interventionStartYear = dt.getUTCFullYear();
      }

      const sites = siteList.map((site) => ({
        id: site.id,
        name: site.name,
        status: site.status,
        geometry: site.geometry,
      }));

      const response = await fetch('/api/restor/sync-sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sites, purpose, interventionStartYear }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body?.error || `HTTP ${response.status}`);
      }

      const { results } = await response.json();

      const failures = (results as { siteName: string | null; siteId: string; success: boolean; error?: string }[]).reduce<string[]>(
        (acc, result, i) => {
          if (!result.success) {
            const siteName = result.siteName || result.siteId || `Site ${i + 1}`;
            acc.push(`${siteName}: ${result.error}`);
          }
          return acc;
        },
        []
      );

      if (failures.length === 0) {
        setIsSiteSyncSuccessful(true);
        setSnackbarOpen(true);
        setSyncErrors([]);
      } else {
        setSyncErrors(failures);
      }
    } catch {
      onConfigError('syncSites.error');
    } finally {
      setIsSyncingSites(false);
      setIsSiteSyncModalOpen(false);
    }
  }, [isSyncingSites, projectDetails, siteList, onConfigError]);

  return {
    isSyncingSites,
    isSiteSyncModalOpen,
    setIsSiteSyncModalOpen,
    isSiteSyncSuccessful,
    snackbarOpen,
    setSnackbarOpen,
    syncErrors,
    syncErrorAnchor,
    setSyncErrorAnchor,
    handleSyncSites,
  };
};

export default useRestorSync;
