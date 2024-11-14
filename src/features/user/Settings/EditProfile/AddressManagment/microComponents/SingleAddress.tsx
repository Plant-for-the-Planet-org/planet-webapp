import type { UpdatedAddress } from '..';
import type { SetState } from '../../../../../common/types/common';
import type { AddressAction } from './AddressActionMenu';
import type { APIError, CountryCode } from '@planet-sdk/common';

import { useContext, useState } from 'react';
import { Modal } from '@mui/material';
import { useTranslations } from 'next-intl';
import { handleError } from '@planet-sdk/common';
import {
  formatAddress,
  getAddressType,
} from '../../../../../../utils/addressManagement';
import styles from '../AddressManagement.module.scss';
import AddressContent from './AddressContent';
import AddressActionsMenu from './AddressActionMenu';
import AddressFormModal, { AddressFormData } from '../AddressFormModal';
import { ADDRESS_ACTIONS } from '../../../../../../utils/addressManagement';
import AddressTypeChangeModal from '../AddressTypeChangeModal';
import { putAuthenticatedRequest } from '../../../../../../utils/apiRequests/api';
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
  const { tenantConfig } = useTenant();
  const { token, logoutUser } = useUserProps();
  const { setErrors } = useContext(ErrorHandlingContext);
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

  const editAddress = async (
    data: AddressFormData | null,
    addressType: string
  ) => {
    if (!addressAction || !userAddress) return;
    const bodyToSend = addressType
      ? { type: addressType }
      : {
          ...data,
          country,
          type: getAddressType('edit', userAddress.type),
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
        setIsModalOpen(false);
      }
    } catch (error) {
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
              formType="edit"
              setIsModalOpen={setIsModalOpen}
              setUserAddresses={setUserAddresses}
              userAddress={userAddress}
              editAddress={editAddress}
            />
          )}
          {(addressAction === ADDRESS_ACTIONS.SET_BILLING ||
            addressAction === ADDRESS_ACTIONS.SET_PRIMARY) && (
            <AddressTypeChangeModal
              addressAction={addressAction}
              formattedAddress={formattedAddress}
              setIsModalOpen={setIsModalOpen}
              editAddress={editAddress}
            />
          )}
          {addressAction === ADDRESS_ACTIONS.DELETE && <AddressDeleteModal />}
        </>
      </Modal>
    </div>
  );
};

export default SingleAddress;
