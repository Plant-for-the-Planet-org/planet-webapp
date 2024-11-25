import type { Address, CountryCode } from '@planet-sdk/common';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { getFormattedAddress } from '../../../../../../utils/addressManagement';

interface Props {
  userAddress: Address | undefined;
}

const FormattedAddressBlock = ({ userAddress }: Props) => {
  if (!userAddress) return null;
  const tCountry = useTranslations('Country');
  const { zipCode, city, state, country, address, address2 } = userAddress;
  const countryName = tCountry(country.toLowerCase() as Lowercase<CountryCode>);
  const formattedAddress = useMemo(
    () => getFormattedAddress(zipCode, city, state, countryName),
    [zipCode, city, state, countryName]
  );
  return (
    <address>
      <p>{address}</p>
      {address2 && <p>{address2}</p>}
      <p>{formattedAddress}</p>
    </address>
  );
};
export default FormattedAddressBlock;
