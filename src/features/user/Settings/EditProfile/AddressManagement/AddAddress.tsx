import type { ExtendedCountryCode } from '../../../../common/types/country';
import type { SetState } from '../../../../common/types/common';
import type { Address, APIError } from '@planet-sdk/common';
import type { AddressAction } from '../../../../common/types/profile';
import type { AddressFormData } from './microComponents/AddressForm';

import { useState, useContext, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { handleError } from '@planet-sdk/common';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../../../common/Layout/ErrorHandlingContext';
import AddressForm from './microComponents/AddressForm';
import { ADDRESS_TYPE } from '../../../../../utils/addressManagement';
import AddressFormLayout from './microComponents/AddressFormLayout';
import { getStoredConfig } from '../../../../../utils/storeConfig';
import { useApi } from '../../../../../hooks/useApi';

export type AddAddressApiPayload = AddressFormData & {
  country: ExtendedCountryCode | string;
  type: 'other' | 'primary';
};

interface Props {
  setIsModalOpen: SetState<boolean>;
  setAddressAction: SetState<AddressAction | null>;
  showPrimaryAddressToggle: boolean;
}

const defaultAddressDetail = {
  address: '',
  address2: '',
  city: '',
  zipCode: '',
  state: '',
  type: ADDRESS_TYPE.OTHER,
};

const AddAddress = ({
  setIsModalOpen,
  setAddressAction,
  showPrimaryAddressToggle,
}: Props) => {
  const tAddressManagement = useTranslations('EditProfile.addressManagement');
  const { contextLoaded, user, token, logoutUser, setUser } = useUserProps();
  const configCountry = getStoredConfig('country');
  const defaultCountry = user?.country || configCountry || 'DE';
  const { setErrors } = useContext(ErrorHandlingContext);
  const { postApiAuthenticated } = useApi();
  const [country, setCountry] = useState<ExtendedCountryCode | ''>(
    defaultCountry
  );
  const [isLoading, setIsLoading] = useState(false);
  const [primaryAddressChecked, setPrimaryAddressChecked] = useState(false);

  const addAddress = useCallback(
    async (data: AddressFormData) => {
      if (!contextLoaded || !user || !token) return;
      setIsLoading(true);
      const payload: AddAddressApiPayload = {
        ...data,
        country,
        type: primaryAddressChecked ? ADDRESS_TYPE.PRIMARY : ADDRESS_TYPE.OTHER,
      };
      try {
        const res = await postApiAuthenticated<Address, AddAddressApiPayload>(
          '/app/addresses',
          {
            payload,
          }
        );
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
      postApiAuthenticated,
      primaryAddressChecked,
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
