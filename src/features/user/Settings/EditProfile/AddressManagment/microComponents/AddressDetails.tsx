import type { CountryCode, Address } from '@planet-sdk/common';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import styles from '../AddressManagement.module.scss';
import { getFormattedAddress } from '../../../../../../utils/addressManagement';

interface Props {
  userAddress: Address;
}
const AddressDetails = ({ userAddress }: Props) => {
  const { zipCode, city, state, country, address, address2, type } =
    userAddress;
  const tProfile = useTranslations('Profile.addressManagement');
  const tCountry = useTranslations('Country');
  const countryName = tCountry(country.toLowerCase() as Lowercase<CountryCode>);

  const formattedAddress = useMemo(
    () => getFormattedAddress(zipCode, city, state, countryName),
    [zipCode, city, state, countryName]
  );
  return (
    <div className={styles.addressDetails}>
      {type !== 'other' && (
        <span className={styles[type]}>{tProfile(`addressType.${type}`)}</span>
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
