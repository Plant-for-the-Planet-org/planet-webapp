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

  const navigateToDonorContactManagement = useCallback(() => {
    router.push(`/profile/donation-receipt/donor-contact-management`);
  }, [router]);

  const showDownloadButton = downloadUrl !== null && isReceiptVerified;

  return (
    <div className={styles.receiptActions}>
      {!isReceiptVerified ? (
        <>
          <WebappButton
            variant="secondary"
            text={tReceipt('modifyContactInformation')}
            elementType="button"
            icon={<EditIcon />}
            onClick={navigateToDonorContactManagement}
          />
          <WebappButton
            variant="primary"
            text={tReceipt('confirm')}
            elementType="button"
            onClick={confirmReceiptData}
          />
        </>
      ) : showDownloadButton ? (
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
        <div className={styles.receiptError}>
          {tReceipt.rich('missingReceiptInformation', {
            b: (chunks) => <strong>{chunks}</strong>,
          })}
        </div>
      )}
    </div>
  );
};

export default ReceiptActions;
