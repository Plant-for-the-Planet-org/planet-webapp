import type { UpdatedAddress } from '..';

import { useTranslations } from 'next-intl';
import { formatAddress } from '../../../utils/addressManagement';
import style from '../AddressManagement.module.scss';
import { CountryCode } from '@planet-sdk/common';

const SingleAddress = ({ userAddress }: { userAddress: UpdatedAddress }) => {
  const tCountry = useTranslations('Country');
  const t = useTranslations('Me');
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
    <div className={style.addressContainer}>
      {type !== 'other' && (
        <span className={`${style.addressTag} ${style[type]}`}>
          {type === 'primary'
            ? t('addressManagement.primaryAddress')
            : t('addressManagement.BillingAddress')}
        </span>
      )}
      <div className={style.address}>{formattedAddress}</div>
    </div>
  );
};

export default SingleAddress;
