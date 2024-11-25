import type { Address } from '@planet-sdk/common';
import type { AddressAction } from '../../../../common/types/profile';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Modal } from '@mui/material';
import AddressList from './microComponents/AddressList';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import WebappButton from '../../../../common/WebappButton';
import styles from './AddressManagement.module.scss';
import AddressForm from './AddressForm';
import CenteredContainer from '../../../../common/Layout/CenteredContainer';
import { ADDRESS_ACTIONS } from './microComponents/AddressActionMenu';

export const addressTypeOrder = ['primary', 'mailing', 'other'];
const AddressManagement = () => {
  const { user } = useUserProps();
  const tProfile = useTranslations('Profile.addressManagement');
  const [userAddresses, setUserAddresses] = useState<Address[]>(
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
