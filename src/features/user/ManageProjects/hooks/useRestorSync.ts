import type { Site, ExtendedProfileProjectProperties } from '../../../common/types/project';
import type { Nullable } from '@planet-sdk/common/build/types/util';

import { useState, useCallback } from 'react';
import { buildRestorPayload } from '../../../../utils/geometrySanitization';

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
      const restorApiUrl = process.env.NEXT_PUBLIC_RESTOR_API;
      const restorApiKey = process.env.NEXT_PUBLIC_RESTOR_API_KEY;
      if (!restorApiKey) throw new Error('Restor API key is not configured');
      if (!restorApiUrl) throw new Error('Restor URL is not configured');

      const purpose = projectDetails?.purpose;
      const firstTreePlanted =
        (projectDetails as { firstTreePlanted?: string | null } | null)?.firstTreePlanted ?? null;

      let interventionStartYear: number | '' = '';
      if (firstTreePlanted) {
        const dt = new Date(firstTreePlanted.trim().replace(' ', 'T'));
        if (!isNaN(dt.getTime())) interventionStartYear = dt.getUTCFullYear();
      }

      const sites = siteList.map((site) => ({
        properties: { id: site.id, name: site.name, status: site.status },
        geometry: site.geometry,
      }));

      const results = await Promise.allSettled(
        sites.map(async ({ properties, geometry }) => {
          const payload = buildRestorPayload(properties, geometry, purpose, interventionStartYear);
          const response = await fetch(restorApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-API-KEY': restorApiKey },
            body: JSON.stringify(payload),
          });
          if (!response.ok) {
            const body = await response.json().catch(() => ({}));
            throw new Error(body?.message || `HTTP ${response.status}`);
          }
          return response.json();
        })
      );

      const failures = results.reduce<string[]>((acc, result, i) => {
        if (result.status === 'rejected') {
          const siteName = sites[i]?.properties.name || sites[i]?.properties.id || `Site ${i + 1}`;
          const errMsg = result.reason instanceof Error ? result.reason.message : String(result.reason);
          acc.push(`${siteName}: ${errMsg}`);
        }
        return acc;
      }, []);

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
