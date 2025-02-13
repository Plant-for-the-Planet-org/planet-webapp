import ContactIcon from '../../../../../public/assets/images/icons/ContactIcon';
// import RedirectRightArrowIcon from '../../../../../public/assets/images/icons/RedirectRightArrowIcon';
import styles from '../DonationReceipt.module.scss';
import { useTranslations } from 'next-intl';

const VerifyReceiptFooter = () => {
  const t = useTranslations('DonationReceipt');

  return (
    <section className={styles.verifyReceiptFooter}>
      {/* <div className={styles.viewTaxReceiptsAction}>
        <div>
          <h3>{t('viewAllTaxReceipts')}</h3>
          <p>{t('donationReceiptsManagementInfo')}</p>
        </div>
        <a
          href="/profile/donation-receipt"
          target={'_blank'}
          className={styles.redirectButton}
        >
          <RedirectRightArrowIcon />
        </a>
      </div> */}
      <div className={styles.contactInfo}>
        <ContactIcon />
        <div>
          <div className={styles.contactSupportMessage}>
            {t('contactSupportMessage')}
          </div>
          <div className={styles.contactDetails}>
            <span>
              {t.rich('emailDetails', {
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
            <span>
              {t.rich('phoneDetails', {
                strong: (chunk) => <strong>{chunk}</strong>,
              })}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerifyReceiptFooter;
