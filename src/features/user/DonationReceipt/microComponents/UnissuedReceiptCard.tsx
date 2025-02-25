import type { UnissuedReceiptDataAPI } from '../donationReceiptTypes';
import styles from '../DonationReceipt.module.scss';
import DonationInfo from './DonationInfo';
import formatDate from '../../../../utils/countryCurrency/getFormattedDate';
import WebappButton from '../../../common/WebappButton';
import { useTranslations } from 'next-intl';
import { UNISSUED_RECEIPT_TYPE } from '../utils';

type Prop = {
  unissuedReceipt: UnissuedReceiptDataAPI;
  onReceiptClick: () => void;
};

const UnissuedReceiptCard = ({ unissuedReceipt, onReceiptClick }: Prop) => {
  const tReceipt = useTranslations('DonationReceipt');
  const { amount, currency, donationCount, donations, paymentDate, type } =
    unissuedReceipt;

  // get the last donation reference number
  const reference = donations[donations.length - 1].uid;

  return (
    <div className={styles.donationReceiptCard}>
      <DonationInfo
        amount={amount}
        count={donationCount}
        currency={currency}
        date={formatDate(paymentDate)}
        reference={reference}
        donations={donations}
      />
      {type !== UNISSUED_RECEIPT_TYPE.PENDING && (
        <WebappButton
          variant="primary"
          elementType="button"
          text={tReceipt('verifyAndDownload')}
          onClick={onReceiptClick}
        />
      )}
      {type === UNISSUED_RECEIPT_TYPE.PENDING && (
        <span className={styles.pendingReceiptBadge}>
          {tReceipt('pendingReceipt', {
            count: donationCount,
          })}
        </span>
      )}
    </div>
  );
};

export default UnissuedReceiptCard;
