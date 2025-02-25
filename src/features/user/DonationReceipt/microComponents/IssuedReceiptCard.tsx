import type { IssuedReceiptDataApi } from '../donationReceiptTypes';

import { useTranslations } from 'next-intl';
import WebappButton from '../../../common/WebappButton';
import styles from '../DonationReceipt.module.scss';
import formatDate from '../../../../utils/countryCurrency/getFormattedDate';
import DownloadIcon from '../../../../../public/assets/images/icons/projectV2/DownloadIcon';
import DonationInfo from './DonationInfo';

type Prop = {
  issuedReceipt: IssuedReceiptDataApi;
  onReceiptClick: () => void;
};

const IssuedReceiptCard = ({ issuedReceipt, onReceiptClick }: Prop) => {
  const tReceipt = useTranslations('DonationReceipt');
  const {
    amount,
    currency,
    donationCount,
    donations,
    downloadUrl,
    paymentDate,
    verificationDate,
  } = issuedReceipt;

  // get the last donation reference number
  const reference = donations[donations.length - 1].reference;
  const isReceiptVerified = Boolean(verificationDate !== null && downloadUrl);

  return (
    <div className={styles.donationReceiptCard}>
      <DonationInfo
        currency={currency}
        amount={amount}
        count={donationCount}
        reference={reference}
        date={formatDate(paymentDate)}
        donations={donations}
      />
      {isReceiptVerified ? (
        <WebappButton
          variant="primary"
          elementType="link"
          href={downloadUrl ?? ''}
          target="_blank"
          text={tReceipt('download')}
          icon={<DownloadIcon color="#fff" />}
        />
      ) : (
        <WebappButton
          variant="primary"
          elementType="button"
          onClick={onReceiptClick}
          text={tReceipt('verifyAndDownload')}
        />
      )}
    </div>
  );
};

export default IssuedReceiptCard;
