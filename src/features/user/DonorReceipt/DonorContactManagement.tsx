import { useTranslations } from 'next-intl';
import BackButton from '../../../../public/assets/images/icons/BackButton';
import styles from './donationReceipt.module.scss';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useDonorReceipt } from '../../common/Layout/DonorReceiptContext';

const DonorContactManagement = () => {
  const t = useTranslations('Donate.donationReceipt');
  const router = useRouter();
  const { donorReceiptData } = useDonorReceipt();

  const navigateToVerificationPage = useCallback(() => {
    if (donorReceiptData) {
      const { dtn, challenge, year } = donorReceiptData;
      router.push(
        `/verify-receipt-data?dtn=${dtn}&challenge=${challenge}&year=${year}`
      );
    }
  }, [donorReceiptData, router]);

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
