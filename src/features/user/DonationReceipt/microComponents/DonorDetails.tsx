import type { AddressView, DonorView } from '../donationReceiptTypes';
import type { CountryCode } from '@planet-sdk/common';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import styles from '../DonationReceipt.module.scss';
import { getFormattedAddress } from '../../../../utils/addressManagement';

interface Props {
  donor: DonorView;
  address: AddressView;
}

const DonorDetails = ({ donor, address }: Props) => {
  const tReceipt = useTranslations('DonationReceipt');
  const tCountry = useTranslations('Country');
  const { country, zipCode, city, address1, address2 } = address;
  const countryName = tCountry(country.toLowerCase() as Lowercase<CountryCode>);

  const cityStatePostalString = useMemo(
    () => getFormattedAddress(zipCode, city, null, countryName),
    [zipCode, city, countryName]
  );

  return (
    <div className={styles.donorDetails}>
      <h3 className={styles.header}>{tReceipt('recipientInfoHeader')}</h3>
      <div className={styles.donorInfo}>
        <div className={styles.donorName}>
          <span className={styles.header}>
            {tReceipt('donorInfo.name', {
              type: donor.type,
            })}
          </span>
          <span>{donor.name}</span>
        </div>
        {donor.tin !== null && (
          <div className={styles.tin}>
            <span className={styles.header}>
              {tReceipt('donationDetails.taxIdentificationNumber')}
            </span>
            <span>{donor.tin}</span>
          </div>
        )}
      </div>
      <div className={styles.addressInfo}>
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
