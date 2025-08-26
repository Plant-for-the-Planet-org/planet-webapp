import { useTranslations } from 'next-intl';
import EditIcon from '../../../../../public/assets/images/icons/EditIcon';
import WebappButton from '../../../common/WebappButton';
import styles from '../DonationReceipt.module.scss';
import DownloadIcon from '../../../../../public/assets/images/icons/projectV2/DownloadIcon';
import themeProperties from '../../../../theme/themeProperties';

type Props = {
  downloadUrl: string | null;
  confirmReceiptData: () => Promise<void>;
  isReceiptVerified: boolean;
  isContactInfoInvalid: boolean;
};

const ReceiptActions = ({
  downloadUrl,
  confirmReceiptData,
  isReceiptVerified,
  isContactInfoInvalid,
}: Props) => {
  const tReceipt = useTranslations('DonationReceipt');
  const showDownloadButton = downloadUrl !== null && isReceiptVerified;

  return (
    <div className={styles.receiptActions}>
      {!isReceiptVerified ? (
        <>
          <WebappButton
            variant="secondary"
            text={tReceipt('modifyContactInformation')}
            elementType="link"
            target="_self"
            icon={<EditIcon />}
            href={`/profile/donation-receipt/donor-contact-management`}
          />
          {!isContactInfoInvalid && (
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
            icon={
              <DownloadIcon color={themeProperties.designSystem.colors.white} />
            }
            href={downloadUrl}
            target={'_blank'}
          />
        </div>
      ) : (
        <div className={styles.missingInfoError}>
          {tReceipt.rich('errors.missingReceiptInformation', {
            b: (chunks) => <strong>{chunks}</strong>,
          })}
        </div>
      )}
    </div>
  );
};

export default ReceiptActions;
