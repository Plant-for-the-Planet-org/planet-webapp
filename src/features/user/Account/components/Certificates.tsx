import { ReactElement } from 'react';
import { useTranslations } from 'next-intl';
import DownloadCodes from './DownloadCodes';
import {
  DonationPurpose,
  PaymentDetails,
} from '../../../common/types/payments';
import styles from '../AccountHistory.module.scss';

interface CertificatesProps {
  recordDetails: PaymentDetails;
  purpose: DonationPurpose;
}

export const shouldEnableCertificate = (purpose: DonationPurpose) => {
  if (purpose === 'bouquet' || purpose === 'composite') {
    return false;
  } else {
    return true;
  }
};

export default function Certificates({
  recordDetails,
  purpose,
}: CertificatesProps): ReactElement {
  const t = useTranslations('Me');

  return (
    <>
      {recordDetails?.donorCertificate && shouldEnableCertificate(purpose) && (
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
      {recordDetails?.giftCertificate && shouldEnableCertificate(purpose) && (
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
