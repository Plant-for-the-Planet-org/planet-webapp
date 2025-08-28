import RedirectRightArrowIcon from '../../../../../public/assets/images/icons/RedirectRightArrowIcon';
import styles from '../DonationReceipt.module.scss';
import { useTranslations } from 'next-intl';
import SupportAssistanceInfo from './SupportAssistanceInfo';
import Link from 'next/link';
import { useAuth0 } from '@auth0/auth0-react';
import useLocalizedPath from '../../../../hooks/useLocalizedPath';

const VerifyReceiptFooter = () => {
  const tReceipt = useTranslations('DonationReceipt');
  const { isAuthenticated } = useAuth0();
  const { localizedPath } = useLocalizedPath();

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
