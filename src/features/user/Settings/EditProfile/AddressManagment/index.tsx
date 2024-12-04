import type { Address, APIError } from '@planet-sdk/common';
import type { AddressAction } from '../../../../common/types/profile';

import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Modal } from '@mui/material';
import { handleError } from '@planet-sdk/common';
import AddressList from './microComponents/AddressList';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import WebappButton from '../../../../common/WebappButton';
import styles from './AddressManagement.module.scss';
import { getAuthenticatedRequest } from '../../../../../utils/apiRequests/api';
import { useTenant } from '../../../../common/Layout/TenantContext';
import { ErrorHandlingContext } from '../../../../common/Layout/ErrorHandlingContext';
import {
  ADDRESS_ACTIONS,
  ADDRESS_TYPE,
  addressTypeOrder,
  findAddressByType,
  MAX_ADDRESS_LIMIT,
} from '../../../../../utils/addressManagement';
import CenteredContainer from '../../../../common/Layout/CenteredContainer';
import AddressTypeConfirmationModal from './AddressTypeConfirmationModal';
import AddressDeleteModal from './AddressDeleteModal';
import EditAddressForm from './EditAddressForm';
import AddAddressForm from './AddAddressForm';

const AddressManagement = () => {
  const tProfile = useTranslations('Profile.addressManagement');
  const { user, contextLoaded, token, logoutUser } = useUserProps();
  const { tenantConfig } = useTenant();
  const { setErrors } = useContext(ErrorHandlingContext);
  const [userAddresses, setUserAddresses] = useState<Address[]>([]);
  const [addressAction, setAddressAction] = useState<AddressAction | null>(
    null
  );
  const [selectedAddressForAction, setSelectedAddressForAction] =
    useState<Address | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sortedAddresses = useMemo(() => {
    return userAddresses.sort((a, b) => {
      return (
        addressTypeOrder.indexOf(a.type) - addressTypeOrder.indexOf(b.type)
      );
    });
  }, [userAddresses]);

  const fetchUserAddresses = useCallback(async () => {
    if (!user || !token || !contextLoaded) return;
    try {
      const res = await getAuthenticatedRequest<Address[]>(
        tenantConfig.id,
        '/app/addresses',
        token,
        logoutUser
      );
      if (res) setUserAddresses(res);
    } catch (error) {
      setErrors(handleError(error as APIError));
    }
  }, [user, token, contextLoaded, tenantConfig.id, logoutUser]);

  useEffect(() => {
    fetchUserAddresses();
  }, []);

  const toggleAddAddressModal = () => {
    setIsModalOpen(true);
    setAddressAction(ADDRESS_ACTIONS.ADD);
  };
  const primaryAddress = useMemo(
    () => findAddressByType(userAddresses, ADDRESS_TYPE.PRIMARY),
    [userAddresses]
  );
  const billingAddress = useMemo(
    () => findAddressByType(userAddresses, ADDRESS_TYPE.MAILING),
    [userAddresses]
  );
  const addrTypeConfProps = {
    setIsModalOpen,
    selectedAddressForAction,
    fetchUserAddresses,
  };
  const renderModalContent = useMemo(() => {
    switch (addressAction) {
      case ADDRESS_ACTIONS.ADD:
        return (
          <AddAddressForm
            setIsModalOpen={setIsModalOpen}
            setUserAddresses={setUserAddresses}
          />
        );
      case ADDRESS_ACTIONS.EDIT:
        return (
          <EditAddressForm
            setIsModalOpen={setIsModalOpen}
            selectedAddressForAction={selectedAddressForAction}
            fetchUserAddresses={fetchUserAddresses}
          />
        );
      case ADDRESS_ACTIONS.DELETE:
        return (
          <AddressDeleteModal
            addressId={selectedAddressForAction?.id}
            setIsModalOpen={setIsModalOpen}
            fetchUserAddresses={fetchUserAddresses}
          />
        );
      case ADDRESS_ACTIONS.SET_PRIMARY:
        return (
          <AddressTypeConfirmationModal
            addressType={ADDRESS_TYPE.PRIMARY}
            userAddress={primaryAddress}
            {...addrTypeConfProps}
          />
        );
      case ADDRESS_ACTIONS.SET_BILLING:
        return (
          <AddressTypeConfirmationModal
            addressType={ADDRESS_TYPE.MAILING}
            userAddress={billingAddress}
            {...addrTypeConfProps}
          />
        );
    }
  }, [
    setIsModalOpen,
    setUserAddresses,
    selectedAddressForAction,
    fetchUserAddresses,
    primaryAddress,
    billingAddress,
    addressAction,
  ]);

  const canAddMoreAddresses = userAddresses.length < MAX_ADDRESS_LIMIT;
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
        {canAddMoreAddresses ? (
          <WebappButton
            text={tProfile('addNewAddress')}
            elementType="button"
            onClick={toggleAddAddressModal}
            variant="primary"
            buttonClasses={styles.addAddressButton}
          />
        ) : (
          <p className={styles.maxAddress}>{tProfile('maxAddressesMessage')}</p>
        )}
      </CenteredContainer>
      <Modal open={isModalOpen}>
        <>{renderModalContent}</>
      </Modal>
    </section>
  ) : null;
};

export default AddressManagement;
