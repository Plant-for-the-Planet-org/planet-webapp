import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import EditIcon from '../../../../../public/assets/images/icons/EditIcon';
import WebappButton from '../../../common/WebappButton';
import styles from '../DonationReceipt.module.scss';
import DownloadIcon from '../../../../../public/assets/images/icons/projectV2/DownloadIcon';

type Props = {
  downloadUrl: string | null;
  confirmReceiptData: () => Promise<void>;
  isReceiptVerified: boolean;
  isDonorContactInvalid: boolean;
};

const ReceiptActions = ({
  downloadUrl,
  confirmReceiptData,
  isReceiptVerified,
  isDonorContactInvalid,
}: Props) => {
  const tReceipt = useTranslations('DonationReceipt');
  const router = useRouter();

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
            onClick={() =>
              router.push(`/profile/tax-receipt/modify-recipient-data`)
            }
          />
          {!isDonorContactInvalid && (
            <WebappButton
              variant="primary"
              text={tReceipt('confirm')}
              elementType="button"
              onClick={confirmReceiptData}
            />
          )}
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
