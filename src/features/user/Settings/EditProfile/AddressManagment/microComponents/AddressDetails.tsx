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
  const tAddressManagement = useTranslations('Profile.addressManagement');
  const tCountry = useTranslations('Country');
  const countryName = tCountry(country.toLowerCase() as Lowercase<CountryCode>);

  const cityStatePostalString = useMemo(() => {
    return [zipCode, city, state, countryName]
      .filter(Boolean)
      .join(', ')
      .replace(/\s+/g, ' ')
      .trim();
  }, [zipCode, city, state, countryName]);

  return (
    <div className={styles.addressDetails}>
      {type !== 'other' && (
        <span className={styles[type]}>
          {tAddressManagement(`addressTags.${type}`)}
        </span>
      )}
      <address>
        <p>{address}</p>
        {address2 !== null && <p>{address2}</p>}
        <p>{cityStatePostalString}</p>
      </address>
    </div>
  );
};

export default AddressDetails;
