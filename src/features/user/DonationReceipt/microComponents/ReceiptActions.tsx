import { useRouter } from 'next/router';
import EditIcon from '../../../../../public/assets/images/icons/EditIcon';
import WebappButton from '../../../common/WebappButton';
import styles from '../donationReceipt.module.scss';
import { useTranslations } from 'next-intl';
import DownloadIcon from '../../../../../public/assets/images/icons/projectV2/DownloadIcon';

type Props = {
  downloadUrl: string | null;
};

const ReceiptActions = ({ downloadUrl }: Props) => {
  const t = useTranslations('Donate.donationReceipt');
  const router = useRouter();

  // logic is pending
  const confirmRecipientData = () => {};
  const handleDownload = () => {};
  return (
    <div className={styles.receiptActions}>
      {downloadUrl ? (
        <WebappButton
          variant="primary"
          text={t('download')}
          elementType="button"
          icon={<DownloadIcon color="#fff" />}
          onClick={handleDownload}
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
