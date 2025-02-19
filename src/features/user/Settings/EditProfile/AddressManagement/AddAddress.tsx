import type { ExtendedCountryCode } from '../../../../common/types/country';
import type { SetState } from '../../../../common/types/common';
import type { Address, APIError } from '@planet-sdk/common';
import type { AddressAction } from '../../../../common/types/profile';

import { useState, useContext, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { handleError } from '@planet-sdk/common';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import { postAuthenticatedRequest } from '../../../../../utils/apiRequests/api';
import { useTenant } from '../../../../common/Layout/TenantContext';
import { ErrorHandlingContext } from '../../../../common/Layout/ErrorHandlingContext';
import AddressForm from './microComponents/AddressForm';
import { ADDRESS_TYPE } from '../../../../../utils/addressManagement';
import AddressFormLayout from './microComponents/AddressFormLayout';
import { getStoredConfig } from '../../../../../utils/storeConfig';

export type FormData = {
  address: string | undefined;
  address2: string | null;
  city: string | undefined;
  zipCode: string | undefined;
  state: string | null;
};

interface Props {
  setIsModalOpen: SetState<boolean>;
  setAddressAction: SetState<AddressAction | null>;
  showPrimaryAddressToggle: boolean;
  updateUserAddresses: () => Promise<void>;
}

const defaultAddressDetail = {
  address: '',
  address2: '',
  city: '',
  zipCode: '',
  state: '',
};

const AddAddress = ({
  setIsModalOpen,
  setAddressAction,
  showPrimaryAddressToggle,
  updateUserAddresses,
}: Props) => {
  const tAddressManagement = useTranslations('EditProfile.addressManagement');
  const { contextLoaded, user, token, logoutUser, setUser } = useUserProps();
  const configCountry = getStoredConfig('country');
  const defaultCountry = user?.country || configCountry || 'DE';
  const { tenantConfig } = useTenant();
  const { setErrors } = useContext(ErrorHandlingContext);
  const [country, setCountry] = useState<ExtendedCountryCode | ''>(
    defaultCountry
  );
  const [isLoading, setIsLoading] = useState(false);
  const [primaryAddressChecked, setPrimaryAddressChecked] = useState(false);

  const addAddress = useCallback(
    async (data: FormData) => {
      if (!contextLoaded || !user || !token) return;
      setIsLoading(true);
      const bodyToSend = {
        ...data,
        country,
        type: primaryAddressChecked ? ADDRESS_TYPE.PRIMARY : ADDRESS_TYPE.OTHER,
      };
      try {
        const res = await postAuthenticatedRequest<Address>({
          tenant: tenantConfig.id,
          url: '/app/addresses',
          data: bodyToSend,
          token,
          logoutUser,
        });
        if (res) {
          setUser((prev) => {
            if (!prev) return null;

            const updatedAddresses =
              res.type === ADDRESS_TYPE.PRIMARY
                ? prev.addresses.map((addr) =>
                    addr.type === ADDRESS_TYPE.PRIMARY
                      ? { ...addr, type: ADDRESS_TYPE.OTHER }
                      : addr
                  )
                : prev.addresses;

            return {
              ...prev,
              addresses: [...updatedAddresses, res],
            };
          });
          updateUserAddresses();
        }
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
      logoutUser,
      handleError,
      setIsLoading,
      setIsModalOpen,
      postAuthenticatedRequest,
      primaryAddressChecked,
      updateUserAddresses,
    ]
  );

  return (
    <AddressFormLayout label={tAddressManagement('addressForm.addAddress')}>
      <AddressForm
        country={country}
        setCountry={setCountry}
        setIsModalOpen={setIsModalOpen}
        isLoading={isLoading}
        label={tAddressManagement('addressForm.addAddress')}
        defaultAddressDetail={defaultAddressDetail}
        processFormData={addAddress}
        setAddressAction={setAddressAction}
        showPrimaryAddressToggle={showPrimaryAddressToggle}
        primaryAddressChecked={primaryAddressChecked}
        setPrimaryAddressChecked={setPrimaryAddressChecked}
      />
    </AddressFormLayout>
  );
};

export default AddAddress;
