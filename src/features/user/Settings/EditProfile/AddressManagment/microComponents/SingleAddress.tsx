import type { UpdatedAddress } from '..';
import type { SetState } from '../../../../../common/types/common';
import type { AddressAction } from './AddressActionMenu';
import type { CountryCode } from '@planet-sdk/common';

import { useState } from 'react';
import { Modal } from '@mui/material';
import { useTranslations } from 'next-intl';
import { formatAddress } from '../../../../../../utils/addressManagement';
import styles from '../AddressManagement.module.scss';
import AddressContent from './AddressContent';
import AddressActionsMenu from './AddressActionMenu';
import AddressForm from '../AddressForm';
import { ADDRESS_ACTIONS } from '../../../../../../utils/addressManagement';

interface Props {
  userAddress: UpdatedAddress;
  addressCount: number;
  addressAction: AddressAction | null;
  setAddressAction: SetState<AddressAction | null>;
  setUserAddresses: SetState<UpdatedAddress[]>;
  fetchUserAddresses: () => Promise<void>;
}

const SingleAddress = ({
  userAddress,
  addressCount,
  addressAction,
  setAddressAction,
  setUserAddresses,
  fetchUserAddresses,
}: Props) => {
  const tCountry = useTranslations('Country');
  const { zipCode, city, state, country, address, type } = userAddress;
  const countryFullForm = tCountry(
    country.toLowerCase() as Lowercase<CountryCode>
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        setIsModalOpen={setIsModalOpen}
      />
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {addressAction === ADDRESS_ACTIONS.EDIT ? (
          <AddressForm
            formType="edit"
            addressAction={addressAction}
            setIsModalOpen={setIsModalOpen}
            setUserAddresses={setUserAddresses}
            userAddress={userAddress}
            fetchUserAddresses={fetchUserAddresses}
          />
        ) : (
          <></>
        )}
      </Modal>
    </div>
  );
};

export default SingleAddress;
