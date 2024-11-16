import type { UpdatedAddress } from '..';
import type { SetState } from '../../../../../common/types/common';
import type { AddressAction } from './AddressActionMenu';
import type { APIError, CountryCode } from '@planet-sdk/common';

import { useContext, useState } from 'react';
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
  primaryAddress: UpdatedAddress | undefined;
  billingAddress: UpdatedAddress | undefined;
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
  const { zipCode, city, state, country, address, type } = userAddress;
  const { tenantConfig } = useTenant();
  const { token, logoutUser } = useUserProps();
  const { setErrors } = useContext(ErrorHandlingContext);
  const countryFullForm = tCountry(
    country.toLowerCase() as Lowercase<CountryCode>
  );
  const isSetBillingAction = addressAction === ADDRESS_ACTIONS.SET_BILLING;
  const isSetPrimaryAction = addressAction === ADDRESS_ACTIONS.SET_PRIMARY;
  const pcountryFullForm = tCountry(
    primaryAddress?.country.toLowerCase() as Lowercase<CountryCode>
  );
  const bcountryFullForm = tCountry(
    billingAddress?.country.toLowerCase() as Lowercase<CountryCode>
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formattedAddress = formatAddress(
    address,
    zipCode,
    city,
    state,
    countryFullForm
  );

  const primaryFrmtAddress = formatAddress(
    primaryAddress?.address,
    primaryAddress?.zipCode,
    primaryAddress?.city,
    primaryAddress?.state ?? '',
    pcountryFullForm
  );

  const billingFrmtAddress = formatAddress(
    billingAddress?.address,
    billingAddress?.zipCode,
    billingAddress?.city,
    billingAddress?.state ?? '',
    bcountryFullForm
  );

  const editAddress = async (
    data: AddressFormData | null,
    addressType: string
  ) => {
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
        setIsUploadingData(false);
        setIsModalOpen(false);
      }
    } catch (error) {
      setErrors(handleError(error as APIError));
    }
  };
  const deleteAddress = async () => {
    try {
      setIsUploadingData(true);
      await deleteAuthenticatedRequest(
        tenantConfig.id,
        `/app/addresses/${userAddress?.id}`,
        token,
        logoutUser
      );
      fetchUserAddresses();
      setIsModalOpen(false);
    } catch (error) {
      setIsUploadingData(false);
      setErrors(handleError(error as APIError));
    }
  };

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
        <>
          {addressAction === ADDRESS_ACTIONS.EDIT && (
            <AddressFormModal
              formType={ADDRESS_FORM_TYPE.EDIT_ADDRESS}
              setIsModalOpen={setIsModalOpen}
              setUserAddresses={setUserAddresses}
              userAddress={userAddress}
              editAddress={editAddress}
              isUploadingData={isUploadingData}
              setIsUploadingData={setIsUploadingData}
            />
          )}
          {(isSetBillingAction || isSetPrimaryAction) && (
            <AddressTypeChangeModal
              setIsModalOpen={setIsModalOpen}
              editAddress={editAddress}
              primaryAddress={
                primaryAddress !== undefined ? primaryFrmtAddress : undefined
              }
              billingAddress={
                billingAddress !== undefined ? billingFrmtAddress : undefined
              }
              isSetBillingAction={isSetBillingAction}
              isSetPrimaryAction={isSetPrimaryAction}
            />
          )}
          {addressAction === ADDRESS_ACTIONS.DELETE && (
            <AddressDeleteModal
              setIsModalOpen={setIsModalOpen}
              deleteAddress={deleteAddress}
            />
          )}
        </>
      </Modal>
    </div>
  );
};

export default SingleAddress;
