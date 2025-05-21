import type { ExtendedCountryCode } from '../../../../common/types/country';
import type { SetState } from '../../../../common/types/common';
import type { Address, AddressType, APIError } from '@planet-sdk/common';
import type { AddressFormData } from './microComponents/AddressForm';
import type { AddressAction } from '../../../../common/types/profile';

import { useState, useContext, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { handleError } from '@planet-sdk/common';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import { useTenant } from '../../../../common/Layout/TenantContext';
import { ErrorHandlingContext } from '../../../../common/Layout/ErrorHandlingContext';
import AddressForm from './microComponents/AddressForm';
import AddressFormLayout from './microComponents/AddressFormLayout';
import { ADDRESS_TYPE } from '../../../../../utils/addressManagement';
import { useApi } from '../../../../../hooks/useApi';

interface Props {
  setIsModalOpen: SetState<boolean>;
  selectedAddressForAction: Address;
  setAddressAction: SetState<AddressAction | null>;
  showPrimaryAddressToggle: boolean;
}

type EditAddressApiPayload = AddressFormData & {
  country: ExtendedCountryCode | string;
  type: AddressType;
};

const EditAddress = ({
  setIsModalOpen,
  selectedAddressForAction,
  setAddressAction,
  showPrimaryAddressToggle,
}: Props) => {
  const defaultAddressDetail = {
    address: selectedAddressForAction.address,
    address2: selectedAddressForAction.address2,
    city: selectedAddressForAction.city,
    zipCode: selectedAddressForAction.zipCode,
    state: selectedAddressForAction.state,
    type: selectedAddressForAction.type,
  };

  const tAddressManagement = useTranslations('EditProfile.addressManagement');
  const { contextLoaded, user, token, logoutUser, setUser } = useUserProps();
  const { tenantConfig } = useTenant();
  const { setErrors } = useContext(ErrorHandlingContext);
  const { putApiAuthenticated } = useApi();
  const [country, setCountry] = useState<ExtendedCountryCode | ''>(
    selectedAddressForAction?.country ?? 'DE'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [primaryAddressChecked, setPrimaryAddressChecked] = useState(false);

  useEffect(() => {
    if (selectedAddressForAction)
      setPrimaryAddressChecked(
        selectedAddressForAction.type === ADDRESS_TYPE.PRIMARY
      );
  }, [selectedAddressForAction]);

  const updateAddress = useCallback(
    async (data: AddressFormData) => {
      if (!contextLoaded || !user || !token) return;
      setIsLoading(true);
      const payload: EditAddressApiPayload = {
        ...data,
        country,
        type: primaryAddressChecked
          ? ADDRESS_TYPE.PRIMARY
          : selectedAddressForAction?.type,
      };
      try {
        const res = await putApiAuthenticated<Address, EditAddressApiPayload>(
          `/app/addresses/${selectedAddressForAction?.id}`,
          {
            payload,
          }
        );
        if (res) {
          setUser((prev) => {
            if (!prev) return null;

            const updatedAddresses = prev.addresses.reduce<Address[]>(
              (acc, addr) => {
                if (addr.id === res.id) return acc;

                if (res.isPrimary && addr.isPrimary) {
                  acc.push({
                    ...addr,
                    isPrimary: false,
                    type: ADDRESS_TYPE.OTHER,
                  });
                } else {
                  acc.push(addr);
                }

                return acc;
              },
              []
            );

            updatedAddresses.push(res);

            return {
              ...prev,
              addresses: updatedAddresses,
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
      selectedAddressForAction?.type,
      selectedAddressForAction?.id,
      tenantConfig.id,
      logoutUser,
      handleError,
      putApiAuthenticated,
      primaryAddressChecked,
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
        showPrimaryAddressToggle={showPrimaryAddressToggle}
        primaryAddressChecked={primaryAddressChecked}
        setPrimaryAddressChecked={setPrimaryAddressChecked}
      />
    </AddressFormLayout>
  );
};

export default EditAddress;
