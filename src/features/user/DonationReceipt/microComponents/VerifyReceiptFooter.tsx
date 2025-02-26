import RedirectRightArrowIcon from '../../../../../public/assets/images/icons/RedirectRightArrowIcon';
import styles from '../DonationReceipt.module.scss';
import { useTranslations } from 'next-intl';
import SupportAssistanceInfo from './SupportAssistanceInfo';
import Link from 'next/link';

const VerifyReceiptFooter = () => {
  const tReceipt = useTranslations('DonationReceipt');

  return (
    <section className={styles.verifyReceiptFooter}>
      <div className={styles.viewTaxReceiptsAction}>
        <div>
          <h3>{tReceipt('viewAllTaxReceipts')}</h3>
          <p>{tReceipt('donationReceiptsManagementInfo')}</p>
        </div>
        <Link
          href="/profile/donation-receipt"
          className={styles.redirectButton}
        >
          <RedirectRightArrowIcon />
        </Link>
      </div>
      <SupportAssistanceInfo />
    </section>
  );
};

export default VerifyReceiptFooter;
