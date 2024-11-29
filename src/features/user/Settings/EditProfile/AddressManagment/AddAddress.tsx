import type { ExtendedCountryCode } from '../../../../common/types/country';
import type { SetState } from '../../../../common/types/common';
import type { Address, APIError } from '@planet-sdk/common';

import { useState, useContext, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { handleError } from '@planet-sdk/common';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import { postAuthenticatedRequest } from '../../../../../utils/apiRequests/api';
import { useTenant } from '../../../../common/Layout/TenantContext';
import { ErrorHandlingContext } from '../../../../common/Layout/ErrorHandlingContext';
import AddressForm from './microComponents/AddressForm';
import { ADDRESS_TYPE } from '../../../../../utils/addressManagement';
import AddressFormWrapper from './microComponents/AddressFormWrapper';

export type FormData = {
  address: string | undefined;
  address2: string | null;
  city: string | undefined;
  zipCode: string | undefined;
  state: string | null;
};

interface Props {
  setIsModalOpen: SetState<boolean>;
  setUserAddresses: SetState<Address[]>;
}

const defaultAddressDetail = {
  address: '',
  address2: '',
  city: '',
  zipCode: '',
  state: '',
};

const AddAddress = ({ setIsModalOpen, setUserAddresses }: Props) => {
  const tAddressManagement = useTranslations('Profile.addressManagement');
  const { contextLoaded, user, token, logoutUser } = useUserProps();
  const { tenantConfig } = useTenant();
  const { setErrors } = useContext(ErrorHandlingContext);
  const [country, setCountry] = useState<ExtendedCountryCode | ''>(
    user?.country ?? 'DE'
  );
  const [isLoading, setIsLoading] = useState(false);

  const addAddress = useCallback(
    async (data: FormData) => {
      if (!contextLoaded || !user || !token) return;
      setIsLoading(true);
      const bodyToSend = {
        ...data,
        country,
        type: ADDRESS_TYPE.OTHER,
      };
      try {
        const res = await postAuthenticatedRequest<Address>(
          tenantConfig.id,
          '/app/addresses',
          bodyToSend,
          token,
          logoutUser
        );
        if (res && setUserAddresses) {
          setUserAddresses((prevAddresses) => [...prevAddresses, res]);
        }
      } catch (error) {
        setErrors(handleError(error as APIError));
      } finally {
        setIsLoading(false);
        setIsModalOpen(false);
      }
    },
    [
      contextLoaded,
      user,
      token,
      country,
      logoutUser,
      setUserAddresses,
      handleError,
      setIsLoading,
      setIsModalOpen,
      postAuthenticatedRequest,
    ]
  );

  return (
    <AddressFormWrapper label={tAddressManagement('addAddress')}>
      <AddressForm
        country={country}
        setCountry={setCountry}
        setIsModalOpen={setIsModalOpen}
        isLoading={isLoading}
        label={tAddressManagement('addAddress')}
        defaultAddressDetail={defaultAddressDetail}
        processFormData={addAddress}
      />
    </AddressFormWrapper>
  );
};

export default AddAddress;
