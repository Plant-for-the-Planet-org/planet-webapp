import RedirectRightArrowIcon from '../../../../../public/assets/images/icons/RedirectRightArrowIcon';
import styles from '../DonationReceipt.module.scss';
import { useTranslations } from 'next-intl';
import SupportAssistanceInfo from './SupportAssistanceInfo';
import Link from 'next/link';
import useLocalizedPath from '../../../../hooks/useLocalizedPath';
import { useAuthSession } from '../../../../hooks/useAuthSession';

const VerifyReceiptFooter = () => {
  const tReceipt = useTranslations('DonationReceipt');
  const { localizedPath } = useLocalizedPath();
  const { isAuthenticated } = useAuthSession();

  return (
    <section className={styles.verifyReceiptFooter}>
      <div className={styles.viewTaxReceiptsAction}>
        <div>
          <h3>{tReceipt('viewAllDonationReceipts')}</h3>
          <p>
            {tReceipt('donationReceiptsManagementInfo')}
            {!isAuthenticated && tReceipt('donationReceiptsManagementLogin')}
          </p>
        </div>
        <Link
          href={localizedPath('/profile/donation-receipt')}
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
