import { useCallback } from 'react';
import ContactIcon from '../../../../../public/assets/images/icons/ContactIcon';
import RedirectRightArrowIcon from '../../../../../public/assets/images/icons/RedirectRightArrowIcon';
import styles from '../donationReceipt.module.scss';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';

const ReceiptListRedirect = () => {
  const t = useTranslations('Donate.donationReceipt');
  const router = useRouter();

  const redirectToReceiptListPage = useCallback(() => {
    router.push('/profile/donation-receipt');
  }, []);

  return (
    <section className={styles.receiptListRedirect}>
      <div className={styles.receiptListRedirectContainer}>
        <div>
          <h3>{t('viewAllTaxReceipts')}</h3>
          <p>{t('donationReceiptsManagementInfo')}</p>
        </div>
        <button
          onClick={redirectToReceiptListPage}
          className={styles.redirectButton}
        >
          <RedirectRightArrowIcon />
        </button>
      </div>
      <div className={styles.contactInfo}>
        <ContactIcon />
        <div>
          <div className={styles.contactSupportMessage}>
            {t('contactSupportMessage')}
          </div>
          <span>
            {t.rich('supportContactDetails', {
              supportLink: (chunk) => (
                <a
                  className="planet-links"
                  href="mailto:spende@plant-for-the-planet.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {chunk}
                </a>
              ),
              strong: (chunk) => <strong>{chunk}</strong>,
            })}
          </span>
        </div>
      </div>
    </section>
  );
};

export default ReceiptListRedirect;
