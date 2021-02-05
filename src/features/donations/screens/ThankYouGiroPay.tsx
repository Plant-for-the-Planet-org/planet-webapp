import React, { ReactElement } from 'react';
import tenantConfig from '../../../../tenant.config';
import styles from '../styles/ThankYou.module.scss';
import i18next from '../../../../i18n';
import { useRouter } from 'next/router';
import AnimatedButton from '../../common/InputTypes/AnimatedButton';

const { useTranslation } = i18next;

function ThankYouGiroPay({ donationID }: any): ReactElement {
  const { t, i18n, ready } = useTranslation(['donate', 'common', 'country']);

  const config = tenantConfig();

  const router = useRouter();

  return ready ? (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          {t('donate:completingYourDonation')}
        </div>
      </div>

      <div className={styles.contributionMessage}>
        {t('donate:waitingConfirmation')}
      </div>

      <div className={styles.contributionMessage} style={{ fontStyle: 'italic' }}>
        {t('donate:yourDonationRef', { donationID: donationID })}
      </div>

      <div className={styles.thankyouImageContainer}>
        <div className={styles.thankyouImage}>
          <div className={styles.thankyouImageHeader}>
            <p dangerouslySetInnerHTML={{ __html: t('donate:thankyouHeaderText') }} />
          </div>
          <div className={styles.donationCount}>
            <p className={styles.donationTenant}>
              {t('donate:plantTreesAtURL', { url: config.tenantURL })}
            </p>
          </div>
        </div>
      </div>

      <div onClick={() => router.replace(`${process.env.NEXTAUTH_URL}`)} className={styles.actionButtonsContainer}>
        <AnimatedButton className={styles.continueButton}>
          {t('common:backToHome')}
        </AnimatedButton>
      </div>
    </div>
  ) : <></>;
}

export default ThankYouGiroPay;
