import type { ExtendedCountryCode } from '../../../../common/types/country';
import type { AddressFormData } from './microComponents/AddressForm';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import AddressForm from './microComponents/AddressForm';
import { ADDRESS_TYPE } from '../../../../../utils/addressManagement';
import AddressFormLayout from './microComponents/AddressFormLayout';
import { getStoredConfig } from '../../../../../utils/storeConfig';
import { useAddressOperations } from './useAddressOperations';

export type AddAddressApiPayload = AddressFormData & {
  country: ExtendedCountryCode | string;
  type: 'other' | 'primary';
};

interface Props {
  handleCancel: () => void;
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

const AddAddress = ({ handleCancel, showPrimaryAddressToggle }: Props) => {
  const tAddressManagement = useTranslations('EditProfile.addressManagement');
  const { user } = useUserProps();
  const { addAddress, isLoading } = useAddressOperations();
  const configCountry = getStoredConfig('country');
  const defaultCountry = user?.country || configCountry || 'DE';
  const [country, setCountry] = useState<ExtendedCountryCode | ''>(
    defaultCountry
  );

  const [primaryAddressChecked, setPrimaryAddressChecked] = useState(false);

  const handleAdd = useCallback(
    async (data: AddressFormData) => {
      const payload: AddAddressApiPayload = {
        ...data,
        country,
        type: primaryAddressChecked ? ADDRESS_TYPE.PRIMARY : ADDRESS_TYPE.OTHER,
      };
      await addAddress(payload).finally(handleCancel);
    },
    [country, primaryAddressChecked, addAddress, handleCancel]
  );

  return (
    <AddressFormLayout label={tAddressManagement('addressForm.addAddress')}>
      <AddressForm
        country={country}
        setCountry={setCountry}
        isLoading={isLoading}
        label={tAddressManagement('addressForm.addAddress')}
        defaultAddressDetail={defaultAddressDetail}
        processFormData={handleAdd}
        showPrimaryAddressToggle={showPrimaryAddressToggle}
        primaryAddressChecked={primaryAddressChecked}
        setPrimaryAddressChecked={setPrimaryAddressChecked}
        handleCancel={handleCancel}
      />
    </AddressFormLayout>
  );
};

export default AddAddress;
