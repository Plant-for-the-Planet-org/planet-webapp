import type { ReceiptDataAPI } from '../donationReceiptTypes';

import { useTranslations } from 'next-intl';
import WebappButton from '../../../common/WebappButton';
import styles from '../DonationReceipt.module.scss';
import formatDate from '../../../../utils/countryCurrency/getFormattedDate';
import DownloadIcon from '../../../../../public/assets/images/icons/projectV2/DownloadIcon';
import DonationInfo from './DonationInfo';

type Prop = {
  donationInfo: ReceiptDataAPI;
};

const IssuedReceiptCard = ({ donationInfo }: Prop) => {
  const tReceipt = useTranslations('DonationReceipt');
  const {
    verificationDate,
    downloadUrl,
    dtn,
    year,
    challenge,
    currency,
    amount,
    donationCount,
    reference,
    issueDate,
  } = donationInfo;

  const isReceiptVerified = Boolean(verificationDate && downloadUrl);
  const buttonProps = isReceiptVerified
    ? {
        text: tReceipt('download'),
        href: downloadUrl,
        icon: <DownloadIcon color="#fff" />,
      }
    : {
        text: tReceipt('verifyAndDownload'),
        href: `/verify-receipt-data?dtn=${dtn}&year=${year}&challenge=${challenge}`,
      };
  return (
    <div className={styles.donationReceiptCard}>
      <DonationInfo
        currency={currency}
        amount={amount}
        count={donationCount}
        reference={reference}
        date={formatDate(issueDate)}
      />
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
