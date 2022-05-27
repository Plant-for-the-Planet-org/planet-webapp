import React, { ReactElement } from 'react';
import i18next from '../../../../../i18n';
import { getRequest } from '../../../../utils/apiRequests/api';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import { unparse } from 'papaparse';

import styles from '../AccountHistory.module.scss';

const { useTranslation } = i18next;

interface DownloadCodesProps {
  codesUrl: string;
}

const DownloadCodes = ({ codesUrl }: DownloadCodesProps): ReactElement => {
  const [t] = useTranslation('me');

  const { handleError } = React.useContext(ErrorHandlingContext);

  function downloadCSV(data: [], filename: string) {
    const csv = unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
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
    try {
      const response = await getRequest<{
        type: string;
        numberOfItems: number;
        items: [];
      }>(codesUrl, handleError);
      if (response) {
        if (response.items.length) {
          downloadCSV(response.items, 'codes.csv');
        } else {
          handleError(Error(t('downloadCodesGeneralError')));
        }
      } else {
        handleError(Error(t('downloadCodesNetworkError')));
      }
    } catch (err) {
      handleError(Error(t('downloadCodesGeneralError')));
    }
  }

  return (
    <div className={styles.singleDetail}>
      <button
        type="button"
        className={styles.downloadCodesButton}
        onClick={handleClick}
        title={t('downloadCodes')}
      >
        {t('downloadCodes')}
      </button>
    </div>
  );
};

export default DownloadCodes;
