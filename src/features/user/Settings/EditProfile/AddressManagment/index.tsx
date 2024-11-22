import type { Address } from '@planet-sdk/common';
import {
  ADDRESS_ACTIONS,
  type AddressAction,
} from './microComponents/AddressActionMenu';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Modal } from '@mui/material';
import AddressList from './microComponents/AddressList';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import WebappButton from '../../../../common/WebappButton';
import styles from './AddressManagement.module.scss';
import AddressForm from './AddressForm';
import CenteredContainer from '../../../../common/Layout/CenteredContainer';

export type AddressType = 'primary' | 'mailing' | 'other';

export interface UpdatedAddress extends Address {
  id: string;
  type: AddressType;
  name: string | null;
  state: string | null;
  isPrimary: boolean | null;
  address2: string | null;
}
export const addressTypeOrder = ['primary', 'mailing', 'other'];
const AddressManagement = () => {
  const { user } = useUserProps();
  const tProfile = useTranslations('Profile.addressManagement');
  const [userAddresses, setUserAddresses] = useState<UpdatedAddress[]>(
    user?.addresses
  );
  const [addressAction, setAddressAction] = useState<AddressAction | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sortedAddresses = useMemo(() => {
    return userAddresses.sort((a, b) => {
      return (
        addressTypeOrder.indexOf(a.type) - addressTypeOrder.indexOf(b.type)
      );
    });
  }, [userAddresses]);

  const toggleAddAddressModal = () => {
    setIsModalOpen(true);
    setAddressAction(ADDRESS_ACTIONS.ADD);
  };

  return (
    <section className={styles.addressManagement}>
      <h2 className={styles.addressManagementTitle}>
        {tProfile('addressManagementTitle')}
      </h2>
      <CenteredContainer>
        <AddressList
          addresses={sortedAddresses}
          setAddressAction={setAddressAction}
        />
        <WebappButton
          text={tProfile('addNewAddress')}
          elementType="button"
          onClick={toggleAddAddressModal}
          variant="primary"
          buttonClasses={styles.addAddressButton}
        />
      </CenteredContainer>
      <Modal open={isModalOpen}>
        <>
          {addressAction === ADDRESS_ACTIONS.ADD && (
            <AddressForm
              formType="add"
              setIsModalOpen={setIsModalOpen}
              setUserAddresses={setUserAddresses}
            />
          )}
        </>
      </Modal>
    </section>
  );
};

export default AddressManagement;
