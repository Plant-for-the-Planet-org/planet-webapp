import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import EditIcon from '../../../../../public/assets/images/icons/EditIcon';
import WebappButton from '../../../common/WebappButton';
import styles from '../DonationReceipt.module.scss';
import DownloadIcon from '../../../../../public/assets/images/icons/projectV2/DownloadIcon';
import { useCallback } from 'react';

type Props = {
  downloadUrl: string | null;
  confirmReceiptData: () => Promise<void>;
  isReceiptVerified: boolean;
};

const ReceiptActions = ({
  downloadUrl,
  confirmReceiptData,
  isReceiptVerified,
}: Props) => {
  const tReceipt = useTranslations('DonationReceipt');
  const router = useRouter();

  const redirectToUserDataForm = useCallback(() => {
    router.push(`/profile/donation-receipt/modify-user-data`);
  }, []);

  const showDownloadButton = downloadUrl !== null && isReceiptVerified;
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
            onClick={redirectToUserDataForm}
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
