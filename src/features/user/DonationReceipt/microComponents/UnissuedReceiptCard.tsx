import type { UnissuedReceiptDataAPI } from '../donationReceiptTypes';

import styles from '../DonationReceipt.module.scss';
import DonationInfo from './DonationInfo';
import formatDate from '../../../../utils/countryCurrency/getFormattedDate';
import WebappButton from '../../../common/WebappButton';
import { useTranslations } from 'next-intl';

type Prop = {
  donationInfo: UnissuedReceiptDataAPI;
};

const UnissuedReceiptCard = ({ donationInfo }: Prop) => {
  const { currency, amount, donationCount, uids, paymentDate, type } =
    donationInfo;
  const tReceipt = useTranslations('DonationReceipt');
  //TODO : API needs to be integrated
  const issueReceipt = () => {};
  return (
    <div className={styles.donationReceiptCard}>
      <p>•</p>
      <DonationInfo
        currency={currency}
        amount={amount}
        count={donationCount}
        reference={uids[0]}
        date={formatDate(paymentDate)}
      />
      {type !== 'pending' && (
        <WebappButton
          variant="primary"
          elementType="button"
          text={tReceipt('verifyAndDownload')}
          onClick={issueReceipt}
        />
      )}
    </div>
  );
};

export default UnissuedReceiptCard;
