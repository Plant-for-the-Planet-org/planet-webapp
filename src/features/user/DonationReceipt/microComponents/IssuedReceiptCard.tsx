import type { IssuedReceiptDataApi } from '../donationReceiptTypes';

import { useTranslations } from 'next-intl';
import WebappButton from '../../../common/WebappButton';
import styles from '../DonationReceipt.module.scss';
import formatDate from '../../../../utils/countryCurrency/getFormattedDate';
import DownloadIcon from '../../../../../public/assets/images/icons/projectV2/DownloadIcon';
import DonationInfo from './DonationInfo';
import themeProperties from '../../../../theme/themeProperties';

type Prop = {
  issuedReceipt: IssuedReceiptDataApi;
  onReceiptClick: () => void;
  isProcessing: boolean;
};

const IssuedReceiptCard = ({
  issuedReceipt,
  onReceiptClick,
  isProcessing,
}: Prop) => {
  const tReceipt = useTranslations('DonationReceipt');
  const {
    amount,
    currency,
    donationCount,
    donations,
    downloadUrl,
    paymentDate,
    verificationDate,
    template,
  } = issuedReceipt;

  // get the last donation reference number
  const reference = donations[donations.length - 1].reference;
  const isReceiptVerified = Boolean(verificationDate !== null && verificationDate !== undefined && downloadUrl);

  return (
    <div className={styles.donationReceiptCard}>
      <DonationInfo
        currency={currency}
        amount={amount}
        count={donationCount}
        reference={reference}
        template={template}
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
          icon={
            <DownloadIcon color={themeProperties.designSystem.colors.white} />
          }
          buttonClasses={styles.receiptCardButton}
        />
      ) : (
        <WebappButton
          variant="primary"
          elementType="button"
          onClick={!isProcessing ? onReceiptClick : () => {}}
          text={!isProcessing ? tReceipt('verifyAndDownload') : undefined}
          icon={isProcessing ? <div className={styles.spinner} /> : undefined}
          buttonClasses={styles.receiptCardButton}
        />
      )}
    </div>
  );
};

export default IssuedReceiptCard;
