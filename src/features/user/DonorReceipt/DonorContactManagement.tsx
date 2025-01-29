import { useTranslations } from 'next-intl';
import BackButton from '../../../../public/assets/images/icons/BackButton';
import styles from './donationReceipt.module.scss';

const DonorContactManagement = () => {
  const t = useTranslations('Donate.donationReceipt');

  //TODO: logic is pending
  const navigateToVerificationPage = () => {};

  return (
    <section className={styles.donorReceiptLayout}>
      <div className={styles.donorContactManagement}>
        <div className={styles.headerContainer}>
          <button onClick={navigateToVerificationPage}>
            <BackButton />
          </button>
          <h2 className={styles.contactManagementHeader}>
            {t('contactManagementHeader')}
          </h2>
        </div>
        <form></form>
      </div>
    </section>
  );
};

export default DonorContactManagement;
