import type { Address, CountryCode } from '@planet-sdk/common';
import type { SetState } from '../../../common/types/common';
import type { AddressAction } from '../../../common/types/profile';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  ADDRESS_ACTIONS,
  getFormattedAddress,
} from '../../../../utils/addressManagement';
import StyledCheckbox from './StyledCheckbox';
import styles from '../donationReceipt.module.scss';
import EditIcon from '../../../../../public/assets/images/icons/EditIcon';
import DonorAddressCheckIcon from '../../../../../public/assets/images/icons/DonorAddressCheckIcon';

type Props = {
  address: Address;
  setSelectedAddressForAction: SetState<Address | null>;
  setAddressAction: SetState<AddressAction | null>;
  setIsModalOpen: SetState<boolean>;
};

const DonorAddress = ({
  address,
  setSelectedAddressForAction,
  setAddressAction,
  setIsModalOpen,
}: Props) => {
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
      <button
        onClick={(e) => {
          e.preventDefault();
          setSelectedAddressForAction(address);
          setAddressAction(ADDRESS_ACTIONS.EDIT);
          setIsModalOpen(true);
        }}
        type="button"
      >
        <EditIcon />
      </button>
    </div>
  );
};

export default DonorAddress;
