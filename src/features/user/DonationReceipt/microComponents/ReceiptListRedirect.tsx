import ContactIcon from '../../../../../public/assets/images/icons/ContactIcon';
import RedirectRightArrowIcon from '../../../../../public/assets/images/icons/RedirectRightArrowIcon';
import styles from '../donationReceipt.module.scss';
import { useTranslations } from 'next-intl';

const ReceiptListRedirect = () => {
  const t = useTranslations('Donate.donationReceipt');

  //TODO: logic need to be implemented
  const handleOnclick = () => {};
  return (
    <section className={styles.receiptListRedirect}>
      <div className={styles.receiptListRedirectContainer}>
        <div className={styles.receiptListRedirectSubContainer}>
          <h3>{t('viewAllTaxReceipts')}</h3>
          <p>{t('donationReceiptsManagementInfo')}</p>
        </div>
        <button onClick={handleOnclick}>
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
