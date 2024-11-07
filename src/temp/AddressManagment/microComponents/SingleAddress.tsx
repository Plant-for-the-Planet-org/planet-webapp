import type { UpdatedAddress } from '..';

import React from 'react';
import { useTranslations } from 'next-intl';
import { formatAddress } from '../../../utils/addressManagement';
import styles from '../AddressManagement.module.scss';
import { CountryCode } from '@planet-sdk/common';
import AddressContent from './AddressContent';
import AddressActions from './AddressActions';

const SingleAddress = ({ userAddress }: { userAddress: UpdatedAddress }) => {
  const tCountry = useTranslations('Country');
  const { zipCode, city, state, country, address, type } = userAddress;
  const countryFullForm = tCountry(
    country.toLowerCase() as Lowercase<CountryCode>
  );
  const formattedAddress = formatAddress(
    address,
    zipCode,
    city,
    state,
    countryFullForm
  );

  return (
    <div className={styles.addressContainer}>
      <AddressContent type={type} userAddress={formattedAddress} />
      <AddressActions type={type} />
    </div>
  );
};

export default SingleAddress;
