import type { Address, CountryCode } from '@planet-sdk/common';

import { useTranslations } from 'next-intl';
import { getFormattedAddress } from '../../../../../../utils/addressManagement';

interface Props {
  userAddress: Address | undefined;
}

const FormattedAddressBlock = ({ userAddress }: Props) => {
  const tCountry = useTranslations('Country');
  if (!userAddress) return null;
  const { zipCode, city, state, country, address, address2 } = userAddress;
  const countryName = tCountry(country.toLowerCase() as Lowercase<CountryCode>);
  const cityStatePostalString = getFormattedAddress(
    zipCode,
    city,
    state,
    countryName
  );
  return (
    <address>
      <p>{address}</p>
      {address2 !== null && <p>{address2}</p>}
      <p>{cityStatePostalString}</p>
    </address>
  );
};
export default FormattedAddressBlock;
