import type { ReactElement } from 'react';
import type {
  DonationPurpose,
  PaymentDetails,
} from '../../../common/types/payments';

import { useTranslations } from 'next-intl';
import DownloadCodes from './DownloadCodes';
import styles from '../AccountHistory.module.scss';

interface DownloadsProps {
  recordDetails: PaymentDetails;
  purpose: DonationPurpose;
}

export const canHaveCertificates = (purpose: DonationPurpose) => {
  return !(purpose === 'bouquet' || purpose === 'composite');
};

export default function Downloads({
  recordDetails,
  purpose,
}: DownloadsProps): ReactElement {
  const t = useTranslations('Me');

  return (
    <>
      {recordDetails?.donorCertificate &&
        recordDetails?.bouquetDonation == null &&
        canHaveCertificates(purpose) && (
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
      {recordDetails?.giftCertificate && canHaveCertificates(purpose) && (
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
      {recordDetails?.codesUrl && canHaveCertificates(purpose) && (
        <DownloadCodes codesUrl={recordDetails.codesUrl} />
      )}
    </>
  );
}
