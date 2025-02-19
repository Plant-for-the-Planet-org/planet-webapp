import type { ReceiptDataAPI } from '../donationReceiptTypes';

import { useTranslations } from 'next-intl';
import WebappButton from '../../../common/WebappButton';
import styles from '../DonationReceipt.module.scss';
import formatDate from '../../../../utils/countryCurrency/getFormattedDate';
import DownloadIcon from '../../../../../public/assets/images/icons/projectV2/DownloadIcon';

type Prop = {
  donationInfo: ReceiptDataAPI;
};

const IssuedReceiptCard = ({ donationInfo }: Prop) => {
  const tReceipt = useTranslations('DonationReceipt');

  const isReceiptVerified = Boolean(
    donationInfo.verificationDate && donationInfo.downloadUrl
  );
  const buttonProps = isReceiptVerified
    ? {
        text: tReceipt('download'),
        href: donationInfo.downloadUrl,
        icon: <DownloadIcon color="#fff" />,
      }
    : {
        text: tReceipt('verifyAndDownload'),
        href: `/verify-receipt-data?dtn=${donationInfo.dtn}&year=${donationInfo.year}&challenge=${donationInfo.challenge}`,
      };
  return (
    <div className={styles.donationReceiptCard}>
      <div className={styles.donationInfo}>
        <span className={styles.amount}>
          {tReceipt('donationDetails.donationAmount', {
            currency: donationInfo.currency,
            amount: donationInfo.amount,
          })}
        </span>
        <span>
          {tReceipt('donationInfo', {
            count: donationInfo.donationCount,
            reference: donationInfo.reference,
            date: formatDate(donationInfo.issueDate),
          })}
        </span>
      </div>

      <WebappButton
        variant="primary"
        elementType="link"
        href={buttonProps.href}
        target="_blank"
        text={buttonProps.text}
        icon={buttonProps.icon}
      />
    </div>
  );
};

export default IssuedReceiptCard;
