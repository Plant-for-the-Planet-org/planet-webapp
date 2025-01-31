import type { Address, CountryCode } from '@planet-sdk/common';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { getFormattedAddress } from '../../../../utils/addressManagement';
import StyledCheckbox from './StyledCheckbox';
import styles from '../donationReceipt.module.scss';
import EditIcon from '../../../../../public/assets/images/icons/EditIcon';
import DonorAddressCheckIcon from '../../../../../public/assets/images/icons/DonorAddressCheckIcon';

type Props = {
  address: Address;
};

const DonorAddress = ({ address }: Props) => {
  const tCountry = useTranslations('Country');
  const { zipCode, city, country } = address;
  const onSelectAddress = (guid: string) => {
    console.log(guid);
  };

  const formattedAddress = useMemo(
    () =>
      getFormattedAddress(
        address.zipCode,
        address.city,
        null,
        tCountry(address.country.toLowerCase() as Lowercase<CountryCode>)
      ),
    [zipCode, city, country]
  );

  return (
    <div className={styles.address}>
      <StyledCheckbox
        onChange={() => onSelectAddress(address.id)}
        checkedIcon={<DonorAddressCheckIcon />}
      />
      <div>
        <address>
          {address.address},{formattedAddress}
        </address>
        {address.address2 && (
          <address>
            {address.address2},{formattedAddress}
          </address>
        )}
      </div>
      <button>
        <EditIcon />
      </button>
    </div>
  );
};

export default DonorAddress;
