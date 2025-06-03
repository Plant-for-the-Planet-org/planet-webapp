import type { Address } from '@planet-sdk/common';
import type { AddressAction } from '../../../../common/types/profile';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Modal } from '@mui/material';
import AddressList from './microComponents/AddressList';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import WebappButton from '../../../../common/WebappButton';
import styles from './AddressManagement.module.scss';
import {
  ADDRESS_ACTIONS,
  ADDRESS_TYPE,
  addressTypeOrder,
  findAddressByType,
  MAX_ADDRESS_LIMIT,
} from '../../../../../utils/addressManagement';
import CenteredContainer from '../../../../common/Layout/CenteredContainer';
import UpdateAddressType from './UpdateAddressType';
import DeleteAddress from './DeleteAddress';
import EditAddress from './EditAddress';
import AddAddress from './AddAddress';
import UnsetBillingAddress from './UnsetBillingAddress';

const AddressManagement = () => {
  const { user } = useUserProps();
  if (!user?.addresses) return null;
  const userAddresses = user.addresses;
  const tAddressManagement = useTranslations('EditProfile.addressManagement');

  const [addressAction, setAddressAction] = useState<AddressAction | null>(
    null
  );
  const [selectedAddressForAction, setSelectedAddressForAction] =
    useState<Address | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sortedAddresses = useMemo(() => {
    return [...userAddresses].sort((a, b) => {
      return (
        addressTypeOrder.indexOf(a.type) - addressTypeOrder.indexOf(b.type)
      );
    });
  }, [userAddresses]);

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

  const renderModalContent = useMemo(() => {
    switch (addressAction) {
      case ADDRESS_ACTIONS.ADD:
        return (
          <AddAddress
            setIsModalOpen={setIsModalOpen}
            setAddressAction={setAddressAction}
            showPrimaryAddressToggle={false}
          />
        );
      case ADDRESS_ACTIONS.EDIT:
        if (!selectedAddressForAction) return <></>;
        return (
          <EditAddress
            setIsModalOpen={setIsModalOpen}
            selectedAddressForAction={selectedAddressForAction}
            setAddressAction={setAddressAction}
            showPrimaryAddressToggle={false}
          />
        );
      case ADDRESS_ACTIONS.DELETE:
        if (!selectedAddressForAction) return <></>;
        return (
          <DeleteAddress
            addressId={selectedAddressForAction.id}
            setIsModalOpen={setIsModalOpen}
            setAddressAction={setAddressAction}
          />
        );
      case ADDRESS_ACTIONS.SET_PRIMARY:
        if (!selectedAddressForAction) return <></>;
        return (
          <UpdateAddressType
            addressType={ADDRESS_TYPE.PRIMARY}
            userAddress={primaryAddress}
            setAddressAction={setAddressAction}
            setIsModalOpen={setIsModalOpen}
            selectedAddressForAction={selectedAddressForAction}
          />
        );
      case ADDRESS_ACTIONS.SET_BILLING:
        if (!selectedAddressForAction) return <></>;
        return (
          <UpdateAddressType
            addressType={ADDRESS_TYPE.MAILING}
            userAddress={billingAddress}
            setAddressAction={setAddressAction}
            setIsModalOpen={setIsModalOpen}
            selectedAddressForAction={selectedAddressForAction}
          />
        );
      case ADDRESS_ACTIONS.UNSET_BILLING:
        if (!selectedAddressForAction) return <></>;
        return (
          <UnsetBillingAddress
            addressType={ADDRESS_TYPE.MAILING}
            setIsModalOpen={setIsModalOpen}
            setAddressAction={setAddressAction}
            selectedAddressForAction={selectedAddressForAction}
          />
        );
      default:
        return <></>;
    }
  }, [
    setIsModalOpen,
    selectedAddressForAction,
    primaryAddress,
    billingAddress,
    addressAction,
    setAddressAction,
  ]);

  const canAddMoreAddresses = userAddresses.length < MAX_ADDRESS_LIMIT;
  const shouldRenderAddressList = userAddresses.length > 0;
  return (
    <section className={styles.addressManagement}>
      <h2 className={styles.addressManagementTitle}>
        {tAddressManagement('addressManagementTitle')}
      </h2>
      <CenteredContainer>
        {shouldRenderAddressList && (
          <AddressList
            addresses={sortedAddresses}
            setAddressAction={setAddressAction}
            setSelectedAddressForAction={setSelectedAddressForAction}
            setIsModalOpen={setIsModalOpen}
          />
        )}
        {canAddMoreAddresses ? (
          <WebappButton
            text={tAddressManagement('actions.addAddress')}
            elementType="button"
            onClick={toggleAddAddressModal}
            variant="primary"
            buttonClasses={styles.addAddressButton}
          />
        ) : (
          <p className={styles.maxAddress}>
            {tAddressManagement('maxAddressesMessage')}
          </p>
        )}
      </CenteredContainer>
      <Modal open={isModalOpen} aria-labelledby="address-action-modal-title">
        {renderModalContent}
      </Modal>
    </section>
  );
};

export default AddressManagement;
