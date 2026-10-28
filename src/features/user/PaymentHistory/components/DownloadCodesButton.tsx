import type { APIError } from '@planet-sdk/common';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { unparse } from 'papaparse';
import { handleError } from '@planet-sdk/common';
import { Download, Loader2 } from 'lucide-react';

import { useApi } from '@/hooks/useApi';
import { useErrorHandlingStore } from '@/stores/errorHandlingStore';

type CodesResponse = {
  type: string;
  numberOfItems: number;
  items: Record<string, unknown>[];
};

const downloadCsv = (items: CodesResponse['items']) => {
  const blob = new Blob([unparse(items)], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'codes.csv';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Downloads the codes of an invitation or bulk gift as a CSV: one row per
 * recipient or code, with its certificate and redeem links.
 * @see DonationGiftsController::codes()
 */
export const DownloadCodesButton = ({ codesUrl }: { codesUrl: string }) => {
  const t = useTranslations('Me');
  const { getApi } = useApi();
  const setErrors = useErrorHandlingStore((state) => state.setErrors);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleClick = async () => {
    setIsDownloading(true);
    try {
      const response = await getApi<CodesResponse>(codesUrl);
      if (!response) {
        setErrors([
          {
            message: t('downloadCodesNetworkError'),
            errorType: 'download-codes',
          },
        ]);
      } else if (response.items.length === 0) {
        setErrors([
          {
            message: t('downloadCodesGeneralError'),
            errorType: 'download-codes',
          },
        ]);
      } else {
        downloadCsv(response.items);
      }
    } catch (err) {
      setErrors(handleError(err as APIError));
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDownloading}
      className="inline-flex items-center gap-2 text-sm text-primary hover:underline disabled:opacity-60"
    >
      {isDownloading ? (
        <Loader2 className="size-4 animate-spin" aria-hidden />
      ) : (
        <Download className="size-4" aria-hidden />
      )}
      {t('downloadCodes')}
    </button>
  );
};
