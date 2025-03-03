import { useTranslations } from 'next-intl';
import ContactIcon from '../../../../../public/assets/images/icons/ContactIcon';
import styles from '../DonationReceipt.module.scss';

const SupportAssistanceInfo = () => {
  const tReceipt = useTranslations('DonationReceipt');
  return (
    <div className={styles.contactInfo}>
      <ContactIcon />
      <div>
        <div className={styles.contactSupportMessage}>
          {tReceipt('contactSupportMessage')}
        </div>
        <div className={styles.contactDetails}>
          <span>
            {tReceipt.rich('emailDetails', {
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
            {tReceipt.rich('phoneDetails', {
              strong: (chunk) => <strong>{chunk}</strong>,
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SupportAssistanceInfo;
