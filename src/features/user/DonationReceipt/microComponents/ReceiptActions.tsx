import { useRouter } from 'next/router';
import EditIcon from '../../../../../public/assets/images/icons/EditIcon';
import WebappButton from '../../../common/WebappButton';
import styles from '../donationReceipt.module.scss';
import { useTranslations } from 'next-intl';
import DownloadIcon from '../../../../../public/assets/images/icons/projectV2/DownloadIcon';
import { useCallback } from 'react';

type Props = {
  downloadUrl: string | null;
};

const ReceiptActions = ({ downloadUrl }: Props) => {
  const t = useTranslations('Donate.donationReceipt');
  const router = useRouter();

  // logic is pending
  const redirectToUserDataForm = useCallback(() => {
    router.push(`/profile/donation-receipt/modify-user-data`);
  }, []);
  const confirmRecipientData = () => {};

  return (
    <div className={styles.receiptActions}>
      {downloadUrl ? (
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
            onClick={redirectToUserDataForm}
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
