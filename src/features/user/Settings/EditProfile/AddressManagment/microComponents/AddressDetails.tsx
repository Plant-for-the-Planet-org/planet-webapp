import type { CountryCode, Address } from '@planet-sdk/common';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import styles from '../AddressManagement.module.scss';

interface Props {
  userAddress: Address;
}
const AddressDetails = ({ userAddress }: Props) => {
  const { zipCode, city, state, country, address, address2, type } =
    userAddress;
  const tProfile = useTranslations('Profile.addressManagement');
  const tCountry = useTranslations('Country');
  const countryName = tCountry(country.toLowerCase() as Lowercase<CountryCode>);

  const formattedAddress = useMemo(() => {
    return [zipCode, city, state, countryName]
      .filter(Boolean)
      .join(', ')
      .replace(/\s+/g, ' ')
      .trim();
  }, [zipCode, city, state, countryName]);

  return (
    <div className={styles.addressDetails}>
      {type !== 'other' && (
        <span className={styles[type]}>{tProfile(`addressTags.${type}`)}</span>
      )}
      <address>
        <p>{address}</p>
        {address2 && <p>{address2}</p>}
        <p>{formattedAddress}</p>
      </address>
    </div>
  );
};

export default AddressDetails;
