import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import { RECEIPT_STATUS } from '../utils';
import EditIcon from '../../../../../public/assets/images/icons/EditIcon';
import WebappButton from '../../../common/WebappButton';
import styles from '../DonationReceipt.module.scss';
import DownloadIcon from '../../../../../public/assets/images/icons/projectV2/DownloadIcon';

export type Operation = (typeof RECEIPT_STATUS)[keyof typeof RECEIPT_STATUS];

type Props = {
  downloadUrl: string | null;
  operation: Operation;
  confirmReceiptData: () => Promise<void>;
  isReceiptVerified: boolean;
};

const ReceiptActions = ({
  downloadUrl,
  operation,
  confirmReceiptData,
  isReceiptVerified,
}: Props) => {
  const tReceipt = useTranslations('DonationReceipt');
  const router = useRouter();

  const showDownloadButton =
    operation === RECEIPT_STATUS.DOWNLOAD &&
    downloadUrl !== null &&
    isReceiptVerified;
  return (
    <div className={styles.receiptActions}>
      {showDownloadButton ? (
        <div className={styles.downloadButtonContainer}>
          <WebappButton
            variant="primary"
            text={tReceipt('download')}
            elementType="link"
            icon={<DownloadIcon color="#fff" />}
            href={downloadUrl}
            target={'_blank'}
          />
        </div>
      ) : (
        <>
          <WebappButton
            variant="secondary"
            text={tReceipt('modifyContactInformation')}
            elementType="button"
            icon={<EditIcon />}
            onClick={() =>
              router.push(`/profile/tax-receipt/modify-recipient-data`)
            }
          />
          <WebappButton
            variant="primary"
            text={tReceipt('confirm')}
            elementType="button"
            onClick={confirmReceiptData}
          />
        </>
      )}
    </div>
  );
};

export default ReceiptActions;
