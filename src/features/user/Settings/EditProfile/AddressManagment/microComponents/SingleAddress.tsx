import type { UpdatedAddress } from '..';
import type { SetState } from '../../../../../common/types/common';
import type { AddressAction } from './AddressActionMenu';
import type { CountryCode } from '@planet-sdk/common';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { formatAddress } from '../../../../../../utils/addressManagement';
import styles from '../AddressManagement.module.scss';
import AddressContent from './AddressContent';
import AddressActionsMenu from './AddressActionMenu';

interface Props {
  userAddress: UpdatedAddress;
  addressCount: number;
  setIsModalOpen: SetState<boolean>;
  setAddressAction: SetState<AddressAction | null>;
  setSelectedAddressForAction: SetState<UpdatedAddress | null>;
}

const SingleAddress = ({
  userAddress,
  addressCount,
  setIsModalOpen,
  setAddressAction,
  setSelectedAddressForAction,
}: Props) => {
  const tCountry = useTranslations('Country');
  const { type } = userAddress;
  const getCountryFullForm = (countryCode: string | undefined) => {
    return countryCode
      ? tCountry(countryCode.toLowerCase() as Lowercase<CountryCode>)
      : '';
  };
  const getFormattedAddress = (address: UpdatedAddress) => {
    const { address: userAddress, zipCode, city, state, country } = address;
    const countryFullForm = getCountryFullForm(country);
    return formatAddress(userAddress, zipCode, city, state, countryFullForm);
  };

  const formattedAddress = useMemo(
    () => getFormattedAddress(userAddress),
    [userAddress]
  );

  return (
    <div className={styles.addressContainer}>
      <AddressContent type={type} userAddress={formattedAddress} />
      <AddressActionsMenu
        type={type}
        addressCount={addressCount}
        setAddressAction={setAddressAction}
        setIsModalOpen={setIsModalOpen}
        setSelectedAddressForAction={setSelectedAddressForAction}
        userAddress={userAddress}
      />
    </div>
  );
};

export default SingleAddress;
