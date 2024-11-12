import type { Address } from '@planet-sdk/common';
import type { AddressAction } from './microComponents/AddressActionMenu';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Modal } from '@mui/material';
import AddressList from './microComponents/AddressList';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import WebappButton from '../../../../common/WebappButton';
import styles from './AddressManagement.module.scss';
import AddressForm from './AddressForm';

export type AddressType = 'primary' | 'mailing' | 'other';

export interface UpdatedAddress extends Address {
  id: string;
  type: AddressType;
  name: string | null;
  state: string | null;
  isPrimary: boolean | null;
  address2: string | null;
}
export const addressType = ['primary', 'mailing', 'other'];
const AddressManagement = () => {
  const { user } = useUserProps();
  const tProfile = useTranslations('Profile.addressManagement');
  const [userAddresses, setUserAddresses] = useState<UpdatedAddress[]>(
    user?.addresses
  ); // need to update planet-sdk to include addresses key
  const [addressAction, setAddressAction] = useState<AddressAction | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sortedAddresses = useMemo(() => {
    return userAddresses.sort((a, b) => {
      return addressType.indexOf(a.type) - addressType.indexOf(b.type);
    });
  }, [userAddresses]);

  return (
    <>
      <AddressList
        addresses={sortedAddresses}
        setAddressAction={setAddressAction}
      />
      <WebappButton
        text={tProfile('addNewAddress')}
        elementType="button"
        onClick={() => setIsModalOpen(true)}
        variant="primary"
        buttonClasses={styles.addNewAddressButton}
      />
      <Modal open={isModalOpen}>
        <AddressForm
          mode="add"
          setIsModalOpen={setIsModalOpen}
          setUserAddresses={setUserAddresses}
        />
      </Modal>
    </>
  );
};

export default AddressManagement;
