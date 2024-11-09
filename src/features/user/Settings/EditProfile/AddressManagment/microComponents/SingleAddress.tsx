import type { UpdatedAddress } from '..';
import type { SetState } from '../../../../../common/types/common';
import type { AddressAction } from './AddressActionMenu';
import type { CountryCode } from '@planet-sdk/common';

import { useTranslations } from 'next-intl';
import { formatAddress } from '../../../../../../utils/addressManagement';
import styles from '../AddressManagement.module.scss';
import AddressContent from './AddressContent';
import AddressActionsMenu from './AddressActionMenu';

interface Props {
  userAddress: UpdatedAddress;
  addressCount: number;
  setAddressAction: SetState<AddressAction | null>;
}

const SingleAddress = ({
  userAddress,
  addressCount,
  setAddressAction,
}: Props) => {
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
      <AddressActionsMenu
        type={type}
        addressCount={addressCount}
        setAddressAction={setAddressAction}
      />
    </div>
  );
};

export default SingleAddress;
