import type { Donor } from '../../../../features/common/Layout/DonationReceiptContext';
import type { CountryCode } from '@planet-sdk/common';

import { useTranslations } from 'next-intl';
import styles from '../donationReceipt.module.scss';
import { getFormattedAddress } from '../../../../utils/addressManagement';
import { useMemo } from 'react';

interface Props {
  donar: Donor | undefined;
}

const RecipientDetails = ({ donar }: Props) => {
  if (!donar) return null;

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
        <div className={styles.Name}>
          <span className={styles.header}>
            {t('donationReceipt.name', {
              type: donar.type,
            })}
          </span>
          <span>{donar.name}</span>
        </div>
        {donar.tin && (
          <div className={styles.tin}>
            <span className={styles.header}>
              {t('donationReceipt.taxIdentificationNumber')}
            </span>
            <span>{donar.tin}</span>
          </div>
        )}
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
  );
};

export default RecipientDetails;
