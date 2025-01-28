import type { AddressView, DonorView } from '../donorReceipt';
import type { CountryCode } from '@planet-sdk/common';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import styles from '../donationReceipt.module.scss';
import { getFormattedAddress } from '../../../../utils/addressManagement';

interface Props {
  donor: DonorView | undefined;
  address: AddressView | undefined;
}

const DonorDetails = ({ donor, address }: Props) => {
  if (address === undefined || donor === undefined) return null;

  const t = useTranslations('Donate');
  const tCountry = useTranslations('Country');
  const { country, zipCode, city, address1, address2 } = address;
  const { type, name, tin } = donor;
  const countryName = tCountry(country.toLowerCase() as Lowercase<CountryCode>);

  const cityStatePostalString = useMemo(
    () => getFormattedAddress(zipCode, city, null, countryName),
    [zipCode, city, countryName]
  );

  return (
    <div className={styles.donorDetails}>
      <h3 className={styles.header}>
        {t('donationReceipt.recipientInfoHeader')}
      </h3>
      <div className={styles.details}>
        <div className={styles.donorName}>
          <span className={styles.header}>
            {t('donationReceipt.name', {
              type,
            })}
          </span>
          <span>{name}</span>
        </div>
        {tin && (
          <div className={styles.tin}>
            <span className={styles.header}>
              {t('donationReceipt.taxIdentificationNumber')}
            </span>
            <span>{tin}</span>
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

export default DonorDetails;
