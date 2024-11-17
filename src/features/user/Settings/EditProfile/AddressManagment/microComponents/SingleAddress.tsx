import type { UpdatedAddress } from '..';
import type { SetState } from '../../../../../common/types/common';
import type { AddressAction } from './AddressActionMenu';
import type { APIError, CountryCode } from '@planet-sdk/common';

import { useContext, useState, useMemo, useCallback } from 'react';
import { Modal } from '@mui/material';
import { useTranslations } from 'next-intl';
import { handleError } from '@planet-sdk/common';
import {
  ADDRESS_FORM_TYPE,
  formatAddress,
  getAddressType,
} from '../../../../../../utils/addressManagement';
import styles from '../AddressManagement.module.scss';
import AddressContent from './AddressContent';
import AddressActionsMenu from './AddressActionMenu';
import AddressFormModal, { AddressFormData } from '../AddressFormModal';
import { ADDRESS_ACTIONS } from '../../../../../../utils/addressManagement';
import AddressTypeChangeModal from '../AddressTypeChangeModal';
import {
  deleteAuthenticatedRequest,
  putAuthenticatedRequest,
} from '../../../../../../utils/apiRequests/api';
import { useTenant } from '../../../../../common/Layout/TenantContext';
import { useUserProps } from '../../../../../common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../../../../common/Layout/ErrorHandlingContext';
import AddressDeleteModal from '../AddressDeleteModal';

interface Props {
  userAddress: UpdatedAddress;
  addressCount: number;
  addressAction: AddressAction | null;
  setAddressAction: SetState<AddressAction | null>;
  setUserAddresses: SetState<UpdatedAddress[]>;
  fetchUserAddresses: () => Promise<void>;
  isUploadingData: boolean;
  setIsUploadingData: SetState<boolean>;
  primaryAddress: UpdatedAddress | null;
  billingAddress: UpdatedAddress | null;
}

const SingleAddress = ({
  userAddress,
  addressCount,
  addressAction,
  setAddressAction,
  setUserAddresses,
  fetchUserAddresses,
  isUploadingData,
  setIsUploadingData,
  primaryAddress,
  billingAddress,
}: Props) => {
  const tCountry = useTranslations('Country');
  const { tenantConfig } = useTenant();
  const { token, logoutUser } = useUserProps();
  const { setErrors } = useContext(ErrorHandlingContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { country, type } = userAddress;
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
  const primaryFormattedAddress = useMemo(
    () => (primaryAddress ? getFormattedAddress(primaryAddress) : null),
    [primaryAddress]
  );
  const billingFormattedAddress = useMemo(
    () => (billingAddress ? getFormattedAddress(billingAddress) : null),
    [billingAddress]
  );

  const editAddress = useCallback(
    async (data: AddressFormData | null, addressType: string) => {
      if (!addressAction || !userAddress) return;
      setIsUploadingData(true);
      const bodyToSend = addressType
        ? { type: addressType }
        : {
            ...data,
            country,
            type: getAddressType(
              ADDRESS_FORM_TYPE.EDIT_ADDRESS,
              userAddress.type
            ),
          };
      try {
        const res = await putAuthenticatedRequest<UpdatedAddress>(
          tenantConfig.id,
          `/app/addresses/${userAddress?.id}`,
          bodyToSend,
          token,
          logoutUser
        );
        if (res && fetchUserAddresses) {
          fetchUserAddresses();
        }
      } catch (error) {
        setErrors(handleError(error as APIError));
      } finally {
        setIsUploadingData(false);
        setIsModalOpen(false);
      }
    },
    [
      addressAction,
      country,
      fetchUserAddresses,
      logoutUser,
      setErrors,
      tenantConfig.id,
      token,
      userAddress,
    ]
  );
  const deleteAddress = useCallback(async () => {
    try {
      setIsUploadingData(true);
      await deleteAuthenticatedRequest(
        tenantConfig.id,
        `/app/addresses/${userAddress?.id}`,
        token,
        logoutUser
      );
      fetchUserAddresses();
    } catch (error) {
      setErrors(handleError(error as APIError));
    } finally {
      setIsModalOpen(false);
      setIsUploadingData(false);
    }
  }, [
    fetchUserAddresses,
    logoutUser,
    setErrors,
    tenantConfig.id,
    token,
    userAddress,
  ]);

  const renderModalContent = useMemo(() => {
    switch (addressAction) {
      case ADDRESS_ACTIONS.EDIT:
        return (
          <AddressFormModal
            formType={ADDRESS_FORM_TYPE.EDIT_ADDRESS}
            setIsModalOpen={setIsModalOpen}
            setUserAddresses={setUserAddresses}
            userAddress={userAddress}
            editAddress={editAddress}
            isUploadingData={isUploadingData}
            setIsUploadingData={setIsUploadingData}
          />
        );
      case ADDRESS_ACTIONS.SET_BILLING:
      case ADDRESS_ACTIONS.SET_PRIMARY:
        return (
          <AddressTypeChangeModal
            setIsModalOpen={setIsModalOpen}
            editAddress={editAddress}
            primaryAddress={primaryFormattedAddress}
            billingAddress={billingFormattedAddress}
            addressAction={addressAction}
          />
        );
      case ADDRESS_ACTIONS.DELETE:
        return (
          <AddressDeleteModal
            setIsModalOpen={setIsModalOpen}
            deleteAddress={deleteAddress}
          />
        );
    }
  }, [
    addressAction,
    setIsModalOpen,
    editAddress,
    deleteAddress,
    userAddress,
    isUploadingData,
    setIsUploadingData,
    setUserAddresses,
    primaryFormattedAddress,
    billingFormattedAddress,
  ]);

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
        <>{renderModalContent}</>
      </Modal>
    </div>
  );
};

export default SingleAddress;
