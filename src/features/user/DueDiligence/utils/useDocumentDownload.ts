import type { APIError } from '@planet-sdk/common';

import { useState } from 'react';
import { handleError } from '@planet-sdk/common';
import { useAuthStore, useErrorHandlingStore } from '../../../../stores';

/**
 * Opens a due diligence document.
 *
 * Not a plain link: these documents are readable only by the organisation that
 * filed them, so the request carries the bearer token, and the path the API
 * returns is relative to the API host rather than to the webapp. Both make an
 * `<a href>` point at nothing.
 */
export function useDocumentDownload() {
  const token = useAuthStore((state) => state.token);
  const setErrors = useErrorHandlingStore((state) => state.setErrors);
  const [downloadingKind, setDownloadingKind] = useState<string | null>(null);

  const openDocument = async (kind: string, path: string) => {
    setDownloadingKind(kind);
    try {
      const response = await fetch(`${process.env.API_ENDPOINT}${path}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error(`Document request failed with ${response.status}`);
      }

      const url = window.URL.createObjectURL(await response.blob());
      window.open(url, '_blank', 'noopener,noreferrer');
      // The tab holds its own reference by now, so the handle can go. Revoking
      // it keeps the blob from living until the page is closed.
      window.setTimeout(() => window.URL.revokeObjectURL(url), 60_000);
    } catch (err) {
      setErrors(handleError(err as APIError));
    } finally {
      setDownloadingKind(null);
    }
  };

  return { openDocument, downloadingKind };
}
