import { useRouter } from 'next/router';
import EditIcon from '../../../../../public/assets/images/icons/EditIcon';
import WebappButton from '../../../common/WebappButton';
import styles from '../donationReceipt.module.scss';
import { useTranslations } from 'next-intl';

const ReceiptActions = () => {
  const t = useTranslations('Donate.donationReceipt');
  const router = useRouter();

  // logic is pending
  const confirmRecipientData = () => {};
  return (
    <div className={styles.receiptActions}>
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
    </div>
  );
};

export default ReceiptActions;
