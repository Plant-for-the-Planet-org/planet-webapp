import type { ExtendedCountryCode } from '../../../../common/types/country';
import type { Address, AddressType } from '@planet-sdk/common';
import type { AddressFormData } from './microComponents/AddressForm';

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import AddressForm from './microComponents/AddressForm';
import AddressFormLayout from './microComponents/AddressFormLayout';
import { ADDRESS_TYPE } from '../../../../../utils/addressManagement';
import { useAddressOperations } from './useAddressOperations';

interface Props {
  selectedAddressForAction: Address;
  showPrimaryAddressToggle: boolean;
  handleCancel: () => void;
}

export type EditAddressApiPayload = AddressFormData & {
  country: ExtendedCountryCode | string;
  type: AddressType;
};

const EditAddress = ({
  selectedAddressForAction,
  showPrimaryAddressToggle,
  handleCancel,
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
  const { editAddress, isLoading } = useAddressOperations();
  const [country, setCountry] = useState<ExtendedCountryCode | ''>(
    selectedAddressForAction.country ?? 'DE'
  );
  const [primaryAddressChecked, setPrimaryAddressChecked] = useState(false);

  useEffect(() => {
    if (selectedAddressForAction)
      setPrimaryAddressChecked(
        selectedAddressForAction.type === ADDRESS_TYPE.PRIMARY
      );
  }, [selectedAddressForAction]);

  const handleEdit = useCallback(async (data: AddressFormData) => {
    const payload: EditAddressApiPayload = {
      ...data,
      country,
      type: primaryAddressChecked
        ? ADDRESS_TYPE.PRIMARY
        : selectedAddressForAction.type,
    };

    await editAddress(selectedAddressForAction.id, payload).finally(
      handleCancel
    );
  }, []);

  return (
    <AddressFormLayout label={tAddressManagement('addressForm.editAddress')}>
      <AddressForm
        country={country}
        setCountry={setCountry}
        isLoading={isLoading}
        label={tAddressManagement('addressForm.saveChanges')}
        defaultAddressDetail={defaultAddressDetail}
        processFormData={handleEdit}
        showPrimaryAddressToggle={showPrimaryAddressToggle}
        primaryAddressChecked={primaryAddressChecked}
        setPrimaryAddressChecked={setPrimaryAddressChecked}
        handleCancel={handleCancel}
      />
    </AddressFormLayout>
  );
};

export default EditAddress;
