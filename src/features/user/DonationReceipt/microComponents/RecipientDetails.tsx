import type { CountryCode } from '@planet-sdk/common';

import { useTranslations } from 'next-intl';
import styles from '../donationReceipt.module.scss';
import { getFormattedAddress } from '../../../../utils/addressManagement';
import { useMemo } from 'react';

type Donar = {
  tin: string | null;
  city: string;
  name: string;
  type: string;
  email: string;
  country: string;
  zipCode: string;
  address1: string;
  address2: string | null;
  reference: string;
  companyName?: string;
};

interface Props {
  donar: Donar;
}

const RecipientDetails = ({ donar }: Props) => {
  const t = useTranslations('Donate');
  const tCountry = useTranslations('Country');

  const { zipCode, city, country, address1, address2 } = donar;

  const countryName = tCountry(country.toLowerCase() as Lowercase<CountryCode>);
  const cityStatePostalString = useMemo(
    () => getFormattedAddress(zipCode, city, null, countryName),
    [zipCode, city, countryName]
  );

  return (
    <div className={styles.recipientDetails}>
      <h3 className={styles.header}>
        {t('donationReceipt.recipientInfoHeader')}
      </h3>
      <div className={styles.details}>
        <div className={styles.firstName}>
          <span className={styles.header}>{t('firstName')}</span>
          <span>John</span>
        </div>
        <div className={styles.lastName}>
          <span className={styles.header}>{t('lastName')}</span>
          <span>Doe</span>
        </div>
        <div className={styles.companyName}>
          <span className={styles.header}>{t('companyName')}</span>
          <span>{donar.companyName ? donar.companyName : '-'}</span>
        </div>
        <div className={styles.tin}>
          <span className={styles.header}>
            {t('donationReceipt.taxIdentificationNumber')}
          </span>
          <span>{donar.tin ? donar.tin : '-'}</span>
        </div>
        <div className={styles.address}>
          <span className={styles.header}>Address</span>
          <address>
            {address1},{cityStatePostalString}
          </address>
          {address2 && (
            <address>
              {address2},{cityStatePostalString}
            </address>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipientDetails;
