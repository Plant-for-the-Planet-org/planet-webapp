import { RECEIPT_STATUS } from '../utils';

import { useRouter } from 'next/router';
import EditIcon from '../../../../../public/assets/images/icons/EditIcon';
import WebappButton from '../../../common/WebappButton';
import styles from '../donationReceipt.module.scss';
import { useTranslations } from 'next-intl';
import DownloadIcon from '../../../../../public/assets/images/icons/projectV2/DownloadIcon';

type Props = {
  downloadUrl: string | null;
  operation: (typeof RECEIPT_STATUS)[keyof typeof RECEIPT_STATUS];
};

const ReceiptActions = ({ downloadUrl, operation }: Props) => {
  const t = useTranslations('Donate.donationReceipt');
  const router = useRouter();

  // logic is pending
  const confirmRecipientData = () => {};
  const showDowloadButton =
    operation === RECEIPT_STATUS.DOWNLOAD && downloadUrl !== null;
  return (
    <div className={styles.receiptActions}>
      {showDowloadButton ? (
        <WebappButton
          variant="primary"
          text={t('download')}
          elementType="link"
          icon={<DownloadIcon color="#fff" />}
          href={downloadUrl}
          target={'_blank'}
        />
      ) : (
        <>
          <WebappButton
            variant="secondary"
            text={t('modifyContactInformation')}
            elementType="button"
            icon={<EditIcon />}
            onClick={() =>
              router.push(`/profile/tax-receipt/modify-recipient-data`)
            }
          />
          <WebappButton
            variant="primary"
            text={t('confirm')}
            elementType="button"
            onClick={confirmRecipientData}
          />
        </>
      )}
    </div>
  );
};

export default ReceiptActions;
