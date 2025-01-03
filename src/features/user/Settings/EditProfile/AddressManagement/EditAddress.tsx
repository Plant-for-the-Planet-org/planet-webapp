import type { ExtendedCountryCode } from '../../../../common/types/country';
import type { SetState } from '../../../../common/types/common';
import type { Address, APIError } from '@planet-sdk/common';
import type { FormData } from './AddAddress';
import type { AddressAction } from '../../../../common/types/profile';

import { useState, useContext, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { handleError } from '@planet-sdk/common';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import { putAuthenticatedRequest } from '../../../../../utils/apiRequests/api';
import { useTenant } from '../../../../common/Layout/TenantContext';
import { ErrorHandlingContext } from '../../../../common/Layout/ErrorHandlingContext';
import AddressForm from './microComponents/AddressForm';
import AddressFormLayout from './microComponents/AddressFormLayout';

interface Props {
  setIsModalOpen: SetState<boolean>;
  selectedAddressForAction: Address;
  updateUserAddresses: () => Promise<void>;
  setAddressAction: SetState<AddressAction | null>;
}

const EditAddress = ({
  setIsModalOpen,
  selectedAddressForAction,
  updateUserAddresses,
  setAddressAction,
}: Props) => {
  const defaultAddressDetail = {
    address: selectedAddressForAction.address,
    address2: selectedAddressForAction.address2,
    city: selectedAddressForAction.city,
    zipCode: selectedAddressForAction.zipCode,
    state: selectedAddressForAction.state,
  };

  const tAddressManagement = useTranslations('EditProfile.addressManagement');
  const { contextLoaded, user, token, logoutUser } = useUserProps();
  const { tenantConfig } = useTenant();
  const { setErrors } = useContext(ErrorHandlingContext);
  const [country, setCountry] = useState<ExtendedCountryCode | ''>(
    selectedAddressForAction?.country ?? 'DE'
  );
  const [isLoading, setIsLoading] = useState(false);

  const updateAddress = useCallback(
    async (data: FormData) => {
      if (!contextLoaded || !user || !token) return;
      setIsLoading(true);
      const bodyToSend = {
        ...data,
        country,
        type: selectedAddressForAction?.type,
      };
      try {
        const res = await putAuthenticatedRequest<Address>({
          tenant: tenantConfig.id,
          url: `/app/addresses/${selectedAddressForAction?.id}`,
          data: bodyToSend,
          token,
          logoutUser,
        });
        if (res && updateUserAddresses) updateUserAddresses();
      } catch (error) {
        setErrors(handleError(error as APIError));
      } finally {
        setIsLoading(false);
        setIsModalOpen(false);
        setAddressAction(null);
      }
    },
    [
      contextLoaded,
      user,
      token,
      country,
      selectedAddressForAction?.type,
      selectedAddressForAction?.id,
      tenantConfig.id,
      logoutUser,
      updateUserAddresses,
      handleError,
      putAuthenticatedRequest,
    ]
  );

  return (
    <AddressFormLayout label={tAddressManagement('addressForm.editAddress')}>
      <AddressForm
        country={country}
        setCountry={setCountry}
        setIsModalOpen={setIsModalOpen}
        isLoading={isLoading}
        label={tAddressManagement('addressForm.saveChanges')}
        defaultAddressDetail={defaultAddressDetail}
        processFormData={updateAddress}
        setAddressAction={setAddressAction}
      />
    </AddressFormLayout>
  );
};

export default EditAddress;
