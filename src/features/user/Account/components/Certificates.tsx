import { ReactElement } from 'react';
import { useTranslation } from 'next-i18next';
import DownloadCodes from './DownloadCodes';
import { PaymentDetails } from '../../../common/types/payments';
import styles from '../AccountHistory.module.scss';

interface CertificatesProps {
  recordDetails: PaymentDetails;
  purpose: string;
}

export const shouldDisableCertificate = (purpose: string) => {
  if (purpose === 'conservation' || purpose === 'bouquet') {
    return false;
  } else {
    return true;
  }
};

export default function Certificates({
  recordDetails,
  purpose,
}: CertificatesProps): ReactElement {
  const { t } = useTranslation(['me']);

  return (
    <>
      {recordDetails?.donorCertificate && shouldDisableCertificate(purpose) && (
        <div className={styles.singleDetail}>
          <a
            href={recordDetails?.donorCertificate}
            target="_blank"
            rel="noreferrer"
          >
            {t('donorCertificate')}
          </a>
        </div>
      )}
      {recordDetails?.taxDeductibleReceipt && (
        <div className={styles.singleDetail}>
          <a
            href={recordDetails.taxDeductibleReceipt}
            target="_blank"
            rel="noreferrer"
          >
            {t('taxDeductibleReceipt')}
          </a>
        </div>
      )}
      {recordDetails?.giftCertificate && shouldDisableCertificate(purpose) && (
        <div className={styles.singleDetail}>
          <a
            href={recordDetails.giftCertificate}
            target="_blank"
            rel="noreferrer"
          >
            {t('giftCertificate')}
          </a>
        </div>
      )}
      {recordDetails?.codesUrl && (
        <DownloadCodes codesUrl={recordDetails.codesUrl} />
      )}
    </>
  );
}
