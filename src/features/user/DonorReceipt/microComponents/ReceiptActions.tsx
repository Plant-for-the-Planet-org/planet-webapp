import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import { RECEIPT_STATUS } from '../utils';
import EditIcon from '../../../../../public/assets/images/icons/EditIcon';
import WebappButton from '../../../common/WebappButton';
import styles from '../donationReceipt.module.scss';
import DownloadIcon from '../../../../../public/assets/images/icons/projectV2/DownloadIcon';
import { useCallback } from 'react';

export type Operation = (typeof RECEIPT_STATUS)[keyof typeof RECEIPT_STATUS];

type Props = {
  downloadUrl: string | null;
  operation: Operation;
  confirmDonorData: () => Promise<void>;
};

const ReceiptActions = ({
  downloadUrl,
  operation,
  confirmDonorData,
}: Props) => {
  const t = useTranslations('Donate.donationReceipt');
  const router = useRouter();

  const redirectToUserDataForm = useCallback(() => {
    router.push(`/profile/donation-receipt/modify-user-data`);
  }, []);

  const showDowloadButton =
    operation === RECEIPT_STATUS.DOWNLOAD && downloadUrl !== null;
  return (
    <div className={styles.receiptActions}>
      {showDowloadButton ? (
        <div className={styles.downloadButtonContainer}>
          <WebappButton
            variant="primary"
            text={t('download')}
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
            text={t('modifyContactInformation')}
            elementType="button"
            icon={<EditIcon />}
            onClick={redirectToUserDataForm}
          />
          <WebappButton
            variant="primary"
            text={t('confirm')}
            elementType="button"
            onClick={confirmDonorData}
          />
        </>
      )}
    </div>
  );
};

export default ReceiptActions;
