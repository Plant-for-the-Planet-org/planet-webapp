import type { ReactElement } from 'react';
import type { APIError } from '@planet-sdk/common';

import { useContext, useState } from 'react';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import { unparse } from 'papaparse';
import styles from '../AccountHistory.module.scss';
import { useTranslations } from 'next-intl';
import { handleError } from '@planet-sdk/common';
import { useApi } from '../../../../hooks/useApi';
import { clsx } from 'clsx';

interface DownloadCodesProps {
  codesUrl: string;
}

const DownloadCodes = ({ codesUrl }: DownloadCodesProps): ReactElement => {
  const t = useTranslations('Me');
  const [isDownloading, setIsDownloading] = useState(false);
  const { getApi } = useApi();
  const { setErrors } = useContext(ErrorHandlingContext);

  function downloadCSV(data: [], filename: string) {
    const csv = unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    // Create a temporary link element to download the file (blob)
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async function handleClick() {
    setIsDownloading(true);
    try {
      const response = await getApi<{
        type: string;
        numberOfItems: number;
        items: [];
      }>(codesUrl);
      if (response) {
        if (response.items.length) {
          downloadCSV(response.items, 'codes.csv');
          setIsDownloading(false);
        } else {
          setErrors([
            {
              message: t('downloadCodesGeneralError'),
              errorType: 'download-codes',
            },
          ]);
          setIsDownloading(false);
        }
      } else {
        setErrors([
          {
            message: t('downloadCodesNetworkError'),
            errorType: 'download-codes',
          },
        ]);
        setIsDownloading(false);
      }
    } catch (err) {
      setErrors(handleError(err as APIError));
      setIsDownloading(false);
    }
  }

  return (
    <div className={styles.singleDetail}>
      <button
        type="button"
        className={styles.downloadCodesButton}
        onClick={handleClick}
        title={t('downloadCodes')}
        disabled={isDownloading}
      >
        {t('downloadCodes')}
        {isDownloading && (
          <span
            className={clsx(styles.spinner, styles['spinner--primary'])}
          ></span>
        )}
      </button>
    </div>
  );
};

export default DownloadCodes;
