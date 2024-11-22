import type { APIError, CountryCode } from '@planet-sdk/common';
import type {
  AddressAction,
  AddressType,
} from './microComponents/AddressActionMenu';

import { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Modal } from '@mui/material';
import AddressList from './microComponents/AddressList';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import WebappButton from '../../../../common/WebappButton';
import styles from './AddressManagement.module.scss';
import AddressForm from './AddressForm';
import { getAuthenticatedRequest } from '../../../../../utils/apiRequests/api';
import { useTenant } from '../../../../common/Layout/TenantContext';
import { ErrorHandlingContext } from '../../../../common/Layout/ErrorHandlingContext';
import { handleError } from '@planet-sdk/common';
import {
  ADDRESS_ACTIONS,
  addressTypeOrder,
} from '../../../../../utils/addressManagement';
import CenteredContainer from '../../../../common/Layout/CenteredContainer';

export interface UpdatedAddress {
  id: string;
  type: AddressType;
  name: string | null;
  state: string | null;
  isPrimary: boolean | null;
  address2: string | null;
  address: string;
  city?: string;
  zipCode?: string;
  country: CountryCode;
}

const AddressManagement = () => {
  const { user, contextLoaded, token, logoutUser } = useUserProps();
  const { tenantConfig } = useTenant();
  const { setErrors } = useContext(ErrorHandlingContext);
  const tProfile = useTranslations('Profile.addressManagement');
  const [userAddresses, setUserAddresses] = useState<UpdatedAddress[]>([]);
  const [addressAction, setAddressAction] = useState<AddressAction | null>(
    null
  );
  const [selectedAddressForAction, setSelectedAddressForAction] =
    useState<UpdatedAddress | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sortedAddresses = useMemo(() => {
    return userAddresses.sort((a, b) => {
      return (
        addressTypeOrder.indexOf(a.type) - addressTypeOrder.indexOf(b.type)
      );
    });
  }, [userAddresses]);

  const fetchUserAddresses = async () => {
    if (!user || !token || !contextLoaded) return;
    try {
      const res = await getAuthenticatedRequest<UpdatedAddress[]>(
        tenantConfig.id,
        '/app/addresses',
        token,
        logoutUser
      );
      if (res) setUserAddresses(res);
    } catch (error) {
      setErrors(handleError(error as APIError));
    }
  };

  useEffect(() => {
    fetchUserAddresses();
  }, []);

  const toggleAddAddressModal = () => {
    setIsModalOpen(true);
    setAddressAction(ADDRESS_ACTIONS.ADD);
  };

  const renderModalContent = useMemo(() => {
    switch (addressAction) {
      case ADDRESS_ACTIONS.ADD:
        return (
          <AddressForm
            formType="add"
            setIsModalOpen={setIsModalOpen}
            setUserAddresses={setUserAddresses} // to update the address list
          />
        );
      case ADDRESS_ACTIONS.EDIT:
        return (
          <AddressForm
            formType="edit"
            setIsModalOpen={setIsModalOpen}
            addressAction={addressAction}
            selectedAddressForAction={selectedAddressForAction}
            fetchUserAddresses={fetchUserAddresses} // to update the address list
          />
        );
    }
  }, [
    addressAction,
    setIsModalOpen,
    setUserAddresses,
    selectedAddressForAction,
    fetchUserAddresses,
  ]);

  return userAddresses.length > 0 ? (
    <section className={styles.addressManagement}>
      <h2 className={styles.addressManagementTitle}>
        {tProfile('addressManagementTitle')}
      </h2>
      <CenteredContainer>
        <AddressList
          addresses={sortedAddresses}
          setAddressAction={setAddressAction}
          setSelectedAddressForAction={setSelectedAddressForAction}
          setIsModalOpen={setIsModalOpen}
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
        <>{renderModalContent}</>
      </Modal>
    </section>
  ) : null;
};

export default AddressManagement;
